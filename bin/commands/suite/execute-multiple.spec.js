describe('execute multiple', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './suite/execute',
      clientMethod: 'executeSuite',
      clientMethodResponse: [
        [
          { name: 'My suite', _id: '98765', passing: true },
          { name: 'My other suite', _id: '76543', passing: true },
        ],
        true,
        false,
      ],
    })
  })

  it('should print JSON', async function () {
    await this.testJsonOutput({
      handlerInput: {
        suiteId: 'my-suite-id',
        myVar: 'foobar',
        immediate: true,
      },
      expectedClientArgs: ['my-suite-id', { myVar: 'foobar', immediate: true }],
      expectedOutput: [
        '[{"name":"My suite","_id":"98765","passing":true},{"name":"My other suite","_id":"76543","passing":true}]',
      ],
    })
  })

  it('should print plain text', async function () {
    await this.testPlainOutput({
      handlerInput: {
        suiteId: 'my-suite-id',
        myVar: 'foobar',
      },
      expectedClientArgs: ['my-suite-id', { myVar: 'foobar' }],
      expectedOutput: [
        ['\u001b[32m✓\u001b[39m Suite result: My suite (98765)'],
        ['\u001b[32m✓\u001b[39m Suite result: My other suite (76543)'],
      ],
    })
  })
})

describe('execute --immediate=true', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './suite/execute',
      clientMethod: 'executeSuite',
      clientMethodResponse: [
        [
          { name: 'My suite', _id: '98765', passing: null, screenshotComparePassing: null },
          { name: 'My other suite', _id: '76543', passing: null, screenshotComparePassing: null },
        ],
        null,
        null,
      ],
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
      expectedOutput: [
        ['? Suite result: My suite (98765)'],
        ['? Suite result: My other suite (76543)'],
      ],
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
      expectedOutput: [
        ['? Suite result: My suite (98765)'],
        ['? Suite result: My other suite (76543)'],
      ],
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
      expectedOutput: [
        ['? Suite result: My suite (98765)'],
        ['? Suite result: My other suite (76543)'],
      ],
    })
  })
})

describe('execute --immediate=false', function () {
  describe('one test failing, one screenshot failing', function () {
    beforeEach(function () {
      this.setUpHandler({
        commandModule: './suite/execute',
        clientMethod: 'executeSuite',
        clientMethodResponse: [
          [
            { name: 'My suite', _id: '98765', passing: false, screenshotComparePassing: true },
            {
              name: 'My other suite',
              _id: '76543',
              passing: true,
              screenshotComparePassing: false,
            },
          ],
          false,
          false,
        ],
      })
    })

    it('--errorOnFail should exit with error for one test failing', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          suiteId: 'my-suite-id',
          myVar: 'foobar',
          immediate: false,
          errorOnFail: true,
        },
        expectedClientArgs: ['my-suite-id', { myVar: 'foobar', immediate: false }],
        expectedOutput: [
          ['\u001b[31m✖️\u001b[39m Suite result: My suite (98765)'],
          ['\u001b[32m✓\u001b[39m Suite result: My other suite (76543)'],
        ],
      })
    })

    it('--errorOnScreenshotFail should exit with error for one screenshot failing', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          suiteId: 'my-suite-id',
          myVar: 'foobar',
          immediate: false,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-suite-id', { myVar: 'foobar', immediate: false }],
        expectedOutput: [
          ['\u001b[32m✓\u001b[39m Suite result: My suite (98765)'],
          ['\u001b[31m✖️\u001b[39m Suite result: My other suite (76543)'],
        ],
      })
    })
  })

  describe('test passing, screenshot passing', function () {
    beforeEach(function () {
      this.setUpHandler({
        commandModule: './suite/execute',
        clientMethod: 'executeSuite',
        clientMethodResponse: [
          [
            { name: 'My suite', _id: '98765', passing: true, screenshotComparePassing: true },
            {
              name: 'My other suite',
              _id: '76543',
              passing: true,
              screenshotComparePassing: true,
            },
          ],
          true,
          true,
        ],
      })
    })

    it('--errorOnFail should exit with success for test passing', async function () {
      await this.testPlainOutput({
        handlerInput: {
          suiteId: 'my-suite-id',
          myVar: 'foobar',
          immediate: false,
          errorOnFail: true,
        },
        expectedClientArgs: ['my-suite-id', { myVar: 'foobar', immediate: false }],
        expectedOutput: [
          ['\u001b[32m✓\u001b[39m Suite result: My suite (98765)'],
          ['\u001b[32m✓\u001b[39m Suite result: My other suite (76543)'],
        ],
      })
    })

    it('--errorOnScreenshotFail should exit with error for screenshot failing', async function () {
      await this.testPlainOutput({
        handlerInput: {
          suiteId: 'my-suite-id',
          myVar: 'foobar',
          immediate: false,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-suite-id', { myVar: 'foobar', immediate: false }],
        expectedOutput: [
          ['\u001b[32m✓\u001b[39m Suite result: My suite (98765)'],
          ['\u001b[32m✓\u001b[39m Suite result: My other suite (76543)'],
        ],
      })
    })

    it('--errorOnFail --errorOnScreenshotFail should exit with error for screenshot failing', async function () {
      await this.testPlainOutput({
        handlerInput: {
          suiteId: 'my-suite-id',
          myVar: 'foobar',
          immediate: false,
          errorOnFail: true,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-suite-id', { myVar: 'foobar', immediate: false }],
        expectedOutput: [
          ['\u001b[32m✓\u001b[39m Suite result: My suite (98765)'],
          ['\u001b[32m✓\u001b[39m Suite result: My other suite (76543)'],
        ],
      })
    })
  })

  describe('one test null, one screenshot null', function () {
    beforeEach(function () {
      this.setUpHandler({
        commandModule: './suite/execute',
        clientMethod: 'executeSuite',
        clientMethodResponse: [
          [
            { name: 'My suite', _id: '98765', passing: true, screenshotComparePassing: null },
            {
              name: 'My other suite',
              _id: '76543',
              passing: null,
              screenshotComparePassing: true,
            },
          ],
          false,
          false,
        ],
      })
    })

    it('--errorOnFail should exit with fail for one test null', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          suiteId: 'my-suite-id',
          myVar: 'foobar',
          immediate: false,
          errorOnFail: true,
        },
        expectedClientArgs: ['my-suite-id', { myVar: 'foobar', immediate: false }],
        expectedOutput: [
          ['\u001b[32m✓\u001b[39m Suite result: My suite (98765)'],
          ['? Suite result: My other suite (76543)'],
        ],
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
        expectedOutput: [
          ['? Suite result: My suite (98765)'],
          ['\u001b[32m✓\u001b[39m Suite result: My other suite (76543)'],
        ],
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
        expectedOutput: [
          ['? Suite result: My suite (98765)'],
          ['? Suite result: My other suite (76543)'],
        ],
      })
    })
  })
})
