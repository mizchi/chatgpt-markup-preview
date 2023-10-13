import { defineConfig } from 'vite'
export default defineConfig({
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  build: {
    copyPublicDir: false,
    outDir: 'src/gen',
    lib: {
      entry: 'src/rendererSource.ts',
      formats: ['es'],
      fileName: (_) => `prebuilt.js`,
    },
  }
})
