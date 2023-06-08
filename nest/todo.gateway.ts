import { WebSocketGateway, SubscribeMessage, MessageBody } from "@nestjs/websockets";
import { TodoService } from "./todo.service";

@WebSocketGateway({})
export class TodoGateway {
  constructor(private readonly todoService: TodoService) {
  }

  @SubscribeMessage('get')
  getTodos(@MessageBody() [_, id]: [string, string]) {
    return this.todoService.getTodoById(id);
  }
}