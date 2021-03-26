
const helpers = require('../../helpers')

// TODO: clean up __v in the JSON output
/*
  {
    "_id": "5cd1d3688a512d55d82c8e1c",
    "name": "WordPress Plugin",
    "organization": "5a0604918ee170435385d4a7",
    "__v": 0
  },
*/

module.exports = {
  command: 'list',
  desc: 'Fetch an array of all the folders in your account.',
  builder: {},
  handler: async function (argv) {
    try {
      const client = require('../../../index')(argv.apiKey)
      const result = await client.getFolders()
      // print out result, regardless
      helpers.print(result)
    } catch (error) {
      throw new Error(error.message)
    }

    process.exit(0)
  }
}