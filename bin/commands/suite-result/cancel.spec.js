describe('cancel', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './suite-result/cancel',
      clientMethod: 'cancelSuiteResult',
      clientMethodResponse: { name: 'Suite result', _id: '12345' },
    })
  })

  it('should throw an error', async function () {
    await this.testRejection()
  })

  it('should print JSON', async function () {
    await this.testJsonOutput({
      handlerInput: {
        suiteResultId: 'my-suite-result-id',
      },
      expectedClientArgs: ['my-suite-result-id'],
      expectedOutput: ['{"name":"Suite result","_id":"12345"}'],
    })
  })

  it('should print plain text', async function () {
    await this.testPlainOutput({
      handlerInput: {
        suiteResultId: 'my-suite-result-id',
      },
      expectedClientArgs: ['my-suite-result-id'],
      expectedOutput: [['Suite result cancelled: Suite result (12345)']],
    })
  })
})
