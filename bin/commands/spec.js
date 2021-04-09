const assert = require('assert').strict
const sinon = require('sinon')
const client = require('../../index')('test-key')
const helpers = require('../helpers')

describe('CLI', function () {
  before(function () {
    this.sandbox = sinon.createSandbox()

    this.setUpHandler = ({ commandModule, clientMethod, clientMethodResponse }) => {
      this.handler = require(commandModule).handler
      this.clientMethodStub = this.sandbox.stub(client, clientMethod).resolves(clientMethodResponse)
    }

    this.testRejection = async () => {
      this.clientMethodStub.rejects(new Error('some error'))
      await assert.rejects(
        async () => {
          await this.handler()
        },
        Error,
        'some error',
      )
    }

    this.testJsonOutput = async ({ handlerInput, expectedClientArgs, expectedOutput }) => {
      await this.handler({ ...handlerInput, json: true })
      // check the ghost inspector method arguments
      assert.deepEqual(this.clientMethodStub.args[0], expectedClientArgs)
      // helpers.printJson will only ever get 1 argument, check it
      assert.deepEqual(this.consoleStub.args[0], expectedOutput)
      // make sure process exited successfully
      assert.ok(this.exitStub.calledWith(0))
    }

    this.testPlainOutput = async ({ handlerInput, expectedClientArgs, expectedOutput }) => {
      await this.handler({ ...handlerInput })
      // check the ghost inspector method arguments
      assert.deepEqual(this.clientMethodStub.args[0], expectedClientArgs)
      /**
       * helpers.print might be called multiple times, check all arguments
       */
      assert.deepEqual(this.consoleStub.args, expectedOutput)
      // make sure process exited successfully
      assert.ok(this.exitStub.calledWith(0))
    }
  })

  beforeEach(function () {
    this.getClientStub = this.sandbox.stub(helpers, 'getClient').returns(client)
    this.consoleStub = this.sandbox.stub(console, 'log')
    this.exitStub = this.sandbox.stub(process, 'exit')
  })

  afterEach(function () {
    this.sandbox.restore()
  })

  describe('folder', function () {
    require('./folder/create.spec')
    require('./folder/get.spec')
    require('./folder/list-suites.spec')
    require('./folder/list.spec')
    require('./folder/update.spec')
  })

  describe('organization', function () {
    require('./organization/get-running.spec')
  })

  describe('suite', function () {
    require('./suite/create.spec')
    require('./suite/download.spec')
    require('./suite/duplicate.spec')
    require('./suite/execute.spec')
    require('./suite/get.spec')
    require('./suite/import-test.spec')
    require('./suite/list-results.spec')
    require('./suite/list-tests.spec')
    require('./suite/list.spec')
    require('./suite/update.spec')
  })

  describe('suite', function () {
    require('./suite-result/cancel.spec')
    require('./suite-result/get-xunit-report.spec')
    require('./suite-result/get.spec')
    require('./suite-result/list-test-results.spec')
    require('./suite-result/list.spec')
  })

  describe('test', function () {
    require('./test/accept-screenshot.spec')
    require('./test/delete.spec')
    require('./test/download.spec')
    require('./test/duplicate.spec')
    require('./test/execute-on-demand.spec')
    require('./test/execute.spec')
    require('./test/get-running.spec')
    require('./test/get.spec')
    require('./test/list-results.spec')
    require('./test/list.spec')
    require('./test/update.spec')
  })
})
