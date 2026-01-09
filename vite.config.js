// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
    base: '/',
    plugins: [
        react({ jsxRuntime: 'automatic' }),
        tailwindcss(),
    ],
});
