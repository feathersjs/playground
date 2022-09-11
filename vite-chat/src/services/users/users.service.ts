// Initializes the `users` service on path `/users`
import { Params, ServiceInterface } from '@feathersjs/feathers'

import { Application } from '#src/declarations.js'
import { Users } from '#src/services/users/users.class.js'
import createModel from '#src/models/users.model.js'
import hooks from '#src/services/users/users.hooks.js'
import {
  UsersData,
  UsersQuery,
  UsersResult
} from '#src/services/users/users.schema.js'

type UsersService = ServiceInterface<UsersResult, UsersData, Params<UsersQuery>>

// Add this service to the service type index
declare module '#src/declarations.js' {
  interface ServiceTypes {
    users: UsersService
  }
}

export default function (app: Application) {
  const Model = createModel(app)
  const paginate = app.get('paginate')

  const options = {
    Model,
    paginate
  }

  try {
    app.service('users')
  } catch (_e) {
    // Initialize our service with any options it requires
    app.use('users', new Users(options, app) as UsersService)

    // Get our initialized service so that we can register hooks
    const service = app.service('users')

    service.hooks(hooks)
  }
}
