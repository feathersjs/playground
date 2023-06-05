// `index.ts` does not NOT run during Dev/Testing
import { main } from './app.js'

// Without this, minor errors like invalid logins would kill the process
process.on('unhandledRejection', (reason, p) =>
  console.error('Unhandled Rejection at: Promise ', p, reason)
)

export const bootServer = async () => {
  const app = await main()
  const host = app.get('host')
  const port = app.get('port')
  await app.listen(port)
  console.info(`Feathers started on http://${host}:${port}`)
}
bootServer()
