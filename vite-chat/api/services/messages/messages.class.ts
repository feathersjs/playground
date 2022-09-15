import { Service, NedbServiceOptions } from 'feathers-nedb'
import NeDB from '@seald-io/nedb'
import path from 'path'
import { authenticate } from '@feathersjs/authentication'
import { resolveAll } from '@feathersjs/schema'
import { messagesResolvers } from '../../services/messages/messages.resolvers.js'
import type { Application } from '../../declarations'

export class Messages extends Service {
  constructor(options: Partial<NedbServiceOptions>, app: Application) {
    super(options)
  }
}

const L = 'lol, jk, lmao, btw, ikr, rofl, OMG, smh, imo, hyfr'.split(',')
const append = () => (ctx: any) => {
  if (typeof ctx.data.text === 'string') {
    const suffix = L[(L.length * Math.random()) | 0]
    ctx.data.text = ctx.data.text + ', - ' + suffix
  }
  return ctx
}

export const hooks = {
  around: {
    all: [authenticate('jwt'), resolveAll(messagesResolvers)]
  },
  before: {
    create: [append()]
  },
  after: {},
  error: {}
}

export const createModel = (app: Application) => {
  const Model = new NeDB({
    filename: path.join(app.get('nedbPath'), 'messages.db'),
    autoload: true
  })

  return Model
}
