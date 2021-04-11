describe('execute', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './suite/execute',
      clientMethod: 'executeSuite',
      clientMethodResponse: [{ name: 'My suite', _id: '98765' }, true, false],
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
      expectedOutput: ['{"name":"My suite","_id":"98765"}'],
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
      clientMethodResponse: [{ name: 'My suite', _id: '98765' }, null, null],
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
})

describe('execute --immediate=false', function () {
  describe('test failing, screenshot failing', function () {
    beforeEach(function () {
      this.setUpHandler({
        commandModule: './suite/execute',
        clientMethod: 'executeSuite',
        clientMethodResponse: [{ name: 'My suite', _id: '98765' }, false, false],
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
        clientMethodResponse: [{ name: 'My suite', _id: '98765' }, true, false],
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
        clientMethodResponse: [{ name: 'My suite', _id: '98765' }, false, true],
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
        clientMethodResponse: [{ name: 'My suite', _id: '98765' }, true, null],
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
        clientMethodResponse: [{ name: 'My suite', _id: '98765' }, null, true],
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
})
