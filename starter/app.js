import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import socketio from '@feathersjs/socketio'
import { MessageService, MessageHooks } from './messages.js'

// Creates an ExpressJS compatible Feathers application
const app = express(feathers())

// Parse HTTP JSON bodies
app.use(express.json())
// Parse URL-encoded params
app.use(express.urlencoded({ extended: true }))
// Host static files from the current folder
app.use(express.static('.'))
// Add REST API support
app.configure(express.rest())
// Configure Socket.io real-time APIs
app.configure(socketio())
// Register an in-memory messages service and register hooks
app.use('/messages', new MessageService()).hooks(MessageHooks)
// Register a nicer error handler than the default Express one
app.use(express.errorHandler())

// Add any new real-time connection to the `everybody` channel
app.on('connection', (connection) => app.channel('everybody').join(connection))
// Publish all events to the `everybody` channel
app.publish((data) => app.channel('everybody'))

// Start the server
app.listen(3030).on('listening', () => console.log('Feathers server listening'))

// Don't crash when invalid queries are received
process.on('unhandledRejection', (reason, p) =>
  console.error('Unhandled Rejection at: Promise ', p, reason)
)

// For good measure let's create a message
// So our API doesn't look so empty
app.service('messages').create([
  { text: 'Hello world from the server' },
  { text: 'For more complete sandboxes with TypeScript etc, see github.com/feathersjs/playground'}
])
