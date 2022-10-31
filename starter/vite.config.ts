import { defineConfig } from 'vite'
import { feathers } from 'feathers-vite'
import util from 'node:util'
import { execFile } from 'node:child_process'
import './api/HolidayBot'

async function getDevUser() {
  const run = util.promisify(execFile)
  const giRaw = []
  try {
    giRaw.push(...(await Promise.all([
      run('/usr/bin/git', ['config', '--get', 'user.name']),
      run('/usr/bin/git', ['config', '--get', 'user.email'])
    ])))
  } catch { console.debug('Using default dev user') }
  const gi = giRaw.map(v => v.stdout?.trim())
  const result = { name: gi[0], email: gi[1] }
  return result
}

// https://vitejs.dev/config/#async-config
export default defineConfig(async ({ command, mode }) => {
  const config = {
    plugins: [feathers()]
  }

  if (mode === 'development') {
    process.env.VITE_USER = JSON.stringify(await getDevUser())
  }

  return config
})
