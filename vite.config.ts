import { defineConfig } from 'vite'
import { crx, defineManifest } from '@crxjs/vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        welcome: 'pages/preview.html',
      },
    },
  },
  plugins: [
    // react(),
    crx({
      manifest: defineManifest({
        manifest_version: 3,
        permissions: [
          "activeTab",
          "scripting"
        ],
        name: "ChatGPT Markup Preview",
        version: "1.0.0",
        action: { "default_popup": "index.html" },
        content_security_policy: {
          extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';",
          sandbox: "sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval'; child-src 'self';"
        },
        content_scripts: [
          {
            "matches": [ "https://chat.openai.com/*"],
            "js": ["src/content.ts"],
            "run_at": "document_idle"
          },
        ]      
      }),
    })
  ],
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
})
