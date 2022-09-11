import { authenticate } from '@feathersjs/authentication'
import { resolveAll } from '@feathersjs/schema'
import { messageResolvers } from '../../schema/messages.schema'

const L = 'lol, jk, lmao, btw, ikr, rofl, OMG, smh, imo, hyfr'.split(',')
const append = () => (ctx: any) => {
  if (typeof ctx.data.text === 'string') {
    // Multi mode allows arrays
    const suffix = L[(L.length * Math.random()) | 0]
    ctx.data.text = ctx.data.text + ', - ' + suffix
  }
  return ctx
}

export default {
  around: {
    all: [authenticate('jwt'), resolveAll(messageResolvers)],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  before: {
    all: [],
    find: [],
    get: [],
    create: [append()],
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
