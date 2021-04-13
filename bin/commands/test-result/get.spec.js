describe('get', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './test-result/get',
      clientMethod: 'getTestResult',
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
      },
      expectedClientArgs: ['my-result-id'],
      expectedOutput: ['{"name":"My result","_id":"98765","passing":true}'],
    })
  })

  it('should print plain text', async function () {
    await this.testPlainOutput({
      handlerInput: {
        resultId: 'my-result-id',
      },
      expectedClientArgs: ['my-result-id'],
      expectedOutput: [['\u001b[32m✓\u001b[39m My result (98765)']],
    })
  })
})
