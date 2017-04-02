# The API key and IDs used in this file belong to the official Ghost Inspector API testing account.
fs = require('fs')
should = require('should')
GhostInspector = require('../index')('ff586dcaaa9b781163dbae48a230ea1947f894ff')


describe 'Get suites', ->
  @timeout(0)
  it 'should return 1 suite', (done) ->
    GhostInspector.getSuites (err, data) ->
      (err is null).should.be.true
      data.length.should.equal(1)
      done()

describe 'Get suite', ->
  @timeout(0)
  it 'should return a suite named "Test Suite"', (done) ->
    GhostInspector.getSuite '53cf58c0350c6c41029a11be', (err, data) ->
      (err is null).should.be.true
      data.name.should.equal("Test Suite")
      done()

describe 'Get suite tests', ->
  @timeout(0)
  it 'should return 2 tests in the suite', (done) ->
    GhostInspector.getSuiteTests '53cf58c0350c6c41029a11be', (err, data) ->
      (err is null).should.be.true
      data.length.should.equal(2)
      done()

describe 'Execute suite ', ->
  @timeout(0)
  it 'should return 2 results and a passing status', (done) ->
    GhostInspector.executeSuite '53cf58c0350c6c41029a11be', (err, data, passing) ->
      (err is null).should.be.true
      data.length.should.equal(2)
      passing.should.be.true
      done()

describe 'Execute suite with immediate response ', ->
  @timeout(0)
  it 'should return success with a pending suite result and null passing value', (done) ->
    GhostInspector.executeSuite '53cf58c0350c6c41029a11be', { immediate: true }, (err, data, passing) ->
      (err is null).should.be.true
      data.suite.should.equal('53cf58c0350c6c41029a11be')
      data.name.should.equal('Test Suite')
      (data.passing is null).should.be.true
      (passing is null).should.be.true
      done()

describe 'Download suite in (zipped) Selenium format', ->
  @timeout(0)
  dest = 'test/suite.zip'
  it 'should return a zip file', (done) ->
    GhostInspector.downloadSuiteSeleniumHtml '53cf58c0350c6c41029a11be', dest, (err) ->
      (err is null).should.be.true
      fs.existsSync(dest).should.be.true
      fs.unlinkSync(dest)
      done()

describe 'Get tests', ->
  @timeout(0)
  it 'should return 2 tests', (done) ->
    GhostInspector.getTests (err, data) ->
      (err is null).should.be.true
      data.length.should.equal(2)
      done()

describe 'Get test', ->
  @timeout(0)
  it 'should return a test named "Google"', (done) ->
    GhostInspector.getTest '53cf58fc350c6c41029a11bf', (err, data) ->
      (err is null).should.be.true
      data.name.should.equal("Google")
      done()

describe 'Get test results', ->
  @timeout(0)
  it 'should return at least 1 result with a test name of "Google"', (done) ->
    GhostInspector.getTestResults '53cf58fc350c6c41029a11bf', (err, data) ->
      (err is null).should.be.true
      data[0].test.name.should.equal("Google")
      done()

describe 'Get test results with options', ->
  @timeout(0)
  it 'should return 5 results', (done) ->
    GhostInspector.getTestResults '53cf58fc350c6c41029a11bf', { 'count': 5 }, (err, data) ->
      (err is null).should.be.true
      data.length.should.equal(5)
      done()

describe 'Execute test ', ->
  @timeout(0)
  it 'should return a test name of "Google" and a passing status', (done) ->
    GhostInspector.executeTest '53cf58fc350c6c41029a11bf', (err, data, passing) ->
      (err is null).should.be.true
      data.test.name.should.equal("Google")
      passing.should.be.true
      done()

describe 'Execute test overriding start URL ', ->
  @timeout(0)
  it 'should return a start URL of "https://www.google.com.br"', (done) ->
    GhostInspector.executeTest '53cf58fc350c6c41029a11bf', { startUrl: 'https://www.google.com.br' }, (err, data, passing) ->
      (err is null).should.be.true
      data.startUrl.should.equal("https://www.google.com.br")
      passing.should.be.true
      done()

describe 'Execute test with immediate response ', ->
  @timeout(0)
  it 'should return success with a pending result and null passing value', (done) ->
    GhostInspector.executeTest '53cf58fc350c6c41029a11bf', { immediate: true }, (err, data, passing) ->
      (err is null).should.be.true
      data.test.should.equal('53cf58fc350c6c41029a11bf')
      data.name.should.equal('Google')
      (data.passing is null).should.be.true
      (passing is null).should.be.true
      done()

describe 'Download test in Selenium format', ->
  @timeout(0)
  dest = 'test/test.html'
  it 'should return an HTML document', (done) ->
    GhostInspector.downloadTestSeleniumHtml '53cf58fc350c6c41029a11bf', dest, (err) ->
      (err is null).should.be.true
      fs.existsSync(dest).should.be.true
      fs.unlinkSync(dest)
      done()

describe 'Get result ', ->
  @timeout(0)
  it 'should return an error that the result does not exist', (done) ->
    GhostInspector.getResult '53cf58fe8e871daa3d95c6c5', (err, data) ->
      err.should.equal("Result not found")
      done()
