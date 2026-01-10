<h1 align="center">
<br>
  <img src="https://github.com/ljlm0402/typescript-express-starter/raw/images/newLogo.png" alt="프로젝트 로고" />
  <br>
    <br>
  TypeScript Express Starter
  <br>
</h1>

<h4 align="center">🚀 TypeScript 기반 Express RESTful API 보일러플레이트</h4>

<p align ="center">
  <a href="https://nodei.co/npm/typescript-express-starter" target="_blank">
    <img src="https://nodei.co/npm/typescript-express-starter.png" alt="npm 정보" />
  </a>
</p>

<p align="center">
    <a href="http://npm.im/typescript-express-starter" target="_blank">
      <img src="https://img.shields.io/npm/v/typescript-express-starter.svg" alt="npm 버전" />
    </a>
    <a href="http://npm.im/typescript-express-starter" target="_blank">
      <img src="https://img.shields.io/github/v/release/ljlm0402/typescript-express-starter" alt="GitHub 릴리즈 버전" />
    </a>
    <a href="http://npm.im/typescript-express-starter" target="_blank">
      <img src="https://img.shields.io/npm/dm/typescript-express-starter.svg" alt="npm 다운로드 수" />
    </a>
    <a href="http://npm.im/typescript-express-starter" target="_blank">
      <img src="https://img.shields.io/npm/l/typescript-express-starter.svg" alt="라이선스" />
    </a>
</p>

<br />

