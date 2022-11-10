import { defineConfig } from 'vite'
import { feathers, getDevUser } from 'feathers-vite'
import './server/HolidayBot'

// https://vitejs.dev/config/#async-config
export default defineConfig(async ({ command, mode }) => {
  const config = {
    plugins: [feathers({ app: 'server/app.ts' })],
  }

  if (mode === 'development') {
    process.env.VITE_DEV_USER = JSON.stringify(await getDevUser())
  }

  return config
})
