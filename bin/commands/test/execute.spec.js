describe('execute', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './test/execute',
      clientMethod: 'executeTest',
      clientMethodResponse: [{ name: 'My test', _id: '98765', passing: true }, true, false],
    })
  })

  it('should throw an error', async function () {
    await this.testRejection()
  })

  it('should print JSON', async function () {
    await this.testJsonOutput({
      handlerInput: {
        testId: 'my-test-id',
        myVar: 'foobar',
        immediate: true,
      },
      expectedClientArgs: ['my-test-id', { myVar: 'foobar', immediate: true }],
      expectedOutput: ['{"name":"My test","_id":"98765","passing":true}'],
    })
  })

  it('should print plain text', async function () {
    await this.testPlainOutput({
      handlerInput: {
        testId: 'my-test-id',
        myVar: 'foobar',
      },
      expectedClientArgs: ['my-test-id', { myVar: 'foobar' }],
      expectedOutput: [['\u001b[32m✓\u001b[39m Result: My test (98765)']],
    })
  })
})

describe('execute --immediate=true', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './test/execute',
      clientMethod: 'executeTest',
      clientMethodResponse: [
        { name: 'My test', _id: '98765', passing: null, screenshotComparePassing: null },
        null,
        null,
      ],
    })
  })

  it('should ignore --errorOnFail when --immediate', async function () {
    await this.testPlainOutput({
      handlerInput: {
        testId: 'my-test-id',
        myVar: 'foobar',
        immediate: true,
      },
      expectedClientArgs: ['my-test-id', { myVar: 'foobar', immediate: true }],
      expectedOutput: [['? Result: My test (98765)']],
    })
  })

  it('should ignore --errorOnScreenshotFail when --immediate', async function () {
    await this.testPlainOutput({
      handlerInput: {
        testId: 'my-test-id',
        myVar: 'foobar',
        immediate: true,
        errorOnScreenshotFail: true,
      },
      expectedClientArgs: ['my-test-id', { myVar: 'foobar', immediate: true }],
      expectedOutput: [['? Result: My test (98765)']],
    })
  })

  it('should ignore --errorOnFail and --errorOnScreenshotFail when --immediate', async function () {
    await this.testPlainOutput({
      handlerInput: {
        testId: 'my-test-id',
        myVar: 'foobar',
        immediate: true,
        errorOnFail: true,
        errorOnScreenshotFail: true,
      },
      expectedClientArgs: ['my-test-id', { myVar: 'foobar', immediate: true }],
      expectedOutput: [['? Result: My test (98765)']],
    })
  })
})

