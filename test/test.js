/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// The API key and IDs used in this file belong to the official Ghost Inspector API testing account.
const fs = require('fs');
const should = require('should');
const GhostInspector = require('../index')('ff586dcaaa9b781163dbae48a230ea1947f894ff');


describe('Get suites', function() {
  this.timeout(0);
  return it('should return 1 suite', done =>
    GhostInspector.getSuites(function(err, data) {
      (err === null).should.be.true;
      data.length.should.equal(1);
      return done();
    })
  );
});

describe('Get suite', function() {
  this.timeout(0);
  return it('should return a suite named "Test Suite"', done =>
    GhostInspector.getSuite('53cf58c0350c6c41029a11be', function(err, data) {
      (err === null).should.be.true;
      data.name.should.equal("Test Suite");
      return done();
    })
  );
});

describe('Get suite tests', function() {
  this.timeout(0);
  return it('should return 2 tests in the suite', done =>
    GhostInspector.getSuiteTests('53cf58c0350c6c41029a11be', function(err, data) {
      (err === null).should.be.true;
      data.length.should.equal(2);
      return done();
    })
  );
});

describe('Execute suite ', function() {
  this.timeout(0);
  return it('should return 2 results and a passing status', done =>
    GhostInspector.executeSuite('53cf58c0350c6c41029a11be', function(err, data, passing) {
      (err === null).should.be.true;
      data.length.should.equal(2);
      passing.should.be.true;
      return done();
    })
  );
});

describe('Execute suite with immediate response ', function() {
  this.timeout(0);
  return it('should return success with a pending suite result and null passing value', done =>
    GhostInspector.executeSuite('53cf58c0350c6c41029a11be', { immediate: true }, function(err, data, passing) {
      (err === null).should.be.true;
      data.suite.should.equal('53cf58c0350c6c41029a11be');
      data.name.should.equal('Test Suite');
      (data.passing === null).should.be.true;
      (passing === null).should.be.true;
      return done();
    })
  );
});

describe('Download suite in (zipped) Selenium format', function() {
  this.timeout(0);
  const dest = 'test/suite.zip';
  return it('should return a zip file', done =>
    GhostInspector.downloadSuiteSeleniumHtml('53cf58c0350c6c41029a11be', dest, function(err) {
      (err === null).should.be.true;
      fs.existsSync(dest).should.be.true;
      fs.unlinkSync(dest);
      return done();
    })
  );
});

describe('Get tests', function() {
  this.timeout(0);
  return it('should return 2 tests', done =>
    GhostInspector.getTests(function(err, data) {
      (err === null).should.be.true;
      data.length.should.equal(2);
      return done();
    })
  );
});

describe('Get test', function() {
  this.timeout(0);
  return it('should return a test named "Google"', done =>
    GhostInspector.getTest('53cf58fc350c6c41029a11bf', function(err, data) {
      (err === null).should.be.true;
      data.name.should.equal("Google");
      return done();
    })
  );
});

describe('Get test results', function() {
  this.timeout(0);
  return it('should return at least 1 result with a test name of "Google"', done =>
    GhostInspector.getTestResults('53cf58fc350c6c41029a11bf', function(err, data) {
      (err === null).should.be.true;
      data[0].test.name.should.equal("Google");
      return done();
    })
  );
});

describe('Get test results with options', function() {
  this.timeout(0);
  return it('should return 1 result', done =>
    GhostInspector.getTestResults('53cf58fc350c6c41029a11bf', { 'count': 1 }, function(err, data) {
      (err === null).should.be.true;
      data.length.should.equal(1);
      return done();
    })
  );
});

describe('Execute test ', function() {
  this.timeout(0);
  return it('should return a test name of "Google" and a passing status', done =>
    GhostInspector.executeTest('53cf58fc350c6c41029a11bf', function(err, data, passing) {
      (err === null).should.be.true;
      data.test.name.should.equal("Google");
      passing.should.be.true;
      return done();
    })
  );
});

describe('Execute test overriding start URL ', function() {
  this.timeout(0);
  return it('should return a start URL of "https://www.google.com.br"', done =>
    GhostInspector.executeTest('53cf58fc350c6c41029a11bf', { startUrl: 'https://www.google.com.br' }, function(err, data, passing) {
      (err === null).should.be.true;
      data.startUrl.should.equal("https://www.google.com.br");
      passing.should.be.true;
      return done();
    })
  );
});

describe('Execute test with immediate response ', function() {
  this.timeout(0);
  return it('should return success with a pending result and null passing value', done =>
    GhostInspector.executeTest('53cf58fc350c6c41029a11bf', { immediate: true }, function(err, data, passing) {
      (err === null).should.be.true;
      data.test.should.equal('53cf58fc350c6c41029a11bf');
      data.name.should.equal('Google');
      (data.passing === null).should.be.true;
      (passing === null).should.be.true;
      return done();
    })
  );
});

describe('Download test in Selenium format', function() {
  this.timeout(0);
  const dest = 'test/test.html';
  return it('should return an HTML document', done =>
    GhostInspector.downloadTestSeleniumHtml('53cf58fc350c6c41029a11bf', dest, function(err) {
      (err === null).should.be.true;
      fs.existsSync(dest).should.be.true;
      fs.unlinkSync(dest);
      return done();
    })
  );
});

describe('Get result ', function() {
  this.timeout(0);
  return it('should return an error that the result does not exist', done =>
    GhostInspector.getResult('53cf58fe8e871daa3d95c6c5', function(err, data) {
      err.should.equal("Result not found");
      return done();
    })
  );
});
