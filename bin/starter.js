#!/usr/bin/env node

/*****************************************************************
 * TYPESCRIPT-EXPRESS-STARTER - Quick and Easy TypeScript Express Starter
 * (c) 2020-present AGUMON (https://github.com/ljlm0402/typescript-express-starter)
 *
 * MIT License
 *
 * Made with ❤️ by AGUMON 🦖
 *****************************************************************/

import { select, text, isCancel, intro, outro, cancel, note, confirm } from '@clack/prompts';
import chalk from 'chalk';
import editJsonFile from 'edit-json-file';
import { execa } from 'execa';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import { PACKAGE_MANAGER, TEMPLATES_VALUES, DEVTOOLS_VALUES, TEMPLATES, DEVTOOLS } from './common.js';
import { TEMPLATE_DB, DB_SERVICES, BASE_COMPOSE } from './db-map.js';

// ========== [공통 함수들] ==========

// Node 버전 체크 (16+)
function checkNodeVersion(min = 16) {
  const major = parseInt(process.versions.node.split('.')[0], 10);
  if (major < min) {
    console.error(chalk.red(`Node.js ${min}+ required. You have ${process.versions.node}.`));
    process.exit(1);
  }
}

// 최신 CLI 버전 체크 & 선택적 설치
async function checkForUpdate(pkgName, localVersion) {
  try {
    const { stdout } = await execa('npm', ['view', pkgName, 'version']);
    const latest = stdout.trim();
    if (latest !== localVersion) {
      console.log(chalk.yellow(`🔔  New version available: ${latest} (You are on ${localVersion})`));
      const shouldUpdate = await confirm({
        message: `Do you want to update ${pkgName} to version ${latest}?`,
        initial: true,
      });
      if (shouldUpdate) {
        console.log(chalk.gray(`  Updating to latest version...`));
        try {
          await execa('npm', ['install', '-g', `${pkgName}@${latest}`], { stdio: 'inherit' });
          console.log(chalk.green(`  ✓ Updated ${pkgName} to ${latest}`));
        } catch (err) {
          printError(`Failed to update ${pkgName}`, err.message);
        }
      } else {
        console.log(chalk.gray('Skipped updating.'));
      }
    }
  } catch (err) {
    printError('Failed to check latest version', err.message);
  }
}

// 패키지매니저 글로벌 설치여부
async function checkPkgManagerInstalled(pm) {
  try {
    await execa(pm, ['--version']);
    return true;
  } catch {
    return false;
  }
}

// 최신 버전 조회
async function getLatestVersion(pkg) {
  try {
    const { stdout } = await execa('npm', ['view', pkg, 'version']);
    return stdout.trim();
  } catch {
    return null;
  }
}

// 도구 간 의존성 자동 해결
function resolveDependencies(selected) {
  const all = new Set(selected);
  let changed = true;
  while (changed) {
    changed = false;
    for (const tool of DEVTOOLS_VALUES) {
      if (all.has(tool.value) && tool.requires) {
        for (const req of tool.requires) {
          if (!all.has(req)) {
            all.add(req);
            changed = true;
          }
        }
      }
    }
  }
  return Array.from(all);
}

// 파일 복사
async function copyDevtoolFiles(devtool, destDir) {
  for (const file of devtool.files) {
    const src = path.join(DEVTOOLS, devtool.value, file);
    const dst = path.join(destDir, file);
    if (await fs.pathExists(src)) {
      await fs.copy(src, dst, { overwrite: true });
      console.log(chalk.gray(`  ⎯ ${file} copied.`));
    }
  }
}

function isExplicitSpecifier(spec) {
  return (
    spec.startsWith('http://') ||
    spec.startsWith('https://') ||
    spec.startsWith('git+') ||
    spec.startsWith('file:') ||
    spec.startsWith('link:') ||
    spec.startsWith('workspace:') ||
    spec.startsWith('npm:')
  );
}

// 'pkg' / '@scope/pkg' vs 'pkg@^1.2.3' / '@scope/pkg@1.2.3' 구분
function splitNameAndVersion(spec) {
  if (spec.startsWith('@')) {
    const idx = spec.indexOf('@', 1); // 스코프 다음 '@'가 버전 구분자
    if (idx === -1) return { name: spec, version: null };
    return { name: spec.slice(0, idx), version: spec.slice(idx + 1) };
  } else {
    const idx = spec.indexOf('@');
    if (idx === -1) return { name: spec, version: null };
    return { name: spec.slice(0, idx), version: spec.slice(idx + 1) };
  }
}

