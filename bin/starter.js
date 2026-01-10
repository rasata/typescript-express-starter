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

// Config and constants
import { CONFIG, getEnvironmentConfig } from './config.js';
import { PACKAGE_MANAGER, TEMPLATES_VALUES, DEVTOOLS_VALUES } from './common.js';

// Database configuration
import { TEMPLATE_DB, generateDockerCompose } from './db-map.js';

// Error handling
import { CLIError, NetworkError, FileSystemError, printError } from './errors.js';

// Validation utilities
import {
  validateProjectName,
  validateProjectPath,
  sanitizeInput,
  validateNodeVersion,
} from './validators.js';

// Performance optimizations
import { versionCache, PackageBatch } from './performance.js';

// AST utilities
import { injectSwaggerIntoApp } from './ast-utils.js';

// ========== [공통 함수들] ==========

// 최신 CLI 버전 체크 & 선택적 설치
async function checkForUpdate() {
  try {
    const pkgPath = path.resolve(process.cwd(), 'package.json');
    const localPkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const pkgName = localPkg.name || 'typescript-express-stater';
    const localVersion = localPkg.version || '0.0.0';

    const latest = await versionCache.getLatestVersion(pkgName);
    if (latest > localVersion) {
      console.log(
        chalk.yellow(`🔔  New version available: ${latest} (You are on ${localVersion})`),
      );
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
          printError(new NetworkError(`Failed to update ${pkgName}`, 'update', err.message));
        }
      } else {
        console.log(chalk.gray('Skipped updating.'));
      }
    }
  } catch (err) {
    printError(new NetworkError('Failed to check latest version', 'version-check', err.message));
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
    const src = path.join(CONFIG.paths.devtools, devtool.value, file);
    const dst = path.join(destDir, file);
    if (await fs.pathExists(src)) {
      await fs.copy(src, dst, { overwrite: true });
      console.log(chalk.gray(`  ⎯ ${file} copied.`));
    }
  }
}

// 패키지 설치 (성능 최적화된 배치 처리 사용)
async function installPackages(pkgs, pkgManager, dev = true, destDir = process.cwd()) {
  if (!pkgs || pkgs.length === 0) return;

  const batch = new PackageBatch();
  batch.addMany(pkgs);
  const resolved = await batch.resolve();

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

// docker-compose 생성
async function generateCompose(template, destDir) {
  try {
    const composeYml = generateDockerCompose(template);
    const filePath = path.join(destDir, 'docker-compose.yml');
    await fs.writeFile(filePath, composeYml, 'utf8');

    const dbType = TEMPLATE_DB[template];
    console.log(chalk.gray(`  ⎯ docker-compose.yml generated with ${dbType || 'no database'}`));
    return dbType;
  } catch (error) {
    console.log(chalk.yellow(`[docker-compose] Warning: ${error.message}`));
    return null;
  }
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
    printError(
      new CLIError('git init/commit failed', 'git', 'Check git is installed and accessible.'),
    );
  }
}

// ========== [메인 CLI 실행 흐름] ==========
async function main() {
  // 1. Node 버전 체크
  validateNodeVersion(CONFIG.minNodeVersion);

  // 2. CLI 최신버전 안내
  await checkForUpdate();

  const config = getEnvironmentConfig();
  intro(config.banner.gradient);

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
  const templateDirs = (await fs.readdir(CONFIG.paths.templates)).filter((f) =>
    fs.statSync(path.join(CONFIG.paths.templates, f)).isDirectory(),
  );
  if (templateDirs.length === 0)
    return printError(new CLIError('No templates found!', 'template-selection'));

  const options = TEMPLATES_VALUES.filter((t) => t.active && templateDirs.includes(t.value)).map(
    (t) => ({
      label: t.name, // UI에 표시될 이름
      value: t.value, // 선택 값
      hint: t.desc, // 오른쪽에 표시될 설명
    }),
  );

  const template = await select({
    message: 'Choose a template:',
    options: options,
    initialValue: 'default',
  });
  if (isCancel(template)) return cancel('❌ Aborted.');

  // 5. 프로젝트명 입력 (중복체크/덮어쓰기)
  let projectName, destDir;
  while (true) {
    const rawProjectName = await text({
      message: 'Enter your project name:',
      initial: CONFIG.defaultProjectName,
      validate: (val) => {
        try {
          validateProjectName(val);
          return undefined;
        } catch (error) {
          return error.message;
        }
      },
    });
    if (isCancel(rawProjectName)) return cancel('❌ Aborted.');

    projectName = sanitizeInput(rawProjectName);
    destDir = validateProjectPath(path.resolve(process.cwd(), projectName));

    if (await fs.pathExists(destDir)) {
      const overwrite = await confirm({
        message: `Directory "${projectName}" already exists. Overwrite?`,
      });
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
    await fs.copy(path.join(CONFIG.paths.templates, template), destDir, { overwrite: true });
    spinner.succeed('Template copied!');
  } catch (e) {
    spinner.fail('Template copy failed!');
    printError(new FileSystemError(e.message, destDir, 'Check templates folder and permissions.'));
    return process.exit(1);
  }

  // [1-1] Testing 도구를 선택한 경우에만 /src/test 예제 복사
  const testDevtool = devtoolValues
    .map((val) => DEVTOOLS_VALUES.find((d) => d.value === val))
    .find((tool) => tool && tool.category === 'Testing');

  if (testDevtool) {
    const devtoolTestDir = path.join(CONFIG.paths.devtools, testDevtool.value, 'src', 'test');
    const projectTestDir = path.join(destDir, 'src', 'test');
    if (await fs.pathExists(devtoolTestDir)) {
      await fs.copy(devtoolTestDir, projectTestDir, { overwrite: true });
      console.log(chalk.gray(`  ⎯ test files for ${testDevtool.name} copied.`));
    }
  }

  // [2] 개발 도구 파일/패키지/스크립트/코드패치
  for (const val of devtoolValues) {
    const tool = DEVTOOLS_VALUES.find((d) => d.value === val);
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

    // [2-4] 개발 도구 - Swagger 선택 시에만 app.ts AST 패치
    if (tool.value === 'swagger') {
      await injectSwaggerIntoApp(destDir);
    }

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

main().catch((err) => {
  if (err instanceof CLIError) {
    printError(err);
  } else {
    printError(new CLIError('Unexpected error', null, err.message));
  }
  process.exit(err.code || 1);
});
