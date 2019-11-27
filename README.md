# Ghost Inspector Node.js Bindings

[![CircleCI](https://circleci.com/gh/ghost-inspector/node-ghost-inspector/tree/master.svg?style=svg)](https://circleci.com/gh/ghost-inspector/node-ghost-inspector/tree/master)

The official Node.js package for interacting with [Ghost Inspector's API](https://ghostinspector.com/docs/api/).


## Installing with [npm](https://www.npmjs.com/)

`npm install ghost-inspector`


## Usage

Every method is accessed via your `GhostInspector` instance. Your API Key is passed in when the instance is created:

```js
const GhostInspector = require('ghost-inspector')('[api-key]');
```

This package supports both callbacks and `await` to receive data back from the method call. Note that when an error is encountered, it will be return as the first argument in the callback. However, if no callback is passed in, it is assumed that `await` is being used and the method will throw an exception. This means that when using `await` you should wrap your calls in a `try/catch` block. 


## Methods

#### GhostInspector.getFolders([callback])
Fetch an array of all the folders in your account.

```js
// Example using await
try {
    const folders = await GhostInspector.getFolders();
} catch (err) {
    console.error(err);
}

// Example using a callback
GhostInspector.getFolders(function (err, folders) {
    if (err) return console.error(err);
    console.log(folders);
});
```

#### GhostInspector.getFolder(folderId, [callback])
Fetch a single folder from your account.

```js
// Example using await
try {
    const folder = await GhostInspector.getFolder('[folder-id]');
} catch (err) {
    console.error(err);
}

// Example using a callback
GhostInspector.getFolder('[folder-id]', function (err, folder) {
    if (err) return console.error(err);
    console.log(folder);
});
```

#### GhostInspector.getFolderSuites(folderId, [callback])
Fetch an array of all the suites in a folder.

```js
// Example using await
try {
    const suites = await GhostInspector.getFolderSuites('[folder-id]');
} catch (err) {
    console.error(err);
}

// Example using a callback
GhostInspector.getFolderSuites('[folder-id]', function (err, suites) {
    if (err) return console.error(err);
    console.log(suites);
});
```

#### GhostInspector.getSuites([callback])
Fetch an array of all the suites in your account.

```js
// Example using await
try {
    const suites = await GhostInspector.getSuites();
} catch (err) {
    console.error(err);
}

// Example using a callback
GhostInspector.getSuites(function (err, suites) {
    if (err) return console.error(err);
    console.log(suites);
});
```

#### GhostInspector.getSuite(suiteId, [callback])
Fetch a single suite from your account.

```js
// Example using await
try {
    const suite = await GhostInspector.getSuite('[suite-id]');
} catch (err) {
    console.error(err);
}

// Example using a callback
GhostInspector.getSuite('[suite-id]', function (err, suite) {
    if (err) return console.error(err);
    console.log(suite);
});
```

#### GhostInspector.getSuiteTests(suiteId, [callback])
Fetch an array of all the tests in a suite.

```js
// Example using await
try {
    const tests = await GhostInspector.getSuiteTests('[suite-id]');
} catch (err) {
    console.error(err);
}

// Example using a callback
GhostInspector.getSuiteTests('[suite-id]', function (err, tests) {
    if (err) return console.error(err);
    console.log(tests);
});
```

#### GhostInspector.getSuiteResults(suiteId, [options], [callback])
Fetch an array of suite results for a suite.

```js
const options = {
    count: 10,
    offset: 0
};

// Example using await
try {
    const results = await GhostInspector.getSuiteResults('[suite-id]', options);
} catch (err) {
    console.error(err);
}

// Example using a callback
GhostInspector.getSuiteResults('[suite-id]', options, function (err, results) {
    if (err) return console.error(err);
    console.log(results);
});
```

#### GhostInspector.executeSuite(suiteId, [options], [callback])
Execute all the tests in a suite and returns an array of results.

```js
// Optionally override the start URL of all tests in this suite (for this run only) 
const options = {
    startUrl: 'http://alternate.yourcompany.com'
};

// Example using await
try {
    const [results, passing] = await GhostInspector.executeSuite('[suite-id]', options);
} catch (err) {
    console.error(err);
}

// Example using a callback
GhostInspector.executeSuite('[suite-id]', options, function (err, results, passing) {
    if (err) return console.error(err);
    console.log(passing === true ? 'Passed' : 'Failed');
    console.log(results);
});
```

#### GhostInspector.downloadSuiteSeleniumHtml(suiteId, dest, [callback])
Download a zip file of all tests in this suite in Selenium IDE .html format

```js
// Example using await
try {
    await GhostInspector.downloadSuiteSeleniumHtml('[suite-id]', 'suite.zip');
} catch (err) {
    console.error(err);
}

// Example using a callback
GhostInspector.downloadSuiteSeleniumHtml('[suite-id]', 'suite.zip', function (err) {
    if (err) return console.error(err);
    console.log('File saved to suite.zip.');
});
```

#### GhostInspector.downloadSuiteSeleniumSide(suiteId, dest, [callback])
Download a file of all tests in this suite in Selenium IDE .side format

```js
// Example using await
try {
    await GhostInspector.downloadSuiteSeleniumSide('[suite-id]', 'suite.side');
} catch (err) {
    console.error(err);
}

// Example using a callback
GhostInspector.downloadSuiteSeleniumSide('[suite-id]', 'suite.side', function (err) {
    if (err) return console.error(err);
    console.log('File saved to suite.side.');
});
```

#### GhostInspector.downloadSuiteSeleniumJson(suiteId, dest, [callback])
Download a zip file of all tests in this suite in Selenium JSON format

```js
// Example using await
try {
    await GhostInspector.downloadSuiteSeleniumJson('[suite-id]', 'suite.zip');
} catch (err) {
    console.error(err);
}

// Example using a callback
GhostInspector.downloadSuiteSeleniumJson('[suite-id]', 'suite.zip', function (err) {
    if (err) return console.error(err);
    console.log('File saved to suite.zip.');
});
```

#### GhostInspector.getTests([callback])
Fetch an array of all the tests in your account.

```js
// Example using await
try {
    const tests = await GhostInspector.getTests();
} catch (err) {
    console.error(err);
}

// Example using a callback
GhostInspector.getTests(function (err, tests) {
    if (err) return console.error(err);
    console.log(tests);
});
```

#### GhostInspector.getTest(testId, [callback])
Fetch a single test from your account.

```js
// Example using await
try {
    const test = await GhostInspector.getTest('[test-id]');
} catch (err) {
    console.error(err);
}

// Example using a callback
GhostInspector.getTest('[test-id]', function (err, test) {
    if (err) return console.error(err);
    console.log(test);
});
```

#### GhostInspector.getTestResults(testId, [options], [callback])
Fetch an array of test results for a test.

```js
const options = {
    count: 10,
    offset: 0
};

// Example using await
try {
    const results = await GhostInspector.getTestResults('[test-id]', options);
} catch (err) {
    console.error(err);
}

// Example using a callback
GhostInspector.getTestResults('[test-id]', options, function (err, results) {
    if (err) return console.error(err);
    console.log(results);
});
```

#### GhostInspector.getTestResultsRunning(testId, [callback])
Fetch an array of test results that are in progress for a test.

```js
// Example using await
try {
    const results = await GhostInspector.getTestResultsRunning('[test-id]');
} catch (err) {
    console.error(err);
}

// Example using a callback
GhostInspector.getTestResultsRunning('[test-id]', function (err, results) {
    if (err) return console.error(err);
    console.log(results);
});
```

#### GhostInspector.acceptTestScreenshot(testId, [callback])
Accept the current screenshot as the new baseline for a test. (Note: _This method will throw/return an error if the test's screenshot is already passing, or if screenshot comparison is disabled._)

```js
// Example using await
try {
    const test = await GhostInspector.acceptTestScreenshot('[test-id]');
} catch (err) {
    console.error(err);
}

// Example using a callback
GhostInspector.acceptTestScreenshot('[test-id]', function (err, test) {
    if (err) return console.error(err);
    console.log(test);
});
```

#### GhostInspector.duplicateTest(testId, [callback])
Create a duplicate copy of a test.

```js
// Example using await
try {
    const newTest = await GhostInspector.duplicateTest('[test-id]');
} catch (err) {
    console.error(err);
}

// Example using a callback
GhostInspector.duplicateTest('[test-id]', function (err, newTest) {
    if (err) return console.error(err);
    console.log(newTest);
});
```

#### GhostInspector.executeTest(testId, [options], [callback])
Execute a single test in your account and return the result.

```js
// Optionally override the start URL of the test (for this run only) 
const options = {
    startUrl: 'http://alternate.yourcompany.com'
};

// Example using await
try {
    const [results, passing] = await GhostInspector.executeTest('[test-id]', options);
} catch (err) {
    console.error(err);
}

// Example using a callback
GhostInspector.executeTest('[test-id]', options, function (err, results, passing) {
    if (err) return console.error(err);
    console.log(passing === true ? 'Passed' : 'Failed');
    console.log(results);
});
```

#### GhostInspector.executeTestOnDemand(organizationId, test, [options], [callback])
Execute an on-demand test against your organization.

```js
const myTest = require('./my-test.json');

// wait for the result to finish execution before returning
const options = {
  wait: true
};

// example using await
try {
  const result = await GhostInspector.executeTestOnDemand('[organization-id]', myTest, options);
} catch (err) {
  console.error(err);
}

// Example using a callback
GhostInspector.executeTestOnDemand('[organization-id]', myTest, options, function (err, result) {
  if (err) return console.error(err);
  console.log(`Passing: ${result.passing}`);
});
```

#### GhostInspector.downloadTestSeleniumHtml(testId, dest, [callback])
Download a single test in Selenium IDE .html format

```js
// Example using await
try {
    await GhostInspector.downloadTestSeleniumHtml('[test-id]', 'test.html');
} catch (err) {
    console.error(err);
}

// Example using a callback
GhostInspector.downloadTestSeleniumHtml('[test-id]', 'test.html', function (err) {
    if (err) return console.error(err);
    console.log('File saved to test.html.');
});
```

#### GhostInspector.downloadTestSeleniumSide(testId, dest, [callback])
Download a single test in Selenium IDE .side format

```js
// Example using await
try {
    await GhostInspector.downloadTestSeleniumSide('[test-id]', 'test.side');
} catch (err) {
    console.error(err);
}

// Example using a callback
GhostInspector.downloadTestSeleniumSide('[test-id]', 'test.side', function (err) {
    if (err) return console.error(err);
    console.log('File saved to test.side.');
});
```

#### GhostInspector.downloadTestSeleniumJson(testId, dest, [callback])
Download a single test in Selenium JSON format

```js
// Example using await
try {
    await GhostInspector.downloadTestSeleniumJson('[test-id]', 'test.json');
} catch (err) {
    console.error(err);
}

// Example using a callback
GhostInspector.downloadTestSeleniumJson('[test-id]', 'test.json', function (err) {
    if (err) return console.error(err);
    console.log('File saved to test.json.');
});
```

#### GhostInspector.getSuiteResult(suiteResultId, [callback])
Fetch a single suite result.

```js
// Example using await
try {
    const result = await GhostInspector.getSuiteResult('[suite-result-id]');
} catch (err) {
    console.error(err);
}

// Example using a callback
GhostInspector.getSuiteResult('[suite-result-id]', function (err, result) {
    if (err) return console.error(err);
    console.log(result);
});
```

#### GhostInspector.getSuiteResultTestResults(suiteResultId, [callback])
Fetch the test results in a single suite result.

```js
// Example using await
try {
    const results = await GhostInspector.getSuiteResultTestResults('[suite-result-id]');
} catch (err) {
    console.error(err);
}

// Example using a callback
GhostInspector.getSuiteResultTestResults('[suite-result-id]', function (err, results) {
    if (err) return console.error(err);
    console.log(results);
});
```

#### GhostInspector.getSuiteResultXUnit(suiteResultId, [callback])
Fetch an XML report (XUnit v2) for a single suite result.

```js
// Example using await
try {
    const xml = await GhostInspector.getSuiteResultXUnit('[suite-result-id]');
} catch (err) {
    console.error(err);
}

// Example using a callback
GhostInspector.getSuiteResultXUnit('[suite-result-id]', function (err, xml) {
    if (err) return console.error(err);
    console.log(xml);
});
```

#### GhostInspector.cancelSuiteResult(suiteResultId, [callback])
Cancel an in-progress suite result.

```js
// Example using await
try {
    const result = await GhostInspector.cancelSuiteResult('[suite-result-id]');
} catch (err) {
    console.error(err);
}

// Example using a callback
GhostInspector.cancelSuiteResult('[suite-result-id]', function (err, result) {
    if (err) return console.error(err);
    console.log(result);
});
```

#### GhostInspector.getTestResult(testResultId, [callback])
Fetch a single test result.

```js
// Example using await
try {
    const result = await GhostInspector.getTestResult('[test-result-id]');
} catch (err) {
    console.error(err);
}

// Example using a callback
GhostInspector.getTestResult('[test-result-id]', function (err, result) {
    if (err) return console.error(err);
    console.log(result);
});
```

#### GhostInspector.cancelTestResult(testResultId, [callback])
Cancel an in-progress test result.

```js
// Example using await
try {
    const result = await GhostInspector.cancelTestResult('[test-result-id]');
} catch (err) {
    console.error(err);
}

// Example using a callback
GhostInspector.cancelTestResult('[test-result-id]', function (err, result) {
    if (err) return console.error(err);
    console.log(result);
});
```
