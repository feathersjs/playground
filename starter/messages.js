// A messages service that allows to create new
// and return all existing messages
export class MessageService {
  constructor() {
    this.messages = []
  }

  async find() {
    // Just return all our messages
    return this.messages
  }

  async create(data) {
    // The new message is the data merged with a unique identifier
    // using the messages length since it changes whenever we add one
    const message = {
      id: this.messages.length,
      text: data.text,
    }

    // Add new message to the list
    this.messages.push(message)

    return message
  }
}

// https://docs.feathersjs.com/guides/basics/hooks.html
export const MessageHooks = {
  before: {
    create: [
      (context) => {
        if (context.data.text.trim() === '') {
          throw new Error('Message text can not be empty')
        }
      },
    ],
  },
}
