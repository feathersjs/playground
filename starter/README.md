# Feathers

A Real-Time and REST API framework. This starter if for learning and demonstration purposes.

- [Documentation](https://feathersjs.com/)
- [Edit on StackBlitz ⚡️](https://stackblitz.com/fork/github/feathersjs/playground/tree/main/starter)
- [Edit on StackBlitz CodeFlow (beta)](https://pr.new/github.com/FossPrime/feathers-halloween)

## Features

- Vite powered Client and Server TypeScript
  - With Hot reloading on the Client
  - HMR for all client dependencies
  - Blunt HMR for Feathers's server
- Automatically switch from Vite to Express static on production
- Client and server builds
- Vitest powered testing
- Less dependencies thanks to Vite

# Known issues

- If you've logged in before, the first loggin will fail twice and give up
  - As if it's attempting to login for the account creation
  - As a workaround I used sessionStorage... but that is undesireable.
- NeDB makes too many IO calls for sandboxes, use LowDB instead