const assert = require('assert')
const chalk = require('chalk')
const path = require('path')
const ngrok = require('ngrok')

/**
 * Clean up arguments so the output is compatible with the Ghost Inspector
 * Node.js client without further modification.
 */
const cleanArgs = (args) => {
  let rawArgs = {}
  if (args.jsonInput) {
    try {
      rawArgs = JSON.parse(args.jsonInput)
    } catch (unused) {}
  }

  // apply JSON input, then options
  args = { ...rawArgs, ...args }

  // remove yargs cruft & apiKey
  delete args._
  delete args.$0
  delete args.apiKey
  delete args.json
  delete args.jsonInput
  delete args.errorOnFail
  delete args.errorOnScreenshotFail

  // delete ngrok stuff
  delete args.ngrokTunnel
  delete args.ngrokUrlVariable
  delete args.ngrokHostHeader
  delete args.ngrokToken

  return args
}

/**
 * Abstract the Ghost Inspector client to customize connection details.
 */
const getClient = (args) => {
  const apiKey = process.env.GHOST_INSPECTOR_API_KEY || args.apiKey
  try {
    assert.ok(apiKey, 'apiKey is required')
  } catch (error) {
    // unwrap assertion error
    throw new Error(error.message)
  }

  const client = require('../index')(apiKey)
  client.userAgent = `${client.userAgent} CLI`
  return client
}

/**
 * Adds common execution-related arguments for test, suite, on-demand test.
 */
const getCommonExecutionOptions = () => {
  return {
    browser: {
      description:
        'Alternate browser to use for this execution. The following options are available: chrome (Latest version), chrome- (Specific version of Chrome, for example chrome-83), firefox (Latest version), firefox- (Specific version of Firefox, for example firefox-77). Provide multiple --browser arguments to trigger multiple executions.',
      type: 'string',
    },
    dataFile: {
      description: 'Path to local CSV file containing a row of variable values for each test run.',
    },
    disableNotifications: {
      description: 'Disable all notifications for this execution only when provided.',
      type: 'boolean',
    },
    disableVisuals: {
      description: 'Disable capturing screenshots and video for this execution only when provided.',
      type: 'boolean',
    },
    errorOnFail: {
      description:
        'Exit the command with a non-0 status if the test or suite passing value is not `true`. Ignored when used with --immediate.',
      default: false,
      type: 'boolean',
    },
    errorOnScreenshotFail: {
      description:
        'Exit the command with a non-0 status if the test or suite screenshotComparePassing value is not `true`. Ignored when used with --immediate.',
      default: false,
      type: 'boolean',
    },
    httpAuthPassword: {
      description: 'Alternate HTTP authentication password to use for this execution only.',
    },
    httpAuthUsername: {
      description: 'Alternate HTTP authentication username to use for this execution only.',
    },
    immediate: {
      description: 'Initiate the execution, then immediate return a response when provided.',
      type: 'boolean',
      default: false,
    },
    maxConcurrentDataRows: {
      description:
        'Specify the max number of rows to execute simultaneously when executing a test using dataFile.',
    },
    ngrokTunnel: {
      description: 'Create a VPN tunnel to the provided local website using ngrok.',
    },
    ngrokUrlVariable: {
      description: 'The name of the variable that will have the ngrok tunnel URL.',
      default: 'ngrokUrl',
    },
    ngrokHostHeader: {
      description: 'Rewrite the host header for incoming HTTP requests for the ngrok tunnel.',
    },
    ngrokToken: {
      description: 'Your ngrok auth token.',
    },
    region: {
      description:
        'Geo-location for this execution, defaults to "us-east-1". Use `ghost-inspector test-runner-ips` to see all available regions. Provide multiple --region params to trigger multiple executions.',
    },
    screenshotCompareEnabled: {
      description: 'Enable screenshot comparison for this execution only when provided.',
      type: Boolean,
    },
    screenshotCompareThreshold: {
      description:
        'Use a number between 0.0 and 1.0 to set the tolerance when comparing screenshots (for this execution only). Will be ignored if screenshot comparison or visual capture is disabled.',
      type: 'number',
    },
    screenshotExclusions: {
      description:
        'Comma-separated list of CSS selectors. Elements matched by this CSS will be hidden before the screenshot is taken (for this execution only). Will be ignored if screenshot comparison or visual capture is disabled.',
    },
    screenshotTarget: {
      description:
        'Use a CSS or XPath selector. Screenshot will be taken of the element specified instead of the whole page (for this execution only). Will be ignored if screenshot comparison or visual capture is disabled.',
    },
    slackChannel: {
      description: 'Specify the Slack channel to notify for this test run.',
    },
    startUrl: {
      description: 'Alternate start URL to use for this execution only',
    },
    userAgent: {
      description: 'Alternate user agent to use for this execution only',
    },
    viewport: {
      description:
        'Alternate screen size to use for this execution only. This should be a string formatted as {width}x{height}, for example 1024x768. Will be ignored if screenshot comparison or visual capture is disabled. Provide multiple --viewport arguments to trigger multiple executions.',
    },
    '[variableName]': {
      description:
        'Pass in custom variables for this execution that are accessible in your steps via {{customVariable}}. For example, providing --first-name=Justin will create a {{first-name}} variable with the value Justin. Note that camelCase and kebab-case are both allowed for custom variables.',
    },
  }
}

