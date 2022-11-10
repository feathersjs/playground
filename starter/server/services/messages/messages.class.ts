import { memory as database, MemoryService as Service } from 'feathers-database'
import { authenticate } from '@feathersjs/authentication'
import { resolveAll } from '@feathersjs/schema'
import { messagesResolvers } from '../../services/messages/messages.resolvers.js'
import type { Application } from '../../declarations'

export class Messages extends Service {
  constructor(options: Partial<any>, app: Application) {
    super(options)
  }
}

export const hooks: any = {
  around: {
    all: [authenticate('jwt'), resolveAll(messagesResolvers)]
  },
  before: {},
  after: {},
  error: {}
}

export const createModel = (app: Application) => {
  return database({
    id: '_id',
    startId: 1,
    paginate: {
      default: 2,
      max: 4
    }
  })
}
