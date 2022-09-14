import { authenticate } from '@feathersjs/authentication'
import { resolveAll } from '@feathersjs/schema'
import { usersResolvers } from '../../services/users/users.resolvers.js'

export default {
  around: {
    all: [],
    find: [authenticate('jwt'), resolveAll(usersResolvers)],
    get: [authenticate('jwt'), resolveAll(usersResolvers)],
    create: [resolveAll(usersResolvers)],
    update: [authenticate('jwt'), resolveAll(usersResolvers)],
    patch: [authenticate('jwt'), resolveAll(usersResolvers)],
    remove: [authenticate('jwt'), resolveAll(usersResolvers)]
  },

  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
