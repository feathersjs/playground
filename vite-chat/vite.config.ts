/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { feathers } from 'feathers-vite'

// https://vitejs.dev/config/#async-config
export default defineConfig(async ({ command }) => {
  return {
    plugins: [feathers({ app: 'src/app.ts' })]
  }
})
