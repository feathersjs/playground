import { memory as database, MemoryService as Service } from 'feathers-database'
import { authenticate } from '@feathersjs/authentication'
import { resolveAll } from '@feathersjs/schema'
import { usersResolvers } from '../../services/users/users.resolvers.js'
import type { Application } from '../../declarations.js'

export class Users extends Service {
  constructor(options: any, app: Application) {
    super(options)
  }
}

export const hooks: any = {
  around: {
    all: [],
    find: [authenticate('jwt'), resolveAll(usersResolvers)],
    get: [authenticate('jwt'), resolveAll(usersResolvers)],
    create: [resolveAll(usersResolvers)],
    update: [authenticate('jwt'), resolveAll(usersResolvers)],
    patch: [authenticate('jwt'), resolveAll(usersResolvers)],
    remove: [authenticate('jwt'), resolveAll(usersResolvers)]
  }
}

export const createModel = (app: Application) => {
  return database({
    id: '_id', // todo: https://github.com/feathersjs/feathers/issues/2839
    startId: 1,
    paginate: {
      default: 2,
      max: 4
    }
  })
}
