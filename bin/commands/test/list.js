
const helpers = require('../../helpers')

module.exports = {
  command: 'list',
  desc: 'Fetch an array of all the tests in your account.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = require('../../../index')(argv.apiKey)
      const result = await client.getTests()
      helpers.print(result)
    } catch (error) {
      throw new Error(error.message)
    }

    process.exit(0)
  }
}