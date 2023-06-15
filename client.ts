/// <reference types="vite/client" />

import { feathers } from '@feathersjs/feathers'
import authentication from '@feathersjs/authentication-client'
import socketio from '@feathersjs/socketio-client'
import io from 'socket.io-client'
import type { MessagesResult } from './dist/server/messages/messages.schema.ts'
import type { UsersData } from './dist/server/users/users.schema.ts'

// Establish a Socket.io connection
const socket = io(import.meta.env.VITE_FV_URL, {
  transports: ['websocket'],
  reconnectionDelay: import.meta.env.DEV ? 60 : 1000,
})
// Initialize our Feathers client application through Socket.io
const client = feathers()
client.configure(socketio(socket))
client.configure(authentication())

// UNSAFELY safely escape HTML
const escape = (str: any) =>
  str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const appEl = document.getElementById('app') as HTMLDivElement
const store = {
  holiday: import.meta.env.VITE_HOLIDAY
    ? JSON.parse(import.meta.env.VITE_HOLIDAY)
    : {},
}
const loginScreenHTML = `<main class="login container">
  <div class="row">
    <div class="col-12 col-6-tablet push-3-tablet text-center heading">
      <h1 class="font-100">Log in or signup</h1>
    </div>
  </div>
  <div class="row">
    <div class="col-12 col-6-tablet push-3-tablet col-4-desktop push-4-desktop">
      <form class="form">
        <fieldset>
          <input class="block" type="email" name="email" placeholder="email">
        </fieldset>

        <fieldset>
          <input class="block" type="password" name="password" placeholder="password" autocomplete="cc-csc">
        </fieldset>

        <button type="button" id="login" class="button button-primary block signup">
          Log in
        </button>

        <button type="button" id="signup" class="button button-primary block signup">
          Sign up and log in
        </button>
      </form>
    </div>
  </div>
</main>`

// Chat base HTML (without user list and messages)
const chatHTML = `<main class="flex flex-column">
  <header class="title-bar flex flex-row flex-center">
    <div class="title-wrapper block center-element">
    ${
      store.holiday.emojii || ''
    } <img class="logo" crossorigin="anonymous" src="https://raw.githubusercontent.com/feathersjs/feathers/ae85fa216f12f7ff5d15e7039640e27a09989ea4/docs/public/img/feathers-logo-horizontal.svg"
        alt="Feathers"> ${store.holiday.emojii || ''}
    </div>
  </header>

  <div class="flex flex-row flex-1 clear">
    <aside class="sidebar col col-3 flex flex-column flex-space-between">
      <header class="flex flex-row flex-center">
        <h4 class="font-300 text-center">
          <span class="font-600 online-count">0</span> users
        </h4>
      </header>

      <ul class="flex flex-column flex-1 list-unstyled user-list"></ul>
      <footer class="flex flex-row flex-center">
        <a href="#" id="logout" class="button button-primary">
          Sign Out
        </a>
      </footer>
    </aside>

    <div class="flex flex-column col col-9">
      <main class="chat flex flex-column flex-1 clear"></main>

      <form class="flex flex-row flex-space-between" id="send-message">
        <input type="text" name="text" class="flex flex-1">
        <button class="button-primary" type="submit">Send</button>
      </form>
    </div>
  </div>
</main>`

// Add a new user to the list
const addUser = (user: UsersData) => {
  const userList = document.querySelector('.user-list') as HTMLDivElement
  if (userList === null) {
    return // we can't add users without a user screen
  }
  userList.innerHTML += `<li>
    <a class="block relative" href="#">
      <img src="${user.avatar}" alt="" class="avatar" crossorigin="anonymous">
      <span class="absolute username">${escape(user.name)}</span>
    </a>
  </li>`

  // Update the number of users
  const userCount = document.querySelectorAll('.user-list li').length
  const onlineEl = document.querySelector(
    '.online-count'
  ) as HTMLParagraphElement
  onlineEl.innerText = '' + userCount
}

// Renders a message to the page
const addMessage = (message: MessagesResult) => {
  const contentClass = 'message-content'
  // The user that sent this message (added by the populate-user hook)
  const user = message.user || (undefined as any)
  console.log(message)
  const id = message['_id'] || (message as any)['id'] // support different DBs/APIs. Task: Replace with a trivial resolver that always returns _id
  const messageId = 'messageId-' + id
  const chat = document.querySelector('.chat') as HTMLDivElement
  const messageEl = chat && chat.querySelector('.' + messageId)
  if (messageEl) {
    const contentEl = messageEl.querySelector('.' + contentClass) || ({} as any)
    contentEl.textContent = message.text
    return
  } else if (chat === null) {
    return // if there is no chat screen, we can't add messages
  }

  // Escape HTML to prevent XSS attacks
  const text = message.userId === 0 ? message.text : escape(message.text) // task: use DOM instead
  const dtf = new Intl.DateTimeFormat(undefined, { timeStyle: 'short' })
  const prettyD = message.createdAt
    ? dtf.format(new Date(message.createdAt as string))
    : ''

  if (chat) {
    const img = `<img src="${user.avatar}" alt="${user.name}" class="avatar" crossorigin="anonymous">`
    const userName = `<span class="username font-600">${escape(
      user.name || ''
    )}</span>`
    chat.innerHTML += `<div class="${messageId} message flex flex-row">${img}
      <div class="message-wrapper">
        <p class="message-header"> ${userName}
          <span class="sent-date font-300">${prettyD}</span>
        </p>
        <p class="${contentClass} font-300">${text}</p>
      </div>
    </div>`

    // Always scroll to the bottom of our message list
    chat.scrollTop = chat.scrollHeight - chat.clientHeight
  }
}

