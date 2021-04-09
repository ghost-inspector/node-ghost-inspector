describe('get', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './suite-result/get',
      clientMethod: 'getSuiteResult',
      clientMethodResponse: { name: 'My suite result', _id: '12345' },
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
      expectedOutput: ['{"name":"My suite result","_id":"12345"}'],
    })
  })

  it('should print plain text', async function () {
    await this.testPlainOutput({
      handlerInput: {
        suiteResultId: 'my-suite-result-id',
      },
      expectedClientArgs: ['my-suite-result-id'],
      expectedOutput: [['My suite result (12345)']],
    })
  })
})
