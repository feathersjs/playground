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
    client.emit('get', 'todos', 'test', (data) => {
      assert.strictEqual(data.id, 'nest-test')
      done(null);
    })
  },

  options: {}
}
