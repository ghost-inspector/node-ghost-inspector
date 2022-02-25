# Ghost Inspector Node.js Bindings

[![CircleCI](https://circleci.com/gh/ghost-inspector/node-ghost-inspector/tree/stable.svg?style=svg)](https://circleci.com/gh/ghost-inspector/node-ghost-inspector/tree/stable)

The official Node.js package and CLI for interacting with [Ghost Inspector's API](https://ghostinspector.com/docs/api/).

## Jump to...

- [Installation](#installation)
- [Quick Start](#quick-start)
- [CLI Usage](#cli-usage)
- [Node.js Client Usage](#nodejs-client-usage)
- [Contributing](#contributing)

## Installation

Our official Node.js package is available from [npm](https://www.npmjs.com/), you can install it with the following command:

```
npm install ghost-inspector
```

In order to use the CLI, install the package globally:

```
npm install -g ghost-inspector
```

## Quick Start

```js
const GhostInspector = require('ghost-inspector')('[api-key]')

// execute a test
try {
  const [results, passing, screenshotPassing] = await GhostInspector.executeTest(
    '[test-id]',
    options,
  )
  console.log('Passing: ', passing)
} catch (err) {
  console.error(err)
}
```

## CLI Usage

CLI quickstart:

```
❯ ghost-inspector test execute <testId> \
  --browser firefox \
  --ngrokTunnel localhost:8000 \
  --myVariable "some variable" \
  --errorOnFail
```

### Exit status control for CI systems

Under an automated build environment it makes sense to have a command return a non-success status when things are failing. By default the CLI will always return a success (`0`) status when executing tests or suites, however you can have the command fail for a non-passing test or suite status (`--errorOnFail`), a non-passing screenshot status (`--errorOnScreenshotFail`) or both when waiting for a result:

```
# exit with error code when failing
❯ ghost-inspector test execute <testId> --errorOnFail

# exit with error code when screenshot failing (will ignore `passing`)
❯ ghost-inspector test execute <testId> --errorOnScreenshotFail

# exit with error code if `passing` or `screenshotComparePassing` is `false`
❯ ghost-inspector test execute <testId> --errorOnFail --errorOnScreenshotFail

```

### Creating a secure VPN tunnel with ngrok

The CLI has built-in support for [ngrok](https://ngrok.com/) to make it easier for you to run your tests against a locally-accessible application. In order to set up `ngrok` you will need your access token from [your ngrok account](https://dashboard.ngrok.com/get-started/your-authtoken). To initiate a tunnel on execution use the `--ngrokTunnel` parameter to specify your local endpoint, this can be a port on your local computer or a target on the local network:

```
❯ ghost-inspector test execute <testId> \
  --ngrokTunnel localhost:8000 \
  --ngrokToken '<my-ngrok-token>'
```

**Note**: `--ngrokTunnel` option is not available when using `--immediate`.

If you prefer you can also set the ngrok token using the environment variable `NGROK_TOKEN`.

#### VPN tunnel URL variable

Once you trigger your execution the variable `ngrokUrl` will be made available in your test with the URL of the tunnel. You can modify the name of this variable using the option `--ngrokUrlVariable`, for instance you could set it to `{{ appDomain }}` with the following example:

```
❯ ghost-inspector test execute <testId> \
  --ngrokTunnel localhost:8000 \
  --ngrokToken '<my-ngrok-token>'
  --ngrokUrlVariable 'appDomain'
```

You can also set the ngrok URL to the start URL of your test or suite:

```
❯ ghost-inspector test execute <testId> \
  --ngrokTunnel localhost:8000 \
  --ngrokToken '<my-ngrok-token>'
  --ngrokUrlVariable 'startUrl'
```

If you require additional configuration, you can use [the ngrok configuration file for your system](https://www.npmjs.com/package/ngrok#config) to customize your tunnel.

### View all available commands for the CLI

```
❯ ghost-inspector --help
ghost-inspector <command>

Commands:
  ghost-inspector folder <command>        Manage folders within your Ghost Inspector account.
  ghost-inspector organization <command>  Access organization details.
  ghost-inspector suite-result <command>  Manage suite results within your Ghost Inspector account.
  ghost-inspector suite <command>         Manage suites within your Ghost Inspector account.
  ghost-inspector test-result <command>   Manage test results within your Ghost Inspector account.
  ghost-inspector test-runner-ips         Fetch a list of test runner IP addresses by region.
  ghost-inspector test <command>          Manage tests within your Ghost Inspector account.

Options:
  --version  Show version number                                                           [boolean]
  --apiKey   Your Ghost Inspector API key.                                                [required]
  --json     Provide output in JSON format.
  --help     Show help                                                                     [boolean]
```

By default all commands will provide human-readable output, but you can also return JSON by passing the flag `--json`.

**Note:** your API key may be passed in through the environment (`GHOST_INSPECTOR_API_KEY`) or as a parameter (`--apiKey xxx`).

<br />

## Node.js Client Usage

Every method is accessed via your `GhostInspector` instance. Your API Key is passed in when the instance is created:

```js
const GhostInspector = require('ghost-inspector')('[api-key]')
```

This package supports both callbacks and `await` to receive data back from the method call. Note that when an error is encountered, it will be return as the first argument in the callback. However, if no callback is passed in, it is assumed that `await` is being used and the method will throw an exception. This means that when using `await` you should wrap your calls in a `try/catch` block.

<br />

### Methods

Jump to...

- Folders
  - [`createFolder()`](#ghostinspectorcreatefolderorganizationid-foldername-callback)
  - [`getFolder()`](#ghostinspectorgetfolderfolderid-callback)
  - [`getFolders()`](#ghostinspectorgetfolderscallback)
  - [`getFolderSuites()`](#ghostinspectorgetfoldersuitesfolderid-callback)
  - [`updateFolder()`](#ghostinspectorupdatefolderfolderid-foldername-callback)
- Suites
  - [`createSuite()`](#ghostinspectorcreatesuiteorganizationid-suitename-callback)
  - [`downloadSuiteJson()`](#ghostinspectordownloadsuitejsonsuiteid-dest-callback)
  - [`downloadSuiteSeleniumHtml()`](#ghostinspectordownloadsuiteseleniumhtmlsuiteid-dest-callback)
  - [`downloadSuiteSeleniumSide()`](#ghostinspectordownloadsuiteseleniumsidesuiteid-dest-callback)
  - [`downloadSuiteSeleniumJson()`](#ghostinspectordownloadsuiteseleniumjsonsuiteid-dest-callback)
  - [`duplicateSuite()`](#ghostinspectorduplicatesuitesuiteid-options-callback)
  - [`executeSuite()`](#ghostinspectorexecutesuitesuiteid-options-callback)
  - [`getSuite()`](#ghostinspectorgetsuitesuiteid-callback)
  - [`getSuites()`](#ghostinspectorgetsuites-callback)
  - [`getSuiteResults()`](#ghostinspectorgetsuiteresultssuiteid-callback)
  - [`getSuiteTests()`](#ghostinspectorgetsuitetestssuiteid-callback)
  - [`importTest()`](#ghostinspectorimporttestsuiteid-test-callback)
  - [`updateSuite()`](#ghostinspectorupdatesuitesuiteid-updates-callback)
- Suite Results
  - [`cancelSuiteResult()`](#ghostinspectorcancelsuiteresultsuiteresultid-callback)
  - [`getSuiteResult()`](#ghostinspectorgetsuiteresultssuiteresultid-callback)
  - [`getSuiteResultTestResults()`](#ghostinspectorgetsuiteresulttestresultssuiteresultid-callback)
  - [`getSuiteResultXUnit()`](#ghostinspectorgetsuiteresultxunitsuiteresultid-callback)
- Tests
  - [`acceptTestScreenshot()`](#ghostinspectoraccepttestscreenshottestid-callback)
  - [`deleteTest()`](#ghostinspectordeletetesttestid-callback)
  - [`downloadTestJson()`](#ghostinspectordownloadtestjsontestid-dest-callback)
  - [`downloadTestSeleniumHtml()`](#ghostinspectordownloadtestseleniumhtmltestid-dest-callback)
  - [`downloadTestSeleniumSide()`](#ghostinspectordownloadtestseleniumsidetestid-dest-callback)
  - [`downloadTestSeleniumJson()`](#ghostinspectordownloadtestseleniumjsontestid-dest-callback)
  - [`duplicateTest()`](#ghostinspectorduplicatetesttestid-callback)
  - [`executeTest()`](#ghostinspectorexecutetesttestid-options-callback)
  - [`executeTestOnDemand()`](#ghostinspectorexecutetestondemandorganizationid-test-options-callback)
  - [`getTest()`](#ghostinspectorgettesttestid-callback)
  - [`getTestResults()`](#ghostinspectorgettestresultstestid-options-callback)
  - [`getTestResultsRunning()`](#ghostinspectorgettestresultsrunningtestid-callback)
  - [`updateTest()`](#ghostinspectorupdatetesttestid-updates-callback)
  - [`waitForTestResult()`](#ghostinspectorwaitfortestresultresultid-options-callback)
- Test Results
  - [`cancelTestResult()`](#ghostinspectorcanceltestresulttestresultid-callback)
  - [`getTestResult()`](#ghostinspectorgettestresulttestresultid-callback)
- Organization
  - [`getAllRunningTests()`](#ghostinspectorgetallrunningtestsorganizationid-callback)
  - [`getTests()`](#ghostinspectorgettests-callback)

<br />

#### `GhostInspector.getFolders([callback])`

Fetch an array of all the folders in your account.

```js
// Example using await
try {
  const folders = await GhostInspector.getFolders()
} catch (err) {
  console.error(err)
}

// Example using a callback
GhostInspector.getFolders(function (err, folders) {
  if (err) return console.error(err)
  console.log(folders)
})
```

#### `GhostInspector.createFolder(organizationId, folderName, [callback])`

Create a folder within your organization.

```js
// Example using await
try {
  const folder = await GhostInspector.createFolder('[organization-id]', '[folder-name]')
} catch (err) {
  console.error(err)
}

// Example using a callback
GhostInspector.createFolder('[organization-id]', '[folder-name]', function (err, folder) {
  if (err) return console.error(err)
  console.log(folder)
})
```

#### `GhostInspector.updateFolder(folderId, folderName, [callback])`

Update a folder name.

```js
// Example using await
try {
  const folder = await GhostInspector.updateFolder('[folder-id]', '[folder-name]')
} catch (err) {
  console.error(err)
}

// Example using a callback
GhostInspector.updateFolder('[folder-id]', '[folder-name]', function (err, folder) {
  if (err) return console.error(err)
  console.log(folder)
})
```

#### `GhostInspector.getFolder(folderId, [callback])`

Fetch a single folder from your account.

```js
// Example using await
try {
  const folder = await GhostInspector.getFolder('[folder-id]')
} catch (err) {
  console.error(err)
}

// Example using a callback
GhostInspector.getFolder('[folder-id]', function (err, folder) {
  if (err) return console.error(err)
  console.log(folder)
})
```

#### `GhostInspector.getFolderSuites(folderId, [callback])`

Fetch an array of all the suites in a folder.

```js
// Example using await
try {
  const suites = await GhostInspector.getFolderSuites('[folder-id]')
} catch (err) {
  console.error(err)
}

// Example using a callback
GhostInspector.getFolderSuites('[folder-id]', function (err, suites) {
  if (err) return console.error(err)
  console.log(suites)
})
```

#### `GhostInspector.createSuite(organizationId, suiteName, [callback])`

Create a suite.

```js
// Example using await
try {
  const suites = await GhostInspector.createSuite('[organization-id]', '[suite-name]')
} catch (err) {
  console.error(err)
}

// Example using a callback
GhostInspector.createSuite('[organization-id]', '[suite-name]', function (err, suites) {
  if (err) return console.error(err)
  console.log(suites)
})
```

#### `GhostInspector.updateSuite(suiteId, updates, [callback])`

Update a suite.

```js
// Example using await
try {
  const suites = await GhostInspector.updateSuite('[suite-id]', { name: 'My new suite name' })
} catch (err) {
  console.error(err)
}

// Example using a callback
GhostInspector.updateSuite('[suite-id]', { name: 'My new suite name' }, function (err, suites) {
  if (err) return console.error(err)
  console.log(suites)
})
```

#### `GhostInspector.getSuites([callback])`

Fetch an array of all the suites in your account.

```js
// Example using await
try {
  const suites = await GhostInspector.getSuites()
} catch (err) {
  console.error(err)
}

// Example using a callback
GhostInspector.getSuites(function (err, suites) {
  if (err) return console.error(err)
  console.log(suites)
})
```

#### `GhostInspector.getSuite(suiteId, [callback])`

Fetch a single suite from your account.

```js
// Example using await
try {
  const suite = await GhostInspector.getSuite('[suite-id]')
} catch (err) {
  console.error(err)
}

// Example using a callback
GhostInspector.getSuite('[suite-id]', function (err, suite) {
  if (err) return console.error(err)
  console.log(suite)
})
```

#### `GhostInspector.getSuiteTests(suiteId, [callback])`

Fetch an array of all the tests in a suite.

```js
// Example using await
try {
  const tests = await GhostInspector.getSuiteTests('[suite-id]')
} catch (err) {
  console.error(err)
}

// Example using a callback
GhostInspector.getSuiteTests('[suite-id]', function (err, tests) {
  if (err) return console.error(err)
  console.log(tests)
})
```

#### `GhostInspector.getSuiteResults(suiteId, [options], [callback])`

Fetch an array of suite results for a suite.

```js
const options = {
  count: 10,
  offset: 0,
}

// Example using await
try {
  const results = await GhostInspector.getSuiteResults('[suite-id]', options)
} catch (err) {
  console.error(err)
}

// Example using a callback
GhostInspector.getSuiteResults('[suite-id]', options, function (err, results) {
  if (err) return console.error(err)
  console.log(results)
})
```

#### `GhostInspector.executeSuite(suiteId, [options], [callback])`

Execute all the tests in a suite and returns an array of results.

```js
// Optionally override the start URL of all tests in this suite (for this run only)
const options = {
  startUrl: 'http://alternate.yourcompany.com',
}

// Example using await
try {
  const [results, passing, screenshotPassing] = await GhostInspector.executeSuite(
    '[suite-id]',
    options,
  )
} catch (err) {
  console.error(err)
}

// Example using a callback
GhostInspector.executeSuite(
  '[suite-id]',
  options,
  function (err, results, passing, screenshotPassing) {
    if (err) return console.error(err)
    console.log(passing === true ? 'Passed' : 'Failed')
    console.log(results)
  },
)
```

#### `GhostInspector.duplicateSuite(suiteId, [options], [callback])`

Execute all the tests in a suite and returns an array of results.

```js
// Example using await
try {
  const newSuite = await GhostInspector.duplicateSuite('[suite-id]')
} catch (err) {
  console.error(err)
}

// Example using a callback
GhostInspector.duplicateSuite('[suite-id]', function (err, newSuite) {
  if (err) return console.error(err)
  console.log(newSuite)
})
```

#### `GhostInspector.downloadSuiteSeleniumHtml(suiteId, dest, [callback])`

Download a zip file of all tests in this suite in Selenium IDE .html format

```js
// Example using await
try {
  await GhostInspector.downloadSuiteSeleniumHtml('[suite-id]', 'suite.zip')
} catch (err) {
  console.error(err)
}

// Example using a callback
GhostInspector.downloadSuiteSeleniumHtml('[suite-id]', 'suite.zip', function (err) {
  if (err) return console.error(err)
  console.log('File saved to suite.zip.')
})
```

#### `GhostInspector.downloadSuiteSeleniumSide(suiteId, dest, [callback])`

Download a file of all tests in this suite in Selenium IDE .side format

```js
// Example using await
try {
  await GhostInspector.downloadSuiteSeleniumSide('[suite-id]', 'suite.side')
} catch (err) {
  console.error(err)
}

// Example using a callback
GhostInspector.downloadSuiteSeleniumSide('[suite-id]', 'suite.side', function (err) {
  if (err) return console.error(err)
  console.log('File saved to suite.side.')
})
```

#### `GhostInspector.downloadSuiteSeleniumJson(suiteId, dest, [callback])`

Download a zip file of all tests in this suite in Selenium JSON format

```js
// Example using await
try {
  await GhostInspector.downloadSuiteSeleniumJson('[suite-id]', 'suite.zip')
} catch (err) {
  console.error(err)
}

// Example using a callback
GhostInspector.downloadSuiteSeleniumJson('[suite-id]', 'suite.zip', function (err) {
  if (err) return console.error(err)
  console.log('File saved to suite.zip.')
})
```

#### `GhostInspector.downloadSuiteJson(suiteId, dest, [callback])`

Download a file of all tests in this suite in Ghostinspector JSON format

```js
// Example using await
const options = {
  includeImports: true,
}

try {
  await GhostInspector.downloadSuiteJson('[suite-id]', 'suite.zip', options)
} catch (err) {
  console.error(err)
}

// Example using a callback
GhostInspector.downloadSuiteJson('[suite-id]', 'suite.zip', options, function (err) {
  if (err) return console.error(err)
  console.log('File saved to suite.zip.')
})
```

#### `GhostInspector.downloadTestJson(testId, dest, [callback])`

Download a single test in Ghostinspector JSON format

```js
const options = {
  includeImports: true,
}

// Example using await
try {
  await GhostInspector.downloadTestJson('[test-id]', 'test.json', options)
} catch (err) {
  console.error(err)
}

// Example using a callback
GhostInspector.downloadTestJson('[test-id]', 'test.json', options, function (err) {
  if (err) return console.error(err)
  console.log('File saved to test.json.')
})
```

#### `GhostInspector.importTest(suiteId, test, [callback])`

Import a test in JSON or HTML (Selenium IDE v1) format.

**Note:** For JSON, pass the JavaScript object to the client, for HTML pass the path to the file on disk.

```js
// JSON example (using async)
const myJsonTest = require('my-test.json')
const importedTest = await GhostInspector.importTest('[suite-id]', myJsonTest)
console.log(importedTest)

// HTML example (using callback)
GhostInspector.importTest('[suite-id]', '/path/to/my-test.html', function (err, importedTest) {
  if (err) return console.error(err)
  console.log(importedTest)
})
```

#### `GhostInspector.getTests([callback])`

Fetch an array of all the tests in your account.

```js
// Example using await
try {
  const tests = await GhostInspector.getTests()
} catch (err) {
  console.error(err)
}

// Example using a callback
GhostInspector.getTests(function (err, tests) {
  if (err) return console.error(err)
  console.log(tests)
})
```

#### `GhostInspector.getTest(testId, [callback])`

Fetch a single test from your account.

```js
// Example using await
try {
  const test = await GhostInspector.getTest('[test-id]')
} catch (err) {
  console.error(err)
}

// Example using a callback
GhostInspector.getTest('[test-id]', function (err, test) {
  if (err) return console.error(err)
  console.log(test)
})
```

#### `GhostInspector.deleteTest(testId, [callback])`

Delete a test.

```js
// Example using await
try {
  const tests = await GhostInspector.deleteTest('[test-id]')
} catch (err) {
  console.error(err)
}

// Example using a callback
GhostInspector.deleteTest('[test-id]', function (err, tests) {
  if (err) return console.error(err)
  console.log(tests)
})
```

#### `GhostInspector.updateTest(testId, updates, [callback])`

Update a test.

```js
// Example using await
try {
  const tests = await GhostInspector.updateTest('[test-id]', { name: 'My new test name' })
} catch (err) {
  console.error(err)
}

// Example using a callback
GhostInspector.updateTest('[test-id]', { name: 'My new test name' }, function (err, tests) {
  if (err) return console.error(err)
  console.log(tests)
})
```

#### `GhostInspector.getTestResults(testId, [options], [callback])`

Fetch an array of test results for a test.

```js
const options = {
  count: 10,
  offset: 0,
}

// Example using await
try {
  const results = await GhostInspector.getTestResults('[test-id]', options)
} catch (err) {
  console.error(err)
}

// Example using a callback
GhostInspector.getTestResults('[test-id]', options, function (err, results) {
  if (err) return console.error(err)
  console.log(results)
})
```

#### `GhostInspector.getTestResultsRunning(testId, [callback])`

Fetch an array of test results that are in progress for a test.

```js
// Example using await
try {
  const results = await GhostInspector.getTestResultsRunning('[test-id]')
} catch (err) {
  console.error(err)
}

// Example using a callback
GhostInspector.getTestResultsRunning('[test-id]', function (err, results) {
  if (err) return console.error(err)
  console.log(results)
})
```

#### `GhostInspector.acceptTestScreenshot(testId, [callback])`

Accept the current screenshot as the new baseline for a test. (Note: _This method will throw/return an error if the test's screenshot is already passing, or if screenshot comparison is disabled._)

```js
// Example using await
try {
  const test = await GhostInspector.acceptTestScreenshot('[test-id]')
} catch (err) {
  console.error(err)
}

// Example using a callback
GhostInspector.acceptTestScreenshot('[test-id]', function (err, test) {
  if (err) return console.error(err)
  console.log(test)
})
```

#### `GhostInspector.duplicateTest(testId, [callback])`

Create a duplicate copy of a test.

```js
// Example using await
try {
  const newTest = await GhostInspector.duplicateTest('[test-id]')
} catch (err) {
  console.error(err)
}

// Example using a callback
GhostInspector.duplicateTest('[test-id]', function (err, newTest) {
  if (err) return console.error(err)
  console.log(newTest)
})
```

#### `GhostInspector.executeTest(testId, [options], [callback])`

Execute a single test in your account and return the result.

```js
// Optionally override the start URL of the test (for this run only)
const options = {
  startUrl: 'http://alternate.yourcompany.com',
}

// Example using await
try {
  const [results, passing, screenshotPassing] = await GhostInspector.executeTest(
    '[test-id]',
    options,
  )
} catch (err) {
  console.error(err)
}

// Example using a callback
GhostInspector.executeTest(
  '[test-id]',
  options,
  function (err, results, passing, screenshotPassing) {
    if (err) return console.error(err)
    console.log(passing === true ? 'Passed' : 'Failed')
    console.log(results)
  },
)
```

#### `GhostInspector.executeTestOnDemand(organizationId, test, [options], [callback])`

Execute an on-demand test against your organization.

```js
const myTest = require('./my-test.json')

// Wait for the result to finish execution before returning
const options = {
  immediate: false,
}

// Example using await
try {
  const [result, passing, screenshotPassing] = await GhostInspector.executeTestOnDemand(
    '[organization-id]',
    myTest,
    options,
  )
} catch (err) {
  console.error(err)
}

// Example using a callback
GhostInspector.executeTestOnDemand(
  '[organization-id]',
  myTest,
  options,
  function (err, result, passing, screenshotPassing) {
    if (err) return console.error(err)
    console.log(`Passing: ${result.passing}`)
  },
)
```

#### `GhostInspector.waitForTestResult(resultId, [options], [callback])`

Poll for a result execution's completion.

```js
// First, we execute a test using immediate=1 to get a result ID
const result = await GhostInspector.executeTest('[test-id]', { immediate: true })
const resultId = result._id

const options = {
  pollInterval: 2000, // default is 5000 (5 seconds)
}
// Example using await
const result = await GhostInspector.waitForTestResult(resultId, options)
console.log(result.passing)

// Example using a callback
GhostInspector.waitForTestResult(resultId, options, function (err, result) {
  if (err) console.error(err)
  console.log(`Passing: ${result.passing}`)
})
```

#### `GhostInspector.downloadTestSeleniumHtml(testId, dest, [callback])`

Download a single test in Selenium IDE .html format

```js
// Example using await
try {
  await GhostInspector.downloadTestSeleniumHtml('[test-id]', 'test.html')
} catch (err) {
  console.error(err)
}

// Example using a callback
GhostInspector.downloadTestSeleniumHtml('[test-id]', 'test.html', function (err) {
  if (err) return console.error(err)
  console.log('File saved to test.html.')
})
```

#### `GhostInspector.downloadTestSeleniumSide(testId, dest, [callback])`

Download a single test in Selenium IDE .side format

```js
// Example using await
try {
  await GhostInspector.downloadTestSeleniumSide('[test-id]', 'test.side')
} catch (err) {
  console.error(err)
}

// Example using a callback
GhostInspector.downloadTestSeleniumSide('[test-id]', 'test.side', function (err) {
  if (err) return console.error(err)
  console.log('File saved to test.side.')
})
```

#### `GhostInspector.downloadTestSeleniumJson(testId, dest, [callback])`

Download a single test in Selenium JSON format

```js
// Example using await
try {
  await GhostInspector.downloadTestSeleniumJson('[test-id]', 'test.json')
} catch (err) {
  console.error(err)
}

// Example using a callback
GhostInspector.downloadTestSeleniumJson('[test-id]', 'test.json', function (err) {
  if (err) return console.error(err)
  console.log('File saved to test.json.')
})
```

#### `GhostInspector.getSuiteResult(suiteResultId, [callback])`

Fetch a single suite result.

```js
// Example using await
try {
  const result = await GhostInspector.getSuiteResult('[suite-result-id]')
} catch (err) {
  console.error(err)
}

// Example using a callback
GhostInspector.getSuiteResult('[suite-result-id]', function (err, result) {
  if (err) return console.error(err)
  console.log(result)
})
```

#### `GhostInspector.getSuiteResultTestResults(suiteResultId, [callback])`

Fetch the test results in a single suite result.

```js
// Example using await
try {
  const results = await GhostInspector.getSuiteResultTestResults('[suite-result-id]')
} catch (err) {
  console.error(err)
}

// Example using a callback
GhostInspector.getSuiteResultTestResults('[suite-result-id]', function (err, results) {
  if (err) return console.error(err)
  console.log(results)
})
```

#### `GhostInspector.getSuiteResultXUnit(suiteResultId, [callback])`

Fetch an XML report (XUnit v2) for a single suite result.

```js
// Example using await
try {
  const xml = await GhostInspector.getSuiteResultXUnit('[suite-result-id]')
} catch (err) {
  console.error(err)
}

// Example using a callback
GhostInspector.getSuiteResultXUnit('[suite-result-id]', function (err, xml) {
  if (err) return console.error(err)
  console.log(xml)
})
```

#### `GhostInspector.cancelSuiteResult(suiteResultId, [callback])`

Cancel an in-progress suite result.

```js
// Example using await
try {
  const result = await GhostInspector.cancelSuiteResult('[suite-result-id]')
} catch (err) {
  console.error(err)
}

// Example using a callback
GhostInspector.cancelSuiteResult('[suite-result-id]', function (err, result) {
  if (err) return console.error(err)
  console.log(result)
})
```

#### `GhostInspector.getTestResult(testResultId, [callback])`

Fetch a single test result.

```js
// Example using await
try {
  const result = await GhostInspector.getTestResult('[test-result-id]')
} catch (err) {
  console.error(err)
}

// Example using a callback
GhostInspector.getTestResult('[test-result-id]', function (err, result) {
  if (err) return console.error(err)
  console.log(result)
})
```

#### `GhostInspector.cancelTestResult(testResultId, [callback])`

Cancel an in-progress test result.

```js
// Example using await
try {
  const result = await GhostInspector.cancelTestResult('[test-result-id]')
} catch (err) {
  console.error(err)
}

// Example using a callback
GhostInspector.cancelTestResult('[test-result-id]', function (err, result) {
  if (err) return console.error(err)
  console.log(result)
})
```

#### `GhostInspector.getAllRunningTests(organizationId, [callback])`

Fetch a list of the currently-executing results for the entire organization.

```js
// Example using await
try {
  const result = await GhostInspector.getAllRunningTests('[organization-id]')
} catch (err) {
  console.error(err)
}

// Example using a callback
GhostInspector.getAllRunningTests('[organization-id]', function (err, result) {
  if (err) return console.error(err)
  console.log(result)
})
```

## Contributing

If you've found that a feature is missing or you've found an issue, feel free to open a pull request or [submit an issue](https://github.com/ghost-inspector/node-ghost-inspector/issues).

### Running tests

To run the unit tests:

```
npm run test-unit
```

You can also run the integration tests, however this will run against a Ghost Inspector suite (requires API key):

```
GHOST_INSPECTOR_API_KEY=xxx npm run test-integration
```
