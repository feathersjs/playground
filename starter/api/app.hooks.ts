// Application hooks that run for every service
// Don't remove this comment. It's needed to format import lines nicely.

import { HookContext } from './declarations.js'

// This is even easier to do on a Resolver
const createdAt = (ctx: any) => {
  const items = Array.isArray(ctx.data) ? ctx.data : [ctx.data]
  for (const item of items) {
    item.createdAt = new Date().toISOString()
  }
}

const FCI = (c: HookContext) => `${c.path}/${c.method}`

// all,find,get,create,update,patch,remove
export default {
  before: {
    all: [
      (c: HookContext) => {
        console.debug(`⏳  ${FCI(c)}`, c.data || '')
      }
    ],
    create: [createdAt]
  },
  after: {
    all: (c: HookContext) => {
      const summarize = ['messages/update']
      const data = summarize.includes(FCI(c)) ? '...' : c.data || ''
      console.debug(`🏁  ${FCI(c)}`, data)
    }
  },
  error: {
    all: [
      (c: HookContext) => {
        const warn = ['not-authenticated', 'not-found']
        if (!warn.includes(c.error.className)) {
          console.error(`🦋  ${FCI(c)}`, c.error)
          console.log('Original', c.params?.resolve?.originalContext)
          console.trace()
          // debugger
        } else {
          console.warn(`🦤  ${FCI(c)}`, c.error.message)
        }
      }
    ]
  }
}
