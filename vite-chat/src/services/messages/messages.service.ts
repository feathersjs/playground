// Initializes the `messages` service on path `/messages`
import { Params, ServiceInterface } from '@feathersjs/feathers'

import { Application } from '../../declarations.js'
import { Messages } from '../../services//messages/messages.class.js'
import createModel from '../../models/messages.model.js'
import hooks from '../../services//messages/messages.hooks.js'
import {
  MessagesData,
  MessagesResult,
  MessagesQuery
} from '../../services/messages/messages.schema.js'

type MessageService = ServiceInterface<
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
