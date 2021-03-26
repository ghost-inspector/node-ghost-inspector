
const helpers = require('../../helpers')

module.exports = {
  command: 'execute-on-demand <organization-id> <file> [options]',
  desc: 'Execute an on-demand test against your organization providing the path to your local JSON <file>.',

  builder: (yargs) => {
    yargs.options({
      'immediate': {
        description: 'Initiate the execution, then immediate return a response when provided',
        type: 'boolean',
        default: false,
      },
    })
    return yargs
  },

  handler: async function (argv) {
    // clean up yargs-related stuff
    const args = helpers.cleanArgs(argv)
    const { apiKey, organizationId, file, immediate } = args

    try {
      const client = require('../../../index')(apiKey)
      const input = require(file)
      const [result, passing, screenshotPassing] = await client.executeTestOnDemand(organizationId, input, { wait: !immediate })
      helpers.print(result)
    } catch (error) {
      throw new Error(error.message)
    }

    process.exit(0)
  }
}