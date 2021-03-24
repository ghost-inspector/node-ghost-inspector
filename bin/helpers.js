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
      description: 'Alternate browser to use for this execution. The following options are available: chrome (Latest version), chrome- (Specific version of Chrome, for example chrome-83), firefox (Latest version), firefox- (Specific version of Firefox, for example firefox-77). Provide multiple --browser arguments to trigger multiple executions.',
      type: 'string',
    },
    'data-file': {
      description: 'Path to local CSV file containing a row of variable values for each test run'
    },
    'disable-notifications': {
      description: 'Disable all notifications for this execution only when provided',
      type: 'boolean',
      default: false,
    },
    'disable-visuals': {
      description: 'Disable capturing screenshots and video for this execution only when provided',
      type: 'boolean',
      default: false,
    },
    'http-auth-password': {
      description: 'Alternate HTTP authentication password to use for this execution only'
    },
    'http-auth-username': {
      description: 'Alternate HTTP authentication username to use for this execution only'
    },
    'immediate': {
      description: 'Initiate the execution, then immediate return a response when provided',
      type: 'boolean',
      default: false,
    },
    'max-concurrent-data-rows': {
      description: 'Specify the max number of rows to execute simultaneously when executing a test using dataFile.'
    },
    'region': {
      // TODO: check if this list of regions is up to date
      description: 'Geo-location for this execution. The following options are available: us-east-1 (default), us-west-1, ca-central-1, eu-central-1, eu-west-1, eu-west-2, eu-west-3, eu-north-1, me-south-1, ap-east-1, ap-northeast-1, ap-northeast-2, ap-southeast-1, ap-southeast-2, ap-south-1, sa-east-1. Provide multiple --region arguments to trigger multiple executions.',
    },
    // NOTE: test-only?
    'screenshot-compare-baseline-result': {
      description: 'The ID of any completed test result across your organization to use as the baseline for the screenshot comparison Will be ignored if screenshot comparison or visual capture is disabled.',
    },
    'screenshot-compare-enabled': {
      description: 'Enable screenshot comparison for this execution only when provided',
      type: Boolean,
    },
    'screenshot-compare-threshold': {
      description: 'Use a number between 0.0 and 1.0 to set the tolerance when comparing screenshots (for this execution only). Will be ignored if screenshot comparison or visual capture is disabled.',
      type: 'number',
    },
    'screenshot-exclusions': {
      description: 'Comma-separated list of CSS selectors. Elements matched by this CSS will be hidden before the screenshot is taken (for this execution only). Will be ignored if screenshot comparison or visual capture is disabled.',
    },
    'screenshot-target': {
      description: 'Use a CSS or XPath selector. Screenshot will be taken of the element specified instead of the whole page (for this execution only). Will be ignored if screenshot comparison or visual capture is disabled.',
    },
    'slack-channel': {
      description: 'Specify the Slack channel to notify for this test run.',
    },
    'start-url': {
      description: 'Alternate start URL to use for this execution only',
    },
    'user-agent': {
      description: 'Alternate user agent to use for this execution only',
    },
    'viewport': {
      description: 'Alternate screen size to use for this execution only. This should be a string formatted as {width}x{height}, for example 1024x768. Will be ignored if screenshot comparison or visual capture is disabled. Provide multiple --viewport arguments to trigger multiple executions.'
    },
    // TODO: this is not a suite option?
    'webhook': {
      description: 'An escaped URL (or array of URLs) added to the webhooks list for this execution only'
    },
    '[custom-variable]': {
      description: 'Pass in custom variables for this execution that are accessible in your steps via {{customVariable}}. For example, providing --first-name=Justin will create a {{firstName}} variable with the value Justin.',
    },
  })
}

module.exports = {cleanArgs, addExecutionArgs}
