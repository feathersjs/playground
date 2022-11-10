import { resolve } from '@feathersjs/schema'
import type { HookContext } from '../../declarations.js'

import type {
  MessagesData,
  MessagesPatch,
  MessagesResult,
  MessagesQuery
} from '../../services/messages/messages.schema.js'
import {
  messagesDataSchema,
  messagesPatchSchema,
  messagesResultSchema,
  messagesQuerySchema
} from '../../services/messages/messages.schema.js'

// Resolver for the basic data model (e.g. creating new entries)
export const messagesDataResolver = resolve<MessagesData, HookContext>({
  schema: messagesDataSchema,
  validate: 'before',
  properties: {
    userId: async (_value, _message, context) => {
      const uidField = context.app.service('users').id
      const user = context.params.user
      return user ? user[uidField] : _value
    },
    createdAt: async () => {
      return (new Date()).toISOString()
    }
  }
})

// Resolver for making partial updates
export const messagesPatchResolver = resolve<MessagesPatch, HookContext>({
  schema: messagesPatchSchema,
  validate: 'before',
  properties: {}
})

// Resolver for the data that is being returned
export const messagesResultResolver = resolve<MessagesResult, HookContext>({
  schema: messagesResultSchema,
  validate: false,
  properties: {
    user: async (_value, message, context) => {
      // Associate the user that sent the message
      return context.app.service('users').get(message.userId)
    }
  }
})

// Resolver for query properties
export const messagesQueryResolver = resolve<MessagesQuery, HookContext>({
  schema: messagesQuerySchema,
  validate: 'before',
  properties: {}
})

// Export all resolvers in a format that can be used with the resolveAll hook
export const messagesResolvers = {
  result: messagesResultResolver,
  data: {
    create: messagesDataResolver,
    update: messagesDataResolver,
    patch: messagesPatchResolver
  },
  query: messagesQueryResolver
}
