const helpers = require('../../helpers')

module.exports = {
  command: 'create <organization-id> <folder-name>',
  desc: 'Create a folder.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = helpers.getClient(argv)
      const result = await client.createFolder(argv.organizationId, argv.folderName)
      if (argv.json) {
        helpers.printJson(result)
      } else {
        helpers.print({
          message: `Folder created: ${result.name}`,
          id: result._id,
        })
      }
    } catch (error) {
      throw error
    }
    process.exit(0)
  },
}
