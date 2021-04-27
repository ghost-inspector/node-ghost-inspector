const helpers = require('../../helpers')

module.exports = {
  command: 'create <organizationId> <folderName>',
  desc: 'Create a folder.',
  builder: {},
  handler: async function (argv) {
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

    process.exit(0)
  },
}
