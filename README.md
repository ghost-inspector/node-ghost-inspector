# Ghost Inspector Node.js Bindings

[![Build Status](https://travis-ci.org/ghost-inspector/node-ghost-inspector.png)](https://travis-ci.org/ghost-inspector/node-ghost-inspector)

Node.js module for interacting with [Ghost Inspector's API](https://ghostinspector.com/api/).

## Installing with [npm](http://npmjs.org/)

    $ npm install ghost-inspector

## Usage

Every method is accessed via your `GhostInspector` instance. Your User ID and API Key is passed in when the instance is created:

    var GhostInspector = require('ghost-inspector')('[user-id]', '[api-key]');

#### getSuites([callback])
Fetch an array of all the suites in your account.

    GhostInspector.getSuites(function(err, suites){
        if(err) return console.log('Error: ' + err);
        console.log(suites);
    });

#### getSuite(suiteId, [callback])
Fetch a single suite from your account.

    GhostInspector.getSuite('[suite-id]', function(err, suite){
        if(err) return console.log('Error: ' + err);
        console.log(suite);
    });

#### getSuiteTests(suiteId, [callback])
Fetch an array of all the tests in a suite.

    GhostInspector.getSuiteTests('[suite-id]', function(err, tests){
        if(err) return console.log('Error: ' + err);
        console.log(tests);
    });

#### executeSuite(suiteId, [callback])
Execute all the tests in a suite and returns an array of results.

    GhostInspector.executeSuite('[suite-id]', function(err, results, passing){
        if(err) return console.log('Error: ' + err);
        console.log(passing === true ? 'Passed' : 'Failed');
        console.log(results);
    });

#### getTests([callback])
Fetch an array of all the tests in your account.

    GhostInspector.getTests(function(err, tests){
        if(err) return console.log('Error: ' + err);
        console.log(tests);
    });

#### getTest(testId, [callback])
Fetch a single test from your account.

    GhostInspector.getTest('[test-id]', function(err, test){
        if(err) return console.log('Error: ' + err);
        console.log(test);
    });

#### getTestResults(testId, [callback])
Fetch an array of all the results for a test.

    GhostInspector.getTestResults('[test-id]', function(err, results){
        if(err) return console.log('Error: ' + err);
        console.log(results);
    });

#### executeTest(testId, [callback])
Execute a single test in your account and return the result.

    GhostInspector.executeTest('[test-id]', function(err, results, passing){
        if(err) return console.log('Error: ' + err);
        console.log(passing === true ? 'Passed' : 'Failed');
        console.log(results);
    });

#### getResult(resultId, [callback])
Fetch a single test result.

    GhostInspector.getResult('[result-id]', function(err, result){
        if(err) return console.log('Error: ' + err);
        console.log(result);
    });