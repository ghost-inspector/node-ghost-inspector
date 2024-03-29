// The API key and IDs used in this file belong to the official Ghost Inspector API testing account.
const assert = require('assert')
const fs = require('fs')
const path = require('path')
const GhostInspector = require('../../index')(process.env.GHOST_INSPECTOR_API_KEY)

let suiteResultId, testResultId

describe('Callback: Get folders', function () {
  this.timeout(0)
  it('should return 1 folder', (done) => {
    GhostInspector.getFolders((err, data) => {
      assert.strictEqual(err, null)
      assert.strictEqual(data.length, 1)
      done()
    })
  })
})

describe('Callback: Get folder', function () {
  this.timeout(0)
  it('should return a folder named "Test Folder"', (done) => {
    GhostInspector.getFolder('5d1bf45df12d703f463820a5', (err, data) => {
      assert.strictEqual(err, null)
      assert.strictEqual(data.name, 'Test Folder')
      done()
    })
  })
})

describe('Callback: Get folder suites', function () {
  this.timeout(0)
  it('should return 1 suite in the folder', (done) => {
    GhostInspector.getFolderSuites('5d1bf45df12d703f463820a5', (err, data) => {
      assert.strictEqual(err, null)
      assert.strictEqual(data.length, 1)
      done()
    })
  })
})

describe('Callback: Get suites', function () {
  this.timeout(0)
  it('should return suites', (done) => {
    GhostInspector.getSuites((err, data) => {
      assert.strictEqual(err, null)
      assert.strictEqual(data.length, 3)
      done()
    })
  })
})

describe('Callback: Get suite', function () {
  this.timeout(0)
  it('should return a suite named "Test Suite"', (done) => {
    GhostInspector.getSuite('53cf58c0350c6c41029a11be', (err, data) => {
      assert.strictEqual(err, null)
      assert.strictEqual(data.name, 'Test Suite')
      done()
    })
  })
})

describe('Callback: Get suite tests', function () {
  this.timeout(0)
  it('should return 2 tests in the suite', (done) => {
    GhostInspector.getSuiteTests('53cf58c0350c6c41029a11be', (err, data) => {
      assert.strictEqual(err, null)
      assert.strictEqual(data.length, 2)
      done()
    })
  })
})

describe('Callback: Execute suite ', function () {
  this.timeout(0)
  it('should return 2 results and a passing status', (done) => {
    GhostInspector.executeSuite('53cf58c0350c6c41029a11be', (err, data, passing) => {
      assert.strictEqual(err, null)
      assert.strictEqual(data.length, 2)
      assert.strictEqual(passing, true)
      done()
    })
  })
})

describe('Callback: Execute suite with immediate response ', function () {
  this.timeout(0)
  it('should return success with a pending suite result and null passing value', (done) => {
    GhostInspector.executeSuite(
      '53cf58c0350c6c41029a11be',
      { immediate: true },
      (err, data, passing) => {
        assert.strictEqual(err, null)
        assert.strictEqual(data.suite, '53cf58c0350c6c41029a11be')
        assert.strictEqual(data.name, 'Test Suite')
        assert.strictEqual(data.passing, null)
        assert.strictEqual(passing, null)
        suiteResultId = data._id
        done()
      },
    )
  })
})

describe('Callback: Get suite results', function () {
  this.timeout(0)
  it('should return 1 suite result with a suite name of "Test Suite"', (done) => {
    GhostInspector.getSuiteResults('53cf58c0350c6c41029a11be', { count: 1 }, (err, data) => {
      assert.strictEqual(err, null)
      assert.strictEqual(data.length, 1)
      assert.ok(data[0].name === 'Test Suite')
      done()
    })
  })
})

describe('Callback: Download suite in (zipped) Selenium HTML format', function () {
  this.timeout(0)
  const dest = '/tmp/suite-html.zip'
  it('should save a zip file', (done) => {
    GhostInspector.downloadSuiteSeleniumHtml('53cf58c0350c6c41029a11be', dest, (err) => {
      assert.strictEqual(err, null)
      assert.ok(fs.existsSync(dest))
      fs.unlinkSync(dest)
      done()
    })
  })
})

describe('Callback: Download suite in Selenium .side format', function () {
  this.timeout(0)
  const dest = '/tmp/suite.side'
  it('should save a .side file', (done) => {
    GhostInspector.downloadSuiteSeleniumSide('53cf58c0350c6c41029a11be', dest, (err) => {
      assert.strictEqual(err, null)
      assert.ok(fs.existsSync(dest))
      fs.unlinkSync(dest)
      done()
    })
  })
})

