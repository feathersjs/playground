// Application hooks that run for every service
// Don't remove this comment. It's needed to format import lines nicely.

import { HookContext } from './declarations.js'

const createdAt = (ctx: any) => {
  const items = Array.isArray(ctx.data) ? ctx.data : [ctx.data]
  for (const item of items) {
    const utc = new Date().toISOString()
    item.createdAt = utc
  }
}

// all,find,get,create,update,patch,remove
export default {
  before: {
    all: [],
    create: [createdAt]
  },
  after: {},
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
    ]
  }
}
