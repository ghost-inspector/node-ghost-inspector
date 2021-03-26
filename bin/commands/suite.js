const newLocal = exports.command = 'suite <command>'
exports.description = 'Manage suites within your Ghost Inspector account.'
exports.builder = function (yargs) {
  return yargs.commandDir('suite')
}
exports.handler = function (argv) {}