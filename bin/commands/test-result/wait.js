const helpers = require('../../helpers')

module.exports = {
  command: 'wait <result-id>',
  desc: 'Poll a running test result until complete.',
  builder: (yargs) => {
    yargs.options({
      pollInterval: {
        description: 'Interval (in ms) to check for updated result.',
        default: 2000,
      },
    })
    return yargs
  },
  handler: async function (argv) {
    try {
      const client = helpers.getClient(argv)
      const result = await client.waitForTestResult(argv.resultId, argv)
      if (argv.json) {
        helpers.printJson(result)
      } else {
        helpers.print({
          message: result.name,
          id: result._id,
        })
      }
    } catch (error) {
      throw error
    }

    process.exit(0)
  },
}
