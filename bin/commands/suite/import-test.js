const resolvePath = require('path').resolve

const helpers = require('../../helpers')

module.exports = {
  command: 'import-test <suite-id> <file>',
  desc: 'Import a test in JSON format. <file> must be local path on-disk to JSON test file.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = helpers.getClient(argv)
      // TODO: test this again with resolvePath
      const test = resolvePath(argv.file)
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
