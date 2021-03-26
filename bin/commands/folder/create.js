
const helpers = require('../../helpers')

module.exports = {
  command: 'create <organization-id> <folder-name>',
  desc: 'Create a folder.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = require('../../../index')(argv.apiKey)
      const result = await client.createFolder(argv.organizationId, argv.folderName)
      helpers.print(result)
    } catch (error) {
      throw new Error(error.message)
    }
    process.exit(0)
  }
}