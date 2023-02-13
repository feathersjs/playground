export class TodoService {
  getTodoById(todoId: string) {
    return {
      id: `nest-${todoId}`,
      message: `You have to do ${todoId}`
    }
  }
}