const assert = require('assert')
const helpers = require('../../helpers')

const onDemandTest = { name: 'My on-demand test' }

describe('execute-on-demand', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './test/execute-on-demand',
      clientMethod: 'executeTestOnDemand',
      clientMethodResponse: [{ name: 'My test', _id: '98765', passing: null }, true, false],
    })

    // stub for file loading
    this.loadJsonStub = this.sandbox.stub(helpers, 'loadJsonFile').returns(onDemandTest)
  })

  it('should throw an error', async function () {
    await this.testRejection()
  })

  it('should print JSON', async function () {
    await this.testJsonOutput({
      handlerInput: {
        organizationId: 'my-org-id',
        file: 'my-on-demand-test.json',
        immediate: true,
      },
      expectedClientArgs: ['my-org-id', { name: 'My on-demand test' }, { wait: false }],
      expectedOutput: ['{"name":"My test","_id":"98765","passing":null}'],
    })

    // assert json file was loaded
    assert.ok(this.loadJsonStub.called)
    assert.ok(this.loadJsonStub.args[0], 'my-on-demand-test.json')
  })

  it('should print plain text', async function () {
    await this.testPlainOutput({
      handlerInput: {
        organizationId: 'my-test-id',
        immediate: true,
      },
      expectedClientArgs: ['my-test-id', { name: 'My on-demand test' }, { wait: false }],
      expectedOutput: [['\u001b[32m✓\u001b[39m Result: My test (98765)']],
    })

    // assert json file was loaded
    assert.ok(this.loadJsonStub.called)
    assert.ok(this.loadJsonStub.args[0], 'my-on-demand-test.json')
  })
})

describe('execute --immediate=true', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './test/execute-on-demand',
      clientMethod: 'executeTestOnDemand',
      clientMethodResponse: [{ name: 'My test', _id: '98765' }, null, null],
    })

    // stub for file loading
    this.loadJsonStub = this.sandbox.stub(helpers, 'loadJsonFile').returns(onDemandTest)
  })

  it('should ignore --errorOnFail when --immediate', async function () {
    await this.testPlainOutput({
      handlerInput: {
        organizationId: 'my-org-id',
        file: 'my-on-demand-test.json',
        immediate: true,
      },
      expectedClientArgs: ['my-org-id', { name: 'My on-demand test' }, { wait: false }],
      expectedOutput: [['? Result: My test (98765)']],
    })
  })

  it('should ignore --errorOnScreenshotFail when --immediate', async function () {
    await this.testPlainOutput({
      handlerInput: {
        organizationId: 'my-org-id',
        file: 'my-on-demand-test.json',
        immediate: true,
        errorOnScreenshotFail: true,
      },
      expectedClientArgs: ['my-org-id', { name: 'My on-demand test' }, { wait: false }],
      expectedOutput: [['? Result: My test (98765)']],
    })
  })

  it('should ignore --errorOnFail and --errorOnScreenshotFail when --immediate', async function () {
    await this.testPlainOutput({
      handlerInput: {
        organizationId: 'my-org-id',
        file: 'my-on-demand-test.json',
        immediate: true,
        errorOnFail: true,
        errorOnScreenshotFail: true,
      },
      expectedClientArgs: ['my-org-id', { name: 'My on-demand test' }, { wait: false }],
      expectedOutput: [['? Result: My test (98765)']],
    })
  })
})

