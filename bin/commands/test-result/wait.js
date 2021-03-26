
const helpers = require('../../helpers')

module.exports = {
  command: 'wait <result-id>',
  desc: 'Poll a running test result until complete.',
  builder: (yargs) => {
    yargs.options({
      'pollInterval': {
        description: 'Interval (in ms) to check for updated result.',
        default: 2000
      },
    })
    return yargs
  },
  handler: async function (argv) {
    try {
      const client = require('../../../index')(argv.apiKey)
      const result = await client.waitForResult(argv.resultId, argv)
      helpers.print(result)
    } catch (error) {
      throw new Error(error.message)
    }

    process.exit(0)
  }
}