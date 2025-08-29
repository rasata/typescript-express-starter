import { existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import pino from 'pino';
import { LOG_DIR, LOG_LEVEL, NODE_ENV } from '@config/env';

// 로그 환경 설정
const logRoot = LOG_DIR || 'logs';
const isProd = NODE_ENV === 'production';
const logLevel = LOG_LEVEL || 'info';

// 로깅용 폴더 위치 지정 (프로젝트 상단)
const findPackageRoot = (startDir: string): string => {
  let dir = startDir;

  while (true) {
    if (existsSync(join(dir, 'package.json'))) return dir;
    const parent = dirname(dir);
    if (parent === dir) return startDir; // fallback
    dir = parent;
  }
}
const appRoot = findPackageRoot(__dirname);
const logDir = join(appRoot, logRoot);

// 로깅용 폴더 생성
if (!existsSync(logDir)) {
  mkdirSync(logDir, { recursive: true });
}

// 파일 로깅용 경로
const debugLogPath = join(logDir, 'debug.log');
const errorLogPath = join(logDir, 'error.log');

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
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

process.on('unhandledRejection', reason => {
  logger.error(`Unhandled Rejection: ${JSON.stringify(reason)}`);
  process.exit(1);
});
