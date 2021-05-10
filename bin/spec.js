const assert = require('assert').strict
const sinon = require('sinon')

const client = require('../index')('test-key')
const helpers = require('./helpers')

describe('CLI', function () {
  before(function () {
    this.sandbox = sinon.createSandbox()
    this.expectedExitCode = 0

    this.setExpectedExitCode = (code) => {
      this.expectedExitCode = code
    }

    this.setUpHandler = ({ commandModule, clientMethod, clientMethodResponse }) => {
      this.handler = require(`../bin/commands/${commandModule}`).handler
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
      assert.ok(this.exitStub.calledWith(this.expectedExitCode))
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
      assert.equal(this.exitStub.args[0][0], this.expectedExitCode)
    }
  })

  beforeEach(function () {
    this.getClientStub = this.sandbox.stub(helpers, 'getClient').returns(client)
    this.consoleStub = this.sandbox.stub(console, 'log')
    this.exitStub = this.sandbox.stub(process, 'exit')
  })

  afterEach(function () {
    this.sandbox.restore()
    this.expectedExitCode = 0
  })

  describe('folder', function () {
    require('./commands/folder')
    require('./commands/folder/get.spec')
    require('./commands/folder/list-suites.spec')
    require('./commands/folder/list.spec')
    require('./commands/folder/update.spec')
  })

  describe('organization', function () {
    require('./commands/organization/get-running.spec')
  })

  describe('suite', function () {
    require('./commands/suite/create.spec')
    require('./commands/suite/download.spec')
    require('./commands/suite/duplicate.spec')
    require('./commands/suite/execute.spec')
    require('./commands/suite/execute-multiple.spec')
    require('./commands/suite/get.spec')
    require('./commands/suite/import-test.spec')
    require('./commands/suite/list-results.spec')
    require('./commands/suite/list-tests.spec')
    require('./commands/suite/list.spec')
    require('./commands/suite/update.spec')
  })

  describe('suite-result', function () {
    require('./commands/suite-result/cancel.spec')
    require('./commands/suite-result/get-xunit-report.spec')
    require('./commands/suite-result/get.spec')
    require('./commands/suite-result/list-test-results.spec')
    require('./commands/suite-result/list.spec')
  })

  describe('test', function () {
    require('./commands/test/accept-screenshot.spec')
    require('./commands/test/delete.spec')
    require('./commands/test/download.spec')
    require('./commands/test/duplicate.spec')
    require('./commands/test/execute-on-demand.spec')
    require('./commands/test/execute-on-demand-multiple.spec')
    require('./commands/test/execute.spec')
    require('./commands/test/execute-multiple.spec')
    require('./commands/test/get-running.spec')
    require('./commands/test/get.spec')
    require('./commands/test/list-results.spec')
    require('./commands/test/list.spec')
    require('./commands/test/update.spec')
  })

  describe('test-result', function () {
    require('./commands/test-result/cancel.spec')
    require('./commands/test-result/get.spec')
    require('./commands/test-result/wait.spec')
  })
})
