import { userInfo } from 'node:os'
// Use winston if installed. see https://github.com/winstonjs/winston
const loadLogger = async () => {
  if (userInfo().username === 'blitz') {
    return console
  }

  try {
    // @ts-ignore
    const { createLogger, format, transports } = await import('winston')
    return createLogger({
      // To see more detailed errors, change this to 'debug'
      level: 'info',
      format: format.combine(format.splat(), format.simple()),
      transports: [new transports.Console()],
    })
  } catch (e) {
    console.warn('To use winston as your logger, run `npm i -D winston`')
    return console
    /*} else {
      throw e
    }
    */
  }
}

const logger = await loadLogger()

export default logger
