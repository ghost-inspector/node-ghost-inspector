const assert = require('assert').strict
const sinon = require('sinon')

const client = require('../index')('test-key')
const helpers = require('../bin/helpers')

describe('CLI', function () {
  before(function () {
    this.sandbox = sinon.createSandbox()

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
    require('../bin/commands/folder')
    require('../bin/commands/folder/get.spec')
    require('../bin/commands/folder/list-suites.spec')
    require('../bin/commands/folder/list.spec')
    require('../bin/commands/folder/update.spec')
  })

  describe('organization', function () {
    require('../bin/commands/organization/get-running.spec')
  })

  describe('suite', function () {
    require('../bin/commands/suite/create.spec')
    require('../bin/commands/suite/download.spec')
    require('../bin/commands/suite/duplicate.spec')
    require('../bin/commands/suite/execute.spec')
    require('../bin/commands/suite/get.spec')
    require('../bin/commands/suite/import-test.spec')
    require('../bin/commands/suite/list-results.spec')
    require('../bin/commands/suite/list-tests.spec')
    require('../bin/commands/suite/list.spec')
    require('../bin/commands/suite/update.spec')
  })

  describe('suite', function () {
    require('../bin/commands/suite-result/cancel.spec')
    require('../bin/commands/suite-result/get-xunit-report.spec')
    require('../bin/commands/suite-result/get.spec')
    require('../bin/commands/suite-result/list-test-results.spec')
    require('../bin/commands/suite-result/list.spec')
  })

  describe('test', function () {
    require('../bin/commands/test/accept-screenshot.spec')
    require('../bin/commands/test/delete.spec')
    require('../bin/commands/test/download.spec')
    require('../bin/commands/test/duplicate.spec')
    require('../bin/commands/test/execute-on-demand.spec')
    require('../bin/commands/test/execute.spec')
    require('../bin/commands/test/get-running.spec')
    require('../bin/commands/test/get.spec')
    require('../bin/commands/test/list-results.spec')
    require('../bin/commands/test/list.spec')
    require('../bin/commands/test/update.spec')
  })
})
