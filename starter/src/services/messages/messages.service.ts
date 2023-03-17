// Initializes the `messages` service on path `/messages`
import { Params, ServiceInterface } from '@feathersjs/feathers'

import { Application } from '../../declarations.js'
import {
  Messages,
  hooks,
  createModel
} from '../../services//messages/messages.class.js'
import type {
  MessagesData,
  MessagesResult,
  MessagesQuery
} from '../../services/messages/messages.schema.js'

type MessagesService = ServiceInterface<
  MessagesResult,
  MessagesData,
  Params<MessagesQuery>
>

// Add this service to the service type index
declare module '../../declarations.js' {
  interface ServiceTypes {
    messages: MessagesService
  }
}

export default function (app: Application) {
  const Model = createModel(app)
  const paginate = app.get('paginate')

  const options = {
    Model,
    paginate
  }

  // Initialize our service with any options it requires
  app.use('messages', new Messages(options, app) as MessagesService)

  // Get our initialized service so that we can register hooks
  const service = app.service('messages')

  service.hooks(hooks)
}
