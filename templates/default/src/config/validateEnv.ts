import { cleanEnv, port, str, bool, url } from 'envalid';

export const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str({ choices: ['development', 'production', 'test'] }),
    PORT: port(),
    SECRET_KEY: str(),
    LOG_FORMAT: str(),
    LOG_DIR: str(),
    ORIGIN: str(),
    CREDENTIALS: bool(),
    // 옵션 환경변수 예시
    SENTRY_DSN: str({ default: '' }),
    REDIS_URL: url({ default: 'redis://localhost:6379' }),
  });
};
