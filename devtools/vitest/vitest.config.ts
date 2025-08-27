import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    globals: true, // 전역 expect/describe/it 사용 시 편의. 원치 않으면 제거
    setupFiles: ['src/test/setup.ts'],
    include: ['src/test/**/*.{test,spec}.ts'], // src/test/e2e, src/test/unit에 최적화
    exclude: ['node_modules', 'dist', 'coverage', 'logs'],
    coverage: {
      provider: 'v8',                 // v8 사용 시
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: 'coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.d.ts', 'src/**/index.ts', 'src/test/**'],
    },
    // e2e에서 포트/자원 충돌나면 단일 스레드:
    // poolOptions: { threads: { singleThread: true } },
  },
});
