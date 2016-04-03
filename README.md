# Ghost Inspector Node.js Bindings

[![Circle CI](https://circleci.com/gh/ghost-inspector/node-ghost-inspector.svg?style=svg)](https://circleci.com/gh/ghost-inspector/node-ghost-inspector)

Node.js module for interacting with [Ghost Inspector's API](https://ghostinspector.com/api/).

## Installing with [npm](http://npmjs.org/)

`npm install ghost-inspector`

## Usage

Every method is accessed via your `GhostInspector` instance. Your API Key is passed in when the instance is created:

```js
var GhostInspector = require('ghost-inspector')('[api-key]');
```

#### getSuites([callback])
Fetch an array of all the suites in your account.

```js
GhostInspector.getSuites(function(err, suites){
    if(err) return console.log('Error: ' + err);
    console.log(suites);
});
```

#### getSuite(suiteId, [callback])
Fetch a single suite from your account.

```js
GhostInspector.getSuite('[suite-id]', function(err, suite){
    if(err) return console.log('Error: ' + err);
    console.log(suite);
});
```

#### getSuiteTests(suiteId, [callback])
Fetch an array of all the tests in a suite.

```js
GhostInspector.getSuiteTests('[suite-id]', function(err, tests){
    if(err) return console.log('Error: ' + err);
    console.log(tests);
});
```

#### executeSuite(suiteId, [options], [callback])
Execute all the tests in a suite and returns an array of results.

```js
// Optionally override the start URL of all tests in this suite (for this run only) 
var options = {
    startUrl: 'http://alternate.yourcompany.com'
};

GhostInspector.executeSuite('[suite-id]', options, function(err, results, passing){
    if(err) return console.log('Error: ' + err);
    console.log(passing === true ? 'Passed' : 'Failed');
    console.log(results);
});
```

#### downloadSuiteSeleniumHtml(suiteId, dest, [callback])
Download a zip file of all tests in Selenium HTML format

```js
GhostInspector.downloadSuiteSeleniumHtml('[suite-id]', 'suite.zip', function(err){
    if(err) return console.log('Error: ' + err);
    console.log('File saved to suite.zip.');
});
```

#### getTests([callback])
Fetch an array of all the tests in your account.

```js
GhostInspector.getTests(function(err, tests){
    if(err) return console.log('Error: ' + err);
    console.log(tests);
});
```

#### getTest(testId, [callback])
Fetch a single test from your account.

```js
GhostInspector.getTest('[test-id]', function(err, test){
    if(err) return console.log('Error: ' + err);
    console.log(test);
});
```

#### getTestResults(testId, [options], [callback])
Fetch an array of results for a test.

```js
var options = {
    count: 10,
    offset: 0
};

GhostInspector.getTestResults('[test-id]', options, function(err, results){
    if(err) return console.log('Error: ' + err);
    console.log(results);
});
```

#### executeTest(testId, [options], [callback])
Execute a single test in your account and return the result.

```js
// Optionally override the start URL of the test (for this run only) 
var options = {
    startUrl: 'http://alternate.yourcompany.com'
};

GhostInspector.executeTest('[test-id]', options, function(err, results, passing){
    if(err) return console.log('Error: ' + err);
    console.log(passing === true ? 'Passed' : 'Failed');
    console.log(results);
});
```

#### downloadTestSeleniumHtml(testId, dest, [callback])
Download a single test in Selenium HTML format

```js
GhostInspector.downloadTestSeleniumHtml('[test-id]', 'test.html', function(err){
    if(err) return console.log('Error: ' + err);
    console.log('File saved to test.html.');
});
```

#### getResult(resultId, [callback])
Fetch a single test result.

```js
GhostInspector.getResult('[result-id]', function(err, result){
    if(err) return console.log('Error: ' + err);
    console.log(result);
});
```
