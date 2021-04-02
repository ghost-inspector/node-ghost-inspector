const helpers = require('../../helpers')

module.exports = {
  command: 'list',
  desc: 'Fetch an array of all the folders in your account.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = helpers.getClient(argv)
      const result = await client.getFolders()
      helpers.printJson(result)
    } catch (error) {
      throw error
    }

    process.exit(0)
  },
}
