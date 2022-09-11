## Features

- Vite powered Client and Server TypeScript
  - With Hot reloading on the Client
  - HMR for all client dependencies
  - Blunt HMR for Feathers's server
- Automatically switch from Vite to Express static on production
- Client and server builds
- Vitest powered testing
- Less dependencies, Vite makes nodemon, ts-node and other deps redundant

# Todo:

- listen to the SIGHUP or what ever signal vite uses to restart config to gracefully shutdown server
- Use stackblitz to auto redirect to correct client

# Known issues

- Syntax errors while authoring will require a manual server restart
