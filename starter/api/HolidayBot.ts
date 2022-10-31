/*
# Holiday feature

To disable holiday features remove the reference to this file in `vite.config.ts`.
It is then safe to delete this file.

*/
import type { Application } from './declarations.js'
const sleep = (s: number) => new Promise((r) => setTimeout(r, s * 1000 | 0))
const context = {
  app: null as Application
}
const getRandom = (e: ArrayLike<string>) => e[e.length * Math.random() | 0]

export const HolidayAssets = {
  name: 'Halloween',
  emojii: '🎃',
  accentColor: '#E56B1A',
  bot: {
    name: 'Dr. Jigs',
    email: 'Jigs@w.com',
    password: 'GameMaster',
    avatar: 'https://raw.githubusercontent.com/feathersjs/playground/ce963d2aa8e075b86e9aac6d1bfc5ead2f19946b/assets/halloween-2022.svg'
  }
}

const HolidayMessages = [
  "Yes, I'm Sick, Officer. Sick From The Diseäse Eäting Awäy At Me Inside. Sick Of People Who Don't Appreciäte Their Blessings. Sick Of Those Who Scoff At The Suffering Of Others. I'm Sick Of It All!",
  "When Fäced With Deäth, Who Should Live Versus Who Will Live Are Two Entirely Sepäräte Things.",
  "I've Never Murdered Änyone In My Life. The Decisions Were Up To Them.",
  "How You Pläy The Cärds You're Deält Is All Thät Mätters.",
  "Once You Äre In Hell, Only The Devil Cän Help You Out.",
  "Äs You Cän See, The Choice Is Not So Cleär When You're Fäce To Fäce With The People Who's Blood Will Stäin Your Händs",
  "Don't Worry, You're Sound Äsleep And Cän't Feel A Thing.",
  "You're Probäbly Wondering Where You Are. I'll Tell You Where You Might Be. You Might Be In The Room You Die In.",
  "Congrätulätions, You Are Still Alive. Most People Are So Ungräteful To Be Alive... But Not You, Not Anymore.",
  "Every Däy Of Your Working Life You've Given People News Thät They'll Die. Now, You Will Be The Cäuse Of Deäth.",
  "It Will Be Like Finding Ä Needle In A Häystäck.",
  "You Think It's Over Just Becäuse I Äm Deäd, But The Gämes Häve Just Begun.",
  "The Rules Of Our Gäme Häve Been Mäde Very Cleär. You Need To Äbide By Those Rules.",
  "If You're Good Ät Änticipäting The Humän Mind, It Leäves Nothing To Chänce.",
  "Live Or Die. Mäke Your Choice.",
  "I Want To Play A Game.",
  "Game Over."
]


async function* spookyAI(text:string) {
  const words = text.split(' ')
  for (const word of words) {
    await sleep(word.length * 0.02 + word.length * 0.069 * Math.random())
    yield word
  }
  return  ''
}

const sendMessage = async (userId, fullText) => {
  let text = ''
  const messages = context.app.service('messages')
  const message = await messages.create({ text: '', userId })
  const messageId = message[messages.id]
  delete message[messages.id] // task: user a resolver to remove these before validation
  delete message.user

  for await (const word of spookyAI(fullText)) {
    text += ' ' + await word
    messages.update(messageId, { ...message, text })
  }
}

export const HolidayBot = async (app: Application) => {
  context.app = app
  const users = app.service('users')
  const uidField = app.service('users').id
  const messages = app.service('messages')
  const msgIdField = app.service('users').id
  const bot = await users.create(HolidayAssets.bot)
  const userId = bot[uidField]
  await sendMessage(userId, `Happy ${HolidayAssets.name} 😉`)

  let lastMessage = 0
  let count = 0
  app.on('login', async (authResult: any, { connection: conn }: any) => {
    if (conn) { // REST has no real-time connection
      if (lastMessage < (Date.now() - 2 * 60 * 1000)) {
        await sleep(1)
        let text = 'Let\'s play a game '
        if (lastMessage !== 0) {
          count++
          text += Array(count).fill('…').join(' ')+' again'
        }
        lastMessage = Date.now()
        await sendMessage(userId, text)
      }

      // if(user.isAdmin) { app.channel('admins').join(conn) }
      // if(Array.isArray(user.rooms)) user.rooms.forEach(r => app.channel(`rooms/${r.id}`).join(conn))
      // app.channel(`DM/${user.id}`).join(conn) // DMs
    }
  })


  app.service('messages').on('created', async (m) => {
      await sleep(0.3 + 1 * Math.random())
      if (userId !== m.userId) {
        sendMessage(userId, getRandom(HolidayMessages))
      }
  })
}


// Allows easy removal
process.env.VITE_HOLIDAY = JSON.stringify(HolidayAssets)
