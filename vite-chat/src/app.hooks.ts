// Application hooks that run for every service
// Don't remove this comment. It's needed to format import lines nicely.

import { HookContext } from './declarations'

const createdAt = (ctx: any) => {
  const items = Array.isArray(ctx.data) ? ctx.data : [ctx.data]
  for (const item of items) {
    const utc = new Date().toISOString()
    item.createdAt = utc
  }
}

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [createdAt],
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
    all: [
      (context: HookContext) => {
        console.error(context.error)
      }
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
