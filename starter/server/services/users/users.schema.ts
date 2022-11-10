import { querySyntax, Infer, schema, Ajv } from '@feathersjs/schema'

const ajv = new Ajv()

// Schema and resolver for the basic data model (e.g. creating new entries)
export const usersDataSchema = schema(
  {
    $id: 'UserData',
    type: 'object',
    additionalProperties: false,
    required: ['email', 'password'],
    properties: {
      createdAt: {
        type: 'string'
      },
      email: {
        type: 'string'
      },
      name: {
        type: 'string'
      },
      password: {
        type: 'string'
      },
      avatar: {
        type: 'string'
      },
      githubId: {
        type: 'string'
      }
    }
  } as const,
  ajv
)

export type UsersData = Infer<typeof usersDataSchema>

// Schema and resolver for making partial updates
export const usersPatchSchema = schema(
  {
    $id: 'UserPatch',
    type: 'object',
    additionalProperties: false,
    required: [],
    properties: {
      ...usersDataSchema.properties
    }
  } as const,
  ajv
)

export type UsersPatch = Infer<typeof usersPatchSchema>

// Schema and resolver for the data that is being returned
export const usersResultSchema = schema(
  {
    $id: 'UserResult',
    type: 'object',
    additionalProperties: false,
    required: [...usersDataSchema.required, '_id'],
    properties: {
      ...usersDataSchema.definition.properties,
      _id: {
        type: 'number'
      }
    }
  } as const,
  ajv
)

export type UsersResult = Infer<typeof usersResultSchema>

// Schema and resolver for allowed query properties
export const usersQuerySchema = schema(
  {
    $id: 'UserQuery',
    type: 'object',
    additionalProperties: false,
    properties: {
      ...querySyntax(usersResultSchema.properties)
    }
  } as const,
  ajv
)

export type UsersQuery = Infer<typeof usersQuerySchema>
