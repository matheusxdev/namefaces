import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// GitHub Pages (project site): https://matheusxdev.github.io/namefaces/
const base = process.env.VITE_BASE ?? '/'

export default defineConfig({
  base,
  plugins: [vue()],
  server: {
    port: 5173,
    open: true,
  },
})
