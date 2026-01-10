<h1 align="center">
<br>
  <img src="https://github.com/ljlm0402/typescript-express-starter/raw/images/newLogo.png" alt="Project Logo" />
  <br>
    <br>
  TypeScript Express Starter
  <br>
</h1>

<h4 align="center">🚀 Express RESTful API Boilerplate Using TypeScript</h4>

<p align ="center">
  <a href="https://nodei.co/npm/typescript-express-starter" target="_blank">
    <img src="https://nodei.co/npm/typescript-express-starter.png" alt="npm Info" />
  </a>
</p>

<p align="center">
    <a href="http://npm.im/typescript-express-starter" target="_blank">
      <img src="https://img.shields.io/npm/v/typescript-express-starter.svg" alt="npm Version" />
    </a>
    <a href="http://npm.im/typescript-express-starter" target="_blank">
      <img src="https://img.shields.io/github/v/release/ljlm0402/typescript-express-starter" alt="npm Release Version" />
    </a>
    <a href="http://npm.im/typescript-express-starter" target="_blank">
      <img src="https://img.shields.io/npm/dm/typescript-express-starter.svg" alt="npm Downloads" />
    </a>
    <a href="http://npm.im/typescript-express-starter" target="_blank">
      <img src="https://img.shields.io/npm/l/typescript-express-starter.svg" alt="npm Package License" />
    </a>
</p>

<p align="center">
  <a href="https://github.com/ljlm0402/typescript-express-starter/stargazers" target="_blank">
    <img src="https://img.shields.io/github/stars/ljlm0402/typescript-express-starter" alt="github Stars" />
  </a>
  <a href="https://github.com/ljlm0402/typescript-express-starter/network/members" target="_blank">
    <img src="https://img.shields.io/github/forks/ljlm0402/typescript-express-starter" alt="github Forks" />
  </a>
  <a href="https://github.com/ljlm0402/typescript-express-starter/stargazers" target="_blank">
    <img src="https://img.shields.io/github/contributors/ljlm0402/typescript-express-starter" alt="github Contributors" />
  </a>
  <a href="https://github.com/ljlm0402/typescript-express-starter/issues" target="_blank">
    <img src="https://img.shields.io/github/issues/ljlm0402/typescript-express-starter" alt="github Issues" />
  </a>
</p>

<br />

