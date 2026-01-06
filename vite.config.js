// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const VITE_PROXY_TARGET = env.VITE_PROXY_TARGET

  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: 'localhost',
      port: 5173,
      https: {
        key: fs.readFileSync(path.resolve(__dirname, 'localhost+1-key.pem')),
        cert: fs.readFileSync(path.resolve(__dirname, 'localhost+1.pem')),
      },
      ...(VITE_PROXY_TARGET && {
        proxy: {
          '/api': {
            target: VITE_PROXY_TARGET,
            changeOrigin: true,
            secure: false,
          }
        }
      })
    }
  }
})
