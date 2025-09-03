import { fileURLToPath } from 'url';
import path from 'path';

export const PACKAGE_MANAGER = [
  { label: 'npm', value: 'npm' },
  { label: 'pnpm', value: 'pnpm' },
  { label: 'yarn', value: 'yarn' },
];

export const TEMPLATES_VALUES = [
  {
    name: 'Default',
    value: 'default',
    desc: 'Basic Express + TypeScript project',
    active: true,
    tags: ['express', 'typescript', 'starter'],
    version: 'v1.0.0',
    maintainer: 'core',
    lastUpdated: '2025-08-27',
  },
  {
    name: 'GraphQL',
    value: 'graphql',
    desc: 'GraphQL API template based on Apollo Server',
    active: false,
    tags: ['graphql', 'apollo', 'api'],
    version: 'v1.2.0',
    maintainer: 'core',
    lastUpdated: '2025-08-10',
  },
  {
    name: 'Knex',
    value: 'knex',
    desc: 'SQL query builder template using Knex.js',
    active: false,
    tags: ['sql', 'knex', 'database'],
    version: 'v0.95.x',
    maintainer: 'db-team',
    lastUpdated: '2025-07-30',
  },
  {
    name: 'Mikro-ORM',
    value: 'mikro-orm',
    desc: 'TypeScript ORM template based on Mikro-ORM',
    active: false,
    tags: ['orm', 'typescript', 'database'],
    version: 'v6.x',
    maintainer: 'orm-team',
    lastUpdated: '2025-07-25',
  },
  {
    name: 'Mongoose',
    value: 'mongoose',
    desc: 'MongoDB ODM template using Mongoose',
    active: false,
    tags: ['mongodb', 'odm', 'database'],
    version: 'v7.x',
    maintainer: 'nosql-team',
    lastUpdated: '2025-08-01',
  },
  {
    name: 'Node-Postgres',
    value: 'node-postgres',
    desc: 'PostgreSQL template using pg library',
    active: false,
    tags: ['postgres', 'sql', 'database'],
    version: 'v8.x',
    maintainer: 'db-team',
    lastUpdated: '2025-07-20',
  },
  {
    name: 'Prisma',
    value: 'prisma',
    desc: 'SQL/NoSQL ORM template based on Prisma',
    active: false,
    tags: ['orm', 'prisma', 'database'],
    version: 'v5.x',
    maintainer: 'orm-team',
    lastUpdated: '2025-08-05',
  },
  {
    name: 'Routing-Controllers',
    value: 'routing-controllers',
    desc: 'Express controller structure with TypeScript decorators',
    active: false,
    tags: ['decorator', 'controller', 'express'],
    version: 'v0.10.x',
    maintainer: 'core',
    lastUpdated: '2025-07-15',
  },
  {
    name: 'Sequelize',
    value: 'sequelize',
    desc: 'SQL ORM template based on Sequelize',
    active: false,
    tags: ['orm', 'sequelize', 'database'],
    version: 'v6.x',
    maintainer: 'orm-team',
    lastUpdated: '2025-07-28',
  },
  {
    name: 'Typegoose',
    value: 'typegoose',
    desc: 'TypeScript-friendly MongoDB ODM using Typegoose',
    active: false,
    tags: ['mongodb', 'typegoose', 'odm'],
    version: 'v11.x',
    maintainer: 'nosql-team',
    lastUpdated: '2025-08-08',
  },
  {
    name: 'TypeORM',
    value: 'typeorm',
    desc: 'SQL/NoSQL ORM template based on TypeORM',
    active: false,
    tags: ['orm', 'typeorm', 'database'],
    version: 'v0.3.x',
    maintainer: 'orm-team',
    lastUpdated: '2025-07-18',
  },
];

export const DEVTOOLS_VALUES = [
  // == [Linter] == //
  {
    name: 'Biome',
    value: 'biome',
    category: 'Linter',
    files: ['.biome.json', '.biomeignore'],
    pkgs: [],
    devPkgs: ['@biomejs/biome@2.1.4'],
    scripts: {
      lint: 'biome lint .',
      check: 'biome check .',
      format: 'biome format . --write',
    },
    desc: 'All-in-one formatter and linter',
  },
  {
    name: 'ESLint & Prettier',
    value: 'eslint',
    category: 'Linter',
    files: ['.prettierrc', 'eslint.config.cjs'],
    pkgs: [],
    devPkgs: ['eslint@^9.33.0', 'eslint-config-prettier@^10.1.1', 'globals@^15.10.0', 'prettier@3.6.2', 'typescript-eslint@^8.39.0'],
    scripts: {
      lint: 'eslint --ext .ts src/',
      'lint:fix': 'npm run lint -- --fix',
      format: 'prettier --check .',
      'format:fix': 'prettier --write .',
    },
    desc: 'Separate formatter and linter setup',
  },
  {
    name: 'Oxlint',
    value: 'oxlint',
    category: 'Linter',
    files: ['.oxlintrc.json', '.prettierrc'],
    pkgs: [],
    devPkgs: ['oxlint@^1.14.0', '@oxlint/migrate@^1.14.0', 'prettier@3.6.2'],
    scripts: {
      'lint': 'oxlint .',
      'lint:fix': 'oxlint . --fix',
      'format': 'prettier --check .',
      'format:fix': 'prettier --write .',
    },
    desc: 'Ultra-fast Rust linter for JS/TS'
  },

  // == [Compiler] == //
  {
    name: 'tsup',
    value: 'tsup',
    category: 'Compiler',
    files: ['tsup.config.ts'],
    pkgs: [],
    devPkgs: ['tsup@8.5.0'],
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
    devPkgs: ['@swc/cli@0.7.8', '@swc/core@1.13.3'],
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
    files: ['jest.config.cjs', 'jest.config.ts'],
    pkgs: [],
    devPkgs: ['@types/supertest@6.0.3', 'supertest@7.1.4', '@types/jest@30.0.0', 'jest@30.0.5', 'ts-jest@29.4.1'],
    scripts: {
      test: 'jest --config jest.config.cjs --watch',
      'test:e2e': 'jest --config jest.config.cjs --testPathPatterns=e2e --watch',
      'test:unit': 'jest --config jest.config.cjs --testPathPatterns=unit --watch',
    },
    desc: 'Industry-standard test runner for Node.js',
  },
  {
    name: 'Vitest',
    value: 'vitest',
    category: 'Testing',
    files: ['vitest.config.ts'],
    pkgs: [],
    devPkgs: ['@types/supertest@6.0.3', 'supertest@7.1.4', 'vite-tsconfig-paths@5.1.4', 'vitest@3.2.4'],
    scripts: {
      test: 'vitest',
      'test:unit': 'vitest src/test/unit',
      'test:e2e': 'vitest src/test/e2e',
      'test:ci': 'vitest run --coverage',
      'test:ci:unit': 'vitest run src/test/unit --coverage',
      'test:ci:e2e': 'vitest run src/test/e2e --coverage',
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
    pkgs: ['pm2'],
    devPkgs: [],
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