/**
 * Resolves and loads a local JSON file, aides in testing the CLI.
 */
const loadJsonFile = (relativePath) => {
  return require(path.resolve(relativePath))
}

/**
 * Helper to consistently print CLI output in plain format and aide in testing.
 */
const print = (details) => {
  let passing
  if (details.passing !== undefined) {
    switch (details.passing) {
      case true:
        passing = `${chalk.green('✓')} `
        break
      case false:
        passing = `${chalk.red('✖️')} `
        break
      default:
        passing = '? '
    }
  } else {
    passing = ''
  }
  let id = ''
  if (details.id) {
    id = ` (${details.id})`
  }
  console.log(`${passing}${details.message}${id}`)
}

/**
 * Prints the provided object to JSON, aides in testing the CLI.
 */
const printJson = (object) => {
  console.log(JSON.stringify(object))
}

/**
 * Given `args.errorOnFail` and `args.errorOnScreenshotFail`, determine the
 * overall passing status based on `passing` and `screenshotComparePassing`
 * when `args.immediate` is provided. Used to resolve the exit code and real
 * passing status of test/suite execution.
 */
const resolvePassingStatus = (args, passing, screenshotPassing) => {
  let overallPassing = passing
  let exitOk = true
  if (!args.immediate) {
    if (args.errorOnScreenshotFail) {
      // check if the user wants to exit based on screenshot failing
      if (screenshotPassing) {
        overallPassing = true
        exitOk = true
      } else {
        // in the failing scenario, "overall" can be `false` or `null`
        overallPassing = screenshotPassing
        exitOk = false
      }
    }
    // check if the user wants to exit based on test failing
    if (args.errorOnFail && !passing) {
      // in the failing scenario, "overall" can be `false` or `null`
      overallPassing = passing
      exitOk = false
    }
  }
  return { overallPassing, exitOk }
}

/**
 * Helper to set up an ngrok tunnel when the correct parameters are present.
 */
const ngrokSetup = async (args) => {
  if (args.ngrokTunnel) {
    if (args.immediate) {
      throw new Error('Cannot use --ngrokTunnel with --immediate')
    }

    const ngrokToken = args.ngrokToken || process.env.NGROK_TOKEN
    try {
      assert.ok(ngrokToken, 'ngrokToken is required')
    } catch (error) {
      // unwrap assertion error
      throw new Error(error.message)
    }

    const connectArgs = {
      authtoken: ngrokToken,
      addr: args.ngrokTunnel,
    }

    if (args.ngrokHostHeader) {
      connectArgs.host_header = args.ngrokHostHeader
    }

    try {
      const url = await ngrok.connect(connectArgs)
      args[args.ngrokUrlVariable] = url

      if (!args.json) {
        console.log(`Ngrok URL (${url}) assigned to variable '${args.ngrokUrlVariable}'`)
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }
  return args
}

const ngrokTeardown = async (args) => {
  // tear down tunnel
  if (args.ngrokTunnel) {
    try {
      await ngrok.disconnect()
      await ngrok.kill()
    } catch (unused) {}
  }
  // kill ngrok
  return args
}

module.exports = {
  cleanArgs,
  getClient,
  getCommonExecutionOptions,
  loadJsonFile,
  ngrokSetup,
  ngrokTeardown,
  print,
  printJson,
  resolvePassingStatus,
}
