const assert = require('assert').strict
const ngrok = require('ngrok')

describe('execute', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './suite/execute',
      clientMethod: 'executeSuite',
      clientMethodResponse: [{ name: 'My suite', _id: '98765', passing: true }, true, false],
    })
  })

  it('should throw an error', async function () {
    await this.testRejection()
  })

  it('should print JSON', async function () {
    await this.testJsonOutput({
      handlerInput: {
        suiteId: 'my-suite-id',
        myVar: 'foobar',
        immediate: true,
      },
      expectedClientArgs: ['my-suite-id', { myVar: 'foobar', immediate: true }],
      expectedOutput: ['{"name":"My suite","_id":"98765","passing":true}'],
    })
  })

  it('should print plain text', async function () {
    await this.testPlainOutput({
      handlerInput: {
        suiteId: 'my-suite-id',
        myVar: 'foobar',
      },
      expectedClientArgs: ['my-suite-id', { myVar: 'foobar' }],
      expectedOutput: [['\u001b[32m✓\u001b[39m Suite result: My suite (98765)']],
    })
  })
})

describe('execute --immediate=true', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './suite/execute',
      clientMethod: 'executeSuite',
      clientMethodResponse: [{ name: 'My suite', _id: '98765', passing: null }, null, null],
    })
  })

  it('should ignore --errorOnFail when --immediate', async function () {
    await this.testPlainOutput({
      handlerInput: {
        suiteId: 'my-suite-id',
        myVar: 'foobar',
        immediate: true,
      },
      expectedClientArgs: ['my-suite-id', { myVar: 'foobar', immediate: true }],
      expectedOutput: [['? Suite result: My suite (98765)']],
    })
  })

  it('should ignore --errorOnScreenshotFail when --immediate', async function () {
    await this.testPlainOutput({
      handlerInput: {
        suiteId: 'my-suite-id',
        myVar: 'foobar',
        immediate: true,
        errorOnScreenshotFail: true,
      },
      expectedClientArgs: ['my-suite-id', { myVar: 'foobar', immediate: true }],
      expectedOutput: [['? Suite result: My suite (98765)']],
    })
  })

  it('should ignore --errorOnFail and --errorOnScreenshotFail when --immediate', async function () {
    await this.testPlainOutput({
      handlerInput: {
        suiteId: 'my-suite-id',
        myVar: 'foobar',
        immediate: true,
        errorOnFail: true,
        errorOnScreenshotFail: true,
      },
      expectedClientArgs: ['my-suite-id', { myVar: 'foobar', immediate: true }],
      expectedOutput: [['? Suite result: My suite (98765)']],
    })
  })

  it('should throw an error when used with ngrok', async function () {
    const input = {
      suiteId: 'my-suite-id',
      myVar: 'foobar',
      immediate: true,
      ngrokTunnel: 8800,
    }
    await assert.rejects(this.handler(input), {
      message: 'Cannot use --ngrokTunnel with --immediate',
    })
  })
})

