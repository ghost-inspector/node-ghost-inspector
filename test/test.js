// The API key and IDs used in this file belong to the official Ghost Inspector API testing account.
const fs = require('fs')
const should = require('should')
const GhostInspector = require('../index')('ff586dcaaa9b781163dbae48a230ea1947f894ff')

let suiteResultId, testResultId

describe('Get suites', function () {
  this.timeout(0)
  it('should return 1 suite', (done) => {
    GhostInspector.getSuites((err, data) => {
      (err === null).should.be.true
      data.length.should.equal(1)
      done()
    })
  })
})

describe('Get suite', function () {
  this.timeout(0)
  it('should return a suite named "Test Suite"', (done) => {
    GhostInspector.getSuite('53cf58c0350c6c41029a11be', (err, data) => {
      (err === null).should.be.true
      data.name.should.equal('Test Suite')
      done()
    })
  })
})

describe('Get suite tests', function () {
  this.timeout(0)
  it('should return 2 tests in the suite', (done) => {
    GhostInspector.getSuiteTests('53cf58c0350c6c41029a11be', (err, data) => {
      (err === null).should.be.true
      data.length.should.equal(2)
      done()
    })
  })
})

describe('Execute suite ', function () {
  this.timeout(0)
  it('should return 2 results and a passing status', (done) => {
    GhostInspector.executeSuite('53cf58c0350c6c41029a11be', (err, data, passing) => {
      (err === null).should.be.true
      data.length.should.equal(2)
      passing.should.be.true
      done()
    })
  })
})

describe('Execute suite with immediate response ', function () {
  this.timeout(0)
  it('should return success with a pending suite result and null passing value', (done) => {
    GhostInspector.executeSuite('53cf58c0350c6c41029a11be', { immediate: true }, (err, data, passing) => {
      (err === null).should.be.true
      data.suite.should.equal('53cf58c0350c6c41029a11be')
      data.name.should.equal('Test Suite');
      (data.passing === null).should.be.true;
      (passing === null).should.be.true
      suiteResultId = data._id
      done()
    })
  })
})

describe('Get suite results', function () {
  this.timeout(0)
  it('should return 1 suite result with a suite name of "Test Suite"', (done) => {
    GhostInspector.getSuiteResults('53cf58c0350c6c41029a11be', { 'count': 1 }, (err, data) => {
      (err === null).should.be.true
      data.length.should.equal(1)
      data[0].name.should.equal('Test Suite')
      done()
    })
  })
})

describe('Download suite in (zipped) Selenium HTML format', function () {
  this.timeout(0)
  const dest = '/tmp/suite-html.zip'
  it('should return a zip file', (done) => {
    GhostInspector.downloadSuiteSeleniumHtml('53cf58c0350c6c41029a11be', dest, (err) => {
      (err === null).should.be.true
      fs.existsSync(dest).should.be.true
      fs.unlinkSync(dest)
      done()
    })
  })
})

describe('Download suite in (zipped) Selenium JSON format', function () {
  this.timeout(0)
  const dest = '/tmp/suite-json.zip'
  it('should return a zip file', (done) => {
    GhostInspector.downloadSuiteSeleniumJson('53cf58c0350c6c41029a11be', dest, (err) => {
      (err === null).should.be.true
      fs.existsSync(dest).should.be.true
      fs.unlinkSync(dest)
      done()
    })
  })
})

describe('Get tests', function () {
  this.timeout(0)
  it('should return 2 tests', (done) => {
    GhostInspector.getTests((err, data) => {
      (err === null).should.be.true
      data.length.should.equal(2)
      done()
    })
  })
})

describe('Get test', function () {
  this.timeout(0)
  it('should return a test named "Google"', (done) => {
    GhostInspector.getTest('53cf58fc350c6c41029a11bf', (err, data) => {
      (err === null).should.be.true
      data.name.should.equal('Google')
      done()
    })
  })
})

describe('Get test results', function () {
  this.timeout(0)
  it('should return at least 1 result with a test name of "Google"', (done) => {
    GhostInspector.getTestResults('53cf58fc350c6c41029a11bf', (err, data) => {
      (err === null).should.be.true
      data[0].test.name.should.equal('Google')
      done()
    })
  })
})

