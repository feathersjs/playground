import NeDB from '@seald-io/nedb'
import path from 'path'
import type { Application } from '../declarations.js'

export default function (app: Application) {
  const Model = new NeDB({
    filename: path.join(app.get('nedbPath'), 'messages.db'),
    autoload: true
  })

  return Model
}
