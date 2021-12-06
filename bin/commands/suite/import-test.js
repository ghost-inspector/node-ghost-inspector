const helpers = require('../../helpers')

module.exports = {
  command: 'import-test <suiteId> <file>',
  desc: 'Import a test in JSON or HTML (Selenium IDE v1) format. <file> must be local path on-disk to JSON test file.',
  builder: {},
  handler: async function (argv) {
    const client = helpers.getClient(argv)
    let test

    // try to load the file with JSON, fall back on HTML
    try {
      test = helpers.loadJsonFile(argv.file)
    } catch (unused) {
      test = argv.file
    }
    const result = await client.importTest(argv.suiteId, test)
    if (argv.json) {
      helpers.printJson(result)
    } else {
      helpers.print({
        message: `Test imported: ${result.name}`,
        id: result._id,
      })
    }

    process.exit(0)
  },
}
