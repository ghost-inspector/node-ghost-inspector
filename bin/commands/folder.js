exports.command = 'folder <command>'
exports.description = 'Manage folders within your Ghost Inspector account.'
exports.builder = function (yargs) {
  return yargs.commandDir('folder')
}
exports.handler = function (argv) {}