describe('execute --immediate=false', function () {
  describe('test failing, screenshot failing', function () {
    beforeEach(function () {
      this.setUpHandler({
        commandModule: './suite/execute',
        clientMethod: 'executeSuite',
        clientMethodResponse: [
          { name: 'My suite', _id: '98765', passing: false, screenshotComparePassing: false },
          false,
          false,
        ],
      })
    })

    it('--errorOnFail should exit with error for test failing', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          suiteId: 'my-suite-id',
          myVar: 'foobar',
          immediate: false,
          errorOnFail: true,
        },
        expectedClientArgs: ['my-suite-id', { myVar: 'foobar', immediate: false }],
        expectedOutput: [['\u001b[31m✖️\u001b[39m Suite result: My suite (98765)']],
      })
    })

    it('--errorOnScreenshotFail should exit with error for screenshot failing', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          suiteId: 'my-suite-id',
          myVar: 'foobar',
          immediate: false,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-suite-id', { myVar: 'foobar', immediate: false }],
        expectedOutput: [['\u001b[31m✖️\u001b[39m Suite result: My suite (98765)']],
      })
    })
  })

  describe('test passing, screenshot failing', function () {
    beforeEach(function () {
      this.setUpHandler({
        commandModule: './suite/execute',
        clientMethod: 'executeSuite',
        clientMethodResponse: [
          { name: 'My suite', _id: '98765', passing: true, screenshotComparePassing: false },
          true,
          false,
        ],
      })
    })

    it('--errorOnFail should exit with success for test passing', async function () {
      this.setExpectedExitCode(0)
      await this.testPlainOutput({
        handlerInput: {
          suiteId: 'my-suite-id',
          myVar: 'foobar',
          immediate: false,
          errorOnFail: true,
        },
        expectedClientArgs: ['my-suite-id', { myVar: 'foobar', immediate: false }],
        expectedOutput: [['\u001b[32m✓\u001b[39m Suite result: My suite (98765)']],
      })
    })

    it('--errorOnScreenshotFail should exit with error for screenshot failing', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          suiteId: 'my-suite-id',
          myVar: 'foobar',
          immediate: false,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-suite-id', { myVar: 'foobar', immediate: false }],
        expectedOutput: [['\u001b[31m✖️\u001b[39m Suite result: My suite (98765)']],
      })
    })

    it('--errorOnFail --errorOnScreenshotFail should exit with error for screenshot failing', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          suiteId: 'my-suite-id',
          myVar: 'foobar',
          immediate: false,
          errorOnFail: true,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-suite-id', { myVar: 'foobar', immediate: false }],
        expectedOutput: [['\u001b[31m✖️\u001b[39m Suite result: My suite (98765)']],
      })
    })
  })

  describe('test failing, screenshot passing', function () {
    beforeEach(function () {
      this.setUpHandler({
        commandModule: './suite/execute',
        clientMethod: 'executeSuite',
        clientMethodResponse: [
          { name: 'My suite', _id: '98765', passing: false, screenshotComparePassing: true },
          false,
          true,
        ],
      })
    })

    it('--errorOnFail should exit with error for test passing', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          suiteId: 'my-suite-id',
          myVar: 'foobar',
          immediate: false,
          errorOnFail: true,
        },
        expectedClientArgs: ['my-suite-id', { myVar: 'foobar', immediate: false }],
        expectedOutput: [['\u001b[31m✖️\u001b[39m Suite result: My suite (98765)']],
      })
    })

    it('--errorOnScreenshotFail should exit with success for screenshot passing', async function () {
      this.setExpectedExitCode(0)
      await this.testPlainOutput({
        handlerInput: {
          suiteId: 'my-suite-id',
          myVar: 'foobar',
          immediate: false,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-suite-id', { myVar: 'foobar', immediate: false }],
        expectedOutput: [['\u001b[32m✓\u001b[39m Suite result: My suite (98765)']],
      })
    })

    it('--errorOnFail --errorOnScreenshotFail should exit with error for screenshot failing', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          suiteId: 'my-suite-id',
          myVar: 'foobar',
          immediate: false,
          errorOnFail: true,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-suite-id', { myVar: 'foobar', immediate: false }],
        expectedOutput: [['\u001b[31m✖️\u001b[39m Suite result: My suite (98765)']],
      })
    })
  })

  describe('test passing, screenshot null', function () {
    beforeEach(function () {
      this.setUpHandler({
        commandModule: './suite/execute',
        clientMethod: 'executeSuite',
        clientMethodResponse: [
          { name: 'My suite', _id: '98765', passing: true, screenshotComparePassing: null },
          true,
          null,
        ],
      })
    })

    it('--errorOnFail should exit with success for test passing', async function () {
      this.setExpectedExitCode(0)
      await this.testPlainOutput({
        handlerInput: {
          suiteId: 'my-suite-id',
          myVar: 'foobar',
          immediate: false,
          errorOnFail: true,
        },
        expectedClientArgs: ['my-suite-id', { myVar: 'foobar', immediate: false }],
        expectedOutput: [['\u001b[32m✓\u001b[39m Suite result: My suite (98765)']],
      })
    })

    it('--errorOnScreenshotFail should exit with error for screenshot null', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          suiteId: 'my-suite-id',
          myVar: 'foobar',
          immediate: false,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-suite-id', { myVar: 'foobar', immediate: false }],
        expectedOutput: [['? Suite result: My suite (98765)']],
      })
    })

    it('--errorOnFail --errorOnScreenshotFail should exit with error for screenshot null', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          suiteId: 'my-suite-id',
          myVar: 'foobar',
          immediate: false,
          errorOnFail: true,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-suite-id', { myVar: 'foobar', immediate: false }],
        expectedOutput: [['? Suite result: My suite (98765)']],
      })
    })
  })

  describe('test null, screenshot passing', function () {
    beforeEach(function () {
      this.setUpHandler({
        commandModule: './suite/execute',
        clientMethod: 'executeSuite',
        clientMethodResponse: [
          { name: 'My suite', _id: '98765', passing: null, screenshotComparePassing: true },
          null,
          true,
        ],
      })
    })
    it('--errorOnFail should exit with error for test null', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          suiteId: 'my-suite-id',
          myVar: 'foobar',
          immediate: false,
          errorOnFail: true,
        },
        expectedClientArgs: ['my-suite-id', { myVar: 'foobar', immediate: false }],
        expectedOutput: [['? Suite result: My suite (98765)']],
      })
    })
    it('--errorOnScreenshotFail should exit with success for test null', async function () {
      this.setExpectedExitCode(0)
      await this.testPlainOutput({
        handlerInput: {
          suiteId: 'my-suite-id',
          myVar: 'foobar',
          immediate: false,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-suite-id', { myVar: 'foobar', immediate: false }],
        expectedOutput: [['\u001b[32m✓\u001b[39m Suite result: My suite (98765)']],
      })
    })
    it('--errorOnFail --errorOnScreenshotFail should exit with error for test null', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          suiteId: 'my-suite-id',
          myVar: 'foobar',
          immediate: false,
          errorOnFail: true,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-suite-id', { myVar: 'foobar', immediate: false }],
        expectedOutput: [['? Suite result: My suite (98765)']],
      })
    })
  })

  describe('ngrok', function () {
    beforeEach(function () {
      this.setUpHandler({
        commandModule: './suite/execute',
        clientMethod: 'executeSuite',
        clientMethodResponse: [{ name: 'My suite', _id: '98765' }, null, true],
      })
    })

    it('should set ngrokTunnel variable', async function () {
      this.sandbox.stub(ngrok, 'connect').resolves('some-url')

      await this.testPlainOutput({
        handlerInput: {
          suiteId: 'my-suite-id',
          myVar: 'foobar',
          immediate: false,
          ngrokTunnel: 8080,
          ngrokToken: 'token',
          ngrokUrlVariable: 'ngrokUrl',
        },
        expectedClientArgs: [
          'my-suite-id',
          { myVar: 'foobar', immediate: false, ngrokUrl: 'some-url' },
        ],
        expectedOutput: [
          ["Ngrok URL (some-url) assigned to variable 'ngrokUrl'"],
          ['Suite result: My suite (98765)'],
        ],
      })
    })

    it('should not have console output with --json', async function () {
      this.sandbox.stub(ngrok, 'connect').resolves('some-url')

      await this.testPlainOutput({
        handlerInput: {
          suiteId: 'my-suite-id',
          myVar: 'foobar',
          immediate: false,
          ngrokTunnel: 8080,
          ngrokToken: 'token',
          ngrokUrlVariable: 'ngrokUrl',
          json: true,
        },
        expectedClientArgs: [
          'my-suite-id',
          { myVar: 'foobar', immediate: false, ngrokUrl: 'some-url' },
        ],
        expectedOutput: [['{"name":"My suite","_id":"98765"}']],
      })
    })

    it('should use ngrokHostHeader', async function () {
      const connectStub = this.sandbox.stub(ngrok, 'connect').resolves('some-url')

      await this.testPlainOutput({
        handlerInput: {
          suiteId: 'my-suite-id',
          myVar: 'foobar',
          immediate: false,
          ngrokTunnel: 8080,
          ngrokToken: 'token',
          ngrokUrlVariable: 'ngrokUrl',
          ngrokHostHeader: 'some-header',
        },
        expectedClientArgs: [
          'my-suite-id',
          { myVar: 'foobar', immediate: false, ngrokUrl: 'some-url' },
        ],
        expectedOutput: [
          ["Ngrok URL (some-url) assigned to variable 'ngrokUrl'"],
          ['Suite result: My suite (98765)'],
        ],
      })

      assert.deepEqual(connectStub.args[0][0], {
        addr: 8080,
        authtoken: 'token',
        host_header: 'some-header',
      })
    })

    it('should tear down ngrok', async function () {
      const connectStub = this.sandbox.stub(ngrok, 'connect').resolves('some-url')
      const disconnectStub = this.sandbox.stub(ngrok, 'disconnect').resolves()

      await this.testPlainOutput({
        handlerInput: {
          suiteId: 'my-suite-id',
          myVar: 'foobar',
          immediate: false,
          ngrokTunnel: 8080,
          ngrokToken: 'token',
          ngrokUrlVariable: 'ngrokUrl',
          ngrokHostHeader: 'some-header',
        },
        expectedClientArgs: [
          'my-suite-id',
          { myVar: 'foobar', immediate: false, ngrokUrl: 'some-url' },
        ],
        expectedOutput: [
          ["Ngrok URL (some-url) assigned to variable 'ngrokUrl'"],
          ['Suite result: My suite (98765)'],
        ],
      })

      assert.ok(disconnectStub.called)
    })

    it('should ignore ngrok teardown error', async function () {
      const connectStub = this.sandbox.stub(ngrok, 'connect').resolves('some-url')
      const disconnectStub = this.sandbox.stub(ngrok, 'disconnect').rejects()

      await this.testPlainOutput({
        handlerInput: {
          suiteId: 'my-suite-id',
          myVar: 'foobar',
          immediate: false,
          ngrokTunnel: 8080,
          ngrokToken: 'token',
          ngrokUrlVariable: 'ngrokUrl',
          ngrokHostHeader: 'some-header',
        },
        expectedClientArgs: [
          'my-suite-id',
          { myVar: 'foobar', immediate: false, ngrokUrl: 'some-url' },
        ],
        expectedOutput: [
          ["Ngrok URL (some-url) assigned to variable 'ngrokUrl'"],
          ['Suite result: My suite (98765)'],
        ],
      })

      assert.ok(disconnectStub.called)
    })
  })
})