// 패키지 설치 (버전/범위 지정 시 그대로, 없으면 latest 조회해 고정)
async function installPackages(pkgs, pkgManager, dev = true, destDir = process.cwd()) {
  if (!pkgs || pkgs.length === 0) return;

  const resolved = [];
  for (const spec of pkgs) {
    // URL/파일/워크스페이스/별칭은 그대로 통과
    if (isExplicitSpecifier(spec)) {
      resolved.push(spec);
      continue;
    }

    const { name, version } = splitNameAndVersion(spec);
    // 이미 버전/범위가 명시된 경우 그대로 사용 (예: ^9.33.0, ~10.1.8, 9.33.0)
    if (version && version.length > 0) {
      resolved.push(`${name}@${version}`);
      continue;
    }

    // 버전 미지정 → npm view로 latest 조회 후 고정
    const latest = await getLatestVersion(name);
    resolved.push(latest ? `${name}@${latest}` : name);
  }

  const installCmd =
    pkgManager === 'npm'
      ? ['install', dev ? '--save-dev' : '', ...resolved].filter(Boolean)
      : pkgManager === 'yarn'
        ? ['add', dev ? '--dev' : '', ...resolved].filter(Boolean)
        : ['add', dev ? '-D' : '', ...resolved].filter(Boolean);

  await execa(pkgManager, installCmd, { cwd: destDir, stdio: 'inherit' });
}

// package.json 수정 (스크립트 추가 등)
async function updatePackageJson(scripts, destDir) {
  const pkgPath = path.join(destDir, 'package.json');
  const file = editJsonFile(pkgPath, { autosave: true });
  Object.entries(scripts).forEach(([k, v]) => file.set(`scripts.${k}`, v));
  if (!file.get('scripts.prepare') && fs.existsSync(path.join(destDir, '.huskyrc'))) {
    file.set('scripts.prepare', 'husky install');
  }
  file.save();
}

function printError(message, suggestion = null) {
  console.log(chalk.bgRed.white(' ERROR '), chalk.red(message));
  if (suggestion) {
    console.log(chalk.gray('Hint:'), chalk.cyan(suggestion));
  }
}

// docker-compose 생성
async function generateCompose(template, destDir) {
  const dbType = TEMPLATE_DB[template];
  const dbSnippet = dbType ? DB_SERVICES[dbType] : '';
  const composeYml = BASE_COMPOSE(dbSnippet);
  const filePath = path.join(destDir, 'docker-compose.yml');
  await fs.writeFile(filePath, composeYml, 'utf8');
  return dbType;
}

// Git init & 첫 커밋
async function gitInitAndFirstCommit(destDir) {
  const doGit = await confirm({ message: 'Initialize git and make first commit?', initial: true });
  if (!doGit) return;
  try {
    await execa('git', ['init'], { cwd: destDir });
    await execa('git', ['add', '.'], { cwd: destDir });
    await execa('git', ['commit', '-m', 'init'], { cwd: destDir });
    console.log(chalk.green('  ✓ git initialized and first commit made!'));
  } catch (e) {
    printError('git init/commit failed', 'Check git is installed and accessible.');
  }
}

