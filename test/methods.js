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
  data: { expected: 'data' },
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

  it('getAllRunningTests()', async function () {
    const response = await this.client.getAllRunningTests('org-123', this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'GET')
    assert.equal(
      requestOptions.uri,
      'https://api.ghostinspector.com/v1/organizations/org-123/running/?apiKey=my-api-key&',
    )
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })

  it('createFolder()', async function () {
    const response = await this.client.createFolder('org-id', 'folder-name', this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
    assert.deepEqual(requestOptions.formData, { organization: 'org-id', name: 'folder-name', apiKey: 'my-api-key' })
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'POST')
    assert.equal(
      requestOptions.uri,
      'https://api.ghostinspector.com/v1/folders/',
    )
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })

  it('getFolders()', async function () {
    const response = await this.client.getFolders(this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'GET')
    assert.equal(
      requestOptions.uri,
      'https://api.ghostinspector.com/v1/folders/?apiKey=my-api-key&',
    )
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })

  it('getFolder()', async function () {
    const response = await this.client.getFolder('folder-123', this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'GET')
    assert.equal(
      requestOptions.uri,
      'https://api.ghostinspector.com/v1/folders/folder-123/?apiKey=my-api-key&',
    )
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })

  it('updateFolder()', async function () {
    const response = await this.client.updateFolder('folder-id', 'new-folder-name', this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
    assert.deepEqual(requestOptions.formData, { name: 'new-folder-name', apiKey: 'my-api-key' })
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'POST')
    assert.equal(
      requestOptions.uri,
      'https://api.ghostinspector.com/v1/folders/folder-id/',
    )
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })

  it('getFolderSuites()', async function () {
    const response = await this.client.getFolderSuites('folder-123', this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'GET')
    assert.equal(
      requestOptions.uri,
      'https://api.ghostinspector.com/v1/folders/folder-123/suites/?apiKey=my-api-key&',
    )
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })

  it('getSuites()', async function () {
    const response = await this.client.getSuites(this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
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
    assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'GET')
    assert.equal(
      requestOptions.uri,
      'https://api.ghostinspector.com/v1/suites/suite-123/?apiKey=my-api-key&',
    )
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })

  it('getSuiteTests()', async function () {
    const response = await this.client.getSuiteTests('suite-123', this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'GET')
    assert.equal(
      requestOptions.uri,
      'https://api.ghostinspector.com/v1/suites/suite-123/tests/?apiKey=my-api-key&',
    )
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })

  it('getSuiteResults()', async function () {
    const response = await this.client.getSuiteResults(
      'suite-123',
      { count: 10, offset: 3 },
      this.callbackSpy,
    )
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'GET')
    assert.equal(
      requestOptions.uri,
      'https://api.ghostinspector.com/v1/suites/suite-123/results/?count=10&offset=3&apiKey=my-api-key&',
    )
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })

  it('getSuiteResults() should use options-position callback', async function () {
    const response = await this.client.getSuiteResults('suite-123', this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'GET')
    assert.equal(
      requestOptions.uri,
      'https://api.ghostinspector.com/v1/suites/suite-123/results/?apiKey=my-api-key&',
    )
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
    before(function () {
      this.sandbox = sinon.createSandbox()
    })

    afterEach(function () {
      this.sandbox.restore()
    })

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
      this.sandbox.stub(this.client, 'getOverallResultOutcome').returns(true)
      this.sandbox.stub(this.client, '_wait').resolves()

      const response = await this.client.executeSuite(
        'suite-123',
        { some: 'option' },
        this.callbackSpy,
      )
      // assert API call
      const requestOptions = this.requestStub.args[0][0]
      assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
      assert.equal(requestOptions.json, true)
      assert.equal(requestOptions.method, 'POST')
      assert.equal(
        requestOptions.uri,
        'https://api.ghostinspector.com/v1/suites/suite-123/execute/',
      )
      // assert async
      assert.deepEqual(response, [[{ expected: 'data' }], true, true])
      // assert callback called with (error, data, passing)
      assert.deepEqual(this.callbackSpy.args[0], [null, [{ expected: 'data' }], true, true])
    })

    it('should execute a suite and handle multiple results', async function () {
      this.sandbox.stub(this.client, 'getOverallResultOutcome').returns(true)
      this.sandbox.stub(this.client, '_wait').resolves()

      // won't reflect actual response, but shows that we can handle an array of results
      const responseData = [
        { expected: 'data' },
        { expected: 'data' },
        { expected: 'data' },
        { expected: 'data' },
      ]
      this.requestStub.onFirstCall().resolves({
        code: 'SUCCESS',
        data: responseData,
      })

      const response = await this.client.executeSuite(
        'suite-123',
        {
          browser: ['chrome', 'firefox'],
          region: ['us-east-1', 'us-east-2'],
          viewport: ['800x600', '1024x768'],
        },
        this.callbackSpy,
      )

      // assert API call
      const requestOptions = this.requestStub.args[0][0]
      assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
      assert.equal(requestOptions.json, true)
      assert.equal(requestOptions.method, 'POST')
      assert.equal(
        requestOptions.uri,
        'https://api.ghostinspector.com/v1/suites/suite-123/execute/',
      )

      // check response
      assert.deepEqual(response, [responseData, true, true])
      // assert callback called with (error, data, passing)
      assert.deepEqual(this.callbackSpy.args[0], [null, responseData, true, true])
    })

    it('should return an array when CSV has one row', async function () {
      // adjust the response
      this.requestStub.resolves({
        code: 'SUCCESS',
        data: [{ expected: 'data' }],
      })

      // mock out reading the file
      this.sandbox.stub(fs, 'createReadStream').returns('file-contents')
      // fudge the result
      this.sandbox
        .stub(this.client, 'getOverallResultOutcome')
        .returns(true)
        .onSecondCall()
        .returns(false)
      this.sandbox.stub(this.client, '_wait').resolves()
      const response = await this.client.executeSuite(
        'suite-123',
        { dataFile: './my-data-file.csv' },
        this.callbackSpy,
      )
      // assert API call
      const requestOptions = this.requestStub.args[0][0]
      assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
      assert.equal(requestOptions.json, true)
      assert.equal(requestOptions.method, 'POST')
      assert.equal(
        requestOptions.uri,
        'https://api.ghostinspector.com/v1/suites/suite-123/execute/',
      )
      assert.equal(requestOptions.formData.apiKey, 'my-api-key')
      assert.equal(requestOptions.formData.dataFile, 'file-contents')
      assert.equal(requestOptions.body, undefined)

      // assert async -- note the data is an array
      assert.deepEqual(response, [[{ expected: 'data' }], true, false])
      // assert callback called with (error, data, passing)
      assert.deepEqual(this.callbackSpy.args[0], [null, [{ expected: 'data' }], true, false])
    })

    it('should use should use options-position callback', async function () {
      this.sandbox
        .stub(this.client, 'getOverallResultOutcome')
        .returns(true)
        .onSecondCall()
        .returns(false)
      this.sandbox.stub(this.client, '_wait').resolves()

      // pass callback as second-position argument
      const response = await this.client.executeSuite('suite-123', this.callbackSpy)
      // assert async
      assert.deepEqual(response, [[{ expected: 'data' }], true, false])
      // assert callback called with (error, data, passing)
      assert.deepEqual(this.callbackSpy.args[0], [null, [{ expected: 'data' }], true, false])
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

    it('should download HTML', async function () {
      this.requestStub.resolves('<some>html</some>')
      const response = await this.client.downloadSuiteSeleniumHtml(
        'suite-123',
        '/foo.html',
        this.callbackSpy,
      )
      // assert API call
      const requestOptions = this.requestStub.args[0][0]
      assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
      assert.equal(requestOptions.json, undefined)
      assert.equal(requestOptions.method, 'GET')
      assert.equal(
        requestOptions.uri,
        'https://api.ghostinspector.com/v1/suites/suite-123/export/selenium-html/?apiKey=my-api-key&',
      )
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

    it('should download JSON', async function () {
      this.requestStub.resolves('{"some": "json"}')
      const response = await this.client.downloadSuiteSeleniumJson(
        'suite-123',
        '/foo.json',
        this.callbackSpy,
      )
      // assert API call
      const requestOptions = this.requestStub.args[0][0]
      assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
      assert.equal(requestOptions.json, undefined)
      assert.equal(requestOptions.method, 'GET')
      assert.equal(
        requestOptions.uri,
        'https://api.ghostinspector.com/v1/suites/suite-123/export/selenium-json/?apiKey=my-api-key&',
      )
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
   * downloadSuiteJson() also falls outside the standard internal pattern of passing through the basic
   * parameters to client.request(), we'll set up a few special tests around this specifically.
   */
  describe('downloadSuiteJson()', function () {
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
        await this.client.downloadSuiteJson('suite-123', '/some/dest')
      } catch (error) {
        assert.ok(error)
        assert.equal(error.message, 'some error')
        return true
      }
      throw new assert.AssertionError({ message: 'Missing expected exception.' })
    })

    it('(callback) should return an error with ERROR response', async function () {
      this.requestStub.throws(new Error('some error'))
      this.client.downloadSuiteJson('suite-123', '/some/place', this.callbackSpy)
      const callbackArgs = this.callbackSpy.args
      // give the callback a second to fire
      await wait()
      // first-position arg (error) should be non-null
      const error = callbackArgs[0][0]
      assert.ok(error)
      assert.equal(error.message, 'some error')
    })

    it('should download JSON', async function () {
      this.requestStub.resolves('{"some": "json"}')
      const response = await this.client.downloadSuiteJson(
        'suite-123',
        '/foo.json',
        this.callbackSpy,
      )
      // assert API call
      const requestOptions = this.requestStub.args[0][0]
      assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
      assert.equal(requestOptions.json, undefined)
      assert.equal(requestOptions.method, 'GET')
      assert.equal(
        requestOptions.uri,
        'https://api.ghostinspector.com/v1/suites/suite-123/export/json/?apiKey=my-api-key&',
      )
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

    it('should download SIDE', async function () {
      this.requestStub.resolves('---\n - some data')
      const response = await this.client.downloadSuiteSeleniumSide(
        'suite-123',
        '/foo.side',
        this.callbackSpy,
      )
      // assert API call
      const requestOptions = this.requestStub.args[0][0]
      assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
      assert.equal(requestOptions.json, undefined)
      assert.equal(requestOptions.method, 'GET')
      assert.equal(
        requestOptions.uri,
        'https://api.ghostinspector.com/v1/suites/suite-123/export/selenium-side/?apiKey=my-api-key&',
      )
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
    assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
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
    assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'GET')
    assert.equal(
      requestOptions.uri,
      'https://api.ghostinspector.com/v1/tests/test-123/?apiKey=my-api-key&',
    )
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })

  it('getTestResults()', async function () {
    const response = await this.client.getTestResults(
      'test-123',
      { count: 10, offset: 3 },
      this.callbackSpy,
    )
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'GET')
    assert.equal(
      requestOptions.uri,
      'https://api.ghostinspector.com/v1/tests/test-123/results/?count=10&offset=3&apiKey=my-api-key&',
    )
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })

  it('getTestResults() should use options-position callback', async function () {
    const response = await this.client.getTestResults('test-123', this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'GET')
    assert.equal(
      requestOptions.uri,
      'https://api.ghostinspector.com/v1/tests/test-123/results/?apiKey=my-api-key&',
    )
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })

  it('getTestResultsRunning()', async function () {
    const response = await this.client.getTestResultsRunning('test-123', this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'GET')
    assert.equal(
      requestOptions.uri,
      'https://api.ghostinspector.com/v1/tests/test-123/running/?apiKey=my-api-key&',
    )
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })

  it('acceptTestScreenshot()', async function () {
    const response = await this.client.acceptTestScreenshot('test-123', this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'POST')
    assert.equal(
      requestOptions.uri,
      'https://api.ghostinspector.com/v1/tests/test-123/accept-screenshot/',
    )
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })

  it('duplicateTest()', async function () {
    const response = await this.client.duplicateTest('test-123', this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
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
    before(function () {
      this.sandbox = sinon.createSandbox()
    })

    afterEach(function () {
      this.sandbox.restore()
    })

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
      this.sandbox.stub(this.client, 'getOverallResultOutcome').returns(true)
      this.sandbox.stub(this.client, '_wait').resolves()

      const response = await this.client.executeTest('test-123', {}, this.callbackSpy)
      // assert API call
      const requestOptions = this.requestStub.args[0][0]
      assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
      assert.equal(requestOptions.json, true)
      assert.equal(requestOptions.method, 'POST')
      assert.equal(requestOptions.uri, 'https://api.ghostinspector.com/v1/tests/test-123/execute/')
      assert.equal(requestOptions.formData.apiKey, 'my-api-key')
      // assert async
      assert.deepEqual(response, [{ expected: 'data' }, true, true])
      // assert callback called with (error, data, passing)
      assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }, true, true])
    })

    it('should execute a test with multiple browser/region/viewport', async function () {
      this.sandbox.stub(this.client, 'getOverallResultOutcome').returns(true)
      this.sandbox.stub(this.client, '_wait').resolves()

      // won't reflect actual response, but shows that we can handle an array of results
      const responseData = [
        { expected: 'data' },
        { expected: 'data' },
        { expected: 'data' },
        { expected: 'data' },
      ]
      this.requestStub.onFirstCall().resolves({
        code: 'SUCCESS',
        data: responseData,
      })

      const response = await this.client.executeTest(
        'test-123',
        {
          browser: ['chrome', 'firefox'],
          region: ['us-east-1', 'us-east-2'],
          viewport: ['800x600', '1024x768'],
        },
        this.callbackSpy,
      )

      // assert API call
      const requestOptions = this.requestStub.args[0][0]
      assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
      assert.equal(requestOptions.json, true)
      assert.equal(requestOptions.method, 'POST')
      assert.equal(requestOptions.uri, 'https://api.ghostinspector.com/v1/tests/test-123/execute/')
      assert.equal(requestOptions.formData.apiKey, 'my-api-key')
      assert.deepEqual(requestOptions.formData.browser, ['chrome', 'firefox'])
      assert.deepEqual(requestOptions.formData.region, ['us-east-1', 'us-east-2'])
      assert.deepEqual(requestOptions.formData.viewport, ['800x600', '1024x768'])
      // assert async
      assert.deepEqual(response, [responseData, true, true])
      // assert callback called with (error, data, passing)
      assert.deepEqual(this.callbackSpy.args[0], [null, responseData, true, true])
    })

    it('should use should use options-position callback', async function () {
      this.sandbox
        .stub(this.client, 'getOverallResultOutcome')
        .returns(true)
        .onSecondCall()
        .returns(false)
      this.sandbox.stub(this.client, '_wait').resolves()
      // pass callback as second-position argument
      const response = await this.client.executeTest('test-123', this.callbackSpy)
      // assert async
      assert.deepEqual(response, [{ expected: 'data' }, true, false])
      // assert callback called with (error, data, passing)
      assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }, true, false])
    })

    it('should execute a test with a CSV file with multiple browser/region/viewport', async function () {
      // mock out reading the file
      this.sandbox.stub(fs, 'createReadStream').returns('file-contents')

      // fudge the result
      this.sandbox
        .stub(this.client, 'getOverallResultOutcome')
        .returns(true)
        .onSecondCall()
        .returns(true)
      this.sandbox.stub(this.client, '_wait').resolves()

      const responseData = [
        { expected: 'data' },
        { expected: 'data' },
        { expected: 'data' },
        { expected: 'data' },
      ]
      this.requestStub.onFirstCall().resolves({
        code: 'SUCCESS',
        data: responseData,
      })

      const response = await this.client.executeTest(
        'test-123',
        {
          dataFile: './my-data-file.csv',
          browser: ['chrome', 'firefox'],
          region: ['us-east-1', 'us-east-2'],
          viewport: ['800x600', '1024x768'],
        },
        this.callbackSpy,
      )

      // assert API call
      const requestOptions = this.requestStub.args[0][0]
      assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
      assert.equal(requestOptions.json, true)
      assert.equal(requestOptions.method, 'POST')
      assert.equal(requestOptions.uri, 'https://api.ghostinspector.com/v1/tests/test-123/execute/')
      assert.equal(requestOptions.formData.apiKey, 'my-api-key')
      assert.equal(requestOptions.formData.dataFile, 'file-contents')
      assert.deepEqual(requestOptions.formData.browser, ['chrome', 'firefox'])
      assert.deepEqual(requestOptions.formData.region, ['us-east-1', 'us-east-2'])
      assert.deepEqual(requestOptions.formData.viewport, ['800x600', '1024x768'])
      assert.equal(requestOptions.body, undefined)

      // assert async response
      assert.deepEqual(response, [responseData, true, true])

      // assert callback called with (error, data, passing)
      assert.deepEqual(this.callbackSpy.args[0], [null, responseData, true, true])
    })

    it('should execute a test with a CSV file', async function () {
      // mock out reading the file
      this.sandbox.stub(fs, 'createReadStream').returns('file-contents')
      // fudge the result
      this.sandbox
        .stub(this.client, 'getOverallResultOutcome')
        .returns(true)
        .onSecondCall()
        .returns(false)
      this.sandbox.stub(this.client, '_wait').resolves()
      const response = await this.client.executeTest(
        'test-123',
        { dataFile: './my-data-file.csv' },
        this.callbackSpy,
      )
      // assert API call
      const requestOptions = this.requestStub.args[0][0]
      assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
      assert.equal(requestOptions.json, true)
      assert.equal(requestOptions.method, 'POST')
      assert.equal(requestOptions.uri, 'https://api.ghostinspector.com/v1/tests/test-123/execute/')
      assert.equal(requestOptions.formData.apiKey, 'my-api-key')
      assert.equal(requestOptions.formData.dataFile, 'file-contents')
      assert.equal(requestOptions.body, undefined)
      // assert async
      assert.deepEqual(response, [{ expected: 'data' }, true, false])
      // assert callback called with (error, data, passing)
      assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }, true, false])
    })

    it('should return an array when CSV has one row', async function () {
      // adjust the response
      this.requestStub.resolves({
        code: 'SUCCESS',
        data: [{ expected: 'data' }],
      })

      // mock out reading the file
      this.sandbox.stub(fs, 'createReadStream').returns('file-contents')
      // fudge the result
      this.sandbox
        .stub(this.client, 'getOverallResultOutcome')
        .returns(true)
        .onSecondCall()
        .returns(false)

      this.sandbox.stub(this.client, '_wait').resolves()
      const response = await this.client.executeTest(
        'test-123',
        { dataFile: './my-data-file.csv' },
        this.callbackSpy,
      )
      // assert API call
      const requestOptions = this.requestStub.args[0][0]
      assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
      assert.equal(requestOptions.json, true)
      assert.equal(requestOptions.method, 'POST')
      assert.equal(requestOptions.uri, 'https://api.ghostinspector.com/v1/tests/test-123/execute/')
      assert.equal(requestOptions.formData.apiKey, 'my-api-key')
      assert.equal(requestOptions.formData.dataFile, 'file-contents')
      assert.equal(requestOptions.body, undefined)

      // assert async -- note the data is an array
      assert.deepEqual(response, [[{ expected: 'data' }], true, false])
      // assert callback called with (error, data, passing)
      assert.deepEqual(this.callbackSpy.args[0], [null, [{ expected: 'data' }], true, false])
    })
  })

  /**
   * waitForResult() is an internal function that abstracts polling for test
   * and suite results.
   */
  describe('waitForResult()', function () {
    it('(async) should throw an error with ERROR response', async function () {
      const getTestResultStub = sinon.stub(this.client, 'getTestResult')
      getTestResultStub.throws(new Error('some error'))
      const pollFunction = () => getTestResultStub()
      try {
        await this.client.waitForResult(pollFunction, { pollInterval: 5 })
      } catch (error) {
        assert.ok(error)
        assert.equal(error.message, 'some error')
        getTestResultStub.restore()
        return true
      }
      throw new assert.AssertionError({ message: 'Missing expected exception.' })
    })

    it('(callback) should throw an error with ERROR response', async function () {
      const getTestResultStub = sinon.stub(this.client, 'getTestResult')
      getTestResultStub.throws(new Error('some error'))
      const pollFunction = () => getTestResultStub()
      this.client.waitForResult(pollFunction, { pollInterval: 5 }, this.callbackSpy)
      // allow callback to fire
      await wait()
      // first-position arg (error) should be non-null
      const callbackArgs = this.callbackSpy.args
      const error = callbackArgs[0][0]
      assert.ok(error)
      assert.equal(error.message, 'some error')
      getTestResultStub.restore()
    })

    it('should poll for a result', async function () {
      const getTestResultStub = sinon.stub(this.client, 'getTestResult')
      getTestResultStub.onFirstCall().returns({ passing: null })
      getTestResultStub.onSecondCall().returns({ passing: null })
      getTestResultStub.onThirdCall().returns({ passing: true })
      const pollFunction = () => getTestResultStub('result-123')
      const result = await this.client.waitForResult(
        pollFunction,
        { pollInterval: 1 },
        this.callbackSpy,
      )
      await wait(5)
      // assert we polled
      assert.equal(getTestResultStub.callCount, 3)
      // assert we got a value back async
      assert.equal(result.passing, true)
      // assert callback
      assert.deepEqual(this.callbackSpy.args[0], [null, { passing: true }])
      getTestResultStub.restore()
    })
  })

  describe('waitForTestResult()', function () {
    it('should poll for test result', async function () {
      const getTestResultStub = sinon.stub(this.client, 'getTestResult')
      getTestResultStub.resolves({ passing: true })
      const waitStub = sinon.stub(this.client, '_wait')
      waitStub.callThrough()
      const result = await this.client.waitForTestResult(
        'my-result-id',
        { pollInterval: 2 },
        this.callbackSpy,
      )
      await wait()
      assert.ok(result.passing)
      // assert proper endpoint was called
      assert.ok(getTestResultStub.called)
      // check that our pollInterval was used
      const waitArgs = waitStub.args[0]
      assert.deepEqual(waitArgs[0], 2)
      // assert callback
      const callbackArgs = this.callbackSpy.args[0]
      assert.deepEqual(callbackArgs, [null, { passing: true }])
      getTestResultStub.restore()
      waitStub.restore()
    })

    it('should use callback (in options position) and default pollInterval', async function () {
      const getTestResultStub = sinon.stub(this.client, 'getTestResult')
      const waitStub = sinon.stub(this.client, '_wait')
      const result = await this.client.waitForTestResult('my-result-id', this.callbackSpy)
      assert.ok(waitStub.called)
      const waitArgs = waitStub.args[0]
      assert.deepEqual(waitArgs, [5000])
      assert.ok(getTestResultStub.called)
      getTestResultStub.restore()
      waitStub.restore()
    })
  })

  describe('waitForSuiteResult', function () {
    it('should poll for suite result', async function () {
      const getSuiteResultStub = sinon.stub(this.client, 'getSuiteResult')
      getSuiteResultStub.resolves({ passing: true })
      const waitStub = sinon.stub(this.client, '_wait')
      waitStub.callThrough()
      const result = await this.client.waitForSuiteResult(
        'my-result-id',
        { pollInterval: 2 },
        this.callbackSpy,
      )
      await wait()
      assert.ok(result.passing)
      // assert proper endpoint was called
      assert.ok(getSuiteResultStub.called)
      // check that our pollInterval was used
      const waitArgs = waitStub.args[0]
      assert.deepEqual(waitArgs[0], 2)
      // assert callback
      const callbackArgs = this.callbackSpy.args[0]
      assert.deepEqual(callbackArgs, [null, { passing: true }])
      getSuiteResultStub.restore()
      waitStub.restore()
    })

    it('should use callback (in options position) and default pollInterval', async function () {
      const getSuiteResultStub = sinon.stub(this.client, 'getSuiteResult')
      const waitStub = sinon.stub(this.client, '_wait')
      const result = await this.client.waitForSuiteResult('my-result-id', this.callbackSpy)
      assert.ok(waitStub.called)
      const waitArgs = waitStub.args[0]
      assert.deepEqual(waitArgs, [5000])
      assert.ok(getSuiteResultStub.called)
      getSuiteResultStub.restore()
      waitStub.restore()
    })
  })

  /**
   * executeTestOnDemand() also falls outside the standard internal pattern of passing through the basic
   * parameters to client.request(), we'll set up a few special tests around this specifically.
   */
  describe('executeTestOnDemand()', function () {
    it('should throw an error if test not provided', async function () {
      try {
        await this.client.executeTestOnDemand('org-123')
      } catch (error) {
        assert.ok(error)
        assert.equal(error.message, 'test must be provided.')
        return true
      }
      throw new assert.AssertionError({ message: 'Missing expected exception.' })
    })

    it('(async) should throw an error with ERROR response', async function () {
      this.requestStub.throws(new Error('some error'))
      try {
        await this.client.executeTestOnDemand('org-123', { body: { name: 'foo' } })
      } catch (error) {
        assert.ok(error)
        assert.equal(error.message, 'some error')
        return true
      }
      throw new assert.AssertionError({ message: 'Missing expected exception.' })
    })

    it('(callback) should return an error with ERROR response', async function () {
      this.requestStub.throws(new Error('some error'))
      this.client.executeTestOnDemand('org-123', { body: { name: 'foo' } }, this.callbackSpy)
      // give the callback a second to fire
      await wait()
      // first-position arg (error) should be non-null
      const callbackArgs = this.callbackSpy.args
      const error = callbackArgs[0][0]
      assert.ok(error)
      assert.equal(error.message, 'some error')
    })

    it('should execute on-demand test', async function () {
      this.requestStub.resolves({ code: 'SUCCESS', data: { _id: '123' } })
      const response = await this.client.executeTestOnDemand(
        'org-123',
        { name: 'foo' },
        this.callbackSpy,
      )
      // assert API call
      const requestOptions = this.requestStub.args[0][0]
      assert.deepEqual(requestOptions.headers, {
        'Content-Type': 'application/json',
        'User-Agent': 'Ghost Inspector Node.js Client',
      })
      assert.equal(requestOptions.json, true)
      assert.equal(requestOptions.method, 'POST')
      assert.equal(
        requestOptions.uri,
        'https://api.ghostinspector.com/v1/organizations/org-123/on-demand/execute/',
      )
      assert.deepEqual(requestOptions.body, { apiKey: 'my-api-key', name: 'foo' })
      assert.equal(requestOptions.formData, undefined)
      // assert async
      assert.deepEqual(response, { _id: '123' })
      // const callbackArgs = this.callbackSpy.args
      assert.deepEqual(this.callbackSpy.args[0], [null, { _id: '123' }])
    })

    it('should execute on-demand test and poll', async function () {
      const result = { _id: '123' }
      // set up a stub to mock waiting for a results
      const waitStub = sinon.stub(this.client, 'waitForResult')
      waitStub.callsFake(function (_resultId) {
        return new Promise(function (resolve) {
          setTimeout(() => {
            resolve(result)
          }, 5)
        })
      })
      // set up success response
      this.requestStub.resolves({ code: 'SUCCESS', data: result })
      const options = { wait: true }
      const test = { name: 'foo' }
      const response = await this.client.executeTestOnDemand(
        'org-123',
        test,
        options,
        this.callbackSpy,
      )
      // assert API call
      const requestOptions = this.requestStub.args[0][0]
      assert.deepEqual(requestOptions.headers, {
        'Content-Type': 'application/json',
        'User-Agent': 'Ghost Inspector Node.js Client',
      })
      assert.equal(requestOptions.json, true)
      assert.equal(requestOptions.method, 'POST')
      assert.equal(
        requestOptions.uri,
        'https://api.ghostinspector.com/v1/organizations/org-123/on-demand/execute/',
      )
      assert.deepEqual(requestOptions.body, { apiKey: 'my-api-key', name: 'foo' })
      assert.equal(requestOptions.formData, undefined)
      // assert async
      assert.deepEqual(response, { _id: '123' })
      // assert that wait was called
      assert.ok(waitStub.called)
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

    it('should download HTML', async function () {
      this.requestStub.resolves('<some>html</some>')
      const response = await this.client.downloadTestSeleniumHtml(
        'test-123',
        '/foo.html',
        this.callbackSpy,
      )
      // assert API call
      const requestOptions = this.requestStub.args[0][0]
      assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
      assert.equal(requestOptions.json, undefined)
      assert.equal(requestOptions.method, 'GET')
      assert.equal(
        requestOptions.uri,
        'https://api.ghostinspector.com/v1/tests/test-123/export/selenium-html/?apiKey=my-api-key&',
      )
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

    it('should download JSON', async function () {
      this.requestStub.resolves('{"some": "json"}')
      const response = await this.client.downloadTestSeleniumJson(
        'test-123',
        '/foo.json',
        this.callbackSpy,
      )
      // assert API call
      const requestOptions = this.requestStub.args[0][0]
      assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
      assert.equal(requestOptions.json, undefined)
      assert.equal(requestOptions.method, 'GET')
      assert.equal(
        requestOptions.uri,
        'https://api.ghostinspector.com/v1/tests/test-123/export/selenium-json/?apiKey=my-api-key&',
      )
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
   * downloadTestJson() also falls outside the standard internal pattern of passing through the basic
   * parameters to client.request(), we'll set up a few special tests around this specifically.
   */
  describe('downloadTestJson()', function () {
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
        await this.client.downloadTestJson('test-123', '/some/dest')
      } catch (error) {
        assert.ok(error)
        assert.equal(error.message, 'some error')
        return true
      }
      throw new assert.AssertionError({ message: 'Missing expected exception.' })
    })

    it('(callback) should return an error with ERROR response', async function () {
      this.requestStub.throws(new Error('some error'))
      this.client.downloadTestJson('test-123', '/some/place', this.callbackSpy)
      const callbackArgs = this.callbackSpy.args
      // give the callback a second to fire
      await wait()
      // first-position arg (error) should be non-null
      const error = callbackArgs[0][0]
      assert.ok(error)
      assert.equal(error.message, 'some error')
    })

    it('should download JSON', async function () {
      this.requestStub.resolves('{"some": "json"}')
      const response = await this.client.downloadTestJson('test-123', '/foo.json', this.callbackSpy)
      // assert API call
      const requestOptions = this.requestStub.args[0][0]
      assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
      assert.equal(requestOptions.json, undefined)
      assert.equal(requestOptions.method, 'GET')
      assert.equal(
        requestOptions.uri,
        'https://api.ghostinspector.com/v1/tests/test-123/export/json/?apiKey=my-api-key&',
      )
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

    it('should download SIDE', async function () {
      this.requestStub.resolves('---\n - some data')
      const response = await this.client.downloadTestSeleniumSide(
        'test-123',
        '/foo.side',
        this.callbackSpy,
      )
      // assert API call
      const requestOptions = this.requestStub.args[0][0]
      assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
      assert.equal(requestOptions.json, undefined)
      assert.equal(requestOptions.method, 'GET')
      assert.equal(
        requestOptions.uri,
        'https://api.ghostinspector.com/v1/tests/test-123/export/selenium-side/?apiKey=my-api-key&',
      )
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
    assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'GET')
    assert.equal(
      requestOptions.uri,
      'https://api.ghostinspector.com/v1/suite-results/test-123/?apiKey=my-api-key&',
    )
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })

  it('getSuiteResultTestResults()', async function () {
    const response = await this.client.getSuiteResultTestResults('test-123', this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'GET')
    assert.equal(
      requestOptions.uri,
      'https://api.ghostinspector.com/v1/suite-results/test-123/results/?count=50&offset=0&apiKey=my-api-key&',
    )
    // assert async
    assert.equal(response[0].expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, [{ expected: 'data' }]])
  })

  it('getSuiteResultXUnit()', async function () {
    this.requestStub.resolves('<some>xml</some>')
    const response = await this.client.getSuiteResultXUnit('test-123', this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
    assert.equal(requestOptions.json, false)
    assert.equal(requestOptions.method, 'GET')
    assert.equal(
      requestOptions.uri,
      'https://api.ghostinspector.com/v1/suite-results/test-123/xunit/?apiKey=my-api-key&',
    )
    // assert async
    assert.equal(response, '<some>xml</some>')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, '<some>xml</some>'])
  })

  it('cancelSuiteResult()', async function () {
    const response = await this.client.cancelSuiteResult('suite-123', this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'POST')
    assert.equal(
      requestOptions.uri,
      'https://api.ghostinspector.com/v1/suite-results/suite-123/cancel/',
    )
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })

  it('getTestResult()', async function () {
    const response = await this.client.getTestResult('test-123', this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'GET')
    assert.equal(
      requestOptions.uri,
      'https://api.ghostinspector.com/v1/results/test-123/?apiKey=my-api-key&',
    )
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })

  it('getResult()', async function () {
    const response = await this.client.getResult('test-123', this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'GET')
    assert.equal(
      requestOptions.uri,
      'https://api.ghostinspector.com/v1/results/test-123/?apiKey=my-api-key&',
    )
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })

  it('cancelTestResult()', async function () {
    const response = await this.client.cancelTestResult('result-123', this.callbackSpy)
    // assert API call
    const requestOptions = this.requestStub.args[0][0]
    assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
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
    assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
    assert.equal(requestOptions.json, true)
    assert.equal(requestOptions.method, 'POST')
    assert.equal(requestOptions.uri, 'https://api.ghostinspector.com/v1/results/result-123/cancel/')
    // assert async
    assert.equal(response.expected, 'data')
    // assert callback called with (error, data)
    assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
  })

  describe('importTest()', function () {
    it('should import an HTML test when file path provided', async function () {
      const readFileStub = sinon.stub(fs, 'createReadStream')
      readFileStub.returns('html-file-contents')
      const response = await this.client.importTest(
        'suite-123',
        './my-file-path.html',
        this.callbackSpy,
      )
      const requestOptions = this.requestStub.args[0][0]
      assert.deepEqual(requestOptions.headers, { 'User-Agent': 'Ghost Inspector Node.js Client' })
      assert.equal(requestOptions.body, undefined)
      assert.deepEqual(requestOptions.formData, {
        apiKey: 'my-api-key',
        dataFile: 'html-file-contents',
      })
      assert.equal(requestOptions.method, 'POST')
      assert.equal(
        requestOptions.uri,
        'https://api.ghostinspector.com/v1/suites/suite-123/import-test',
      )
      // assert async response
      assert.equal(response.expected, 'data')
      // assert callback called with (error, data)
      assert.deepEqual(this.callbackSpy.args[0], [null, { expected: 'data' }])
      readFileStub.restore()
    })
  })
})