describe('Get test results with options', function () {
  this.timeout(0)
  it('should return 1 result', (done) => {
    GhostInspector.getTestResults('53cf58fc350c6c41029a11bf', { 'count': 1 }, (err, data) => {
      (err === null).should.be.true
      data.length.should.equal(1)
      done()
    })
  })
})

describe('Execute test ', function () {
  this.timeout(0)
  it('should return a test name of "Google" and a passing status', (done) => {
    GhostInspector.executeTest('53cf58fc350c6c41029a11bf', (err, data, passing) => {
      (err === null).should.be.true
      data.test.name.should.equal('Google')
      passing.should.be.true
      done()
    })
  })
})

describe('Execute test overriding start URL ', function () {
  this.timeout(0)
  it('should return a start URL of "https://www.google.com.br"', (done) => {
    GhostInspector.executeTest('53cf58fc350c6c41029a11bf', { startUrl: 'https://www.google.com.br' }, (err, data, passing) => {
      (err === null).should.be.true
      data.startUrl.should.equal('https://www.google.com.br')
      passing.should.be.true
      done()
    })
  })
})

describe('Execute test with immediate response ', function () {
  this.timeout(0)
  it('should return success with a pending result and null passing value', (done) => {
    GhostInspector.executeTest('53cf58fc350c6c41029a11bf', { immediate: true }, (err, data, passing) => {
      (err === null).should.be.true
      data.test.should.equal('53cf58fc350c6c41029a11bf')
      data.name.should.equal('Google');
      (data.passing === null).should.be.true;
      (passing === null).should.be.true
      testResultId = data._id
      done()
    })
  })
})

describe('Download test in Selenium HTML format', function () {
  this.timeout(0)
  const dest = '/tmp/test.html'
  it('should return an HTML document', (done) => {
    GhostInspector.downloadTestSeleniumHtml('53cf58fc350c6c41029a11bf', dest, (err) => {
      (err === null).should.be.true
      fs.existsSync(dest).should.be.true
      fs.unlinkSync(dest)
      done()
    })
  })
})

describe('Download test in Selenium JSON format', function () {
  this.timeout(0)
  const dest = '/tmp/test.json'
  it('should return an HTML document', (done) => {
    GhostInspector.downloadTestSeleniumJson('53cf58fc350c6c41029a11bf', dest, (err) => {
      (err === null).should.be.true
      fs.existsSync(dest).should.be.true
      fs.unlinkSync(dest)
      done()
    })
  })
})

describe('Get suite result ', function () {
  this.timeout(0)
  it('should return a suite result that was triggered above', (done) => {
    GhostInspector.getSuiteResult(suiteResultId, (err, data) => {
      (err === null).should.be.true
      data.name.should.equal('Test Suite')
      done()
    })
  })
})

describe('Get suite result test result listing', function () {
  this.timeout(0)
  it('should return a list of test results for the suite result', (done) => {
    GhostInspector.getSuiteResultTestResults(suiteResultId, (err, data) => {
      (err === null).should.be.true
      data.length.should.equal(2)
      done()
    })
  })
})

describe('Cancel suite result ', function () {
  this.timeout(0)
  it('should return a suite result that was triggered above', (done) => {
    GhostInspector.cancelSuiteResult(suiteResultId, (err, data) => {
      (err === null).should.be.true
      data.name.should.equal('Test Suite')
      done()
    })
  })
})

describe('Get test result ', function () {
  this.timeout(0)
  it('should return a test result that was triggered above', (done) => {
    GhostInspector.getResult(testResultId, (err, data) => {
      (err === null).should.be.true
      data.name.should.equal('Google')
      done()
    })
  })
})

describe('Cancel test result ', function () {
  this.timeout(0)
  it('should return a test result that was triggered above', (done) => {
    GhostInspector.cancelResult(testResultId, (err, data) => {
      (err === null).should.be.true
      data.name.should.equal('Google')
      done()
    })
  })
})
