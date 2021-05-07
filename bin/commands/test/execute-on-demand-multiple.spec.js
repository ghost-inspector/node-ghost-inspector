const assert = require('assert')
const helpers = require('../../helpers')

const onDemandTest = { name: 'My on-demand test' }

describe('execute-on-demand multiple', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './test/execute-on-demand',
      clientMethod: 'executeTestOnDemand',
      clientMethodResponse: [
        [
          { name: 'My test', _id: '98765', passing: true },
          { name: 'My other test', _id: '76543', passing: true },
        ],
        true,
        false,
      ],
    })

    // stub for file loading
    this.loadJsonStub = this.sandbox.stub(helpers, 'loadJsonFile').returns(onDemandTest)
  })

  it('should print JSON', async function () {
    await this.testJsonOutput({
      handlerInput: {
        organizationId: 'my-org-id',
        file: 'my-on-demand-test.json',
        immediate: true,
      },
      expectedClientArgs: ['my-org-id', { name: 'My on-demand test' }, { immediate: true }],
      expectedOutput: [
        '[{"name":"My test","_id":"98765","passing":true},{"name":"My other test","_id":"76543","passing":true}]',
      ],
    })
  })

  it('should print plain text', async function () {
    await this.testPlainOutput({
      handlerInput: {
        organizationId: 'my-org-id',
        file: 'my-on-demand-test.json',
        immediate: true,
      },
      expectedClientArgs: ['my-org-id', { name: 'My on-demand test' }, { immediate: true }],
      expectedOutput: [
        ['\u001b[32m✓\u001b[39m Result: My test (98765)'],
        ['\u001b[32m✓\u001b[39m Result: My other test (76543)'],
      ],
    })
  })
})

describe('execute-on-demand --immediate=true', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './test/execute-on-demand',
      clientMethod: 'executeTestOnDemand',
      clientMethodResponse: [
        [
          { name: 'My test', _id: '98765', passing: null, screenshotComparePassing: null },
          { name: 'My other test', _id: '76543', passing: null, screenshotComparePassing: null },
        ],
        null,
        null,
      ],
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
      expectedClientArgs: ['my-org-id', { name: 'My on-demand test' }, { immediate: true }],
      expectedOutput: [['? Result: My test (98765)'], ['? Result: My other test (76543)']],
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
      expectedClientArgs: ['my-org-id', { name: 'My on-demand test' }, { immediate: true }],
      expectedOutput: [['? Result: My test (98765)'], ['? Result: My other test (76543)']],
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
      expectedClientArgs: ['my-org-id', { name: 'My on-demand test' }, { immediate: true }],
      expectedOutput: [['? Result: My test (98765)'], ['? Result: My other test (76543)']],
    })
  })
})

