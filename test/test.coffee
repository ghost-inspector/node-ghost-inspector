should = require('should')
GhostInspector = require('../index')('53cf58be350c6c41029a11bd', 'ff586dcaaa9b781163dbae48a230ea1947f894ff')


describe 'Get suites', ->
  @timeout(0)
  it 'should return 1 suite', (done) ->
    GhostInspector.getSuites (err, data) ->
      data.length.should.equal(1)
      done()

describe 'Get suite', ->
  @timeout(0)
  it 'should return a suite named "Test Suite"', (done) ->
    GhostInspector.getSuite '53cf58c0350c6c41029a11be', (err, data) ->
      data.name.should.equal("Test Suite")
      done()

describe 'Get suite tests', ->
  @timeout(0)
  it 'should return 2 tests in the suite', (done) ->
    GhostInspector.getSuiteTests '53cf58c0350c6c41029a11be', (err, data) ->
      data.length.should.equal(2)
      done()

describe 'Execute suite ', ->
  @timeout(0)
  it 'should return 2 results and a passing status', (done) ->
    GhostInspector.executeSuite '53cf58c0350c6c41029a11be', (err, data, passing) ->
      data.length.should.equal(2)
      passing.should.equal(true)
      done()

describe 'Get tests', ->
  @timeout(0)
  it 'should return 2 tests', (done) ->
    GhostInspector.getTests (err, data) ->
      data.length.should.equal(2)
      done()

describe 'Get test', ->
  @timeout(0)
  it 'should return a test named "Google"', (done) ->
    GhostInspector.getTest '53cf58fc350c6c41029a11bf', (err, data) ->
      data.name.should.equal("Google")
      done()

describe 'Get test results', ->
  @timeout(0)
  it 'should return at least 1 result with a start URL of "https://www.google.com"', (done) ->
    GhostInspector.getTestResults '53cf58fc350c6c41029a11bf', (err, data) ->
      data[0].startUrl.should.equal("https://www.google.com")
      done()

describe 'Execute test ', ->
  @timeout(0)
  it 'should return a test name of "Google" and a passing status', (done) ->
    GhostInspector.executeTest '53cf58fc350c6c41029a11bf', (err, data, passing) ->
      data.testName.should.equal("Google")
      passing.should.equal(true)
      done()

describe 'Get result ', ->
  @timeout(0)
  it 'should return a result with a start URL of "https://www.google.com"', (done) ->
    GhostInspector.getResult '53cf58fe8e871daa3d95c6c5', (err, data) ->
      data.startUrl.should.equal("https://www.google.com")
      done()
