import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import pino from 'pino';
import { LOG_DIR } from '@config/env';

const logDir: string = join(__dirname, LOG_DIR || '/logs');
if (!existsSync(logDir)) {
  mkdirSync(logDir, { recursive: true });
}

// 파일 로깅용 경로
const debugLogPath = join(logDir, 'debug.log');
const errorLogPath = join(logDir, 'error.log');

// 로그 레벨 및 환경 설정
const isProd = process.env.NODE_ENV === 'production';
const logLevel = process.env.LOG_LEVEL || 'info';

// Pino 인스턴스
export const logger = pino(
  {
    level: logLevel,
    formatters: {
      level: label => ({ level: label }),
    },
    transport: !isProd
      ? {
          // 개발환경: 예쁜 콘솔 출력
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'yyyy-mm-dd HH:MM:ss',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
  },
  isProd ? pino.destination(debugLogPath) : undefined,
);

// 파일 로깅은 에러만 별도 핸들러로 예시
export const errorLogger = isProd ? pino(pino.destination(errorLogPath)) : logger;

// morgan stream 인터페이스
export const stream = {
  write: (msg: string) => logger.info(msg.trim()),
};

// 전역 에러 핸들링 (필요하면)
process.on('uncaughtException', err => {
  logger.error(`Uncaught Exception: ${err.message}`, { stack: err.stack });
  process.exit(1);
});
process.on('unhandledRejection', reason => {
  logger.error(`Unhandled Rejection: ${JSON.stringify(reason)}`);
  process.exit(1);
});
