import { Application } from '../declarations.js'
import users from '../services/users/users.service.js'
import messages from '../services/messages/messages.service.js'
// Don't remove this comment. It's needed to format import lines nicely.

export const services = (app: Application) => {
  app.configure(users)
  app.configure(messages)
}

export default services
