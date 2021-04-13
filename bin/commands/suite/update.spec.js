describe('update', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './suite/update',
      clientMethod: 'updateSuite',
      clientMethodResponse: { name: 'New name', _id: '12345' },
    })
  })

  it('should throw an error', async function () {
    await this.testRejection()
  })

  it('should print JSON', async function () {
    await this.testJsonOutput({
      handlerInput: {
        suiteId: 'my-suite-id',
        name: 'New name',
      },
      expectedClientArgs: ['my-suite-id', { name: 'New name' }],
      expectedOutput: ['{"name":"New name","_id":"12345"}'],
    })
  })

  it('should print plain text', async function () {
    await this.testPlainOutput({
      handlerInput: {
        suiteId: 'my-suite-id',
        name: 'New name',
      },
      expectedClientArgs: ['my-suite-id', { name: 'New name' }],
      expectedOutput: [['Suite updated: New name (12345)']],
    })
  })
})
