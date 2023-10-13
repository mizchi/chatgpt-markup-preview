import { defineConfig } from 'vite'
export default defineConfig({
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  build: {
    copyPublicDir: false,
    outDir: 'public',
    lib: {
      entry: 'src/rendererWorker.tsx',
      formats: ['es'],
      fileName: (_) => `worker.js`,
    },
  }
})
