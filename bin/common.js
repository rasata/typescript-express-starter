import { fileURLToPath } from 'url';
import path from 'path';

export const PACKAGE_MANAGER = [
  { label: 'npm', value: 'npm' },
  { label: 'yarn', value: 'yarn' },
  { label: 'pnpm', value: 'pnpm' },
];

export const DEVTOOLS_VALUES = [
  // == [Formatter] == //
  {
    name: 'Biome',
    value: 'biome',
    category: 'Formatter',
    files: ['.biome.json', '.biomeignore'],
    pkgs: [],
    devPkgs: [
      '@biomejs/biome',
    ],
    scripts: {
      "lint": "biome lint .",
      "check": "biome check .",
      "format": "biome format . --write",
    },
    desc: 'All-in-one formatter and linter',
  },
  {
    name: 'Prettier & ESLint',
    value: 'prettier',
    category: 'Formatter',
    files: ['.prettierrc', '.eslintrc', '.eslintignore', '.editorconfig'],
    pkgs: [],
    devPkgs: [
      'prettier',
      'eslint',
      '@typescript-eslint/eslint-plugin',
      '@typescript-eslint/parser',
      'eslint-config-prettier'
    ],
    scripts: {
      lint: 'eslint --ignore-path .gitignore --ext .ts src/',
      'lint:fix': 'npm run lint -- --fix',
      format: 'prettier --check .',
      'format:fix': 'prettier --write .'
    },
    desc: 'Separate formatter and linter setup',
  },

  // == [Compiler] == //
  {
    name: 'tsup',
    value: 'tsup',
    category: 'Compiler',
    files: ['tsup.config.ts'],
    pkgs: [],
    devPkgs: ['tsup'],
    scripts: {
      'start:tsup': 'node -r tsconfig-paths/register dist/server.js',
      'build:tsup': 'tsup --config tsup.config.ts',
    },
    desc: 'Fast bundler for TypeScript',
  },
  {
    name: 'SWC',
    value: 'swc',
    category: 'Compiler',
    files: ['.swcrc'],
    pkgs: [],
    devPkgs: ['@swc/cli', '@swc/core'],
    scripts: {
      'start:swc': 'node dist/server.js',
      'build:swc': 'swc src -d dist --strip-leading-paths --copy-files --delete-dir-on-start',
    },
    desc: 'Rust-based TypeScript compiler',
  },

  // == [Testing] == //
  {
    name: 'Jest',
    value: 'jest',
    category: 'Testing',
    files: ['jest.config.js'],
    pkgs: [],
    devPkgs: ['@types/supertest', 'supertest', '@types/jest', 'jest', 'ts-jest'],
    scripts: {
      "test": "jest --forceExit --detectOpenHandles",
      "test:e2e": "jest --testPathPattern=e2e",
      "test:unit": "jest --testPathPattern=unit"
    },
    desc: 'Industry-standard test runner for Node.js',
  },
  {
    name: 'Vitest',
    value: 'vitest',
    category: 'Testing',
    files: ['vitest.config.ts'],
    pkgs: [],
    devPkgs: ['@types/supertest', 'supertest', 'vitest', 'vite-tsconfig-paths'],
    scripts: {
      "test": "vitest run",
      "test:e2e": "vitest run src/test/e2e",
      "test:unit": "vitest run src/test/unit",
    },
    desc: 'Fast Vite-powered unit/e2e test framework',
  },

  // == [Infrastructure] == //
  {
    name: 'Docker',
    value: 'docker',
    category: 'Infrastructure',
    files: ['.dockerignore', 'Dockerfile.dev', 'Dockerfile.prod', 'nginx.conf', 'Makefile'],
    pkgs: [],
    devPkgs: [],
    scripts: {},
    desc: 'Containerized dev & prod environment',
  },

  // == [Git Tools] == //
  {
    name: 'Husky',
    value: 'husky',
    category: 'Git Tools',
    files: ['.husky'],
    pkgs: [],
    devPkgs: ['husky'],
    scripts: { prepare: 'husky install' },
    requires: [],
    desc: 'Git hooks for automation',
  },

  // == [Deployment] == //
  {
    name: 'PM2',
    value: 'pm2',
    category: 'Deployment',
    files: ['ecosystem.config.js'],
    pkgs: [],
    devPkgs: ['pm2'],
    scripts: {
      'deploy:prod': 'pm2 start ecosystem.config.js --only prod',
      'deploy:dev': 'pm2 start ecosystem.config.js --only dev',
    },
    desc: 'Process manager for Node.js',
  },

  // == [CI/CD] == //
  {
    name: 'GitHub Actions',
    value: 'github',
    category: 'CI/CD',
    files: ['.github/workflows/ci.yml'],
    pkgs: [],
    devPkgs: [],
    scripts: {},
    desc: 'CI/CD workflow automation',
  },
];

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const TEMPLATES = path.join(__dirname, '../templates');

export const DEVTOOLS = path.join(__dirname, '../devtools');
