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

**TypeScript Express Starter** provides a robust starting point for building secure, scalable, and maintainable RESTful APIs.  

It blends the flexibility and simplicity of Express with TypeScript’s type safety, supporting rapid development without compromising code quality or maintainability.

- Clean architecture and modular structure

- Built-in security, logging, validation, and developer tooling

- Instantly ready for both prototyping and production

## 💎 Features

- ⚡ **TypeScript + Express** — Modern JS with full type safety

- 📜 **API Docs** — Swagger/OpenAPI ready out-of-the-box

- 🛡 **Security** — Helmet, CORS, HPP, rate limiting

- 🧩 **Validation** — Zod schema-based runtime validation

- 🔗 **Dependency Injection** — Lightweight DI with tsyringe

- 🗄 **Database Integrations** — Sequelize, Prisma, Mongoose, TypeORM, Knex, Drizzle, etc.

- 🛠 **Developer Tools** — ESLint, Prettier, Jest, Docker, PM2, NGINX, Makefile

- 🧱 **Modular Architecture** — Easily extendable and maintainable

- 🚀 **Production Ready** — Docker, PM2, NGINX support

## ⚡️ Quick Start

```bash
# Install globally
npm install -g typescript-express-starter

# Scaffold a new project
typescript-express-starter
cd my-app

# Run in development mode
npm run dev
```
- Access the app: http://localhost:3000/

- Auto-generated API docs: http://localhost:3000/api-docs

### Example

## 📂 Project Structure

```bash
src/
 ├── config/           # Configuration files, environment settings
 ├── controllers/      # Request handling & response logic
 ├── dtos/             # Data Transfer Objects for request/response
 ├── exceptions/       # Custom exception classes
 ├── interfaces/       # TypeScript interfaces and type definitions
 ├── middlewares/      # Middlewares (logging, auth, error handling, etc.)
 ├── repositories/     # Database access logic
 ├── routes/           # API route definitions
 ├── services/         # Business logic
 ├── utils/            # Utility/helper functions
 ├── app.ts            # Express app initialization
 └── server.ts         # Server entry point

.env                   # Default environment variables
.env.development.local # Development-specific variables
.env.production.local  # Production-specific variables
.env.test.local        # Test-specific variables
nodemon.json           # Nodemon variables
swagger.yaml           # Swagger API documentation
tsconfig.jsnon         # TypeScript variables
```

## 🛠 Devtools Types

| Category                    | Tools / Configs             | Description                                  |
| --------------------------- | --------------------------- | -------------------------------------------- |
| **Code Formatter / Linter** | `biome`, `prettier, eslint` | Code formatting & linting rules              |
| **Build / Bundler**         | `swc`, `tsup`               | Build & bundling configuration               |
| **Testing**                 | `jest`, `vitest`            | Unit & integration testing frameworks        |
| **Process Manager**         | `pm2`                       | Manage and monitor Node.js processes         |
| **CI/CD**                   | `github`                    | GitHub Actions workflow settings             |
| **Git Hooks**               | `husky`                     | Pre-commit / pre-push hooks for lint/test    |
| **Containerization**        | `docker`                    | Docker & docker-compose setup for deployment |

> This categorization helps developers quickly understand what each tool is used for without checking every folder.

## 🧩 Template Choices

Choose your preferred stack during setup!
Support for major databases and patterns via CLI:

| Template      | Stack / Integration            |
| ------------- | ------------------------------ |
| Default       | Express + TypeScript           |
| Sequelize     | Sequelize ORM                  |
| Mongoose      | MongoDB ODM (Mongoose)         |
| TypeORM       | TypeORM                        |
| Prisma        | Prisma ORM                     |
| Knex          | SQL Query Builder              |
| GraphQL       | GraphQL support                |
| Typegoose     | TS-friendly Mongoose           |
| Mikro ORM     | Data Mapper ORM (multi-DB)     |
| Node Postgres | PostgreSQL driver (pg)         |
| Drizzle       | Drizzle                        |

> More templates are regularly added and updated.

## 🤔 Positioning: When to Use Each

| Criteria         | TypeScript Express Starter                          | NestJS                                     |
| ---------------- | --------------------------------------------------- | ------------------------------------------ |
| Learning Curve   | ✅ Low — easy for anyone familiar with Express       | Higher — requires OOP/DI/Decorators        |
| Flexibility      | ✅ Maximum — customize any part of the stack         | Convention-based, opinionated structure    |
| Modularity       | Middleware & modular pattern                        | 🌟 Strong built-in module system           |
| Type Safety      | Full TypeScript support                             | Full TypeScript support                    |
| Testing          | ✅ Supports Jest & Vitest — flexible choice          | Built-in Jest E2E setup                    |
| Scale            | ✅ Fast prototyping → mid-size apps                  | 🌟 Large-scale enterprise apps             |
| DI Framework     | Lightweight tsyringe — minimal overhead             | 🌟 Full-featured DI container              |
| Best Fit         | ✅ Microservices, quick MVPs, developer agility      | 🌟 Complex, enterprise-grade applications  |


## 📑 Recommended Commit Message

| When            | Commit Message     |
| --------------- | ------------------ |
| Add Feature     | ✨ Add Feature      |
| Fix Bug         | 🐞 Fix Bug         |
| Refactor Code   | 🛠 Refactor Code   |
| Install Package | 📦 Install Package |
| Fix Readme      | 📚 Fix Readme      |
| Update Version  | 🌼 Update Version  |
| New Template    | 🎉 New Template    |

## 📄 License
MIT(LICENSE) © AGUMON (ljlm0402)

## ⭐️ Stargazers

[![Stargazers repo roster for @ljlm0402/typescript-express-starter](https://reporoster.com/stars/ljlm0402/typescript-express-starter)](https://github.com/ljlm0402/typescript-express-starter/stargazers)

## 🍴 Forkers

[![Forkers repo roster for @ljlm0402/typescript-express-starter](https://reporoster.com/forks/ljlm0402/typescript-express-starter)](https://github.com/ljlm0402/typescript-express-starter/network/members)

## 🤝 Contributors

[![Contributors repo roster for @ljlm0402/typescript-express-starter](https://contributors-img.web.app/image?repo=ljlm0402/typescript-express-starter)](https://github.com/ljlm0402/typescript-express-starter/graphs/contributors)
