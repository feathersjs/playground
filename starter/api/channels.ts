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
    if (conn) {
      // REST has no real-time connection
      // const user = authResult.user
      app.channel('anonymous').leave(conn)
      app.channel('authenticated').join(conn)

      // if(user.isAdmin) { app.channel('admins').join(conn) }
      // if(Array.isArray(user.rooms)) user.rooms.forEach(r => app.channel(`rooms/${r.id}`).join(conn))
      // app.channel(`DM/${user.id}`).join(conn) // DMs
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

  // Publish the `users` service, `created` event, to the channel "admins"
  // app.service('users').publish('created', () => app.channel('admins'))

  // app.service('messages').publish(() => {
  //   return [
  //     app.channel(`userIds/${data.createdBy}`),
  //     app.channel(`emails/${data.recipientEmail}`)
  //   ]
  // })
}
