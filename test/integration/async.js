// The API key and IDs used in this file belong to the official Ghost Inspector API testing account.
const assert = require('assert')
const fs = require('fs')
const path = require('path')
const GhostInspector = require('../../index')(process.env.GHOST_INSPECTOR_API_KEY)

let suiteResultId, testResultId

describe('Async: Get folders', function () {
  this.timeout(0)
  it('should return 1 folder', async () => {
    const data = await GhostInspector.getFolders()
    assert.strictEqual(data.length, 1)
  })
})

describe('Async: Get folder', function () {
  this.timeout(0)
  it('should return a folder named "Test Folder"', async () => {
    const data = await GhostInspector.getFolder('5d1bf45df12d703f463820a5')
    assert.strictEqual(data.name, 'Test Folder')
  })
})

describe('Async: Get folder suites', function () {
  this.timeout(0)
  it('should return 1 suite in the folder', async () => {
    const data = await GhostInspector.getFolderSuites('5d1bf45df12d703f463820a5')
    assert.strictEqual(data.length, 1)
  })
})

describe('Async: Get suites', function () {
  this.timeout(0)
  it('should return suites', async () => {
    const data = await GhostInspector.getSuites()
    assert.strictEqual(data.length, 2)
  })
})

describe('Async: Get suite', function () {
  this.timeout(0)
  it('should return a suite named "Test Suite"', async () => {
    const data = await GhostInspector.getSuite('53cf58c0350c6c41029a11be')
    assert.strictEqual(data.name, 'Test Suite')
  })
})

describe('Async: Get suite tests', function () {
  this.timeout(0)
  it('should return 2 tests in the suite', async () => {
    const data = await GhostInspector.getSuiteTests('53cf58c0350c6c41029a11be')
    assert.strictEqual(data.length, 2)
  })
})

describe('Async: Execute suite - wait', function () {
  this.timeout(0)
  it('should return 2 TEST results and a passing status', async () => {
    const [data, passing] = await GhostInspector.executeSuite('53cf58c0350c6c41029a11be')

    assert.strictEqual(data.length, 2)
    assert.strictEqual(passing, true)

    // make sure that these results are test results
    assert.strictEqual(data[0].name, 'Google')
    assert.strictEqual(data[1].name, 'Yahoo')
  })

  it('should execute with multiple browsers and return SUITE results', async function () {
    const [data, passing] = await GhostInspector.executeSuite('53cf58c0350c6c41029a11be', {
      browser: ['chrome', 'firefox'],
    })

    assert.strictEqual(data.length, 2)
    assert.strictEqual(passing, true)

    // make sure that these results are suite results
    assert.strictEqual(data[0].name, 'Test Suite')
    assert.strictEqual(data[1].name, 'Test Suite')
  })
})

describe('Async: Execute suite with immediate response ', function () {
  this.timeout(0)
  it('should return success with a pending suite result and null passing value', async () => {
    const [data, passing] = await GhostInspector.executeSuite('53cf58c0350c6c41029a11be', {
      immediate: true,
    })
    assert.strictEqual(data.suite, '53cf58c0350c6c41029a11be')
    assert.strictEqual(data.name, 'Test Suite')
    assert.strictEqual(data.passing, null)
    assert.strictEqual(passing, null)
    suiteResultId = data._id
  })

  it('should execute with multiple browser and return SUITE results', async function () {
    const [data, passing] = await GhostInspector.executeSuite('53cf58c0350c6c41029a11be', {
      browser: ['chrome', 'firefox'],
      immediate: true,
    })

    assert.strictEqual(data.length, 2)
    assert.strictEqual(passing, null)

    // make sure that these results are suite results
    assert.strictEqual(data[0].name, 'Test Suite')
    assert.strictEqual(data[1].name, 'Test Suite')
  })
})

describe('Async: Get suite results', function () {
  this.timeout(0)
  it('should return 1 suite result with a suite name of "Test Suite"', async () => {
    const data = await GhostInspector.getSuiteResults('53cf58c0350c6c41029a11be', { count: 1 })
    assert.strictEqual(data.length, 1)
    assert.ok(data[0].name === 'Test Suite')
  })
})

describe('Async: Download suite in (zipped) Selenium HTML format', function () {
  this.timeout(0)
  const dest = '/tmp/suite-html.zip'
  it('should save a zip file', async () => {
    await GhostInspector.downloadSuiteSeleniumHtml('53cf58c0350c6c41029a11be', dest)
    assert.ok(fs.existsSync(dest))
    fs.unlinkSync(dest)
  })
})

