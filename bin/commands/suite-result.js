const newLocal = (exports.command = 'suite-result <command>')
exports.description = 'Manage suite results within your Ghost Inspector account.'
exports.builder = function (yargs) {
  return yargs.commandDir('suite-result')
}
exports.handler = function (argv) {}
