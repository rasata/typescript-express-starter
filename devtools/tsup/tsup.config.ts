import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],     // CLI 등 추가시 여러 entry도 가능
  outDir: 'dist',
  format: ['cjs'],             // 필요시 'esm'도 ['cjs', 'esm']
  dts: true,
  sourcemap: true,
  clean: true,
  minify: false,
  target: 'es2020',
  // alias, swc 옵션은 tsconfig.json 기준으로 자동 적용
  // external: [], // node_modules 제외하고 싶을 때
});
