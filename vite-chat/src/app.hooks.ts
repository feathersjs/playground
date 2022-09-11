// Application hooks that run for every service
// Don't remove this comment. It's needed to format import lines nicely.

import { HookContext } from '#src/declarations.js'

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
        const qwell = ['not-authenticated', 'not-found']
        if (!qwell.includes(context.error.className)) {
          console.error(context.error)
        } else {
          console.log(context.error.message)
        }
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
