import { Controller, Get, Param } from "@nestjs/common";
import { TodoService } from "./todo.service";

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {
  }

  @Get('/:id')
  getTodoById(@Param('id') todoId: string) {
    return this.todoService.getTodoById(todoId);
  }
}