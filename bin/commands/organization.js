exports.command = 'organization <command>'
exports.description = 'Access organization details.'
exports.builder = function (yargs) {
  return yargs.commandDir('organization')
}
exports.handler = function (argv) {}
