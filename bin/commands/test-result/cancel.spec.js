describe('cancel', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './test-result/cancel',
      clientMethod: 'cancelTestResult',
      clientMethodResponse: { name: 'My result', _id: '98765' },
    })
  })

  it('should throw an error', async function () {
    await this.testRejection()
  })

  it('should print JSON', async function () {
    await this.testJsonOutput({
      handlerInput: {
        resultId: 'my-result-id',
      },
      expectedClientArgs: ['my-result-id'],
      expectedOutput: ['{"name":"My result","_id":"98765"}'],
    })
  })

  it('should print plain text', async function () {
    await this.testPlainOutput({
      handlerInput: {
        resultId: 'my-result-id',
      },
      expectedClientArgs: ['my-result-id'],
      expectedOutput: [['Result cancelled: My result (98765)']],
    })
  })
})
