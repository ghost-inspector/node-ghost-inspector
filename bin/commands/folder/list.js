const helpers = require('../../helpers')

module.exports = {
  command: 'list',
  desc: 'Fetch an array of all the folders in your account.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = require('../../../index')(argv.apiKey)
      const result = await client.getFolders()
      helpers.print(result)
    } catch (error) {
      throw error
    }

    process.exit(0)
  },
}