describe('Callback: Download suite in (zipped) Selenium JSON format', function () {
  this.timeout(0)
  const dest = '/tmp/suite-json.zip'
  it('should save a zip file', (done) => {
    GhostInspector.downloadSuiteSeleniumJson('53cf58c0350c6c41029a11be', dest, (err) => {
      assert.strictEqual(err, null)
      assert.ok(fs.existsSync(dest))
      fs.unlinkSync(dest)
      done()
    })
  })
})

describe('Callback: Download suite in (zipped) Ghost Inspector JSON format', function () {
  this.timeout(0)
  const dest = '/tmp/suite-json.zip'
  it('should save a zip file', (done) => {
    GhostInspector.downloadSuiteJson('53cf58c0350c6c41029a11be', dest, (err) => {
      assert.strictEqual(err, null)
      assert.ok(fs.existsSync(dest))
      fs.unlinkSync(dest)
      done()
    })
  })
})

describe('Callback: Get tests', function () {
  this.timeout(0)
  it('should return tests', (done) => {
    GhostInspector.getTests((err, data) => {
      assert.strictEqual(err, null)
      assert.ok(data.length > 0)
      done()
    })
  })
})

describe('Callback: Get test', function () {
  this.timeout(0)
  it('should return a test named "Google"', (done) => {
    GhostInspector.getTest('53cf58fc350c6c41029a11bf', (err, data) => {
      assert.strictEqual(err, null)
      assert.strictEqual(data.name, 'Google')
      done()
    })
  })
})

describe('Callback: Get test results', function () {
  this.timeout(0)
  it('should return at least 1 result with a test name of "Google"', (done) => {
    GhostInspector.getTestResults('53cf58fc350c6c41029a11bf', (err, data) => {
      assert.strictEqual(err, null)
      assert.strictEqual(data[0].test.name, 'Google')
      done()
    })
  })
})

describe('Callback: Get test results with options', function () {
  this.timeout(0)
  it('should return 1 result', (done) => {
    GhostInspector.getTestResults('53cf58fc350c6c41029a11bf', { count: 1 }, (err, data) => {
      assert.strictEqual(err, null)
      assert.strictEqual(data.length, 1)
      done()
    })
  })
})

describe('Callback: Execute test ', function () {
  this.timeout(0)
  it('should return a test name of "Google" and a passing status', (done) => {
    GhostInspector.executeTest('53cf58fc350c6c41029a11bf', (err, data, passing) => {
      assert.strictEqual(err, null)
      assert.strictEqual(data.test.name, 'Google')
      assert.strictEqual(passing, true)
      done()
    })
  })
})

describe('Callback: Execute test overriding start URL ', function () {
  this.timeout(0)
  it('should return a start URL of "https://www.google.com.br"', (done) => {
    GhostInspector.executeTest(
      '53cf58fc350c6c41029a11bf',
      { startUrl: 'https://www.google.com.br' },
      (err, data, passing) => {
        assert.strictEqual(err, null)
        assert.strictEqual(data.startUrl, 'https://www.google.com.br')
        assert.strictEqual(passing, true)
        done()
      },
    )
  })
})

describe('Callback: Execute test with CSV file ', function () {
  this.timeout(0)
  it('should return a single result in an array with the "foo" value from the CSV used in step #2', (done) => {
    GhostInspector.executeTest(
      '53cf58fc350c6c41029a11bf',
      { dataFile: path.join(__dirname, 'sample.csv') },
      (err, data, passing) => {
        assert.strictEqual(err, null)
        assert.strictEqual(data[0].steps[1].value, 'foo')
        assert.strictEqual(passing, true)
        done()
      },
    )
  })
})

describe('Callback: Execute test with immediate response ', function () {
  this.timeout(0)
  it('should return success with a pending result and null passing value', (done) => {
    GhostInspector.executeTest(
      '53cf58fc350c6c41029a11bf',
      { immediate: true },
      (err, data, passing) => {
        assert.strictEqual(err, null)
        assert.strictEqual(data.test._id, '53cf58fc350c6c41029a11bf')
        assert.strictEqual(data.test.name, 'Google')
        assert.strictEqual(data.test.organization, '547fc38c404e81ff79292e53')
        assert.strictEqual(data.test.suite, '53cf58c0350c6c41029a11be')
        assert.deepStrictEqual(Object.keys(data.test), ['_id', 'name', 'organization', 'suite'])
        assert.strictEqual(data.name, 'Google')
        assert.strictEqual(data.passing, null)
        assert.strictEqual(passing, null)
        testResultId = data._id
        done()
      },
    )
  })
})

describe('Callback: Get test results that are in progress', function () {
  this.timeout(0)
  it('should return at least 1 result', (done) => {
    GhostInspector.getTestResultsRunning('53cf58fc350c6c41029a11bf', (err, data) => {
      assert.strictEqual(err, null)
      assert.ok(data.length >= 1)
      done()
    })
  })
})

