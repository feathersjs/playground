export class TodoService {
  async get (id: string) {
    return {
      id: `feathers-${id}`,
      message: `You have to do ${id}`
    }
  }
}
