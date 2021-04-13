describe('get-running', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './test/get-running',
      clientMethod: 'getTestResultsRunning',
      clientMethodResponse: [
        { name: 'My test', _id: '98765' },
        { name: 'My other test', _id: '87654' },
      ],
    })
  })

  it('should throw an error', async function () {
    await this.testRejection()
  })

  it('should print JSON', async function () {
    await this.testJsonOutput({
      handlerInput: {
        testId: 'my-test-id',
      },
      expectedClientArgs: ['my-test-id'],
      expectedOutput: ['[{"name":"My test","_id":"98765"},{"name":"My other test","_id":"87654"}]'],
    })
  })

  it('should print plain text', async function () {
    await this.testPlainOutput({
      handlerInput: {
        testId: 'my-test-id',
      },
      expectedClientArgs: ['my-test-id'],
      expectedOutput: [['My test (98765)'], ['My other test (87654)']],
    })
  })
})
