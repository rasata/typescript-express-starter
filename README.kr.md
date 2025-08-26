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

**TypeScript Express Starter**는 안정적이고 확장 가능한 RESTful API 서버를 빠르게 구축할 수 있는 보일러플레이트입니다.  
Express의 유연함과 간결함에 TypeScript의 타입 안정성을 결합하여, 프로토타입 단계부터 프로덕션까지 품질과 유지보수성을 보장합니다.

- 깔끔한 아키텍처와 모듈 구조

- 기본 내장 보안, 로깅, 유효성 검사, 개발 도구

- 빠른 개발과 안정적인 배포 환경 지원

## 💎 주요 기능

- ⚡ **TypeScript + Express** — 최신 JavaScript와 완전한 타입 안정성 제공

- 📜 **API 문서** — Swagger/OpenAPI를 기본 제공

- 🛡 **보안** — Helmet, CORS, HPP, 요청 속도 제한(rate limiting) 기본 포함

- 🧩 **유효성 검사** — Zod 기반의 스키마 런타임 유효성 검사

- 🔗 **의존성 주입** — tsyringe를 활용한 경량 DI 지원

- 🗄 **데이터베이스 연동** — Sequelize, Prisma, Mongoose, TypeORM, Knex, Drizzle 등 지원

- 🛠 **개발 도구** — ESLint, Prettier, Jest, Docker, PM2, NGINX, Makefile 포함

- 🧱 **모듈형 아키텍처** — 손쉽게 확장 및 유지보수 가능

- 🚀 **프로덕션 준비 완료** — Docker, PM2, NGINX 지원

## ⚡️ 빠른 시작

```bash
# 전역 설치
npm install -g typescript-express-starter

# 새 프로젝트 생성
typescript-express-starter
cd my-app

# 개발 모드 실행
npm run dev
```
- 앱 접속: http://localhost:3000/

- 자동 생성된 API 문서: http://localhost:3000/api-docs

### 샘플 영상

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

## 🛠 개발 도구(Devtools) 유형

| 구분              | 도구 / 설정 파일          | 설명                               |
| --------------- | ------------------- | -------------------------------- |
| **코드 포맷터 / 린터** | `biome`, `prettier`, `eslint` | 코드 포맷팅 및 린팅 규칙 설정                |
| **빌드 / 번들러**    | `swc`, `tsup`       | 빌드 및 번들링 설정                      |
| **테스트**         | `jest`, `vitest`    | 단위/통합 테스트 프레임워크                  |
| **프로세스 매니저**    | `pm2`               | Node.js 프로세스 관리 및 모니터링           |
| **CI/CD**       | `github`            | GitHub Actions 워크플로우 설정          |
| **Git 훅**       | `husky`             | 커밋/푸시 전 린트 및 테스트 실행              |
| **컨테이너화**       | `docker`            | Docker 및 docker-compose 배포 환경 설정 |

> 이 표를 통해 각 도구의 용도와 역할을 한눈에 파악할 수 있습니다.

## 🧩 템플릿 선택

CLI를 통해 원하는 스택을 선택하여 프로젝트를 생성할 수 있습니다.

| 템플릿         | 스택 / 통합 기능             |
| ------------- | ---------------------------- |
| Default       | Express + TypeScript         |
| Sequelize     | Sequelize ORM                |
| Mongoose      | MongoDB ODM (Mongoose)       |
| TypeORM       | TypeORM                      |
| Prisma        | Prisma ORM                   |
| Knex          | SQL Query Builder            |
| GraphQL       | GraphQL 지원                 |
| Typegoose     | TS 친화적인 Mongoose          |
| Mikro ORM     | 멀티 DB 지원 Data Mapper ORM  |
| Node Postgres | PostgreSQL 드라이버 (pg)     |
| Drizzle       | Drizzle                      |

## 🤔 포지셔닝: 각 프레임워크 사용에 적합한 상황

| 기준       | TypeScript Express Starter          | NestJS                    |
| -------- | ----------------------------------- | ------------------------- |
| 학습 곡선    | ✅ 낮음 — Express에 익숙하다면 바로 사용 가능      | 높음 — OOP/DI/데코레이터 학습 필요   |
| 유연성      | ✅ 매우 높음 — 스택의 모든 부분을 자유롭게 커스터마이징 가능 | 컨벤션 기반, 구조가 정해져 있음        |
| 모듈성      | 미들웨어 & 모듈 패턴                        | 🌟 강력한 내장 모듈 시스템          |
| 타입 안정성   | 완전한 TypeScript 지원                   | 완전한 TypeScript 지원         |
| 테스트      | ✅ Jest & Vitest 지원 — 원하는 방식 선택 가능   | Jest E2E 테스트 환경 내장        |
| 확장성      | ✅ 빠른 프로토타이핑 → 중규모 애플리케이션에 적합        | 🌟 대규모 엔터프라이즈 애플리케이션에 최적화 |
| DI 프레임워크 | 경량 tsyringe — 최소한의 오버헤드             | 🌟 기능이 풍부한 내장 DI 컨테이너     |
| 최적 사용 사례 | ✅ 마이크로서비스, MVP, 빠른 개발 속도            | 🌟 복잡하고 대규모의 엔터프라이즈 환경    |

## 📑 권장 커밋 메시지

| 상황        | 커밋 메시지       |
| --------- | ------------ |
| 기능 추가     | ✨ 기능 추가      |
| 버그 수정     | 🐞 버그 수정     |
| 코드 리팩토링   | 🛠 코드 리팩토링   |
| 패키지 설치    | 📦 패키지 설치    |
| 문서 수정     | 📚 문서 수정     |
| 버전 업데이트   | 🌼 버전 업데이트   |
| 신규 템플릿 추가 | 🎉 신규 템플릿 추가 |

## 📄 라이선스
MIT(LICENSE) © AGUMON (ljlm0402)

## ⭐️ 응원해주신 분들

[![Stargazers repo roster for @ljlm0402/typescript-express-starter](https://reporoster.com/stars/ljlm0402/typescript-express-starter)](https://github.com/ljlm0402/typescript-express-starter/stargazers)

## 🍴 참고하시는 분들

[![Forkers repo roster for @ljlm0402/typescript-express-starter](https://reporoster.com/forks/ljlm0402/typescript-express-starter)](https://github.com/ljlm0402/typescript-express-starter/network/members)

## 🤝 도움주신 분들

[![Contributors repo roster for @ljlm0402/typescript-express-starter](https://contributors-img.web.app/image?repo=ljlm0402/typescript-express-starter)](https://github.com/ljlm0402/typescript-express-starter/graphs/contributors)
