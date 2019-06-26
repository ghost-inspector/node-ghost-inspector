// The API key and IDs used in this file belong to the official Ghost Inspector API testing account.
const assert = require('assert').strict
const fs = require('fs')
const GhostInspector = require('../index')('ff586dcaaa9b781163dbae48a230ea1947f894ff')

let suiteResultId, testResultId

describe('Async: Get suites', function () {
  this.timeout(0)
  it('should return 1 suite', async () => {
    const data = await GhostInspector.getSuites()
    assert.ok(data.length === 1)
  })
})

describe('Async: Get suite', function () {
  this.timeout(0)
  it('should return a suite named "Test Suite"', async () => {
    const data = await GhostInspector.getSuite('53cf58c0350c6c41029a11be')
    assert.ok(data.name === 'Test Suite')
  })
})

describe('Async: Get suite tests', function () {
  this.timeout(0)
  it('should return 2 tests in the suite', async () => {
    const data = await GhostInspector.getSuiteTests('53cf58c0350c6c41029a11be')
    assert.ok(data.length === 2)
  })
})

describe('Async: Execute suite ', function () {
  this.timeout(0)
  it('should return 2 results and a passing status', async () => {
    const [data, passing] = await GhostInspector.executeSuite('53cf58c0350c6c41029a11be')
    assert.ok(data.length === 2)
    assert.ok(passing === true)
  })
})

describe('Async: Execute suite with immediate response ', function () {
  this.timeout(0)
  it('should return success with a pending suite result and null passing value', async () => {
    const [data, passing] = await GhostInspector.executeSuite('53cf58c0350c6c41029a11be', { immediate: true })
    assert.ok(data.suite === '53cf58c0350c6c41029a11be')
    assert.ok(data.name === 'Test Suite')
    assert.ok(data.passing === null)
    assert.ok(passing === null)
    suiteResultId = data._id
  })
})

describe('Async: Get suite results', function () {
  this.timeout(0)
  it('should return 1 suite result with a suite name of "Test Suite"', async () => {
    const data = await GhostInspector.getSuiteResults('53cf58c0350c6c41029a11be', { 'count': 1 })
    assert.ok(data.length === 1)
    assert.ok(data[0].name === 'Test Suite')
  })
})

describe('Async: Download suite in (zipped) Selenium HTML format', function () {
  this.timeout(0)
  const dest = '/tmp/suite-html.zip'
  it('should return a zip file', async () => {
    await GhostInspector.downloadSuiteSeleniumHtml('53cf58c0350c6c41029a11be', dest)
    assert.ok(fs.existsSync(dest))
    fs.unlinkSync(dest)
  })
})

describe('Async: Download suite in (zipped) Selenium JSON format', function () {
  this.timeout(0)
  const dest = '/tmp/suite-json.zip'
  it('should return a zip file', async () => {
    await GhostInspector.downloadSuiteSeleniumJson('53cf58c0350c6c41029a11be', dest)
    assert.ok(fs.existsSync(dest))
    fs.unlinkSync(dest)
  })
})

describe('Async: Get tests', function () {
  this.timeout(0)
  it('should return 2 tests', async () => {
    const data = await GhostInspector.getTests()
    assert.ok(data.length === 2)
  })
})

describe('Async: Get test', function () {
  this.timeout(0)
  it('should return a test named "Google"', async () => {
    const data = await GhostInspector.getTest('53cf58fc350c6c41029a11bf')
    assert.ok(data.name === 'Google')
  })
})

describe('Async: Get test results', function () {
  this.timeout(0)
  it('should return at least 1 result with a test name of "Google"', async () => {
    const data = await GhostInspector.getTestResults('53cf58fc350c6c41029a11bf')
    assert.ok(data[0].test.name === 'Google')
  })
})

describe('Async: Get test results with options', function () {
  this.timeout(0)
  it('should return 1 result', async () => {
    const data = await GhostInspector.getTestResults('53cf58fc350c6c41029a11bf', { 'count': 1 })
    assert.ok(data.length === 1)
  })
})

describe('Async: Execute test ', function () {
  this.timeout(0)
  it('should return a test name of "Google" and a passing status', async () => {
    const [data, passing] = await GhostInspector.executeTest('53cf58fc350c6c41029a11bf')
    assert.ok(data.test.name === 'Google')
    assert.ok(passing === true)
  })
})

describe('Async: Execute test overriding start URL ', function () {
  this.timeout(0)
  it('should return a start URL of "https://www.google.com.br"', async () => {
    const [data, passing] = await GhostInspector.executeTest('53cf58fc350c6c41029a11bf', { startUrl: 'https://www.google.com.br' })
    assert.ok(data.startUrl === 'https://www.google.com.br')
    assert.ok(passing === true)
  })
})

describe('Async: Execute test with immediate response ', function () {
  this.timeout(0)
  it('should return success with a pending result and null passing value', async () => {
    const [data, passing] = await GhostInspector.executeTest('53cf58fc350c6c41029a11bf', { immediate: true })
    assert.ok(data.test === '53cf58fc350c6c41029a11bf')
    assert.ok(data.name === 'Google')
    assert.ok(data.passing === null)
    assert.ok(passing === null)
    testResultId = data._id
  })
})

describe('Async: Download test in Selenium HTML format', function () {
  this.timeout(0)
  const dest = '/tmp/test.html'
  it('should return an HTML document', async () => {
    await GhostInspector.downloadTestSeleniumHtml('53cf58fc350c6c41029a11bf', dest)
    assert.ok(fs.existsSync(dest))
    const data = fs.readFileSync(dest)
    assert.ok(data.toString().includes('<title>Google</title>'))
    fs.unlinkSync(dest)
  })
})

describe('Async: Download test in Selenium JSON format', function () {
  this.timeout(0)
  const dest = '/tmp/test.json'
  it('should return an HTML document', async () => {
    await GhostInspector.downloadTestSeleniumJson('53cf58fc350c6c41029a11bf', dest)
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
    assert.ok(data.name === 'Test Suite')
  })
})

describe('Async: Get suite result test result listing', function () {
  this.timeout(0)
  it('should return a list of test results for the suite result', async () => {
    const data = await GhostInspector.getSuiteResultTestResults(suiteResultId)
    assert.ok(data.length === 2)
  })
})

describe('Async: Cancel suite result ', function () {
  this.timeout(0)
  it('should return a suite result that was triggered above', async () => {
    const data = await GhostInspector.cancelSuiteResult(suiteResultId)
    assert.ok(data.name === 'Test Suite')
  })
})

describe('Async: Get test result ', function () {
  this.timeout(0)
  it('should return a test result that was triggered above', async () => {
    const data = await GhostInspector.getResult(testResultId)
    assert.ok(data.name === 'Google')
  })
})

describe('Async: Cancel test result ', function () {
  this.timeout(0)
  it('should return a test result that was triggered above', async () => {
    const data = await GhostInspector.cancelResult(testResultId)
    assert.ok(data.name === 'Google')
  })
})
