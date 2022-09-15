import { Application } from '../declarations.js'
import users from '../services/users/users.service.js'
import messages from '../services/messages/messages.service.js'
import { userInfo, tmpdir } from 'node:os'
// Don't remove this comment. It's needed to format import lines nicely.

export const services = (app: Application) => {
  const dataDir = userInfo().username === 'blitz' ? tmpdir() : app.get('nedb')
  app.set('nedbPath', dataDir)
  app.configure(users)
  app.configure(messages)
}

export default services
