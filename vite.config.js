import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  css: {
    postcss: './postcss.config.js'
  },
  server: {
    // 開発時にhelp/配下のHTMLファイルを正しく提供
    fs: {
      allow: ['..']
    }
  }
})
