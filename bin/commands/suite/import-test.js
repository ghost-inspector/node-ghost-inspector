const helpers = require('../../helpers')

module.exports = {
  command: 'import-test <suite-id> <file>',
  desc: 'Import a test in JSON format. <file> must be local path on-disk to JSON test file.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = helpers.getClient(argv)
      // TODO: resolve path
      const test = require(argv.file)
      const result = await client.importTest(argv.suiteId, test)
      helpers.printJson(result)
    } catch (error) {
      throw error
    }
    process.exit(0)
  },
}
