import logger from './logger'
import app from './app'

const port = app.get('port')

// Without this, old JWT tokens for non existen users will crash us
process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
)

// Close previous port and open it again
const listenGlobal = globalThis as any

// A function that creates messages and then logs
// all existing messages on the service
export const bootServer = async () => {
  const server = listenGlobal.FeathersServer as any
  if (server === undefined || server.close()) {
    listenGlobal.FeathersServer = await app.listen(port)
    logger.info(
      'Feathers application started on http://%s:%d',
      app.get('host'),
      port
    )
  }
}

// Bootstrap
if (import.meta?.url?.endsWith(process.argv[1])) {
  await bootServer()
}
