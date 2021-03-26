exports.command = 'test-result <command>'
exports.description = 'Manage test results within your Ghost Inspector account.'
exports.builder = function (yargs) {
  return yargs.commandDir('test-result')
}
exports.handler = function (argv) {}