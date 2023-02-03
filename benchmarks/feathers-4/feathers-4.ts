import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import { TodoService } from '../feathers-5/service'

const port = 3035
const app = express(feathers())

app.configure(express.rest())
app.use('todos', new TodoService())

app.listen(port, () => console.log(`Feathers 4 REST API started at http://localhost:${port}`))
