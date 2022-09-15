/// <reference types="vite/client" />

import {
  default as feathers,
  socketio,
  authentication
} from '@feathersjs/client'
import io from 'socket.io-client'
import type { MessagesData } from './src/services/messages/messages.schema.js'
import type { UsersData } from './src/services/users/users.schema.js'

// Establish a Socket.io connection
const socket = io(import.meta.env.SOCKET_URL, {
  transports: ['websocket'],
  reconnectionDelay: import.meta.env.DEV ? 60 : 1000
})
// Initialize our Feathers client application through Socket.io
const client = feathers()
client.configure(socketio(socket))
const storageKey = 'feathers-jwt'
client.configure(authentication({ storageKey, storage: sessionStorage }))

// UNSAFELY safely escape HTML
const escape = (str: any) =>
  str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const appEl = document.getElementById('app') as HTMLDivElement
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
      <img class="logo" src="https://feathersjs.com/img/feathers-logo-wide.png"
        alt="Feathers">
      <span class="title">Vite Chat</span>
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
  userList.innerHTML += `<li>
    <a class="block relative" href="#">
      <img src="${user.avatar}" alt="" class="avatar" crossorigin="anonymous">
      <span class="absolute username">${escape(user.name || user.email)}</span>
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
const addMessage = (message: MessagesData) => {
  // The user that sent this message (added by the populate-user hook)
  const user = message.user || (undefined as any)
  const chat = document.querySelector('.chat')
  // Escape HTML to prevent XSS attacks
  const text = escape(message.text)
  const dtf = new Intl.DateTimeFormat(undefined, { timeStyle: 'short' })
  const prettyD = message.createdAt
    ? dtf.format(new Date(message.createdAt as string))
    : ''

  if (chat) {
    const img = user
      ? `<img src="${user.avatar}" alt="${
          user.name || user.email
        }" class="avatar" crossorigin="anonymous">`
      : ''
    const userName = user
      ? `<span class="username font-600">${escape(
          user.name || user.email || ''
        )}</span>`
      : ''
    chat.innerHTML += `<div class="message flex flex-row">${img}
      <div class="message-wrapper">
        <p class="message-header"> ${userName}
          <span class="sent-date font-300">${prettyD}</span>
        </p>
        <p class="message-content font-300">${text}</p>
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
      $limit: 25
    }
  })

  // We want to show the newest message last
  messages.data.reverse().forEach(addMessage)

  // Find all users
  const users = await client.service('users').find()

  // Add each user to the list
  users.data.forEach(addUser)

  if (messages.data.length === 0) {
    addMessage({ text: `For documentation, visit dove.feathersjs.com` })
  }
}

// Retrieve email/password object from the login/signup page
const getCredentials = () => {
  const dev = import.meta.env.DEV
    ? 'Droid #' + crypto.getRandomValues(new Uint16Array(1))
    : ''
  const email =
    document.querySelector<HTMLInputElement>('[name="email"]')?.value
  const password =
    document.querySelector<HTMLInputElement>('[name="password"]')?.value

  return email && password ? { email, password } : { email: dev, password: dev }
}

// Log in either using the given email/password or the token from storage
const login = async (credentials?: any): Promise<boolean> => {
  try {
    if (credentials) {
      // log in with the `local` strategy using the credentials we got
      await client.authenticate({
        strategy: 'local',
        ...credentials
      })
    } else if (localStorage.getItem(storageKey)) {
      // TODO: Why does this try to authenticate without a JWT... causing errors in the server
      await client.reAuthenticate()
    } else {
      return false
    }

    // If successful, show the chat page
    showChat()
    return true
  } catch (error) {
    // If we got an error, show the login page
    await logout()
    return false
  }
}

const logout = async () => {
  try {
    await client.logout()
  } catch (e) {}
  localStorage.removeItem('feathers-jwt')
  showLogin()
}

const signup = async () => {
  const credentials = getCredentials()

  try {
    // First create the user
    await client.service('users').create(credentials)

    // If successful log them in
    await login(credentials)
  } catch (e) {
    await logout()
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
  logout()
})

// "Send" message form submission handler
addEventListener('#send-message', 'submit', async (ev: any) => {
  // This is the message text input field
  const input = document.querySelector('[name="text"]') as HTMLInputElement

  ev.preventDefault()

  // Create a new message and then clear the input field
  await client.service('messages').create({
    text: input.value
  })

  input.value = ''
})

// Listen to created events and add the new message in real-time
client.service('messages').on('created', addMessage)

// We will also see when new users get created in real-time
client.service('users').on('created', addUser)

// Call login right away so we can show the chat window
// If the user can already be authenticated

if ((await login()) === false && import.meta.env.DEV) {
  signup()
}