// Show the login page
const showLogin = (error?: any) => {
  const headingEl = document.querySelector('.heading')
  if (document.querySelectorAll('.login').length && error && headingEl) {
    headingEl.insertAdjacentHTML(
      'beforeend',
      `<p>There was an error: ${error.message}</p>`
    )
  }
  appEl.innerHTML = loginScreenHTML
}

// Shows the chat page
const showChat = async () => {
  appEl.innerHTML = chatHTML

  // Find the latest 25 messages. They will come with the newest first
  const messages = await client.service('messages').find({
    query: {
      $sort: { createdAt: -1 },
      $limit: 25,
    },
  })

  // We want to show the newest message last
  messages.data.reverse().forEach(addMessage)

  // Find all users
  const users = await client.service('users').find()

  // Add each user to the list
  users.data.forEach(addUser)
}

// Retrieve email/password object from the login/signup page
const getCredentials = () => {
  const defDev = { email: 'you@example.com', password: 'password' }
  const dev = import.meta.env.DEV
    ? { ...defDev, ...JSON.parse(import.meta.env.VITE_FV_DEV_USER || '') }
    : false
  const email =
    document.querySelector<HTMLInputElement>('[name="email"]')?.value || ''
  const password =
    document.querySelector<HTMLInputElement>('[name="password"]')?.value || ''
  document.querySelector<HTMLInputElement>('[name="password"]')?.value ||
    '' + Math.random()

  if (dev) {
    return { email: email || dev.email, password: password || dev.password }
  } else {
    return { email, password }
  }
}

// Log in either using the given email/password or the token from storage
const login = async (credentials?: any): Promise<boolean> => {
  try {
    if (credentials) {
      // log in with the `local` strategy using the credentials we got
      await client.authenticate({
        strategy: 'local',
        ...credentials,
      })
    } else {
      try {
        await client.reAuthenticate(true) // force
      } catch {
        return false
      }
    }

    // If successful, show the chat page
    showChat()
    return true
  } catch (error) {
    // If we got an error, show the login page
    await showLogout()
    return false
  }
}

const showLogout = async () => {
  console.log('removing access token from storage')
  await client.authentication.removeAccessToken()
  try {
    await client.logout()
  } catch {}
  showLogin()
}

const signup = async () => {
  const credentials = getCredentials()

  try {
    // First create the user
    await client.configure(authentication())
    await client.service('users').create(credentials)

    // If successful log them in
    await login(credentials)
  } catch (e) {
    await showLogout()
    console.log('signup failed', e)
  }
}

const addEventListener = (
  selector: string,
  event: string,
  handler: Function
) => {
  document.addEventListener(event, async (ev: any) => {
    if (ev?.target?.closest(selector)) {
      handler(ev)
    }
  })
}

// "Signup and login" button click handler
addEventListener('#signup', 'click', signup)

// "Login" button click handler
addEventListener('#login', 'click', async () => {
  const user = getCredentials()

  await login(user)
})

// "Logout" button click handler
addEventListener('#logout', 'click', async () => {
  showLogout()
})

// "Send" message form submission handler
addEventListener('#send-message', 'submit', async (ev: any) => {
  // This is the message text input field
  const input = document.querySelector('[name="text"]') as HTMLInputElement

  ev.preventDefault()

  // Create a new message and then clear the input field
  await client.service('messages').create({
    text: input.value,
  })

  input.value = ''
})

const main = async () => {
  // Real-time event listeners for messages and users
  client.service('messages').on('created', addMessage)
  client.service('messages').on('updated', addMessage)
  client.service('users').on('created', addUser)

  store.holiday.accentColor &&
    document.body.style.setProperty('--accent-color', store.holiday.accentColor)

  // - If DEV, login w jwt, login w dev user, or make dev user.
  // - else, login w jwt, or show login
  if (
    import.meta.env.DEV &&
    (await login()) === false &&
    (await login(getCredentials())) === false
  ) {
    await signup() // attempt to signup with dev creds
  } else if ((await login()) === false) {
    showLogin()
  }
}
globalThis.addEventListener('DOMContentLoaded', main)
