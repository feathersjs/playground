import { querySyntax, Infer, schema, Ajv } from '@feathersjs/schema'
import {
  UsersResult
} from '../../services/users/users.schema.js'

const ajv = new Ajv()

// Schema and resolver for the basic data model (e.g. creating new entries)
export const messagesDataSchema = schema(
  {
    $id: 'messageData',
    type: 'object',
    additionalProperties: false,
    required: ['text'],
    properties: {
      text: {
        type: 'string'
      },
      userId: {
        type: 'number'
      },
      createdAt: {
        type: 'string'
      }
    }
  } as const,
  ajv
)

export type MessagesData = Infer<typeof messagesDataSchema>

// Schema and resolver for making partial updates
export const messagesPatchSchema = schema(
  {
    $id: 'messagePatch',
    type: 'object',
    additionalProperties: false,
    required: [],
    properties: {
      ...messagesDataSchema.properties
    }
  } as const,
  ajv
)

export type MessagesPatch = Infer<typeof messagesPatchSchema>

// Schema and resolver for the data that is being returned
export const messagesResultSchema = schema(
  {
    $id: 'messageResult',
    type: 'object',
    additionalProperties: false,
    required: [...messagesDataSchema.required, 'userId', '_id'],
    properties: {
      ...messagesDataSchema.definition.properties,
      _id: {
        type: 'number'
      }
    }
  } as const,
  ajv
)

export type MessagesResult = Infer<typeof messagesResultSchema> & {
  user: UsersResult
}

// Schema and resolver for allowed query properties
export const messagesQuerySchema = schema(
  {
    $id: 'messageQuery',
    type: 'object',
    additionalProperties: false,
    properties: {
      ...querySyntax(messagesResultSchema.properties)
    }
  } as const,
  ajv
)

export type MessagesQuery = Infer<typeof messagesQuerySchema>
