// https://docs.feathersjs.com/api/authentication/client.html
import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication'
import { LocalStrategy } from '@feathersjs/authentication-local'

import { Application } from './declarations'

declare module './declarations' {
  interface ServiceTypes {
    authentication: AuthenticationService
  }
}

// https://github.com/feathersjs/feathers/pull/3206
class StackBlitzAuthService extends AuthenticationService {
  constructor(app: Application) {
    super(app)
  }
  get configuration() {
    const config = super.configuration
    config.secret = null
    return config
  }
  async setup() {}
}

export default function (app: Application) {
  const authentication = new StackBlitzAuthService(app)

  authentication.register('jwt', new JWTStrategy())
  authentication.register('local', new LocalStrategy())

  app.use('authentication', authentication)
}
