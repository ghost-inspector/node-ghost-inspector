describe('wait', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './test-result/wait',
      clientMethod: 'waitForTestResult',
      clientMethodResponse: { name: 'My result', _id: '98765', passing: true },
    })
  })

  it('should throw an error', async function () {
    await this.testRejection()
  })

  it('should print JSON', async function () {
    await this.testJsonOutput({
      handlerInput: {
        resultId: 'my-result-id',
        pollInterval: 50,
      },
      expectedClientArgs: ['my-result-id', { pollInterval: 50 }],
      expectedOutput: ['{"name":"My result","_id":"98765","passing":true}'],
    })
  })

  it('should print plain text', async function () {
    await this.testPlainOutput({
      handlerInput: {
        resultId: 'my-result-id',
        pollInterval: 50,
      },
      expectedClientArgs: ['my-result-id', { pollInterval: 50 }],
      expectedOutput: [['\u001b[32m✓\u001b[39m My result (98765)']],
    })
  })
})

describe('execute --immediate=false', function () {
  describe('test failing, screenshot failing', function () {
    beforeEach(function () {
      this.setUpHandler({
        commandModule: './test-result/wait',
        clientMethod: 'waitForTestResult',
        clientMethodResponse: {
          name: 'My result',
          _id: '98765',
          passing: false,
          screenshotComparePassing: false,
        },
      })
    })
    it('--errorOnFail should exit with error for test failing', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          resultId: 'my-result-id',
          errorOnFail: true,
          pollInterval: 50,
        },
        expectedClientArgs: ['my-result-id', { pollInterval: 50 }],
        expectedOutput: [['\u001b[31m✖️\u001b[39m My result (98765)']],
      })
    })
    it('--errorOnScreenshotFail should exit with error for screenshot failing', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          resultId: 'my-result-id',
          pollInterval: 50,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-result-id', { pollInterval: 50 }],
        expectedOutput: [['\u001b[31m✖️\u001b[39m My result (98765)']],
      })
    })
  })

  describe('test passing, screenshot failing', function () {
    beforeEach(function () {
      this.setUpHandler({
        commandModule: './test-result/wait',
        clientMethod: 'waitForTestResult',
        clientMethodResponse: {
          name: 'My result',
          _id: '98765',
          passing: true,
          screenshotComparePassing: false,
        },
      })
    })

    it('--errorOnFail should exit with success for test passing', async function () {
      this.setExpectedExitCode(0)
      await this.testPlainOutput({
        handlerInput: {
          resultId: 'my-result-id',
          pollInterval: 50,
          errorOnFail: true,
        },
        expectedClientArgs: ['my-result-id', { pollInterval: 50 }],
        expectedOutput: [['\u001b[32m✓\u001b[39m My result (98765)']],
      })
    })

    it('--errorOnScreenshotFail should exit with error for screenshot failing', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          resultId: 'my-result-id',
          pollInterval: 50,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-result-id', { pollInterval: 50 }],
        expectedOutput: [['\u001b[31m✖️\u001b[39m My result (98765)']],
      })
    })

    it('--errorOnFail --errorOnScreenshotFail should exit with error for screenshot failing', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          resultId: 'my-result-id',
          pollInterval: 50,
          errorOnFail: true,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-result-id', { pollInterval: 50 }],
        expectedOutput: [['\u001b[31m✖️\u001b[39m My result (98765)']],
      })
    })
  })

  describe('test failing, screenshot passing', function () {
    beforeEach(function () {
      this.setUpHandler({
        commandModule: './test-result/wait',
        clientMethod: 'waitForTestResult',
        clientMethodResponse: {
          name: 'My result',
          _id: '98765',
          passing: false,
          screenshotComparePassing: true,
        },
      })
    })
    it('--errorOnFail should exit with error for test passing', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          resultId: 'my-result-id',
          pollInterval: 50,
          errorOnFail: true,
        },
        expectedClientArgs: ['my-result-id', { pollInterval: 50 }],
        expectedOutput: [['\u001b[31m✖️\u001b[39m My result (98765)']],
      })
    })
    it('--errorOnScreenshotFail should exit with success for screenshot passing', async function () {
      this.setExpectedExitCode(0)
      await this.testPlainOutput({
        handlerInput: {
          resultId: 'my-result-id',
          pollInterval: 50,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-result-id', { pollInterval: 50 }],
        expectedOutput: [['\u001b[32m✓\u001b[39m My result (98765)']],
      })
    })
    it('--errorOnFail --errorOnScreenshotFail should exit with error for screenshot failing', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          resultId: 'my-result-id',
          pollInterval: 50,
          errorOnFail: true,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-result-id', { pollInterval: 50 }],
        expectedOutput: [['\u001b[31m✖️\u001b[39m My result (98765)']],
      })
    })
  })

  describe('test passing, screenshot null', function () {
    beforeEach(function () {
      this.setUpHandler({
        commandModule: './test-result/wait',
        clientMethod: 'waitForTestResult',
        clientMethodResponse: {
          name: 'My result',
          _id: '98765',
          passing: true,
          screenshotComparePassing: null,
        },
      })
    })
    it('--errorOnFail should exit with success for test passing', async function () {
      this.setExpectedExitCode(0)
      await this.testPlainOutput({
        handlerInput: {
          resultId: 'my-result-id',
          pollInterval: 50,
          errorOnFail: true,
        },
        expectedClientArgs: ['my-result-id', { pollInterval: 50 }],
        expectedOutput: [['\u001b[32m✓\u001b[39m My result (98765)']],
      })
    })
    it('--errorOnScreenshotFail should exit with error for screenshot null', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          resultId: 'my-result-id',
          pollInterval: 50,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-result-id', { pollInterval: 50 }],
        expectedOutput: [['? My result (98765)']],
      })
    })
    it('--errorOnFail --errorOnScreenshotFail should exit with error for screenshot null', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          resultId: 'my-result-id',
          pollInterval: 50,
          errorOnFail: true,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-result-id', { pollInterval: 50 }],
        expectedOutput: [['? My result (98765)']],
      })
    })
  })

  describe('test null, screenshot passing', function () {
    beforeEach(function () {
      this.setUpHandler({
        commandModule: './test-result/wait',
        clientMethod: 'waitForTestResult',
        clientMethodResponse: {
          name: 'My result',
          _id: '98765',
          passing: null,
          screenshotComparePassing: true,
        },
      })
    })
    it('--errorOnFail should exit with error for test null', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          resultId: 'my-result-id',
          pollInterval: 50,
          errorOnFail: true,
        },
        expectedClientArgs: ['my-result-id', { pollInterval: 50 }],
        expectedOutput: [['? My result (98765)']],
      })
    })
    it('--errorOnScreenshotFail should exit with success for test null', async function () {
      this.setExpectedExitCode(0)
      await this.testPlainOutput({
        handlerInput: {
          resultId: 'my-result-id',
          pollInterval: 50,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-result-id', { pollInterval: 50 }],
        expectedOutput: [['\u001b[32m✓\u001b[39m My result (98765)']],
      })
    })
    it('--errorOnFail --errorOnScreenshotFail should exit with error for test null', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          resultId: 'my-result-id',
          pollInterval: 50,
          errorOnFail: true,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-result-id', { pollInterval: 50 }],
        expectedOutput: [['? My result (98765)']],
      })
    })
  })
})
