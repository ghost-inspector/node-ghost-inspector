const request = require('request-promise-native')
const helpers = require('../helpers')

module.exports = {
  command: 'test-runner-ips',
  desc: 'Fetch a list of test runner IP addresses by region.',
  builder: {},
  handler: async function (argv) {
    const uri = 'https://api.ghostinspector.com/v1/test-runner-ip-addresses'
    helpers.printJson(await request({ uri, json: true }))

    process.exit(0)
  },
}
