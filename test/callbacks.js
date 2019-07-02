// The API key and IDs used in this file belong to the official Ghost Inspector API testing account.
const assert = require('assert').strict
const fs = require('fs')
const GhostInspector = require('../index')('ff586dcaaa9b781163dbae48a230ea1947f894ff')

let suiteResultId, testResultId

describe('Callback: Get suites', function () {
  this.timeout(0)
  it('should return 1 suite', (done) => {
    GhostInspector.getSuites((err, data) => {
      assert.ok(err === null)
      assert.ok(data.length === 1)
      done()
    })
  })
})

describe('Callback: Get suite', function () {
  this.timeout(0)
  it('should return a suite named "Test Suite"', (done) => {
    GhostInspector.getSuite('53cf58c0350c6c41029a11be', (err, data) => {
      assert.ok(err === null)
      assert.ok(data.name === 'Test Suite')
      done()
    })
  })
})

describe('Callback: Get suite tests', function () {
  this.timeout(0)
  it('should return 2 tests in the suite', (done) => {
    GhostInspector.getSuiteTests('53cf58c0350c6c41029a11be', (err, data) => {
      assert.ok(err === null)
      assert.ok(data.length === 2)
      done()
    })
  })
})

describe('Callback: Execute suite ', function () {
  this.timeout(0)
  it('should return 2 results and a passing status', (done) => {
    GhostInspector.executeSuite('53cf58c0350c6c41029a11be', (err, data, passing) => {
      assert.ok(err === null)
      assert.ok(data.length === 2)
      assert.ok(passing === true)
      done()
    })
  })
})

describe('Callback: Execute suite with immediate response ', function () {
  this.timeout(0)
  it('should return success with a pending suite result and null passing value', (done) => {
    GhostInspector.executeSuite('53cf58c0350c6c41029a11be', { immediate: true }, (err, data, passing) => {
      assert.ok(err === null)
      assert.ok(data.suite === '53cf58c0350c6c41029a11be')
      assert.ok(data.name === 'Test Suite')
      assert.ok(data.passing === null)
      assert.ok(passing === null)
      suiteResultId = data._id
      done()
    })
  })
})

describe('Callback: Get suite results', function () {
  this.timeout(0)
  it('should return 1 suite result with a suite name of "Test Suite"', (done) => {
    GhostInspector.getSuiteResults('53cf58c0350c6c41029a11be', { 'count': 1 }, (err, data) => {
      assert.ok(err === null)
      assert.ok(data.length === 1)
      assert.ok(data[0].name === 'Test Suite')
      done()
    })
  })
})

describe('Callback: Download suite in (zipped) Selenium HTML format', function () {
  this.timeout(0)
  const dest = '/tmp/suite-html.zip'
  it('should return a zip file', (done) => {
    GhostInspector.downloadSuiteSeleniumHtml('53cf58c0350c6c41029a11be', dest, (err) => {
      assert.ok(err === null)
      assert.ok(fs.existsSync(dest))
      fs.unlinkSync(dest)
      done()
    })
  })
})

describe('Callback: Download suite in (zipped) Selenium JSON format', function () {
  this.timeout(0)
  const dest = '/tmp/suite-json.zip'
  it('should return a zip file', (done) => {
    GhostInspector.downloadSuiteSeleniumJson('53cf58c0350c6c41029a11be', dest, (err) => {
      assert.ok(err === null)
      assert.ok(fs.existsSync(dest))
      fs.unlinkSync(dest)
      done()
    })
  })
})

describe('Callback: Get tests', function () {
  this.timeout(0)
  it('should return 2 tests', (done) => {
    GhostInspector.getTests((err, data) => {
      assert.ok(err === null)
      assert.ok(data.length === 2)
      done()
    })
  })
})

describe('Callback: Get test', function () {
  this.timeout(0)
  it('should return a test named "Google"', (done) => {
    GhostInspector.getTest('53cf58fc350c6c41029a11bf', (err, data) => {
      assert.ok(err === null)
      assert.ok(data.name === 'Google')
      done()
    })
  })
})

describe('Callback: Get test results', function () {
  this.timeout(0)
  it('should return at least 1 result with a test name of "Google"', (done) => {
    GhostInspector.getTestResults('53cf58fc350c6c41029a11bf', (err, data) => {
      assert.ok(err === null)
      assert.ok(data[0].test.name === 'Google')
      done()
    })
  })
})

describe('Callback: Get test results with options', function () {
  this.timeout(0)
  it('should return 1 result', (done) => {
    GhostInspector.getTestResults('53cf58fc350c6c41029a11bf', { 'count': 1 }, (err, data) => {
      assert.ok(err === null)
      assert.ok(data.length === 1)
      done()
    })
  })
})

