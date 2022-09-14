import helmet from 'helmet'

import { feathers } from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import {
  default as express,
  json,
  urlencoded,
  static as staticFiles,
  rest,
  notFound,
  errorHandler
} from '@feathersjs/express'
import socketio from '@feathersjs/socketio'

import { Application } from './declarations.js'
import middleware from './middleware/index.js'
import { services } from './services/index.js'
import appHooks from './app.hooks.js'
import channels from './channels.js'
import authentication from './authentication.js'
// Don't remove this comment. It's needed to format import lines nicely.

export const main = async () => {
  const app: Application = express(feathers())

  // Load app configuration
  app.configure(configuration())
  // Enable security, CORS, compression, favicon and body parsing
  app.use(
    helmet({
      contentSecurityPolicy: false,
      frameguard: false
    })
  )
  app.use(json())
  app.use(urlencoded({ extended: true }))

  if (process.env.NODE_ENV === 'production') {
    app.use('/', staticFiles(app.get('dist')))
  } else {
    app.use('/', (req, res, next) => {
      if (req.path === '/') {
        res.send(`<html lang="en">
        Hello there, You seem to be lost...<br>
        Perhaps you have the wrong port?<br><br>
        NODE_ENV: ${process.env.NODE_ENV}
      `)
      } else {
        next()
      }
    })
  }

  // Set up Plugins and providers
  app.configure(rest())
  app.configure(
    socketio({
      cors: {
        origin: '*'
      }
    })
  )

  // Configure other middleware (see `middleware/index.js`)
  app.configure(middleware)
  app.configure(authentication)
  // Set up our services (see `services/index.js`)
  app.configure(services)
  // Set up event channels (see channels.js)
  app.configure(channels)

  // Configure a middleware for 404s and the error handler
  app.use(notFound())
  app.use(errorHandler({ logger: console }))

  app.hooks(appHooks)

  return app
}
export default main
