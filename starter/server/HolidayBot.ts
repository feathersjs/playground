/*
# Holiday feature

To disable holiday features remove the reference to this file in `vite.config.ts`.
It is then safe to delete this file.

*/
import type {Application} from './declarations.js'
const sleep = (s: number) => new Promise(r => setTimeout(r, (s * 1000) | 0))
const context = {
  app: null as Application,
  lastMessage: -1
}
const getRandom = (e: ArrayLike<string>) => e[e.length * Math.random() | 0]
const getNext = (e: ArrayLike<string>): string => {
  context.lastMessage++
  return e[context.lastMessage % e.length]
}

export const HolidayAssets = {
  name: 'Programming',
  emojii: '🍀',
  emojiis: ['🍀','🪙','🌈','☘️'],
  accentColor: '#009E60',
  bot: {
    name: 'Lucky Leprechaun',
    email: 'featherbot@feathersjs.com',
    password: 'feathers rules',
    avatar: 'https://raw.githubusercontent.com/feathersjs/playground/main/assets/holiday.svg'
  }
}

const greeting = "Ahoy!"
const HolidayMessages = [
  '<a href="https://discord.gg/qa8kez8QBx">Happy St. Patrick\'s Day!</a>',
  '<a href="https://discord.gg/qa8kez8QBx">Join our discord!</a>',
  '<a href="https://github.com/feathersjs/feathers">Star us on GitHub!</a>',
  '<a href="https://twitter.com/feathersjs">Follow us on Twitter!</a>',
  '<a href="https://feathersjs.com/guides/basics/starting.html">Read our docs!</a>',
  '<a href="https://feathersjs.com/awesome/">Checkout our Awesome Feathers community packages!</a>',
]

const sendMessage = async (userId, fullText) => {
  const messages = context.app.service('messages')
  const message = await messages.create({text: fullText, userId})
  const messageId = message[messages.id]
  delete message[messages.id] // task: user a resolver to remove these before validation
  delete message.user
}

export const HolidayBot = async (app: Application) => {
  context.app = app
  const users = app.service('users')
  const uidField = app.service('users').id
  const bot = await users.create(HolidayAssets.bot)
  const userId = bot[uidField]
  await sendMessage(userId, `Happy ${HolidayAssets.name}!`)

  let lastMessage = 0
  app.on('login', async (authResult: any, {connection: conn}: any) => {
    if (conn) {
      // REST has no real-time connection
      if (lastMessage < Date.now() - 2 * 60 * 1000) {
        await sleep(1)
        let text = `${greeting}, ${authResult.user.name}`
        await sendMessage(userId, text)
      }

      // if(user.isAdmin) { app.channel('admins').join(conn) }
      // if(Array.isArray(user.rooms)) user.rooms.forEach(r => app.channel(`rooms/${r.id}`).join(conn))
      // app.channel(`DM/${user.id}`).join(conn) // DMs
    }
  })

  app.service('messages').on('created', async m => {
    await sleep(0.420) 
    if (userId !== m.userId) {
      const emo = getRandom(HolidayAssets.emojiis)
      sendMessage(userId, emo + ' ' + getNext(HolidayMessages) + ' ' + emo)
    }
  })
}

// Allows easy removal
process.env.VITE_HOLIDAY = JSON.stringify(HolidayAssets)
