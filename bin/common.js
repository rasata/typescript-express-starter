import { fileURLToPath } from 'url';
import path from 'path';

export const packageManager = [
  { label: 'npm', value: 'npm' },
  { label: 'yarn', value: 'yarn' },
  { label: 'pnpm', value: 'pnpm' },
];

export const devTools = [
  {
    name: 'Prettier & ESLint',
    value: 'prettier',
    files: ['.prettierrc', '.eslintrc', '.eslintignore', '.editorconfig'],
    pkgs: [],
    devPkgs: [
      'prettier',
      'eslint',
      '@typescript-eslint/eslint-plugin',
      '@typescript-eslint/parser',
      'eslint-config-prettier',
      'eslint-plugin-prettier',
    ],
    scripts: {
      lint: 'eslint --ignore-path .gitignore --ext .ts src/',
      'lint:fix': 'npm run lint -- --fix',
      format: 'prettier --check .',
    },
    desc: 'Code Formatter',
  },
  {
    name: 'tsup',
    value: 'tsup',
    files: ['tsup.config.ts'],
    pkgs: [],
    devPkgs: ['tsup'],
    scripts: {
      'start:tsup': 'node -r tsconfig-paths/register dist/server.js',
      'build:tsup': 'tsup',
    },
    desc: 'Fastest Bundler',
  },
  {
    name: 'SWC',
    value: 'swc',
    files: ['.swcrc'],
    pkgs: [],
    devPkgs: ['@swc/cli', '@swc/core'],
    scripts: {
      'build:swc': 'swc src -d dist --strip-leading-paths --copy-files --delete-dir-on-start',
    },
    desc: 'Super Fast Compiler',
  },
  {
    name: 'Docker',
    value: 'docker',
    files: ['.dockerignore', 'docker-compose.yml', 'Dockerfile.dev', 'Dockerfile.prod', 'nginx.conf'],
    pkgs: [],
    devPkgs: [],
    scripts: {},
    desc: 'Container',
  },
  {
    name: 'Husky',
    value: 'husky',
    files: ['.husky'],
    pkgs: [],
    devPkgs: ['husky'],
    scripts: { prepare: 'husky install' },
    requires: [],
    desc: 'Git hooks',
  },
  {
    name: 'PM2',
    value: 'pm2',
    files: ['ecosystem.config.js'],
    pkgs: [],
    devPkgs: ['pm2'],
    scripts: {
      'deploy:prod': 'pm2 start ecosystem.config.js --only prod',
      'deploy:dev': 'pm2 start ecosystem.config.js --only dev',
    },
    desc: 'Process Manager',
  },
  {
    name: 'GitHub Actions',
    value: 'github',
    files: ['.github/workflows/ci.yml'],
    pkgs: [],
    devPkgs: [],
    scripts: {},
    desc: 'CI/CD',
  },
];

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const templatesPkg = path.join(__dirname, '../templates');

export const devtoolsPkg = path.join(__dirname, '../devtools');
