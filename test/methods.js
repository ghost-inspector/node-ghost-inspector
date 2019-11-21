const assert = require('assert').strict
const fs = require('fs')
const request = require('request-promise-native')
const sinon = require('sinon')

const successResponse = {
  code: 'SUCCESS',
  data: { name: 'test' }
}

describe('API methods', function () {
  before(function () {
    this.client = require('../index')('my-api-key')
  })

  beforeEach(function () {
    this.requestStub = sinon.stub(this.client, '_request')
    this.requestStub.resolves(successResponse)
    this.callbackStub = sinon.spy()
  })

  afterEach(function () {
    this.requestStub.restore()
  })

  describe('Client errors and defaults', function () {})

  describe('GhostInspector.getFolders()', function () {
    it('should get folders', async function () {
      const response = await this.client.getFolders(this.callbackStub)
      // assert API parts
      const requestOptions = this.requestStub.args[0][0]
      assert.equal(requestOptions.headers['User-Agent'], 'Ghost Inspector Node.js Client')
      assert.equal(requestOptions.json, true)
      assert.equal(requestOptions.method, 'GET')
      assert.equal(requestOptions.uri, 'https://api.ghostinspector.com/v1/folders/?apiKey=my-api-key&')
      // assert await
      assert.equal(response.name, 'test')
      // assert callback called with (null, data)
      assert.deepEqual(this.callbackStub.args[0], [null, { name: 'test' }])
    })
  })

})
