const assert = require('assert')

module.exports = {
  /**
   * On client connection (required)
   * @param {client} client connection
   * @param {done} callback function(err) {}
   */
  onConnect (client, done) {
    done()
  },

  /**
   * Send a message (required)
   * @param {client} client connection
   * @param {done} callback function(err) {}
   */
  sendMessage (client, done) {
    client.emit('get', 'todos', 'test', (error, data) => {
      assert.equal(error, null)
      assert.strictEqual(data.id, 'feathers-test')
      done(error)
    })
  },

  options: {}
}