// ========== [메인 CLI 실행 흐름] ==========
async function main() {
  // 1. Node 버전 체크
  checkNodeVersion(16);

  // 2. CLI 최신버전 안내
  await checkForUpdate('typescript-express-starter', '10.2.2');

  const gradientBanner =
    '\x1B[38;2;66;211;146m✨\x1B[39m\x1B[38;2;66;211;146m \x1B[39m\x1B[38;2;66;211;146mT\x1B[39m\x1B[38;2;66;211;146my\x1B[39m\x1B[38;2;66;211;146mp\x1B[39m\x1B[38;2;66;211;146me\x1B[39m\x1B[38;2;67;209;149mS\x1B[39m\x1B[38;2;68;206;152mc\x1B[39m\x1B[38;2;69;204;155mr\x1B[39m\x1B[38;2;70;201;158mi\x1B[39m\x1B[38;2;71;199;162mp\x1B[39m\x1B[38;2;72;196;165mt\x1B[39m\x1B[38;2;73;194;168m \x1B[39m\x1B[38;2;74;192;171mE\x1B[39m\x1B[38;2;75;189;174mx\x1B[39m\x1B[38;2;76;187;177mp\x1B[39m\x1B[38;2;77;184;180mr\x1B[39m\x1B[38;2;78;182;183me\x1B[39m\x1B[38;2;79;179;186ms\x1B[39m\x1B[38;2;80;177;190ms\x1B[39m\x1B[38;2;81;175;193m \x1B[39m\x1B[38;2;82;172;196mS\x1B[39m\x1B[38;2;83;170;199mt\x1B[39m\x1B[38;2;84;167;202ma\x1B[39m\x1B[38;2;85;165;205mr\x1B[39m\x1B[38;2;86;162;208mt\x1B[39m\x1B[38;2;87;160;211me\x1B[39m\x1B[38;2;88;158;215mr\x1B[39m';
  intro(gradientBanner);

  // 3. 패키지 매니저 선택 + 글로벌 설치 확인
  let pkgManager;
  while (true) {
    pkgManager = await select({
      message: 'Which package manager do you want to use?',
      options: PACKAGE_MANAGER,
      initialValue: 'npm',
    });
    if (isCancel(pkgManager)) return cancel('❌ Aborted.');
    if (await checkPkgManagerInstalled(pkgManager)) break;
    printError(`${pkgManager} is not installed globally! Please install it first.`);
  }
  note(`Using: ${pkgManager}`);

  // 4. 템플릿 선택
  const templateDirs = (await fs.readdir(TEMPLATES)).filter(f => fs.statSync(path.join(TEMPLATES, f)).isDirectory());
  if (templateDirs.length === 0) return printError('No templates found!');

  const options = TEMPLATES_VALUES
    .filter(t => t.active && templateDirs.includes(t.value))
    .map(t => ({
      label: t.name, // UI에 표시될 이름
      value: t.value, // 선택 값
      hint: t.desc, // 오른쪽에 표시될 설명
    }));

  const template = await select({
    message: 'Choose a template:',
    options: options,
    initialValue: 'default',
  });
  if (isCancel(template)) return cancel('❌ Aborted.');

  // 5. 프로젝트명 입력 (중복체크/덮어쓰기)
  let projectName, destDir;
  while (true) {
    projectName = await text({
      message: 'Enter your project name:',
      initial: 'my-app',
      validate: val => (!val ? 'Project name is required' : undefined),
    });
    if (isCancel(projectName)) return cancel('❌ Aborted.');
    destDir = path.resolve(process.cwd(), projectName);
    if (await fs.pathExists(destDir)) {
      const overwrite = await confirm({ message: `Directory "${projectName}" already exists. Overwrite?` });
      if (overwrite) break;
    } else break;
  }

  // 6. 개발 도구 옵션 선택 (category 기준으로 그룹화)
  const groupedDevtools = DEVTOOLS_VALUES.reduce((acc, tool) => {
    const cat = tool.category || 'Others';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(tool);
    return acc;
  }, {});

  // 6-1. 개발 도구 옵션 선택 (category별 하나씩만 선택하는 방식)
  let devtoolValues = [];
  for (const [category, tools] of Object.entries(groupedDevtools)) {
    const picked = await select({
      message: `Select a tool for "${category}":`,
      options: [
        { label: 'None', value: null },
        ...tools.map(({ name, value, desc }) => ({
          label: `${name} (${desc})`,
          value,
        })),
      ],
      initialValue: null,
    });
    if (isCancel(picked)) return cancel('❌ Aborted.');
    if (picked) devtoolValues.push(picked);
  }
  devtoolValues = resolveDependencies(devtoolValues);

  // === [진행] ===

  // [1] 템플릿 복사
  const spinner = ora('Copying template...').start();
  try {
    await fs.copy(path.join(TEMPLATES, template), destDir, { overwrite: true });
    spinner.succeed('Template copied!');
  } catch (e) {
    spinner.fail('Template copy failed!');
    printError(e.message, 'Check templates folder and permissions.');
    return process.exit(1);
  }

  // [1-1] Testing 도구를 선택한 경우에만 /src/test 예제 복사
  const testDevtool = devtoolValues.map(val => DEVTOOLS_VALUES.find(d => d.value === val)).find(tool => tool && tool.category === 'Testing');

  if (testDevtool) {
    const devtoolTestDir = path.join(DEVTOOLS, testDevtool.value, 'src', 'test');
    const projectTestDir = path.join(destDir, 'src', 'test');
    if (await fs.pathExists(devtoolTestDir)) {
      await fs.copy(devtoolTestDir, projectTestDir, { overwrite: true });
      console.log(chalk.gray(`  ⎯ test files for ${testDevtool.name} copied.`));
    }
  }

  // [2] 개발 도구 파일/패키지/스크립트/코드패치
  for (const val of devtoolValues) {
    const tool = DEVTOOLS_VALUES.find(d => d.value === val);
    if (!tool) continue;

    spinner.start(`Setting up ${tool.name}...`);
    await copyDevtoolFiles(tool, destDir);

    // [2-1] 개발 도구 - 패키지 설치
    if (tool.pkgs?.length > 0) await installPackages(tool.pkgs, pkgManager, false, destDir);
    if (tool.devPkgs?.length > 0) await installPackages(tool.devPkgs, pkgManager, true, destDir);

    // [2-2] 개발 도구 - 스크립트 추가 등
    if (Object.keys(tool.scripts).length) await updatePackageJson(tool.scripts, destDir);

    // [2-3] 개발 도구 - Docker 선택 한 경우, docker-compose.yml 생성
    if (tool.value === 'docker') await generateCompose(template, destDir);

    spinner.succeed(`${tool.name} setup done.`);
  }

  // [3] 템플릿 기본 패키지 설치
  spinner.start(`Installing base dependencies with ${pkgManager}...`);
  await execa(pkgManager, ['install'], { cwd: destDir, stdio: 'inherit' });
  spinner.succeed('📦 Base dependencies installed!');

  // [4] git 첫 커밋 옵션
  await gitInitAndFirstCommit(destDir);

  outro(chalk.greenBright('\n🎉 Project setup complete!\n'));
  console.log(chalk.cyan(`   $ cd ${projectName}`));
  console.log(chalk.cyan(`   $ ${pkgManager} run dev\n`));
  console.log(chalk.gray('✨ Happy hacking!\n'));
}

main().catch(err => {
  printError('Unexpected error', err.message);
  process.exit(1);
});
