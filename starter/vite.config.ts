import { defineConfig } from 'vite'
import { feathers, getDevUser } from 'feathers-vite'
import util from 'node:util'
import { execFile } from 'node:child_process'
import './api/HolidayBot'

// https://vitejs.dev/config/#async-config
export default defineConfig(async ({ command, mode }) => {
  const config = {
    plugins: [feathers()],
  }

  if (mode === 'development') {
    process.env.VITE_DEV_USER = JSON.stringify(await getDevUser())
  }

  return config
})
