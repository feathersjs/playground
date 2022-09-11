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

/*/ Using a single function to handle multiple signals
function handle(signal) {
  console.log(`Received ${signal}`)
}

process.on('SIGUSR1', handle)
process.on('SIGUSR2', handle)
process.on('SIGTERM', handle)
*/
