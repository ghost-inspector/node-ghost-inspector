describe('download: html', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './test/download',
      clientMethod: 'downloadTestSeleniumHtml',
      clientMethodResponse: true,
    })
  })

  it('should throw an error', async function () {
    await this.testRejection()
  })

  it('+destination', async function () {
    await this.testPlainOutput({
      handlerInput: {
        testId: 'my-test-id',
        destination: 'my-destination',
        format: 'html',
      },
      expectedClientArgs: ['my-test-id', 'my-destination.html', { includeImports: false }],
      expectedOutput: [['Test downloaded to my-destination.html']],
    })
  })

  it('-destination', async function () {
    await this.testPlainOutput({
      handlerInput: {
        testId: 'my-test-id',
        format: 'html',
      },
      expectedClientArgs: ['my-test-id', 'test-my-test-id.html', { includeImports: false }],
      expectedOutput: [['Test downloaded to test-my-test-id.html']],
    })
  })
})

describe('download: side', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './test/download',
      clientMethod: 'downloadTestSeleniumSide',
      clientMethodResponse: true,
    })
  })

  it('should throw an error', async function () {
    await this.testRejection()
  })

  it('html +destination', async function () {
    await this.testPlainOutput({
      handlerInput: {
        testId: 'my-test-id',
        destination: 'my-destination',
        format: 'side',
      },
      expectedClientArgs: ['my-test-id', 'my-destination.side', { includeImports: false }],
      expectedOutput: [['Test downloaded to my-destination.side']],
    })
  })

  it('html -destination', async function () {
    await this.testPlainOutput({
      handlerInput: {
        testId: 'my-test-id',
        format: 'side',
      },
      expectedClientArgs: ['my-test-id', 'test-my-test-id.side', { includeImports: false }],
      expectedOutput: [['Test downloaded to test-my-test-id.side']],
    })
  })
})

describe('download: json', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './test/download',
      clientMethod: 'downloadTestJson',
      clientMethodResponse: true,
    })
  })

  it('should throw an error', async function () {
    await this.testRejection()
  })

  it('html +destination +imports', async function () {
    await this.testPlainOutput({
      handlerInput: {
        testId: 'my-test-id',
        destination: 'my-destination',
        format: 'json',
        includeImports: true,
      },
      expectedClientArgs: ['my-test-id', 'my-destination.json', { includeImports: true }],
      expectedOutput: [['Test downloaded to my-destination.json']],
    })
  })

  it('html -destination -imports', async function () {
    await this.testPlainOutput({
      handlerInput: {
        testId: 'my-test-id',
        format: 'json',
      },
      expectedClientArgs: ['my-test-id', 'test-my-test-id.json', { includeImports: false }],
      expectedOutput: [['Test downloaded to test-my-test-id.json']],
    })
  })
})
