// StackBlitz classic has an outdated TypeScript client
// So, we have to ignore these errors for now
// Use StackBlitz CodeFlow or bare-metal and delete this for a better experience

// declare module '@feathersjs/feathers'
// declare module '@feathersjs/schema'
// declare module '@feathersjs/authentication'
// declare module 'feathers-database'

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HOLIDAY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