describe('Async: Download suite in Selenium .side format', function () {
  this.timeout(0)
  const dest = '/tmp/suite.side'
  it('should save a .side file', async () => {
    await GhostInspector.downloadSuiteSeleniumSide('53cf58c0350c6c41029a11be', dest)
    assert.ok(fs.existsSync(dest))
    fs.unlinkSync(dest)
  })
})

describe('Async: Download suite in (zipped) Selenium JSON format', function () {
  this.timeout(0)
  const dest = '/tmp/suite-json.zip'
  it('should save a zip file', async () => {
    await GhostInspector.downloadSuiteSeleniumJson('53cf58c0350c6c41029a11be', dest)
    assert.ok(fs.existsSync(dest))
    fs.unlinkSync(dest)
  })
})

describe('Async: Download suite in (zipped) Ghost Inspector JSON format', function () {
  this.timeout(0)
  const dest = '/tmp/json.zip'
  it('should save a zip file', async () => {
    await GhostInspector.downloadSuiteJson('53cf58c0350c6c41029a11be', dest)
    assert.ok(fs.existsSync(dest))
    fs.unlinkSync(dest)
  })
})

describe('Async: Get tests', function () {
  this.timeout(0)
  it('should return tests', async () => {
    const data = await GhostInspector.getTests()
    assert.ok(data.length > 0)
  })
})

describe('Async: Get test', function () {
  this.timeout(0)
  it('should return a test named "Google"', async () => {
    const data = await GhostInspector.getTest('53cf58fc350c6c41029a11bf')
    assert.strictEqual(data.name, 'Google')
  })
})

describe('Async: Get test results', function () {
  this.timeout(0)
  it('should return at least 1 result with a test name of "Google"', async () => {
    const data = await GhostInspector.getTestResults('53cf58fc350c6c41029a11bf')
    assert.strictEqual(data[0].test.name, 'Google')
  })
})

describe('Async: Get test results with options', function () {
  this.timeout(0)
  it('should return 1 result', async () => {
    const data = await GhostInspector.getTestResults('53cf58fc350c6c41029a11bf', { count: 1 })
    assert.strictEqual(data.length, 1)
  })
})

describe('Async: Execute test ', function () {
  this.timeout(0)
  it('should return a test name of "Google" and a passing status', async () => {
    const [data, passing] = await GhostInspector.executeTest('53cf58fc350c6c41029a11bf')
    assert.strictEqual(data.test.name, 'Google')
    assert.strictEqual(passing, true)
  })
})

describe('Async: Execute test overriding start URL ', function () {
  this.timeout(0)
  it('should return a start URL of "https://www.google.com.br"', async () => {
    const [data, passing] = await GhostInspector.executeTest('53cf58fc350c6c41029a11bf', {
      startUrl: 'https://www.google.com.br',
    })
    assert.strictEqual(data.startUrl, 'https://www.google.com.br')
    assert.strictEqual(passing, true)
  })
})

describe.only('Async: Execute test with CSV file ', function () {
  this.timeout(0)
  it.only('should return a single result in an array with the "foo" value from the CSV used in step #2', async () => {
    const [data, passing] = await GhostInspector.executeTest('53cf58fc350c6c41029a11bf', {
      dataFile: path.join(__dirname, 'sample.csv'),
    })
    // Since the CSV only has one row, the single test will be returned instead of a list
    assert.strictEqual(data[0].steps[1].value, 'foo')
    assert.strictEqual(passing, true)
  })
})

describe('Async: Execute test with immediate response ', function () {
  this.timeout(0)
  it('should return success with a pending result and null passing value', async () => {
    const [data, passing] = await GhostInspector.executeTest('53cf58fc350c6c41029a11bf', {
      immediate: true,
    })
    assert.strictEqual(data.test._id, '53cf58fc350c6c41029a11bf')
    assert.strictEqual(data.test.name, 'Google')
    assert.strictEqual(data.test.organization, '547fc38c404e81ff79292e53')
    assert.strictEqual(data.test.suite, '53cf58c0350c6c41029a11be')
    assert.deepStrictEqual(Object.keys(data.test), ['_id', 'name', 'organization', 'suite'])
    assert.strictEqual(data.name, 'Google')
    assert.strictEqual(data.passing, null)
    assert.strictEqual(passing, null)
    testResultId = data._id
  })
})

describe('Async: Get test results that are in progress', function () {
  this.timeout(0)
  it('should return at least 1 result', async () => {
    const data = await GhostInspector.getTestResultsRunning('53cf58fc350c6c41029a11bf')
    assert.ok(data.length >= 1)
  })
})

