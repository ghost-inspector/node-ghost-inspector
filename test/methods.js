const assert = require('assert').strict
const fs = require('fs')
const request = require('request-promise-native')
const sinon = require('sinon')

const wait = (time = 5) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

const successResponse = {
  code: 'SUCCESS',
  data: { expected: 'data' }
}

describe('API methods', function () {
  before(function () {
    this.client = require('../index')('my-api-key')
  })

  beforeEach(function () {
    this.requestStub = sinon.stub(this.client, '_request')
    this.requestStub.resolves(successResponse)
    this.callbackSpy = sinon.spy()
  })

  afterEach(function () {
    this.requestStub.restore()
  })

  describe('request errors', function () {
    it('(async) should throw an error when API response is ERROR', async function () {
      const failResponse = { code: 'ERROR', message: 'some error message' }
      this.requestStub.resolves(failResponse)
      try {
        await this.client.executeSuite('suite-123')
      } catch (error) {
        assert.ok(error)
        assert.equal(error.message, 'some error message')
        return true
      }
      throw new assert.AssertionError({ message: 'Missing expected exception.' })
    })

    it('(callback) should throw an error when API response is ERROR', async function () {
      const failResponse = { code: 'ERROR', message: 'some error message' }
      this.requestStub.resolves(failResponse)
      this.client.executeSuite('suite-123', this.callbackSpy)
      await wait()
      assert.ok(this.callbackSpy.called)
      assert.equal(this.callbackSpy.args[0][0].message, 'some error message')
    })
  })

  it('getFolders()', async function () {
    const response = await this.client.getFolders(this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.equal(requestOptions.headers['User-Agent'], 'Ghost Inspector Node.js Client')
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'GET')
    assert.equal(requestOptions.uri, 'https://api.ghostinspector.com/v1/folders/?apiKey=my-api-key&')
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })

  it('getFolder()', async function () {
    const response = await this.client.getFolder('folder-123', this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.equal(requestOptions.headers['User-Agent'], 'Ghost Inspector Node.js Client')
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'GET')
    assert.equal(requestOptions.uri, 'https://api.ghostinspector.com/v1/folders/folder-123/?apiKey=my-api-key&')
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })

  it('getFolderSuites()', async function () {
    const response = await this.client.getFolderSuites('folder-123', this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.equal(requestOptions.headers['User-Agent'], 'Ghost Inspector Node.js Client')
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'GET')
    assert.equal(requestOptions.uri, 'https://api.ghostinspector.com/v1/folders/folder-123/suites/?apiKey=my-api-key&')
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })

  it('getSuites()', async function () {
    const response = await this.client.getSuites(this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.equal(requestOptions.headers['User-Agent'], 'Ghost Inspector Node.js Client')
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'GET')
    assert.equal(requestOptions.uri, 'https://api.ghostinspector.com/v1/suites/?apiKey=my-api-key&')
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })

  it('getSuite()', async function () {
    const response = await this.client.getSuite('suite-123', this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.equal(requestOptions.headers['User-Agent'], 'Ghost Inspector Node.js Client')
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'GET')
    assert.equal(requestOptions.uri, 'https://api.ghostinspector.com/v1/suites/suite-123/?apiKey=my-api-key&')
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })

  it('getSuiteTests()', async function () {
    const response = await this.client.getSuiteTests('suite-123', this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.equal(requestOptions.headers['User-Agent'], 'Ghost Inspector Node.js Client')
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'GET')
    assert.equal(requestOptions.uri, 'https://api.ghostinspector.com/v1/suites/suite-123/tests/?apiKey=my-api-key&')
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })

  it('getSuiteResults()', async function () {
    const response = await this.client.getSuiteResults('suite-123', { count: 10, offset: 3 }, this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.equal(requestOptions.headers['User-Agent'], 'Ghost Inspector Node.js Client')
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'GET')
    assert.equal(requestOptions.uri, 'https://api.ghostinspector.com/v1/suites/suite-123/results/?count=10&offset=3&apiKey=my-api-key&')
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })

  it('getSuiteResults() should use options-position callback', async function () {
    const response = await this.client.getSuiteResults('suite-123', this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.equal(requestOptions.headers['User-Agent'], 'Ghost Inspector Node.js Client')
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'GET')
    assert.equal(requestOptions.uri, 'https://api.ghostinspector.com/v1/suites/suite-123/results/?apiKey=my-api-key&')
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })

  /**
   * executeSuite() falls outside the standard internal pattern of passing through the basic
   * parameters to client.request(), we'll set up a few special tests around this specifically.
   */
  describe('executeSuite()', function () {
    it('(async) should throw an error with ERROR response', async function () {
      this.requestStub.throws(new Error('some error'))
      try {
        await this.client.executeSuite('suite-123')
      } catch (error) {
        assert.ok(error)
        assert.equal(error.message, 'some error')
        return true
      }
      throw new assert.AssertionError({ message: 'Missing expected exception.' })
    })

    it('(callback) should return an error with ERROR response', async function () {
      this.requestStub.throws(new Error('some error'))
      this.client.executeSuite('suite-123', {}, this.callbackSpy)
      const callbackArgs = this.callbackSpy.args
      // give the callback a second to fire
      await wait()
      // first-position arg (error) should be non-null
      const error = callbackArgs[0][0]
      assert.ok(error)
      assert.equal(error.message, 'some error')
    })

    it('should execute a suite', async function () {
      const outcomeStub = sinon.stub(this.client, 'getOverallResultOutcome')
      outcomeStub.returns(true)
      const response = await this.client.executeSuite('suite-123', {}, this.callbackSpy)
      // assert API call
      const requestOptions = this.requestStub.args[0][0]
      assert.equal(requestOptions.headers['User-Agent'], 'Ghost Inspector Node.js Client')
      assert.equal(requestOptions.json, true)
      assert.equal(requestOptions.method, 'POST')
      assert.equal(requestOptions.uri, 'https://api.ghostinspector.com/v1/suites/suite-123/execute/')
      // assert async
      assert.deepEqual(response, [{ expected: 'data' }, true])
      // assert callback called with (error, data, passing)
      assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }, true])
      outcomeStub.restore()
    })

    it('should use should use options-position callback', async function () {
      const outcomeStub = sinon.stub(this.client, 'getOverallResultOutcome')
      outcomeStub.returns(true)
      // pass callback as second-position argument
      const response = await this.client.executeSuite('suite-123', this.callbackSpy)
      // assert async
      assert.deepEqual(response, [{ expected: 'data' }, true])
      // assert callback called with (error, data, passing)
      assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }, true])
      outcomeStub.restore()
    })
  })

  /**
   * downloadSuiteSeleniumHtml() also falls outside the standard internal pattern of passing through the basic
   * parameters to client.request(), we'll set up a few special tests around this specifically.
   */
  describe('downloadSuiteSeleniumHtml()', function () {
    beforeEach(function () {
      this.requestStub.resolves(successResponse)
      this.writeFileStub = sinon.stub(fs, 'writeFile')
      this.writeFileStub.callsFake(function (_dest, _data, cb) {
        cb(null)
      })
    })

    afterEach(function () {
      this.writeFileStub.restore()
    })

    it('(async) it should throw an error with ERROR response', async function () {
      this.requestStub.throws(new Error('some error'))
      try {
        await this.client.downloadSuiteSeleniumHtml('suite-123', '/some/dest')
      } catch (error) {
        assert.ok(error)
        assert.equal(error.message, 'some error')
        return true
      }
      throw new assert.AssertionError({ message: 'Missing expected exception.' })
    })

    it('(callback) should return an error with ERROR response', async function () {
      this.requestStub.throws(new Error('some error'))
      this.client.downloadSuiteSeleniumHtml('suite-123', '/some/place', this.callbackSpy)
      const callbackArgs = this.callbackSpy.args
      // give the callback a second to fire
      await wait()
      // first-position arg (error) should be non-null
      const error = callbackArgs[0][0]
      assert.ok(error)
      assert.equal(error.message, 'some error')
    })

    it('should download', async function () {
      this.requestStub.resolves('<some>html</some>')
      const response = await this.client.downloadSuiteSeleniumHtml('suite-123', '/foo.html', this.callbackSpy)
      // assert API call
      const requestOptions = this.requestStub.args[0][0]
      assert.equal(requestOptions.headers['User-Agent'], 'Ghost Inspector Node.js Client')
      assert.equal(requestOptions.json, undefined)
      assert.equal(requestOptions.method, 'GET')
      assert.equal(requestOptions.uri, 'https://api.ghostinspector.com/v1/suites/suite-123/export/selenium-html/?apiKey=my-api-key&')
      // download*() return the full response, assert async
      assert.equal(response, '<some>html</some>')
      // assert callback called with (error, html)
      assert.deepEqual(this.callbackSpy.args[0], [null, '<some>html</some>'])
      // assert file was written
      assert.ok(this.writeFileStub.called)
      assert.deepEqual(this.writeFileStub.args[0][0], '/foo.html')
      assert.deepEqual(this.writeFileStub.args[0][1], '<some>html</some>')
    })
  })

  /**
   * downloadSuiteSeleniumJson() also falls outside the standard internal pattern of passing through the basic
   * parameters to client.request(), we'll set up a few special tests around this specifically.
   */
  describe('downloadSuiteSeleniumJson()', function () {
    beforeEach(function () {
      this.requestStub.resolves(successResponse)
      this.writeFileStub = sinon.stub(fs, 'writeFile')
      this.writeFileStub.callsFake(function (_dest, _data, cb) {
        cb(null)
      })
    })

    afterEach(function () {
      this.writeFileStub.restore()
    })

    it('(async) it should throw an error with ERROR response', async function () {
      this.requestStub.throws(new Error('some error'))
      try {
        await this.client.downloadSuiteSeleniumJson('suite-123', '/some/dest')
      } catch (error) {
        assert.ok(error)
        assert.equal(error.message, 'some error')
        return true
      }
      throw new assert.AssertionError({ message: 'Missing expected exception.' })
    })

    it('(callback) should return an error with ERROR response', async function () {
      this.requestStub.throws(new Error('some error'))
      this.client.downloadSuiteSeleniumJson('suite-123', '/some/place', this.callbackSpy)
      const callbackArgs = this.callbackSpy.args
      // give the callback a second to fire
      await wait()
      // first-position arg (error) should be non-null
      const error = callbackArgs[0][0]
      assert.ok(error)
      assert.equal(error.message, 'some error')
    })

    it('should download', async function () {
      this.requestStub.resolves('{"some": "json"}')
      const response = await this.client.downloadSuiteSeleniumJson('suite-123', '/foo.json', this.callbackSpy)
      // assert API call
      const requestOptions = this.requestStub.args[0][0]
      assert.equal(requestOptions.headers['User-Agent'], 'Ghost Inspector Node.js Client')
      assert.equal(requestOptions.json, undefined)
      assert.equal(requestOptions.method, 'GET')
      assert.equal(requestOptions.uri, 'https://api.ghostinspector.com/v1/suites/suite-123/export/selenium-json/?apiKey=my-api-key&')
      // download*() return the full response, assert async
      assert.equal(response, '{"some": "json"}')
      // assert callback called with (error, html)
      assert.deepEqual(this.callbackSpy.args[0], [null, '{"some": "json"}'])
      // assert file was written
      assert.ok(this.writeFileStub.called)
      assert.deepEqual(this.writeFileStub.args[0][0], '/foo.json')
      assert.deepEqual(this.writeFileStub.args[0][1], '{"some": "json"}')
    })
  })

  /**
   * downloadSuiteSeleniumSide() also falls outside the standard internal pattern of passing through the basic
   * parameters to client.request(), we'll set up a few special tests around this specifically.
   */
  describe('downloadSuiteSeleniumSide()', function () {
    beforeEach(function () {
      this.requestStub.resolves(successResponse)
      this.writeFileStub = sinon.stub(fs, 'writeFile')
      this.writeFileStub.callsFake(function (_dest, _data, cb) {
        cb(null)
      })
    })

    afterEach(function () {
      this.writeFileStub.restore()
    })

    it('(async) it should throw an error with ERROR response', async function () {
      this.requestStub.throws(new Error('some error'))
      try {
        await this.client.downloadSuiteSeleniumSide('suite-123', '/some/dest')
      } catch (error) {
        assert.ok(error)
        assert.equal(error.message, 'some error')
        return true
      }
      throw new assert.AssertionError({ message: 'Missing expected exception.' })
    })

    it('(callback) should return an error with ERROR response', async function () {
      this.requestStub.throws(new Error('some error'))
      this.client.downloadSuiteSeleniumSide('suite-123', '/some/place', this.callbackSpy)
      const callbackArgs = this.callbackSpy.args
      // give the callback a second to fire
      await wait()
      // first-position arg (error) should be non-null
      const error = callbackArgs[0][0]
      assert.ok(error)
      assert.equal(error.message, 'some error')
    })

    it('should download', async function () {
      this.requestStub.resolves('---\n - some data')
      const response = await this.client.downloadSuiteSeleniumSide('suite-123', '/foo.side', this.callbackSpy)
      // assert API call
      const requestOptions = this.requestStub.args[0][0]
      assert.equal(requestOptions.headers['User-Agent'], 'Ghost Inspector Node.js Client')
      assert.equal(requestOptions.json, undefined)
      assert.equal(requestOptions.method, 'GET')
      assert.equal(requestOptions.uri, 'https://api.ghostinspector.com/v1/suites/suite-123/export/selenium-side/?apiKey=my-api-key&')
      // download*() return the full response, assert async
      assert.equal(response, '---\n - some data')
      // assert callback called with (error, html)
      assert.deepEqual(this.callbackSpy.args[0], [null, '---\n - some data'])
      // assert file was written
      assert.ok(this.writeFileStub.called)
      assert.deepEqual(this.writeFileStub.args[0][0], '/foo.side')
      assert.deepEqual(this.writeFileStub.args[0][1], '---\n - some data')
    })
  })

  it('getTests()', async function () {
    const response = await this.client.getTests(this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.equal(requestOptions.headers['User-Agent'], 'Ghost Inspector Node.js Client')
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'GET')
    assert.equal(requestOptions.uri, 'https://api.ghostinspector.com/v1/tests/?apiKey=my-api-key&')
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })

  it('getTest()', async function () {
    const response = await this.client.getTest('test-123', this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.equal(requestOptions.headers['User-Agent'], 'Ghost Inspector Node.js Client')
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'GET')
    assert.equal(requestOptions.uri, 'https://api.ghostinspector.com/v1/tests/test-123/?apiKey=my-api-key&')
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })

  it('getTestResults()', async function () {
    const response = await this.client.getTestResults('test-123', { count: 10, offset: 3 }, this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.equal(requestOptions.headers['User-Agent'], 'Ghost Inspector Node.js Client')
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'GET')
    assert.equal(requestOptions.uri, 'https://api.ghostinspector.com/v1/tests/test-123/results/?count=10&offset=3&apiKey=my-api-key&')
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })

  it('getTestResults() should use options-position callback', async function () {
    const response = await this.client.getTestResults('test-123', this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.equal(requestOptions.headers['User-Agent'], 'Ghost Inspector Node.js Client')
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'GET')
    assert.equal(requestOptions.uri, 'https://api.ghostinspector.com/v1/tests/test-123/results/?apiKey=my-api-key&')
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })

  it('getTestResultsRunning()', async function () {
    const response = await this.client.getTestResultsRunning('test-123', this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.equal(requestOptions.headers['User-Agent'], 'Ghost Inspector Node.js Client')
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'GET')
    assert.equal(requestOptions.uri, 'https://api.ghostinspector.com/v1/tests/test-123/running/?apiKey=my-api-key&')
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })

  it('acceptTestScreenshot()', async function () {
    const response = await this.client.acceptTestScreenshot('test-123', this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.equal(requestOptions.headers['User-Agent'], 'Ghost Inspector Node.js Client')
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'POST')
    assert.equal(requestOptions.uri, 'https://api.ghostinspector.com/v1/tests/test-123/accept-screenshot/')
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })

  it('duplicateTest()', async function () {
    const response = await this.client.duplicateTest('test-123', this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.equal(requestOptions.headers['User-Agent'], 'Ghost Inspector Node.js Client')
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'POST')
    assert.equal(requestOptions.uri, 'https://api.ghostinspector.com/v1/tests/test-123/duplicate/')
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })

  /**
   * executeTest() falls outside the standard internal pattern of passing through the basic
   * parameters to client.request(), we'll set up a few special tests around this specifically.
   */
  describe('executeTest()', function () {
    it('(async) should throw an error with ERROR response', async function () {
      this.requestStub.throws(new Error('some error'))
      try {
        await this.client.executeTest('suite-123')
      } catch (error) {
        assert.ok(error)
        assert.equal(error.message, 'some error')
        return true
      }
      throw new assert.AssertionError({ message: 'Missing expected exception.' })
    })

    it('(callback) should return an error with ERROR response', async function () {
      this.requestStub.throws(new Error('some error'))
      this.client.executeTest('suite-123', {}, this.callbackSpy)
      const callbackArgs = this.callbackSpy.args
      // give the callback a second to fire
      await wait()
      // first-position arg (error) should be non-null
      const error = callbackArgs[0][0]
      assert.ok(error)
      assert.equal(error.message, 'some error')
    })

    it('should execute a test', async function () {
      const outcomeStub = sinon.stub(this.client, 'getOverallResultOutcome')
      outcomeStub.returns(true)
      const response = await this.client.executeTest('test-123', {}, this.callbackSpy)
      // assert API call
      const requestOptions = this.requestStub.args[0][0]
      assert.equal(requestOptions.headers['User-Agent'], 'Ghost Inspector Node.js Client')
      assert.equal(requestOptions.json, true)
      assert.equal(requestOptions.method, 'POST')
      assert.equal(requestOptions.uri, 'https://api.ghostinspector.com/v1/tests/test-123/execute/')
      // assert async
      assert.deepEqual(response, [{ expected: 'data' }, true])
      // assert callback called with (error, data, passing)
      assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }, true])
      outcomeStub.restore()
    })

    it('should use should use options-position callback', async function () {
      const outcomeStub = sinon.stub(this.client, 'getOverallResultOutcome')
      outcomeStub.returns(true)
      // pass callback as second-position argument
      const response = await this.client.executeTest('test-123', this.callbackSpy)
      // assert async
      assert.deepEqual(response, [{ expected: 'data' }, true])
      // assert callback called with (error, data, passing)
      assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }, true])
      outcomeStub.restore()
    })
  })

  /**
   * downloadTestSeleniumHtml() also falls outside the standard internal pattern of passing through the basic
   * parameters to client.request(), we'll set up a few special tests around this specifically.
   */
  describe('downloadTestSeleniumHtml()', function () {
    beforeEach(function () {
      this.requestStub.resolves(successResponse)
      this.writeFileStub = sinon.stub(fs, 'writeFile')
      this.writeFileStub.callsFake(function (_dest, _data, cb) {
        cb(null)
      })
    })

    afterEach(function () {
      this.writeFileStub.restore()
    })

    it('(async) it should throw an error with ERROR response', async function () {
      this.requestStub.throws(new Error('some error'))
      try {
        await this.client.downloadTestSeleniumHtml('test-123', '/some/dest')
      } catch (error) {
        assert.ok(error)
        assert.equal(error.message, 'some error')
        return true
      }
      throw new assert.AssertionError({ message: 'Missing expected exception.' })
    })

    it('(callback) should return an error with ERROR response', async function () {
      this.requestStub.throws(new Error('some error'))
      this.client.downloadTestSeleniumHtml('test-123', '/some/place', this.callbackSpy)
      const callbackArgs = this.callbackSpy.args
      // give the callback a second to fire
      await wait()
      // first-position arg (error) should be non-null
      const error = callbackArgs[0][0]
      assert.ok(error)
      assert.equal(error.message, 'some error')
    })

    it('should download', async function () {
      this.requestStub.resolves('<some>html</some>')
      const response = await this.client.downloadTestSeleniumHtml('test-123', '/foo.html', this.callbackSpy)
      // assert API call
      const requestOptions = this.requestStub.args[0][0]
      assert.equal(requestOptions.headers['User-Agent'], 'Ghost Inspector Node.js Client')
      assert.equal(requestOptions.json, undefined)
      assert.equal(requestOptions.method, 'GET')
      assert.equal(requestOptions.uri, 'https://api.ghostinspector.com/v1/tests/test-123/export/selenium-html/?apiKey=my-api-key&')
      // download*() return the full response, assert async
      assert.equal(response, '<some>html</some>')
      // assert callback called with (error, html)
      assert.deepEqual(this.callbackSpy.args[0], [null, '<some>html</some>'])
      // assert file was written
      assert.ok(this.writeFileStub.called)
      assert.deepEqual(this.writeFileStub.args[0][0], '/foo.html')
      assert.deepEqual(this.writeFileStub.args[0][1], '<some>html</some>')
    })
  })

  /**
   * downloadTestSeleniumJson() also falls outside the standard internal pattern of passing through the basic
   * parameters to client.request(), we'll set up a few special tests around this specifically.
   */
  describe('downloadTestSeleniumJson()', function () {
    beforeEach(function () {
      this.requestStub.resolves(successResponse)
      this.writeFileStub = sinon.stub(fs, 'writeFile')
      this.writeFileStub.callsFake(function (_dest, _data, cb) {
        cb(null)
      })
    })

    afterEach(function () {
      this.writeFileStub.restore()
    })

    it('(async) it should throw an error with ERROR response', async function () {
      this.requestStub.throws(new Error('some error'))
      try {
        await this.client.downloadTestSeleniumJson('test-123', '/some/dest')
      } catch (error) {
        assert.ok(error)
        assert.equal(error.message, 'some error')
        return true
      }
      throw new assert.AssertionError({ message: 'Missing expected exception.' })
    })

    it('(callback) should return an error with ERROR response', async function () {
      this.requestStub.throws(new Error('some error'))
      this.client.downloadTestSeleniumJson('test-123', '/some/place', this.callbackSpy)
      const callbackArgs = this.callbackSpy.args
      // give the callback a second to fire
      await wait()
      // first-position arg (error) should be non-null
      const error = callbackArgs[0][0]
      assert.ok(error)
      assert.equal(error.message, 'some error')
    })

    it('should download', async function () {
      this.requestStub.resolves('{"some": "json"}')
      const response = await this.client.downloadTestSeleniumJson('test-123', '/foo.json', this.callbackSpy)
      // assert API call
      const requestOptions = this.requestStub.args[0][0]
      assert.equal(requestOptions.headers['User-Agent'], 'Ghost Inspector Node.js Client')
      assert.equal(requestOptions.json, undefined)
      assert.equal(requestOptions.method, 'GET')
      assert.equal(requestOptions.uri, 'https://api.ghostinspector.com/v1/tests/test-123/export/selenium-json/?apiKey=my-api-key&')
      // download*() return the full response, assert async
      assert.equal(response, '{"some": "json"}')
      // assert callback called with (error, html)
      assert.deepEqual(this.callbackSpy.args[0], [null, '{"some": "json"}'])
      // assert file was written
      assert.ok(this.writeFileStub.called)
      assert.deepEqual(this.writeFileStub.args[0][0], '/foo.json')
      assert.deepEqual(this.writeFileStub.args[0][1], '{"some": "json"}')
    })
  })

  /**
   * downloadSuiteSeleniumSide() also falls outside the standard internal pattern of passing through the basic
   * parameters to client.request(), we'll set up a few special tests around this specifically.
   */
  describe('downloadTestSeleniumSide()', function () {
    beforeEach(function () {
      this.requestStub.resolves(successResponse)
      this.writeFileStub = sinon.stub(fs, 'writeFile')
      this.writeFileStub.callsFake(function (_dest, _data, cb) {
        cb(null)
      })
    })

    afterEach(function () {
      this.writeFileStub.restore()
    })

    it('(async) it should throw an error with ERROR response', async function () {
      this.requestStub.throws(new Error('some error'))
      try {
        await this.client.downloadTestSeleniumSide('test-123', '/some/dest')
      } catch (error) {
        assert.ok(error)
        assert.equal(error.message, 'some error')
        return true
      }
      throw new assert.AssertionError({ message: 'Missing expected exception.' })
    })

    it('(callback) should return an error with ERROR response', async function () {
      this.requestStub.throws(new Error('some error'))
      this.client.downloadTestSeleniumSide('test-123', '/some/place', this.callbackSpy)
      const callbackArgs = this.callbackSpy.args
      // give the callback a second to fire
      await wait()
      // first-position arg (error) should be non-null
      const error = callbackArgs[0][0]
      assert.ok(error)
      assert.equal(error.message, 'some error')
    })

    it('should download', async function () {
      this.requestStub.resolves('---\n - some data')
      const response = await this.client.downloadTestSeleniumSide('test-123', '/foo.side', this.callbackSpy)
      // assert API call
      const requestOptions = this.requestStub.args[0][0]
      assert.equal(requestOptions.headers['User-Agent'], 'Ghost Inspector Node.js Client')
      assert.equal(requestOptions.json, undefined)
      assert.equal(requestOptions.method, 'GET')
      assert.equal(requestOptions.uri, 'https://api.ghostinspector.com/v1/tests/test-123/export/selenium-side/?apiKey=my-api-key&')
      // download*() return the full response, assert async
      assert.equal(response, '---\n - some data')
      // assert callback called with (error, html)
      assert.deepEqual(this.callbackSpy.args[0], [null, '---\n - some data'])
      // assert file was written
      assert.ok(this.writeFileStub.called)
      assert.deepEqual(this.writeFileStub.args[0][0], '/foo.side')
      assert.deepEqual(this.writeFileStub.args[0][1], '---\n - some data')
    })
  })

  it('getSuiteResult()', async function () {
    const response = await this.client.getSuiteResult('test-123', this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.equal(requestOptions.headers['User-Agent'], 'Ghost Inspector Node.js Client')
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'GET')
    assert.equal(requestOptions.uri, 'https://api.ghostinspector.com/v1/suite-results/test-123/?apiKey=my-api-key&')
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })

  it('getSuiteResultTestResults()', async function () {
    const response = await this.client.getSuiteResultTestResults('test-123', this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.equal(requestOptions.headers['User-Agent'], 'Ghost Inspector Node.js Client')
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'GET')
    assert.equal(requestOptions.uri, 'https://api.ghostinspector.com/v1/suite-results/test-123/results/?apiKey=my-api-key&')
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })

  it('getSuiteResultXUnit()', async function () {
    this.requestStub.resolves('<some>xml</some>')
    const response = await this.client.getSuiteResultXUnit('test-123', this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.equal(requestOptions.headers['User-Agent'], 'Ghost Inspector Node.js Client')
    assert.equal(requestOptions.json, false)
    assert.equal(requestOptions.method, 'GET')
    assert.equal(requestOptions.uri, 'https://api.ghostinspector.com/v1/suite-results/test-123/xunit/?apiKey=my-api-key&')
    // assert async
    assert.equal(response, '<some>xml</some>')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, '<some>xml</some>'])
  })

  it('cancelSuiteResult()', async function () {
    const response = await this.client.cancelSuiteResult('suite-123', this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.equal(requestOptions.headers['User-Agent'], 'Ghost Inspector Node.js Client')
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'POST')
    assert.equal(requestOptions.uri, 'https://api.ghostinspector.com/v1/suite-results/suite-123/cancel/')
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })

  it('getTestResult()', async function () {
    const response = await this.client.getTestResult('test-123', this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.equal(requestOptions.headers['User-Agent'], 'Ghost Inspector Node.js Client')
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'GET')
    assert.equal(requestOptions.uri, 'https://api.ghostinspector.com/v1/results/test-123/?apiKey=my-api-key&')
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })

  it('getResult()', async function () {
    const response = await this.client.getResult('test-123', this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.equal(requestOptions.headers['User-Agent'], 'Ghost Inspector Node.js Client')
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'GET')
    assert.equal(requestOptions.uri, 'https://api.ghostinspector.com/v1/results/test-123/?apiKey=my-api-key&')
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })

  it('cancelTestResult()', async function () {
    const response = await this.client.cancelTestResult('result-123', this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.equal(requestOptions.headers['User-Agent'], 'Ghost Inspector Node.js Client')
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'POST')
    assert.equal(requestOptions.uri, 'https://api.ghostinspector.com/v1/results/result-123/cancel/')
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })

  it('cancelResult()', async function () {
    const response = await this.client.cancelResult('result-123', this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.equal(requestOptions.headers['User-Agent'], 'Ghost Inspector Node.js Client')
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'POST')
    assert.equal(requestOptions.uri, 'https://api.ghostinspector.com/v1/results/result-123/cancel/')
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })
})
