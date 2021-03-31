exports.command = 'test <command>'
exports.description = 'Manage tests within your Ghost Inspector account.'
exports.builder = function (yargs) {
  return yargs.commandDir('test')
}
exports.handler = function (argv) {}
