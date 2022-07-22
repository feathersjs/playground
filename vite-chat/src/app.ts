import compress from 'compression'
import helmet from 'helmet'

import { feathers } from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import express, {
  json,
  urlencoded,
  static as staticFiles,
  rest,
  notFound,
  errorHandler
} from '@feathersjs/express'
import socketio from '@feathersjs/socketio'

import { Application } from './declarations'
import logger from './logger'
import middleware from './middleware'
import { services } from './services'
import appHooks from './app.hooks'
import channels from './channels'
import authentication from './authentication'
// Don't remove this comment. It's needed to format import lines nicely.

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
app.use(compress())
app.use(json())
app.use(urlencoded({ extended: true }))

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
// app.use('/', staticFiles(app.get('public')))

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
app.use(errorHandler({ logger }))

app.hooks(appHooks)

export default app
