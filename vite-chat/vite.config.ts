/// <reference types="vitest" />

// vite.config.ts
// https://vitejs.dev/config/
import { defineConfig } from 'vite'
import app from './src/app'
import feathers from 'feathers-vite'

// https://vitejs.dev/config/#async-config
export default defineConfig(async () => {
  // const app = await import('./src/app.js')
  return {
    plugins: [feathers({ app })],
    build: { target: 'esnext' }
  }
})