describe('Async: Execute on-demand test', function () {
  this.timeout(0)
  it('should execute an on-demand test and wait for completion', async () => {
    const test = require('./test.json')
    const organizationId = '547fc38c404e81ff79292e53'
    const result = await GhostInspector.executeTestOnDemand(organizationId, test, { wait: true })
    assert.ok(result.passing)
  })
})

describe('Async: Accept screenshot for a test', function () {
  this.timeout(0)
  it('should fail with error because screenshot comparison is not enabled', async () => {
    try {
      await GhostInspector.acceptTestScreenshot('53cf58fc350c6c41029a11bf')
    } catch (err) {
      assert.ok(err.message.includes('Unable to accept screenshot'))
    }
  })
})

describe('Async: Download test in Selenium HTML format', function () {
  this.timeout(0)
  const dest = '/tmp/test.html'
  it('should save an HTML file', async () => {
    await GhostInspector.downloadTestSeleniumHtml('53cf58fc350c6c41029a11bf', dest)
    assert.ok(fs.existsSync(dest))
    const data = fs.readFileSync(dest)
    assert.ok(data.toString().includes('<title>Google</title>'))
    fs.unlinkSync(dest)
  })
})

describe('Async: Download test in Selenium .side format', function () {
  this.timeout(0)
  const dest = '/tmp/test.side'
  it('should save a .side file', async () => {
    await GhostInspector.downloadTestSeleniumSide('53cf58fc350c6c41029a11bf', dest)
    assert.ok(fs.existsSync(dest))
    const data = fs.readFileSync(dest)
    assert.ok(data.toString().includes('Google'))
    fs.unlinkSync(dest)
  })
})

describe('Async: Download test in Selenium JSON format', function () {
  this.timeout(0)
  const dest = '/tmp/test.json'
  it('should save a JSON file', async () => {
    await GhostInspector.downloadTestSeleniumJson('53cf58fc350c6c41029a11bf', dest)
    assert.ok(fs.existsSync(dest))
    const data = fs.readFileSync(dest)
    assert.ok(data.toString().includes('Google'))
    fs.unlinkSync(dest)
  })
})

describe('Async: Download test in Ghost Inspector JSON format', function () {
  this.timeout(0)
  const dest = '/tmp/test.json'
  it('should save a JSON file', async () => {
    await GhostInspector.downloadTestJson('53cf58fc350c6c41029a11bf', dest)
    assert.ok(fs.existsSync(dest))
    const data = fs.readFileSync(dest)
    assert.ok(data.toString().includes('Google'))
    fs.unlinkSync(dest)
  })
})

describe('Async: Get suite result ', function () {
  this.timeout(0)
  it('should return a suite result that was triggered above', async () => {
    const data = await GhostInspector.getSuiteResult(suiteResultId)
    assert.strictEqual(data.name, 'Test Suite')
  })
})

describe('Async: Get suite result test result listing', function () {
  this.timeout(0)
  it('should return a list of test results for the suite result', async () => {
    const data = await GhostInspector.getSuiteResultTestResults(suiteResultId)
    assert.strictEqual(data.length, 2)
  })
})

describe('Async: Get suite result XUnit report', function () {
  this.timeout(0)
  it('should return XML for the suite result', async () => {
    const data = await GhostInspector.getSuiteResultXUnit(suiteResultId)
    assert.ok(data.toString().startsWith('<?xml version="1.0" encoding="UTF-8"?>'))
  })
})

describe('Async: Cancel suite result ', function () {
  this.timeout(0)
  it('should return a suite result that was triggered above', async () => {
    const data = await GhostInspector.cancelSuiteResult(suiteResultId)
    assert.strictEqual(data.name, 'Test Suite')
  })
})

describe('Async: Get test result ', function () {
  this.timeout(0)
  it('should return a test result that was triggered above', async () => {
    const data = await GhostInspector.getResult(testResultId)
    assert.strictEqual(data.name, 'Google')
  })
})

describe('Async: Cancel test result ', function () {
  this.timeout(0)
  it('should return a test result that was triggered above', async () => {
    const data = await GhostInspector.cancelResult(testResultId)
    assert.strictEqual(data.name, 'Google')
  })
})

describe('Async: Import a test', function () {
  this.timeout(0)
  it('should import a test', async function () {
    const suiteId = '5de57382bbeff026afe7b025'
    const timestamp = `${+new Date()}`
    const test = require('./test.json')
    test.name = `${test.name}-${timestamp}`
    const result = await GhostInspector.importTest(suiteId, test)
    assert.strictEqual(result.name, test.name)
  })
})