describe('Callback: Execute test ', function () {
  this.timeout(0)
  it('should return a test name of "Google" and a passing status', (done) => {
    GhostInspector.executeTest('53cf58fc350c6c41029a11bf', (err, data, passing) => {
      assert.ok(err === null)
      assert.ok(data.test.name === 'Google')
      assert.ok(passing === true)
      done()
    })
  })
})

describe('Callback: Execute test overriding start URL ', function () {
  this.timeout(0)
  it('should return a start URL of "https://www.google.com.br"', (done) => {
    GhostInspector.executeTest('53cf58fc350c6c41029a11bf', { startUrl: 'https://www.google.com.br' }, (err, data, passing) => {
      assert.ok(err === null)
      assert.ok(data.startUrl === 'https://www.google.com.br')
      assert.ok(passing === true)
      done()
    })
  })
})

describe('Callback: Execute test with CSV file ', function () {
  this.timeout(0)
  it('should return a single result in an array with the "foo" value from the CSV used in step #2', (done) => {
    GhostInspector.executeTest('53cf58fc350c6c41029a11bf', { dataFile: `${__dirname}/sample.csv` }, (err, data, passing) => {
      assert.ok(err === null)
      assert.strictEqual(data[0].steps[1].value, 'foo')
      assert.ok(passing === true)
      done()
    })
  })
})

describe('Callback: Execute test with immediate response ', function () {
  this.timeout(0)
  it('should return success with a pending result and null passing value', (done) => {
    GhostInspector.executeTest('53cf58fc350c6c41029a11bf', { immediate: true }, (err, data, passing) => {
      assert.ok(err === null)
      assert.ok(data.test === '53cf58fc350c6c41029a11bf')
      assert.ok(data.name === 'Google')
      assert.ok(data.passing === null)
      assert.ok(passing === null)
      testResultId = data._id
      done()
    })
  })
})

describe('Callback: Download test in Selenium HTML format', function () {
  this.timeout(0)
  const dest = '/tmp/test.html'
  it('should return an HTML document', (done) => {
    GhostInspector.downloadTestSeleniumHtml('53cf58fc350c6c41029a11bf', dest, (err) => {
      assert.ok(err === null)
      assert.ok(fs.existsSync(dest))
      const data = fs.readFileSync(dest)
      assert.ok(data.toString().includes('<title>Google</title>'))
      fs.unlinkSync(dest)
      done()
    })
  })
})

describe('Callback: Download test in Selenium JSON format', function () {
  this.timeout(0)
  const dest = '/tmp/test.json'
  it('should return an HTML document', (done) => {
    GhostInspector.downloadTestSeleniumJson('53cf58fc350c6c41029a11bf', dest, (err) => {
      assert.ok(err === null)
      assert.ok(fs.existsSync(dest))
      const data = fs.readFileSync(dest)
      assert.ok(data.toString().includes('Google'))
      fs.unlinkSync(dest)
      done()
    })
  })
})

describe('Callback: Get suite result ', function () {
  this.timeout(0)
  it('should return a suite result that was triggered above', (done) => {
    GhostInspector.getSuiteResult(suiteResultId, (err, data) => {
      assert.ok(err === null)
      assert.ok(data.name === 'Test Suite')
      done()
    })
  })
})

describe('Callback: Get suite result test result listing', function () {
  this.timeout(0)
  it('should return a list of test results for the suite result', (done) => {
    GhostInspector.getSuiteResultTestResults(suiteResultId, (err, data) => {
      assert.ok(err === null)
      assert.ok(data.length === 2)
      done()
    })
  })
})

describe('Callback: Cancel suite result ', function () {
  this.timeout(0)
  it('should return a suite result that was triggered above', (done) => {
    GhostInspector.cancelSuiteResult(suiteResultId, (err, data) => {
      assert.ok(err === null)
      assert.ok(data.name === 'Test Suite')
      done()
    })
  })
})

describe('Callback: Get test result ', function () {
  this.timeout(0)
  it('should return a test result that was triggered above', (done) => {
    GhostInspector.getResult(testResultId, (err, data) => {
      assert.ok(err === null)
      assert.ok(data.name === 'Google')
      done()
    })
  })
})

describe('Callback: Cancel test result ', function () {
  this.timeout(0)
  it('should return a test result that was triggered above', (done) => {
    GhostInspector.cancelResult(testResultId, (err, data) => {
      assert.ok(err === null)
      assert.ok(data.name === 'Google')
      done()
    })
  })
})
