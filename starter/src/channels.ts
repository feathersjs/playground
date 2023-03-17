// https://docs.feathersjs.com/api/channels.html
import { HookContext } from '@feathersjs/feathers'
import { Application } from './declarations.js'

let warningDelivered = false
export default function (app: Application) {
  if (typeof app.channel !== 'function') {
    return // real-time features are turned off
  }

  app.on('connection', (connection: any) => {
    app.channel('anonymous').join(connection)
  })

  app.on('login', (authResult: any, { connection: conn }: any) => {
    if (conn) { // REST has no real-time connection
      app.channel('anonymous').leave(conn)
      app.channel('authenticated').join(conn)
    }
  })

  // Register event publishers to channels
  app.publish((data: any, hook: HookContext) => {
    // `app.publish(EVENT_NAME, () => {})` // publish only for a specific event
    if (!warningDelivered) {
      console.warn('Publishing all events to ALL authenticated users.')
      warningDelivered = true
    }
    return app.channel('authenticated')
  })
}
