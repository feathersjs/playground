import { Service, NedbServiceOptions } from 'feathers-nedb'
import NeDB from '@seald-io/nedb'
import path from 'path'
import { authenticate } from '@feathersjs/authentication'
import { resolveAll } from '@feathersjs/schema'
import { usersResolvers } from '../../services/users/users.resolvers.js'
import type { Application } from '../../declarations.js'

export class Users extends Service {
  constructor(options: Partial<NedbServiceOptions>, app: Application) {
    super(options)
  }
}

export const hooks = {
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
  const Model = new NeDB({
    filename: path.join(app.get('nedbPath'), 'users.db'),
    autoload: true
  })

  Model.ensureIndex({ fieldName: 'email', unique: true })

  return Model
}
