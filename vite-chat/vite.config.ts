/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { spawn } from 'node:child_process'

if (process.env.SKIP_SERVER !== 'true') {
  spawn('npm', ['run', 'dev:server'], { stdio: 'inherit' })
}

// https://vitejs.dev/config/#async-config
export default defineConfig(async ({ command }) => {
  return {
    plugins: [],
    build: { target: 'esnext' }
  }
})
