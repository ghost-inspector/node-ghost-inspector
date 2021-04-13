describe('download: html', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './suite/download',
      clientMethod: 'downloadSuiteSeleniumHtml',
      clientMethodResponse: true,
    })
  })

  it('should throw an error', async function () {
    await this.testRejection()
  })

  it('+destination', async function () {
    await this.testPlainOutput({
      handlerInput: {
        suiteId: 'my-suite-id',
        destination: 'my-destination',
        format: 'html',
      },
      expectedClientArgs: ['my-suite-id', 'my-destination.zip', { includeImports: false }],
      expectedOutput: [['Suite downloaded to my-destination.zip']],
    })
  })

  it('-destination', async function () {
    await this.testPlainOutput({
      handlerInput: {
        suiteId: 'my-suite-id',
        format: 'html',
      },
      expectedClientArgs: ['my-suite-id', 'suite-my-suite-id.zip', { includeImports: false }],
      expectedOutput: [['Suite downloaded to suite-my-suite-id.zip']],
    })
  })
})

describe('download: side', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './suite/download',
      clientMethod: 'downloadSuiteSeleniumSide',
      clientMethodResponse: true,
    })
  })

  it('should throw an error', async function () {
    await this.testRejection()
  })

  it('html +destination', async function () {
    await this.testPlainOutput({
      handlerInput: {
        suiteId: 'my-suite-id',
        destination: 'my-destination',
        format: 'side',
      },
      expectedClientArgs: ['my-suite-id', 'my-destination.zip', { includeImports: false }],
      expectedOutput: [['Suite downloaded to my-destination.zip']],
    })
  })

  it('html -destination', async function () {
    await this.testPlainOutput({
      handlerInput: {
        suiteId: 'my-suite-id',
        format: 'side',
      },
      expectedClientArgs: ['my-suite-id', 'suite-my-suite-id.zip', { includeImports: false }],
      expectedOutput: [['Suite downloaded to suite-my-suite-id.zip']],
    })
  })
})

describe('download: json', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './suite/download',
      clientMethod: 'downloadSuiteJson',
      clientMethodResponse: true,
    })
  })

  it('should throw an error', async function () {
    await this.testRejection()
  })

  it('html +destination +imports', async function () {
    await this.testPlainOutput({
      handlerInput: {
        suiteId: 'my-suite-id',
        destination: 'my-destination',
        format: 'json',
        includeImports: true,
      },
      expectedClientArgs: ['my-suite-id', 'my-destination.zip', { includeImports: true }],
      expectedOutput: [['Suite downloaded to my-destination.zip']],
    })
  })

  it('html -destination -imports', async function () {
    await this.testPlainOutput({
      handlerInput: {
        suiteId: 'my-suite-id',
        format: 'json',
      },
      expectedClientArgs: ['my-suite-id', 'suite-my-suite-id.zip', { includeImports: false }],
      expectedOutput: [['Suite downloaded to suite-my-suite-id.zip']],
    })
  })
})
