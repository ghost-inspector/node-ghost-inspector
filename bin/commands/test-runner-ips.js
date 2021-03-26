const request = require('request-promise-native')
const helpers = require('../helpers')

module.exports = {
  command: 'test-runner-ips',
  desc: 'Fetch the list of IP addresses used by Ghost Inspector test runners, by region.',
  builder: {},
  handler: async function (argv) {
    try {
      const uri = 'https://api.ghostinspector.com/v1/test-runner-ip-addresses'
      helpers.print(await request({uri, json: true}))
    } catch (error) {
      throw new Error(error.message)
    }
    process.exit(0)
  }
}