const helpers = require('../../helpers')

module.exports = {
  command: 'import-test <suite-id> <file>',
  desc: 'Import a test in JSON format. <file> must be local path on-disk to JSON test file.',
  builder: {},
  handler: async function (argv) {
    // TODO test this again manually
    try {
      const client = helpers.getClient(argv)
      const test = helpers.loadJsonFile(argv.file)
      const result = await client.importTest(argv.suiteId, test)
      if (argv.json) {
        helpers.printJson(result)
      } else {
        helpers.print({
          message: `Test imported: ${result.name}`,
          id: result._id,
        })
      }
    } catch (error) {
      throw error
    }
    process.exit(0)
  },
}