describe('execute --immediate=false', function () {
  describe('single: test failing, screenshot failing', function () {
    beforeEach(function () {
      this.setUpHandler({
        commandModule: './test/execute',
        clientMethod: 'executeTest',
        clientMethodResponse: [
          { name: 'My test', _id: '98765', passing: false, screenshotComparePassing: false },
          false,
          false,
        ],
      })
    })

    it('--errorOnFail should exit with error for test failing', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          testId: 'my-test-id',
          myVar: 'foobar',
          immediate: false,
          errorOnFail: true,
        },
        expectedClientArgs: ['my-test-id', { myVar: 'foobar', immediate: false }],
        expectedOutput: [['\u001b[31m✖️\u001b[39m Result: My test (98765)']],
      })
    })

    it('--errorOnScreenshotFail should exit with error for screenshot failing', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          testId: 'my-test-id',
          myVar: 'foobar',
          immediate: false,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-test-id', { myVar: 'foobar', immediate: false }],
        expectedOutput: [['\u001b[31m✖️\u001b[39m Result: My test (98765)']],
      })
    })
  })

  describe('test passing, screenshot failing', function () {
    beforeEach(function () {
      this.setUpHandler({
        commandModule: './test/execute',
        clientMethod: 'executeTest',
        clientMethodResponse: [
          { name: 'My test', _id: '98765', passing: true, screenshotComparePassing: false },
          true,
          false,
        ],
      })
    })

    it('--errorOnFail should exit with success for test passing', async function () {
      this.setExpectedExitCode(0)
      await this.testPlainOutput({
        handlerInput: {
          testId: 'my-test-id',
          myVar: 'foobar',
          immediate: false,
          errorOnFail: true,
        },
        expectedClientArgs: ['my-test-id', { myVar: 'foobar', immediate: false }],
        expectedOutput: [['\u001b[32m✓\u001b[39m Result: My test (98765)']],
      })
    })

    it('--errorOnScreenshotFail should exit with error for screenshot failing', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          testId: 'my-test-id',
          myVar: 'foobar',
          immediate: false,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-test-id', { myVar: 'foobar', immediate: false }],
        expectedOutput: [['\u001b[31m✖️\u001b[39m Result: My test (98765)']],
      })
    })

    it('--errorOnFail --errorOnScreenshotFail should exit with error for screenshot failing', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          testId: 'my-test-id',
          myVar: 'foobar',
          immediate: false,
          errorOnFail: true,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-test-id', { myVar: 'foobar', immediate: false }],
        expectedOutput: [['\u001b[31m✖️\u001b[39m Result: My test (98765)']],
      })
    })
  })

  describe('test failing, screenshot passing', function () {
    beforeEach(function () {
      this.setUpHandler({
        commandModule: './test/execute',
        clientMethod: 'executeTest',
        clientMethodResponse: [
          { name: 'My test', _id: '98765', passing: false, screenshotComparePassing: true },
          false,
          true,
        ],
      })
    })

    it('--errorOnFail should exit with error for test passing', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          testId: 'my-test-id',
          myVar: 'foobar',
          immediate: false,
          errorOnFail: true,
        },
        expectedClientArgs: ['my-test-id', { myVar: 'foobar', immediate: false }],
        expectedOutput: [['\u001b[31m✖️\u001b[39m Result: My test (98765)']],
      })
    })

    it('--errorOnScreenshotFail should exit with success for screenshot passing', async function () {
      this.setExpectedExitCode(0)
      await this.testPlainOutput({
        handlerInput: {
          testId: 'my-test-id',
          myVar: 'foobar',
          immediate: false,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-test-id', { myVar: 'foobar', immediate: false }],
        expectedOutput: [['\u001b[32m✓\u001b[39m Result: My test (98765)']],
      })
    })

    it('--errorOnFail --errorOnScreenshotFail should exit with error for screenshot failing', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          testId: 'my-test-id',
          myVar: 'foobar',
          immediate: false,
          errorOnFail: true,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-test-id', { myVar: 'foobar', immediate: false }],
        expectedOutput: [['\u001b[31m✖️\u001b[39m Result: My test (98765)']],
      })
    })
  })

  describe('test passing, screenshot null', function () {
    beforeEach(function () {
      this.setUpHandler({
        commandModule: './test/execute',
        clientMethod: 'executeTest',
        clientMethodResponse: [
          { name: 'My test', _id: '98765', passing: true, screenshotComparePassing: null },
          true,
          null,
        ],
      })
    })

    it('--errorOnFail should exit with success for test passing', async function () {
      this.setExpectedExitCode(0)
      await this.testPlainOutput({
        handlerInput: {
          testId: 'my-test-id',
          myVar: 'foobar',
          immediate: false,
          errorOnFail: true,
        },
        expectedClientArgs: ['my-test-id', { myVar: 'foobar', immediate: false }],
        expectedOutput: [['\u001b[32m✓\u001b[39m Result: My test (98765)']],
      })
    })

    it('--errorOnScreenshotFail should exit with error for screenshot null', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          testId: 'my-test-id',
          myVar: 'foobar',
          immediate: false,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-test-id', { myVar: 'foobar', immediate: false }],
        expectedOutput: [['? Result: My test (98765)']],
      })
    })

    it('--errorOnFail --errorOnScreenshotFail should exit with error for screenshot null', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          testId: 'my-test-id',
          myVar: 'foobar',
          immediate: false,
          errorOnFail: true,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-test-id', { myVar: 'foobar', immediate: false }],
        expectedOutput: [['? Result: My test (98765)']],
      })
    })
  })

  describe('test null, screenshot passing', function () {
    beforeEach(function () {
      this.setUpHandler({
        commandModule: './test/execute',
        clientMethod: 'executeTest',
        clientMethodResponse: [
          { name: 'My test', _id: '98765', passing: null, screenshotComparePassing: true },
          null,
          true,
        ],
      })
    })
    it('--errorOnFail should exit with error for test null', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          testId: 'my-test-id',
          myVar: 'foobar',
          immediate: false,
          errorOnFail: true,
        },
        expectedClientArgs: ['my-test-id', { myVar: 'foobar', immediate: false }],
        expectedOutput: [['? Result: My test (98765)']],
      })
    })
    it('--errorOnScreenshotFail should exit with success for test null', async function () {
      this.setExpectedExitCode(0)
      await this.testPlainOutput({
        handlerInput: {
          testId: 'my-test-id',
          myVar: 'foobar',
          immediate: false,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-test-id', { myVar: 'foobar', immediate: false }],
        expectedOutput: [['\u001b[32m✓\u001b[39m Result: My test (98765)']],
      })
    })
    it('--errorOnFail --errorOnScreenshotFail should exit with error for test null', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          testId: 'my-test-id',
          myVar: 'foobar',
          immediate: false,
          errorOnFail: true,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-test-id', { myVar: 'foobar', immediate: false }],
        expectedOutput: [['? Result: My test (98765)']],
      })
    })
  })
})
