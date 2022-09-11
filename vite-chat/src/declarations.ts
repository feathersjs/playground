import { Application as ExpressFeathers } from '@feathersjs/express'
import { HookContext as FeathersHookContext } from '@feathersjs/feathers'
import '@feathersjs/transport-commons'
import { ConfigurationSchema } from '#src/configuration.js'

import { UsersResult } from '#src/services/users/users.schema.ts'

export interface Configuration extends ConfigurationSchema {}

// A mapping of service names to types. Will be extended in service files.
export interface ServiceTypes {}

// The application instance type that will be used everywhere else
export type Application = ExpressFeathers<ServiceTypes>
export type HookContext = FeathersHookContext<Application>

// Add the user as an optional property to all params
declare module '@feathersjs/feathers' {
  interface Params {
    user?: UsersResult
  }
}
