#!/usr/bin/env node

/*****************************************************************
 * TYPESCRIPT-EXPRESS-STARTER - Quick and Easy TypeScript Express Starter
 * (c) 2020-present AGUMON (https://github.com/ljlm0402/typescript-express-starter)
 *
 * MIT License
 *
 * Made with ❤️ by AGUMON 🦖
 *****************************************************************/

import { select, multiselect, text, isCancel, intro, outro, cancel, note, confirm } from '@clack/prompts';
import chalk from 'chalk';
import editJsonFile from 'edit-json-file';
import { execa } from 'execa';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import { PACKAGE_MANAGER, DEVTOOLS_VALUES, TEMPLATES, DEVTOOLS } from './common.js';
import { TEMPLATE_DB, DB_SERVICES, BASE_COMPOSE } from './db-map.js';

// import recast from 'recast';
// import * as tsParser from 'recast/parsers/typescript.js';

// ========== [공통 함수들] ==========

// Node 버전 체크 (16+)
function checkNodeVersion(min = 16) {
  const major = parseInt(process.versions.node.split('.')[0], 10);
  if (major < min) {
    console.error(chalk.red(`Node.js ${min}+ required. You have ${process.versions.node}.`));
    process.exit(1);
  }
}

// 최신 CLI 버전 체크 (배포용 이름으로 변경 필요!)
async function checkForUpdate(pkgName, localVersion) {
  try {
    const { stdout } = await execa('npm', ['view', pkgName, 'version']);
    const latest = stdout.trim();
    if (latest !== localVersion) {
      console.log(chalk.yellow(`🔔  New version available: ${latest} (You are on ${localVersion})\n  $ npm i -g ${pkgName}`));
    }
  } catch {
    /* 무시 */
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

// 패키지 설치 (최신버전)
async function installPackages(pkgs, pkgManager, dev = true, destDir = process.cwd()) {
  if (!pkgs || pkgs.length === 0) return;
  const pkgsWithLatest = [];
  for (const pkg of pkgs) {
    const version = await getLatestVersion(pkg);
    if (version) pkgsWithLatest.push(`${pkg}@${version}`);
    else pkgsWithLatest.push(pkg);
  }
  const installCmd =
    pkgManager === 'npm'
      ? ['install', dev ? '--save-dev' : '', ...pkgsWithLatest].filter(Boolean)
      : pkgManager === 'yarn'
        ? ['add', dev ? '--dev' : '', ...pkgsWithLatest].filter(Boolean)
        : ['add', dev ? '-D' : '', ...pkgsWithLatest].filter(Boolean);

  await execa(pkgManager, installCmd, { cwd: destDir, stdio: 'inherit' });
}

// package.json 수정 (스크립트 추가 등)
async function updatePackageJson(scripts, destDir) {
  const pkgPath = path.join(destDir, 'package.json');
  const file = editJsonFile(pkgPath, { autosave: true });
  Object.entries(scripts).forEach(([k, v]) => file.set(`scripts.${k}`, v));
  // Husky 자동 추가 예시
  if (!file.get('scripts.prepare') && fs.existsSync(path.join(destDir, '.huskyrc'))) {
    file.set('scripts.prepare', 'husky install');
  }
  file.save();
}

// 친절한 에러/경고 안내
function printError(message, suggestion = null) {
  console.log(chalk.bgRed.white(' ERROR '), chalk.red(message));
  if (suggestion) {
    console.log(chalk.gray('Hint:'), chalk.cyan(suggestion));
  }
}

// docker-compose 생성
async function generateCompose(template, destDir) {
  // 템플릿에 맞는 DB 선택
  const dbType = TEMPLATE_DB[template];
  const dbSnippet = dbType ? DB_SERVICES[dbType] : '';

  // docker-compose.yml 내용 생성
  const composeYml = BASE_COMPOSE(dbSnippet);

  // 파일로 기록
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

  // 2. CLI 최신버전 안내 (자신의 패키지 이름/버전 직접 입력)
  await checkForUpdate('typescript-express-starter', '10.2.2');

  intro(chalk.cyanBright.bold('✨ TypeScript Express Starter'));

  // 3. 패키지 매니저 선택 + 글로벌 설치 확인
  let pkgManager;
  while (true) {
    pkgManager = await select({
      message: 'Which package manager do you want to use?',
      options: PACKAGE_MANAGER,
      initialValue: 'npm',
    });
    if (isCancel(pkgManager)) return cancel('Aborted.');
    if (await checkPkgManagerInstalled(pkgManager)) break;
    printError(`${pkgManager} is not installed globally! Please install it first.`);
  }
  note(`Using: ${pkgManager}`);

  // 4. 템플릿 선택
  const templateDirs = (await fs.readdir(TEMPLATES)).filter(f => fs.statSync(path.join(TEMPLATES, f)).isDirectory());
  if (templateDirs.length === 0) {
    printError('No templates found!');
    return;
  }
  const template = await select({
    message: 'Choose a template:',
    options: templateDirs.map(t => ({ label: t, value: t })),
    initialValue: 'default',
  });
  if (isCancel(template)) return cancel('Aborted.');

  // 5. 프로젝트명 (중복체크/덮어쓰기)
  let projectName;
  let destDir;
  while (true) {
    projectName = await text({
      message: 'Enter your project name:',
      initial: 'my-app',
      validate: val => (!val ? 'Project name is required' : undefined),
    });
    if (isCancel(projectName)) return cancel('Aborted.');
    destDir = path.resolve(process.cwd(), projectName);
    if (await fs.pathExists(destDir)) {
      const overwrite = await confirm({ message: `Directory "${projectName}" already exists. Overwrite?` });
      if (overwrite) break;
      else continue;
    }
    break;
  }

  // 6. 개발 도구 옵션 선택(멀티)
  let devtoolValues = await multiselect({
    message: 'Select additional developer tools:',
    options: DEVTOOLS_VALUES.map(({ name, value, desc }) => ({ label: name, value, hint: desc })),
    initialValues: ['prettier', 'tsup'],
    required: false,
  });
  if (isCancel(devtoolValues)) return cancel('Aborted.');
  devtoolValues = resolveDependencies(devtoolValues);

  // === [진행] ===

  // [1] 템플릿 복사
  const spinner = ora('Copying template...\n').start();
  try {
    await fs.copy(path.join(TEMPLATES, template), destDir, { overwrite: true });
    spinner.succeed('Template copied!');
  } catch (e) {
    spinner.fail('Template copy failed!');
    printError(e.message, 'Check templates folder and permissions.');
    return process.exit(1);
  }

  // [2] 개발 도구 파일/패키지/스크립트/코드패치
  for (const val of devtoolValues) {
    const tool = DEVTOOLS_VALUES.find(d => d.value === val);
    if (!tool) continue;

    spinner.start(`Copying ${tool.name} files...\n`);
    await copyDevtoolFiles(tool, destDir);
    spinner.succeed(`${tool.name} files copied!`);

    if (tool.pkgs?.length > 0) {
      spinner.start(`Installing ${tool.name} packages (prod)...\n`);
      await installPackages(tool.pkgs, pkgManager, false, destDir);
      spinner.succeed(`${tool.name} packages (prod) installed!`);
    }

    if (tool.devPkgs?.length > 0) {
      spinner.start(`Installing ${tool.name} packages (dev)...\n`);
      await installPackages(tool.devPkgs, pkgManager, true, destDir);
      spinner.succeed(`${tool.name} packages (dev) installed!`);
    }

    if (Object.keys(tool.scripts).length) {
      spinner.start(`Updating scripts for ${tool.name}...\n`);
      await updatePackageJson(tool.scripts, destDir);
      spinner.succeed(`${tool.name} scripts updated!`);
    }

    // [2-1] 개발 도구 - Docker 선택 한 경우, docker-compose.yml 생성
    if (tool.value === 'docker') {
      spinner.start(`Creating docker-compose ...\n`);
      const dbType = await generateCompose(template, destDir);
      spinner.succeed(`docker-compose.yml with ${dbType || 'no'} DB created!`);
    }
  }

  // [3] 템플릿 기본 패키지 설치
  spinner.start(`Installing base dependencies with ${pkgManager}...\n`);
  await execa(pkgManager, ['install'], { cwd: destDir, stdio: 'inherit' });
  spinner.succeed('Base dependencies installed!');

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