- [🇰🇷 한국어](https://github.com/ljlm0402/typescript-express-starter/blob/master/README.kr.md)
- [🇺🇸 영어](https://github.com/ljlm0402/typescript-express-starter/blob/master/README.md)

<br />

## 📝 소개

**TypeScript Express Starter**는 원하는 스택 구성으로 프로덕션 준비된 TypeScript Express 프로젝트를 생성하는 대화형 CLI 도구입니다.

처음부터 시작하는 대신, 이 CLI는 다양한 데이터베이스 연동, 개발 도구, 배포 구성을 포함한 포괄적인 프로젝트 생성기를 제공합니다. 10개 이상의 템플릿 중 선택하고 몇 분 안에 개발 워크플로우를 맞춤 설정할 수 있습니다.

- **대화형 설정**: 데이터베이스, ORM, 린터, 테스트 프레임워크 등을 선택
- **프로덕션 준비**: Docker, PM2, NGINX 구성 포함
- **개발자 경험**: 핫 리로드, 테스트, 린팅, 포맷팅이 미리 구성됨
- **다양한 스택**: 10개 이상의 데이터베이스/ORM 조합 지원

## 💎 CLI 주요 기능

- 🎯 **대화형 설정** — 스마트 CLI로 프로젝트 구성을 안내

- 🗄️ **다양한 데이터베이스 옵션** — Prisma, Sequelize, TypeORM, Mongoose, Knex 등

- 🛠️ **개발 도구** — ESLint, Biome, Jest, Vitest, Docker, PM2 중 선택

- 📱 **템플릿 선택** — 10개 이상의 사전 구성된 프로젝트 템플릿

- ⚡ **자동 구성** — 의존성, 스크립트, 설정이 자동으로 설정됨

- 🔧 **스마트 의존성** — 도구 호환성 및 요구사항 자동 해결

- 📦 **패키지 매니저 지원** — npm, pnpm, yarn 모두 지원

- 🚀 **제로 설정 시작** — 생성된 프로젝트가 즉시 동작

- 🎨 **커스터마이징 가능** — 자신만의 템플릿과 개발 도구 추가

## ⚡️ 빠른 시작

```bash
# 전역 설치
npm install -g typescript-express-starter

# 대화형 CLI 실행
typescript-express-starter

# 프롬프트에 따라 다음을 선택:
# 1. 패키지 매니저 선택 (npm/pnpm/yarn)
# 2. 프로젝트 템플릿 선택 (default/prisma/sequelize/등)
# 3. 프로젝트 이름 입력
# 4. 개발 도구 선택 (린팅/테스트/도커/등)

# 프로젝트로 이동
cd your-project-name

# 개발 서버 시작
npm run dev
```

**생성된 프로젝트 기능:**
- 🌐 Express 서버: `http://localhost:3000/`
- 📚 자동 생성된 API 문서: `http://localhost:3000/api-docs`
- 🔄 nodemon을 통한 핫 리로드
- 🧪 테스트 설정 포함

## 📂 프로젝트 구조

```bash
src/
 ├── config/           # 환경 변수, 설정 파일
 ├── controllers/      # 요청 처리 및 응답 반환
 ├── dtos/             # 요청/응답 데이터 구조 정의
 ├── exceptions/       # 커스텀 예외 클래스
 ├── interfaces/       # 타입/인터페이스 정의
 ├── middlewares/      # 미들웨어 (로그, 인증, 에러 처리 등)
 ├── repositories/     # 데이터베이스 접근 로직
 ├── routes/           # 라우팅 정의
 ├── services/         # 비즈니스 로직
 ├── utils/            # 유틸리티 함수
 ├── app.ts            # Express 앱 초기화
 └── server.ts         # 서버 실행 엔트리 포인트

.env                   # 기본 환경 변수
.env.development.local # 개발 환경 변수
.env.production.local  # 운영 환경 변수
.env.test.local        # 테스트 환경 변수
nodemon.json           # Nodemon 환경 변수
swagger.yaml           # Swagger API 문서 정의
tsconfig.jsnon         # TypeScript 환경 변수
```

## 🛠 사용 가능한 개발 도구

프로젝트 설정 중 다음 카테고리에서 선택할 수 있습니다:

| 카테고리   | 사용 가능한 도구        | 설명                                    |
| ---------- | ------------------------ | ------------------------------------------- |
| **린터**   | `biome`, `eslint`        | 코드 포맷팅 및 린팅 (Biome은 올인원) |
| **번들러** | `swc`, `tsup`           | 빠른 TypeScript 컴파일 및 번들링     |
| **테스트** | `jest`, `vitest`        | 단위 및 통합 테스트 프레임워크        |
| **프로세스** | `pm2`                   | 프로덕션 프로세스 관리               |
| **CI/CD**  | `github`                | GitHub Actions 워크플로우               |
| **Git 훅** | `husky`                 | 품질 관리를 위한 Pre-commit 훅       |
| **컨테이너** | `docker`                | Docker 및 docker-compose 구성          |
| **API 문서** | `swagger`               | OpenAPI/Swagger 문서                   |

**스마트 선택**: CLI가 도구 의존성과 호환성을 자동으로 해결합니다.

## 🧩 사용 가능한 템플릿

현재 템플릿 상태 (더 많은 템플릿 추가 예정!):

### ✅ **현재 사용 가능**
| 템플릿   | 설명                        | 상태 |
| ---------- | ------------------------------ | ------ |
| `default`  | Express + TypeScript 스타터   | ✅ 활성 |

### 🚧 **개발 예정**

#### **ORM/데이터베이스 연동**
| 템플릿           | 설명                    | 우선순위 |
| ------------------ | ------------------------------ | -------- |
| `prisma`           | 타입 안전 데이터베이스 클라이언트, 자동 타입 생성         | 🔥 높음  |
| `drizzle`          | 런타임 오버헤드 없는 TypeScript 우선 ORM              | 🔥 높음  |
| `mikro-orm`        | TypeScript용 Data Mapper ORM 패턴           | 🔥 높음  |
| `mongoose`         | Node.js용 우아한 MongoDB ODM         | 🔥 높음  |
| `node-postgres`    | 고성능 PostgreSQL 원시 드라이버 (pg)      | 🚧 개발 중 |
| `knex`             | 유연한 SQL 쿼리 빌더 및 마이그레이션      | 🚧 개발 중 |
| `typeorm`          | 데코레이터 기반 Active Record ORM            | 🚧 개발 중 |
| `sequelize`        | 성숙한 Promise 기반 SQL ORM                  | 🚧 개발 중 |
| `typegoose`        | TypeScript 친화적 Mongoose 대안            | 🚧 개발 중 |

#### **아키텍처/컨트롤러 스타일**
| 템플릿           | 설명                    | 우선순위 |
| ------------------ | ------------------------------ | -------- |
| `graphql`          | Apollo Server 기반 GraphQL API 스키마        | 🚧 개발 중 |

> **참고**: 현재 `default` 템플릿에 집중하고 있습니다. 추가 템플릿은 완성 및 테스트가 끝나면 활성화될 예정입니다.

## 🤔 이 CLI를 사용하는 이유?

### vs. 수동 설정
| 측면           | 수동 설정                      | TypeScript Express Starter CLI        |
| ---------------- | --------------------------------- | ------------------------------------- |
| **시간**         | 🔴 수 시간의 구성 작업          | ✅ 2-3분 대화형 설정      |
| **구성** | 🔴 수동 의존성 관리    | ✅ 자동 해결, 호환 버전  |
| **모범 사례** | 🔴 연구 필요            | ✅ 사전 구성된 업계 표준  |
| **일관성**  | 🔴 개발자마다 다름           | ✅ 표준화된 프로젝트 구조     |
| **업데이트**      | 🔴 수동 유지보수             | ✅ CLI 업데이트로 새 기능 제공     |

### vs. 다른 생성기
| 기능          | TypeScript Express Starter | 다른 생성기 |
| ---------------- | -------------------------- | ---------------- |
| **데이터베이스 선택** | ✅ 10개 이상 옵션 계획       | 제한된 옵션  |
| **도구 선택**  | ✅ 믹스 앤 매치 개발 도구    | 고정된 스택      |
| **TypeScript 우선** | ✅ TypeScript를 위해 제작    | 주로 JS 우선   |
| **프로덕션 준비** | ✅ Docker, PM2 포함    | 기본 설정      |

## 📄 라이선스

MIT(LICENSE) © AGUMON (ljlm0402)

## ⭐️ 응원해주신 분들

[![Stargazers repo roster for @ljlm0402/typescript-express-starter](https://reporoster.com/stars/ljlm0402/typescript-express-starter)](https://github.com/ljlm0402/typescript-express-starter/stargazers)

## 🍴 참고하시는 분들

[![Forkers repo roster for @ljlm0402/typescript-express-starter](https://reporoster.com/forks/ljlm0402/typescript-express-starter)](https://github.com/ljlm0402/typescript-express-starter/network/members)

## 🤝 도움주신 분들

[![Contributors repo roster for @ljlm0402/typescript-express-starter](https://contributors-img.web.app/image?repo=ljlm0402/typescript-express-starter)](https://github.com/ljlm0402/typescript-express-starter/graphs/contributors)
