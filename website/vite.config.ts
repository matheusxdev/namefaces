import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// GitHub Pages (project site): https://matheusxdev.github.io/namefaces/
const base = process.env.VITE_BASE ?? '/'
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

export default defineConfig({
  base,
  plugins: [vue()],
  resolve: {
    // Prefer the local package over any nested registry copy.
    alias: {
      namefaces: repoRoot,
    },
  },
  optimizeDeps: {
    include: ['namefaces'],
  },
  server: {
    port: 5173,
    strictPort: true,
    open: true,
    fs: {
      allow: [repoRoot],
    },
  },
})
