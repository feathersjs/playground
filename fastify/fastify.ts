import Fastify from 'fastify'

const fastify = Fastify()
const port = 3032

fastify.get('/todos/:id', async (request, reply) => {
  return {
    id: `fastify-${(request.params as any).id}`,
    message: `You have to do ${(request.params as any).id}`
  }
})

fastify.listen({ port }).then(() => console.log(`Fastify REST API started at http://localhost:${port}`))
