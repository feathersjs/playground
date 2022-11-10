// Initializes the `users` service on path `/users`
import { Params, ServiceInterface } from '@feathersjs/feathers'

import { Application } from '../../declarations.js'
import { Users, hooks, createModel } from '../../services/users/users.class.js'
import {
  UsersData,
  UsersQuery,
  UsersResult
} from '../../services/users/users.schema.js'

type UsersService = ServiceInterface<UsersResult, UsersData, Params<UsersQuery>>

// Add this service to the service type index
declare module '../../declarations.js' {
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
