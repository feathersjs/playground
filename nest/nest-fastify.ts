import { NestFactory } from '@nestjs/core'
import { TodoModule } from "./todo.module";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { FastifyAdapter } from "@nestjs/platform-fastify";

async function bootstrap() {
  const port = 3035;

  const app = await NestFactory.create(TodoModule, new FastifyAdapter());
  app.useWebSocketAdapter(new IoAdapter(app));
  app.listen(port, () => {
    console.log(`Nest API started at http://localhost:${port}`)
  });
}

bootstrap();