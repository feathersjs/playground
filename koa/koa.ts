import Koa from 'koa'
import Router from '@koa/router'

const port = 3033
const app = new Koa()
const router = new Router()

router.get('/todos/:id', (ctx: any) => {
  ctx.body = {
    id: `koa-${ctx.params.id}`,
    message: `You have to do ${ctx.params.id}`
  }
})

router.get('/something/:id', (ctx: any) => {
  ctx.body = {
    id: `koa-${ctx.params.id}`,
    message: `You have to do ${ctx.params.id}`
  }
})

app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(port, () => console.log(`Koa REST API started at http://localhost:${port}`))
