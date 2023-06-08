import { feathers } from '@feathersjs/feathers'
import { koa, rest } from '@feathersjs/koa'
import socketio from '@feathersjs/socketio'
import { TodoService } from './service'

type ServiceTypes = {
  todos: TodoService
}

const port = 3034
const app = koa<ServiceTypes>(feathers())

app.configure(socketio())
app.configure(rest())

app.use('todos', new TodoService())

app.listen(port).then(() => console.log(`Feathers 5 Koa and Socket.io API started at http://localhost:${port}`))
