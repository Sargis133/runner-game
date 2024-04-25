import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/runner-game/',
  plugins: [vue()],
  server: {
    proxy: {
      '/': {
        target: 'https://sargis133.github.io/runner-game/',
        changeOrigin: true,
        rewrite: (path) => path === '/' ? '/' : '/'
      }
    }
  }
})