- [🇰🇷 Korean](https://github.com/ljlm0402/typescript-express-starter/blob/master/README.kr.md)
- [🇺🇸 English](https://github.com/ljlm0402/typescript-express-starter/blob/master/README.md)

<br />

---

## 📝 Introduction

**TypeScript Express Starter** is an interactive CLI tool that generates production-ready TypeScript Express projects with your preferred stack configuration.

Instead of starting from scratch, this CLI provides a comprehensive project generator with multiple database integrations, development tools, and deployment configurations. Choose from 10+ templates and customize your development workflow in minutes.

- **Interactive Setup**: Choose database, ORM, linter, testing framework, and more
- **Production Ready**: Docker, PM2, NGINX configurations included
- **Developer Experience**: Hot reload, testing, linting, and formatting pre-configured
- **Multiple Stacks**: Support for 10+ database/ORM combinations

## 💎 CLI Features

- 🎯 **Interactive Setup** — Smart CLI with guided project configuration

- 🗄️ **Multiple Database Options** — Prisma, Sequelize, TypeORM, Mongoose, Knex, and more

- 🛠️ **Development Tools** — Choose from ESLint, Biome, Jest, Vitest, Docker, PM2

- 📱 **Template Selection** — 10+ pre-configured project templates

- ⚡ **Auto Configuration** — Dependencies, scripts, and configs automatically setup

- 🔧 **Smart Dependencies** — Tool compatibility and requirement resolution

- 📦 **Package Manager Agnostic** — Works with npm, pnpm, or yarn

- 🚀 **Zero Config Start** — Generated projects work immediately

- 🎨 **Customizable** — Add your own templates and development tools

## ⚡️ Quick Start

```bash
# Install globally
npm install -g typescript-express-starter

# Run the interactive CLI
typescript-express-starter

# Follow the prompts to:
# 1. Choose package manager (npm/pnpm/yarn)
# 2. Select project template (default/prisma/sequelize/etc.)
# 3. Enter project name
# 4. Pick development tools (linting/testing/docker/etc.)

# Navigate to your project
cd your-project-name

# Start development server
npm run dev
```

**Generated Project Features:**
- 🌐 Express server: `http://localhost:3000/`
- 📚 Auto-generated API docs: `http://localhost:3000/api-docs`
- 🔄 Hot reload with nodemon
- 🧪 Testing setup included

## 📂 Generated Project Structure

When you create a new project, the CLI generates this structure:

```bash
your-project/
├── src/
│   ├── config/           # Configuration files, environment settings
│   ├── controllers/      # Request handling & response logic
│   ├── dtos/             # Data Transfer Objects for request/response
│   ├── entities/         # Database entities/models (if ORM selected)
│   ├── exceptions/       # Custom exception classes
│   ├── interfaces/       # TypeScript interfaces and type definitions
│   ├── middlewares/      # Middlewares (logging, auth, error handling)
│   ├── repositories/     # Database access logic
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic
│   ├── utils/            # Utility/helper functions
│   ├── app.ts            # Express app initialization
│   └── server.ts         # Server entry point
├── .env*                 # Environment variables (multiple stages)
├── nodemon.json          # Development server configuration
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── docker-compose.yml    # Docker setup (if selected)
```

## 🛠 Development Tools Available

Choose from these categories during project setup:

| Category      | Available Tools          | Description                                     |
| ------------- | ------------------------ | ----------------------------------------------- |
| **Linter**    | `biome`, `eslint`        | Code formatting & linting (Biome is all-in-one) |
| **Bundler**   | `swc`, `tsup`           | Fast TypeScript compilation and bundling       |
| **Testing**   | `jest`, `vitest`        | Unit & integration testing frameworks          |
| **Process**   | `pm2`                   | Production process management                   |
| **CI/CD**     | `github`                | GitHub Actions workflows                        |
| **Git Hooks** | `husky`                 | Pre-commit hooks for quality control           |
| **Container** | `docker`                | Docker & docker-compose configuration          |
| **API Docs**  | `swagger`               | OpenAPI/Swagger documentation                  |

**Smart Selection**: The CLI automatically resolves tool dependencies and compatibility.

## 🧩 Available Templates

Current template status (more coming soon!):

### ✅ **Currently Available**
| Template   | Description                    | Status |
| ---------- | ------------------------------ | ------ |
| `default`  | Express + TypeScript starter   | ✅ Active |

### 🚧 **Coming Soon**

#### **ORM/Database Integration**
| Template           | Description                    | Priority |
| ------------------ | ------------------------------ | -------- |
| `prisma`           | Type-safe database client with auto-generated types         | 🔥 High  |
| `drizzle`          | TypeScript-first ORM with zero runtime overhead              | 🔥 High  |
| `mikro-orm`        | Data Mapper ORM pattern for TypeScript           | 🔥 High  |
| `mongoose`         | Elegant MongoDB ODM for Node.js         | 🔥 High  |
| `node-postgres`    | High-performance PostgreSQL native driver      | 🚧 In Dev |
| `knex`             | Flexible SQL query builder & migrations      | 🚧 In Dev |
| `typeorm`          | Decorator-based Active Record ORM            | 🚧 In Dev |
| `sequelize`        | Mature Promise-based SQL ORM                  | 🚧 In Dev |
| `typegoose`        | TypeScript-friendly Mongoose alternative            | 🚧 In Dev |

#### **Architecture/Controller Style**
| Template           | Description                    | Priority |
| ------------------ | ------------------------------ | -------- |
| `graphql`          | GraphQL API schema with Apollo Server        | 🚧 In Dev |

> **Note**: Currently focusing on the `default` template. Additional templates will be activated as they're completed and tested.

## 🤔 Why Use This CLI?

### vs. Manual Setup
| Aspect           | Manual Setup                      | TypeScript Express Starter CLI        |
| ---------------- | --------------------------------- | ------------------------------------- |
| **Time**         | 🔴 Hours of configuration          | ✅ 2-3 minutes interactive setup      |
| **Configuration** | 🔴 Manual dependency management    | ✅ Auto-resolved, compatible versions  |
| **Best Practices** | 🔴 Research required            | ✅ Pre-configured industry standards  |
| **Consistency**  | 🔴 Varies by developer           | ✅ Standardized project structure     |
| **Updates**      | 🔴 Manual maintenance             | ✅ CLI updates bring new features     |

### vs. Other Generators
| Feature          | TypeScript Express Starter | Other Generators |
| ---------------- | -------------------------- | ---------------- |
| **Database Choice** | ✅ 10+ options planned       | Limited options  |
| **Tool Selection**  | ✅ Mix & match dev tools    | Fixed stack      |
| **TypeScript First** | ✅ Built for TypeScript    | Often JS-first   |
| **Production Ready** | ✅ Docker, PM2 included    | Basic setup      |

## 📄 License

MIT(LICENSE) © AGUMON (ljlm0402)

## ⭐️ Stargazers

[![Stargazers repo roster for @ljlm0402/typescript-express-starter](https://reporoster.com/stars/ljlm0402/typescript-express-starter)](https://github.com/ljlm0402/typescript-express-starter/stargazers)

## 🍴 Forkers

[![Forkers repo roster for @ljlm0402/typescript-express-starter](https://reporoster.com/forks/ljlm0402/typescript-express-starter)](https://github.com/ljlm0402/typescript-express-starter/network/members)

## 🤝 Contributors

[![Contributors repo roster for @ljlm0402/typescript-express-starter](https://contributors-img.web.app/image?repo=ljlm0402/typescript-express-starter)](https://github.com/ljlm0402/typescript-express-starter/graphs/contributors)
