import { Module } from "@nestjs/common";
import { TodoService } from "./todo.service";
import { TodoController } from "./todo.controller";
import { TodoGateway } from "./todo.gateway";

@Module({
  providers: [TodoService, TodoGateway],
  controllers: [TodoController]
})
export class TodoModule {
}