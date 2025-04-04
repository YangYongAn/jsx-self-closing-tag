import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/extension.ts'],
  format: ['cjs'],
  dts: true,
  clean: true,
  outDir: 'dist',
  external: ['vscode'],
  noExternal: ['@babel/parser', '@babel/traverse', '@babel/types']
}) 