describe('Callback: Accept screenshot for a test', function () {
  this.timeout(0)
  it('should fail with error because screenshot comparison is not enabled', (done) => {
    GhostInspector.acceptTestScreenshot('53cf58fc350c6c41029a11bf', (err, data) => {
      assert.ok(err.message.includes('Unable to accept screenshot'))
      done()
    })
  })
})

describe('Callback: Download test in Selenium HTML format', function () {
  this.timeout(0)
  const dest = '/tmp/test.html'
  it('should save an HTML file', (done) => {
    GhostInspector.downloadTestSeleniumHtml('53cf58fc350c6c41029a11bf', dest, (err) => {
      assert.strictEqual(err, null)
      assert.ok(fs.existsSync(dest))
      const data = fs.readFileSync(dest)
      assert.ok(data.toString().includes('<title>Google</title>'))
      fs.unlinkSync(dest)
      done()
    })
  })
})

describe('Callback: Download test in Selenium .side format', function () {
  this.timeout(0)
  const dest = '/tmp/test.side'
  it('should save a .side file', (done) => {
    GhostInspector.downloadTestSeleniumSide('53cf58fc350c6c41029a11bf', dest, (err) => {
      assert.strictEqual(err, null)
      assert.ok(fs.existsSync(dest))
      const data = fs.readFileSync(dest)
      assert.ok(data.toString().includes('Google'))
      fs.unlinkSync(dest)
      done()
    })
  })
})

describe('Callback: Download test in Selenium JSON format', function () {
  this.timeout(0)
  const dest = '/tmp/test.json'
  it('should save a JSON file', (done) => {
    GhostInspector.downloadTestSeleniumJson('53cf58fc350c6c41029a11bf', dest, (err) => {
      assert.strictEqual(err, null)
      assert.ok(fs.existsSync(dest))
      const data = fs.readFileSync(dest)
      assert.ok(data.toString().includes('Google'))
      fs.unlinkSync(dest)
      done()
    })
  })
})

describe('Callback: Download test in Ghost Inspector JSON format', function () {
  this.timeout(0)
  const dest = '/tmp/test.json'
  it('should save a JSON file', (done) => {
    GhostInspector.downloadTestJson('53cf58fc350c6c41029a11bf', dest, (err) => {
      assert.strictEqual(err, null)
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
      assert.strictEqual(err, null)
      assert.strictEqual(data.name, 'Test Suite')
      done()
    })
  })
})

describe('Callback: Get suite result test result listing', function () {
  this.timeout(0)
  it('should return a list of test results for the suite result', (done) => {
    GhostInspector.getSuiteResultTestResults(suiteResultId, (err, data) => {
      assert.strictEqual(err, null)
      assert.strictEqual(data.length, 2)
      done()
    })
  })
})

describe('Callback: Get suite result XUnit report', function () {
  this.timeout(0)
  it('should return XML for the suite result', (done) => {
    GhostInspector.getSuiteResultXUnit(suiteResultId, (err, data) => {
      assert.strictEqual(err, null)
      assert.ok(data.toString().startsWith('<?xml version="1.0" encoding="UTF-8"?>'))
      done()
    })
  })
})

describe('Callback: Cancel suite result ', function () {
  this.timeout(0)
  it('should return a suite result that was triggered above', (done) => {
    GhostInspector.cancelSuiteResult(suiteResultId, (err, data) => {
      assert.strictEqual(err, null)
      assert.strictEqual(data.name, 'Test Suite')
      done()
    })
  })
})

describe('Callback: Get test result ', function () {
  this.timeout(0)
  it('should return a test result that was triggered above', (done) => {
    GhostInspector.getResult(testResultId, (err, data) => {
      assert.strictEqual(err, null)
      assert.strictEqual(data.name, 'Google')
      done()
    })
  })
})

describe('Callback: Cancel test result ', function () {
  this.timeout(0)
  it('should return a test result that was triggered above', (done) => {
    GhostInspector.cancelResult(testResultId, (err, data) => {
      assert.strictEqual(err, null)
      assert.strictEqual(data.name, 'Google')
      done()
    })
  })
})

describe('Callback: Import a test', function () {
  this.timeout(0)
  it('should import a test', function (done) {
    const suiteId = '5de57382bbeff026afe7b025'
    const timestamp = `${+new Date()}`
    const test = require('./test.json')
    test.name = `${test.name}-${timestamp}`
    const result = GhostInspector.importTest(suiteId, test, function (err, data) {
      assert.strictEqual(err, null)
      assert.strictEqual(data.name, test.name)
      done()
    })
  })
})
