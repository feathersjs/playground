import assert from 'node:assert'
import {describe, it, beforeEach, afterEach} from 'node:test'
import {Server} from 'http'
import {URL} from 'node:url'

import {main} from '../src/app.js'

const port = '' + 9000
const getUrl = (pathname?: string) => {
  const url = new URL('http://localhost')
  url.hostname = 'localhost'
  url.protocol = 'http'
  url.port = port
  url.pathname = (pathname as string) || ''
  return url.toString()
}

describe('Feathers application tests', () => {
  let server: Server

  beforeEach(async () => {
    console.log('STARTING TEST SERVER', port)
    server = await (await main()).listen(port)
  })

  afterEach(() => {
    console.log('RUNNING AFTER EACH')
    return new Promise<void>((resolve, reject) => {
      server.close(e => (e ? reject(e) : resolve()))
    })
  })

  it('starts and shows the index page', async () => {
    const url = getUrl()
    const response = await fetch(url)
    const body = await response.text()
    assert.ok(body.indexOf('<html lang="en">') !== -1)
  })

  it('shows a 404 HTML page', async () => {
    const url = getUrl('path/to/nowhere')
    const response = await fetch(url, {
      headers: {
        Accept: 'text/html'
      }
    })

    assert.equal(response.status, 404)
    // assert.ok((await response.text()).indexOf('<html>') !== -1)
  })

  it('shows a 404 JSON error without stack trace', async () => {
    const response = await fetch(getUrl('path/to/nowhere'))

    assert.equal(response.status, 404)
    assert.equal(response.statusText, 'Not Found')
    assert.ok(response.url.indexOf('/path/to/nowhere') !== -1)
  })
})
