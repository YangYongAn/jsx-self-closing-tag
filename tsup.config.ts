import { defineConfig } from 'tsup'

const isDev = process.env.NODE_ENV === 'development'

export default defineConfig({
  entry: ['src/extension.ts'],
  format: ['cjs'],
  dts: true,
  clean: true,
  outDir: 'dist',
  external: ['vscode'],
  noExternal: ['@babel/parser', '@babel/traverse', '@babel/types'],
  sourcemap: isDev,
  minify: !isDev,
  watch: isDev
})
