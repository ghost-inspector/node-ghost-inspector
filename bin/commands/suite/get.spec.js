describe('get', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './suite/get',
      clientMethod: 'getSuite',
      clientMethodResponse: { name: 'My suite', _id: '12345' },
    })
  })

  it('should throw an error', async function () {
    await this.testRejection()
  })

  it('should print JSON', async function () {
    await this.testJsonOutput({
      handlerInput: {
        suiteId: 'my-suite-id',
      },
      expectedClientArgs: ['my-suite-id'],
      expectedOutput: ['{"name":"My suite","_id":"12345"}'],
    })
  })

  it('should print plain text', async function () {
    await this.testPlainOutput({
      handlerInput: {
        suiteId: 'my-suite-id',
      },
      expectedClientArgs: ['my-suite-id'],
      expectedOutput: [['My suite (12345)']],
    })
  })
})
