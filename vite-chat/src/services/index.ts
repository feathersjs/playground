import { Application } from '#src/declarations.js'
import users from '#src/services/users/users.service.js'
import messages from '#src/services/messages/messages.service.js'
import path from 'path'
import { tmpdir } from 'os'
// Don't remove this comment. It's needed to format import lines nicely.

export const services = (app: Application) => {
  const nedbPath = path.join(tmpdir(), app.get('nedb'))
  const nedbStamp = '-' + new Date().toISOString().replace(/\.\d{3}Z/, 'Z') // Still ISO 8601
  app.set('nedbPath', nedbPath + nedbStamp)

  app.configure(users)
  app.configure(messages)
}

export default services