describe('execute --immediate=false', function () {
  describe('test failing, screenshot failing', function () {
    beforeEach(function () {
      this.setUpHandler({
        commandModule: './test/execute-on-demand',
        clientMethod: 'executeTestOnDemand',
        clientMethodResponse: [{ name: 'My test', _id: '98765' }, false, false],
      })

      // stub for file loading
      this.loadJsonStub = this.sandbox.stub(helpers, 'loadJsonFile').returns(onDemandTest)
    })

    it('--errorOnFail should exit with error for test failing', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          organizationId: 'my-org-id',
          file: 'my-on-demand-test.json',
          immediate: false,
          errorOnFail: true,
        },
        expectedClientArgs: ['my-org-id', { name: 'My on-demand test' }, { wait: true }],
        expectedOutput: [['\u001b[31m✖️\u001b[39m Result: My test (98765)']],
      })
    })

    it('--errorOnScreenshotFail should exit with error for screenshot failing', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          organizationId: 'my-org-id',
          file: 'my-on-demand-test.json',
          immediate: false,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-org-id', { name: 'My on-demand test' }, { wait: true }],
        expectedOutput: [['\u001b[31m✖️\u001b[39m Result: My test (98765)']],
      })
    })
  })

  describe('test passing, screenshot failing', function () {
    beforeEach(function () {
      this.setUpHandler({
        commandModule: './test/execute-on-demand',
        clientMethod: 'executeTestOnDemand',
        clientMethodResponse: [{ name: 'My test', _id: '98765' }, true, false],
      })

      // stub for file loading
      this.loadJsonStub = this.sandbox.stub(helpers, 'loadJsonFile').returns(onDemandTest)
    })

    it('--errorOnFail should exit with success for test passing', async function () {
      this.setExpectedExitCode(0)
      await this.testPlainOutput({
        handlerInput: {
          organizationId: 'my-org-id',
          file: 'my-on-demand-test.json',
          immediate: false,
          errorOnFail: true,
        },
        expectedClientArgs: ['my-org-id', { name: 'My on-demand test' }, { wait: true }],
        expectedOutput: [['\u001b[32m✓\u001b[39m Result: My test (98765)']],
      })
    })

    it('--errorOnScreenshotFail should exit with error for screenshot failing', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          organizationId: 'my-org-id',
          file: 'my-on-demand-test.json',
          immediate: false,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-org-id', { name: 'My on-demand test' }, { wait: true }],
        expectedOutput: [['\u001b[31m✖️\u001b[39m Result: My test (98765)']],
      })
    })

    it('--errorOnFail --errorOnScreenshotFail should exit with error for screenshot failing', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          organizationId: 'my-org-id',
          file: 'my-on-demand-test.json',
          immediate: false,
          errorOnFail: true,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-org-id', { name: 'My on-demand test' }, { wait: true }],
        expectedOutput: [['\u001b[31m✖️\u001b[39m Result: My test (98765)']],
      })
    })
  })

  describe('test failing, screenshot passing', function () {
    beforeEach(function () {
      this.setUpHandler({
        commandModule: './test/execute-on-demand',
        clientMethod: 'executeTestOnDemand',
        clientMethodResponse: [{ name: 'My test', _id: '98765' }, false, true],
      })

      // stub for file loading
      this.loadJsonStub = this.sandbox.stub(helpers, 'loadJsonFile').returns(onDemandTest)
    })

    it('--errorOnFail should exit with error for test passing', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          organizationId: 'my-org-id',
          file: 'my-on-demand-test.json',
          immediate: false,
          errorOnFail: true,
        },
        expectedClientArgs: ['my-org-id', { name: 'My on-demand test' }, { wait: true }],
        expectedOutput: [['\u001b[31m✖️\u001b[39m Result: My test (98765)']],
      })
    })

    it('--errorOnScreenshotFail should exit with success for screenshot passing', async function () {
      this.setExpectedExitCode(0)
      await this.testPlainOutput({
        handlerInput: {
          organizationId: 'my-org-id',
          file: 'my-on-demand-test.json',
          immediate: false,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-org-id', { name: 'My on-demand test' }, { wait: true }],
        expectedOutput: [['\u001b[32m✓\u001b[39m Result: My test (98765)']],
      })
    })

    it('--errorOnFail --errorOnScreenshotFail should exit with error for screenshot failing', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          organizationId: 'my-org-id',
          file: 'my-on-demand-test.json',
          immediate: false,
          errorOnFail: true,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-org-id', { name: 'My on-demand test' }, { wait: true }],
        expectedOutput: [['\u001b[31m✖️\u001b[39m Result: My test (98765)']],
      })
    })
  })

  describe('test passing, screenshot null', function () {
    beforeEach(function () {
      this.setUpHandler({
        commandModule: './test/execute-on-demand',
        clientMethod: 'executeTestOnDemand',
        clientMethodResponse: [{ name: 'My test', _id: '98765' }, true, null],
      })

      // stub for file loading
      this.loadJsonStub = this.sandbox.stub(helpers, 'loadJsonFile').returns(onDemandTest)
    })

    it('--errorOnFail should exit with success for test passing', async function () {
      this.setExpectedExitCode(0)
      await this.testPlainOutput({
        handlerInput: {
          organizationId: 'my-org-id',
          file: 'my-on-demand-test.json',
          immediate: false,
          errorOnFail: true,
        },
        expectedClientArgs: ['my-org-id', { name: 'My on-demand test' }, { wait: true }],
        expectedOutput: [['\u001b[32m✓\u001b[39m Result: My test (98765)']],
      })
    })

    it('--errorOnScreenshotFail should exit with error for screenshot null', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          organizationId: 'my-org-id',
          file: 'my-on-demand-test.json',
          immediate: false,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-org-id', { name: 'My on-demand test' }, { wait: true }],
        expectedOutput: [['? Result: My test (98765)']],
      })
    })

    it('--errorOnFail --errorOnScreenshotFail should exit with error for screenshot null', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          organizationId: 'my-org-id',
          file: 'my-on-demand-test.json',
          immediate: false,
          errorOnFail: true,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-org-id', { name: 'My on-demand test' }, { wait: true }],
        expectedOutput: [['? Result: My test (98765)']],
      })
    })
  })

  describe('test null, screenshot passing', function () {
    beforeEach(function () {
      this.setUpHandler({
        commandModule: './test/execute-on-demand',
        clientMethod: 'executeTestOnDemand',
        clientMethodResponse: [{ name: 'My test', _id: '98765' }, null, true],
      })

      // stub for file loading
      this.loadJsonStub = this.sandbox.stub(helpers, 'loadJsonFile').returns(onDemandTest)
    })

    it('--errorOnFail should exit with error for test null', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          organizationId: 'my-org-id',
          file: 'my-on-demand-test.json',
          immediate: false,
          errorOnFail: true,
        },
        expectedClientArgs: ['my-org-id', { name: 'My on-demand test' }, { wait: true }],
        expectedOutput: [['? Result: My test (98765)']],
      })
    })

    it('--errorOnScreenshotFail should exit with success for test null', async function () {
      this.setExpectedExitCode(0)
      await this.testPlainOutput({
        handlerInput: {
          organizationId: 'my-org-id',
          file: 'my-on-demand-test.json',
          immediate: false,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-org-id', { name: 'My on-demand test' }, { wait: true }],
        expectedOutput: [['\u001b[32m✓\u001b[39m Result: My test (98765)']],
      })
    })

    it('--errorOnFail --errorOnScreenshotFail should exit with error for test null', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          organizationId: 'my-org-id',
          file: 'my-on-demand-test.json',
          immediate: false,
          errorOnFail: true,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-org-id', { name: 'My on-demand test' }, { wait: true }],
        expectedOutput: [['? Result: My test (98765)']],
      })
    })
  })
})
