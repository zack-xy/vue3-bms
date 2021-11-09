import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import svgLoader from 'vite-svg-loader'
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 8080,
    proxy: {
      '/vue3Bms': {
        target: 'http://localhost:3100/'
      }
    }
  },
  plugins: [vue(), svgLoader()]
})
