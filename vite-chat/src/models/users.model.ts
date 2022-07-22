import NeDB from '@seald-io/nedb'
import path from 'path'
import { Application } from '../declarations'

export default function (app: Application) {
  const Model = new NeDB({
    filename: path.join(app.get('nedbPath'), 'users.db'),
    autoload: true
  })

  Model.ensureIndex({ fieldName: 'email', unique: true })

  return Model
}
