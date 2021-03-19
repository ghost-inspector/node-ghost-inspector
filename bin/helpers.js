/**
 * Yargs duplicates every argument like so:
 * 
 *   {
 *     'foo-bar': 'baz',
 *     fooBar: 'baz',
 *   }
 * 
 * And also includes some yargs-specific details (eg '$0') that we don't need.
 * This cleans those up so the output is compatible with the Ghost Inspector
 * Node.js client without further modification.
 */
const cleanArgs = (args) => {
  // remove yargs cruft
  delete args['_']
  delete args['$0']

  // remove hypenated args 'foo-bar'
  Object.keys(args).forEach((key) => {
    if (key.includes('-')) {
      delete args[key]
    }
  })
  return args
}

/**
 * Adds common execution-related arguments for test, suite, on-demand test.
 */
const addExecutionArgs = (yargs) => {
  yargs.options({
    'browser': {
      description: 'Alternate browser to use for this execution. The following options are available: chrome (Latest version), chrome- (Specific version of Chrome, for example chrome-83), firefox (Latest version), firefox- (Specific version of Firefox, for example firefox-77)',
    },
    'start-url': {
      description: 'Alternate start URL to use for this execution only',
    },
    'user-agent': {
      description: 'Alternate user agent to use for this execution only',
    },
    'region': {
      // TODO: are these up to date?
      description: 'Geo-location for test execution. The following options are available: us-east-1 (default), us-west-1, ca-central-1, eu-central-1, eu-west-1, eu-west-2, eu-west-3, eu-north-1, me-south-1, ap-east-1, ap-northeast-1, ap-northeast-2, ap-southeast-1, ap-southeast-2, ap-south-1, sa-east-1',
    },
    'viewport': {
      description: 'Alternate screen size to use for this execution only. This should be a string formatted as {width}x{height}, for example 1024x768. Will be ignored if screenshot comparison or visual capture is disabled.'
    },
    'immediate': {
      type: 'boolean',
    },
    // TODO: build out the rest of the execution args
  })
}

module.exports = {cleanArgs, addExecutionArgs}