describe('execute --immediate=false', function () {
  describe('one test failing, one screenshot failing', function () {
    beforeEach(function () {
      this.setUpHandler({
        commandModule: './test/execute-on-demand',
        clientMethod: 'executeTestOnDemand',
        clientMethodResponse: [
          [
            { name: 'My test', _id: '98765', passing: false, screenshotComparePassing: true },
            { name: 'My other test', _id: '76543', passing: true, screenshotComparePassing: false },
          ],
          false,
          false,
        ],
      })
      // stub for file loading
      this.loadJsonStub = this.sandbox.stub(helpers, 'loadJsonFile').returns(onDemandTest)
    })

    it('--errorOnFail should exit with error for one test failing', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          organizationId: 'my-org-id',
          file: 'my-on-demand-test.json',
          immediate: false,
          errorOnFail: true,
        },
        expectedClientArgs: ['my-org-id', { name: 'My on-demand test' }, { immediate: false }],
        expectedOutput: [
          ['\u001b[31m✖️\u001b[39m Result: My test (98765)'],
          ['\u001b[32m✓\u001b[39m Result: My other test (76543)'],
        ],
      })
    })

    it('--errorOnScreenshotFail should exit with error for one screenshot failing', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          organizationId: 'my-org-id',
          file: 'my-on-demand-test.json',
          immediate: false,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-org-id', { name: 'My on-demand test' }, { immediate: false }],
        expectedOutput: [
          ['\u001b[32m✓\u001b[39m Result: My test (98765)'],
          ['\u001b[31m✖️\u001b[39m Result: My other test (76543)'],
        ],
      })
    })
  })

  describe('test passing, screenshot passing', function () {
    beforeEach(function () {
      this.setUpHandler({
        commandModule: './test/execute-on-demand',
        clientMethod: 'executeTestOnDemand',
        clientMethodResponse: [
          [
            { name: 'My test', _id: '98765', passing: true, screenshotComparePassing: true },
            {
              name: 'My other test',
              _id: '76543',
              passing: true,
              screenshotComparePassing: true,
            },
          ],
          true,
          true,
        ],
      })
      // stub for file loading
      this.loadJsonStub = this.sandbox.stub(helpers, 'loadJsonFile').returns(onDemandTest)
    })

    it('--errorOnFail should exit with success for test passing', async function () {
      await this.testPlainOutput({
        handlerInput: {
          organizationId: 'my-org-id',
          file: 'my-on-demand-test.json',
          immediate: false,
          errorOnFail: true,
        },
        expectedClientArgs: ['my-org-id', { name: 'My on-demand test' }, { immediate: false }],
        expectedOutput: [
          ['\u001b[32m✓\u001b[39m Result: My test (98765)'],
          ['\u001b[32m✓\u001b[39m Result: My other test (76543)'],
        ],
      })
    })

    it('--errorOnScreenshotFail should exit with error for screenshot failing', async function () {
      await this.testPlainOutput({
        handlerInput: {
          organizationId: 'my-org-id',
          file: 'my-on-demand-test.json',
          immediate: false,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-org-id', { name: 'My on-demand test' }, { immediate: false }],
        expectedOutput: [
          ['\u001b[32m✓\u001b[39m Result: My test (98765)'],
          ['\u001b[32m✓\u001b[39m Result: My other test (76543)'],
        ],
      })
    })

    it('--errorOnFail --errorOnScreenshotFail should exit with error for screenshot failing', async function () {
      await this.testPlainOutput({
        handlerInput: {
          organizationId: 'my-org-id',
          file: 'my-on-demand-test.json',
          immediate: false,
          errorOnFail: true,
          errorOnScreenshotFail: true,
        },
        expectedClientArgs: ['my-org-id', { name: 'My on-demand test' }, { immediate: false }],
        expectedOutput: [
          ['\u001b[32m✓\u001b[39m Result: My test (98765)'],
          ['\u001b[32m✓\u001b[39m Result: My other test (76543)'],
        ],
      })
    })
  })

  describe('one test null, one screenshot null', function () {
    beforeEach(function () {
      this.setUpHandler({
        commandModule: './test/execute-on-demand',
        clientMethod: 'executeTestOnDemand',
        clientMethodResponse: [
          [
            { name: 'My test', _id: '98765', passing: true, screenshotComparePassing: null },
            {
              name: 'My other test',
              _id: '76543',
              passing: null,
              screenshotComparePassing: true,
            },
          ],
          false,
          false,
        ],
      })
      // stub for file loading
      this.loadJsonStub = this.sandbox.stub(helpers, 'loadJsonFile').returns(onDemandTest)
    })

    it('--errorOnFail should exit with fail for one test null', async function () {
      this.setExpectedExitCode(1)
      await this.testPlainOutput({
        handlerInput: {
          organizationId: 'my-org-id',
          file: 'my-on-demand-test.json',
          immediate: false,
          errorOnFail: true,
        },
        expectedClientArgs: ['my-org-id', { name: 'My on-demand test' }, { immediate: false }],
        expectedOutput: [
          ['\u001b[32m✓\u001b[39m Result: My test (98765)'],
          ['? Result: My other test (76543)'],
        ],
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
        expectedClientArgs: ['my-org-id', { name: 'My on-demand test' }, { immediate: false }],
        expectedOutput: [
          ['? Result: My test (98765)'],
          ['\u001b[32m✓\u001b[39m Result: My other test (76543)'],
        ],
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
        expectedClientArgs: ['my-org-id', { name: 'My on-demand test' }, { immediate: false }],
        expectedOutput: [['? Result: My test (98765)'], ['? Result: My other test (76543)']],
      })
    })
  })
})
