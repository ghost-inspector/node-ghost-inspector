describe('update', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './test/update',
      clientMethod: 'updateTest',
      clientMethodResponse: { name: 'New name', _id: '12345' },
    })
  })

  it('should throw an error', async function () {
    await this.testRejection()
  })

  it('should print JSON', async function () {
    await this.testJsonOutput({
      handlerInput: {
        testId: 'my-test-id',
        name: 'New name',
      },
      expectedClientArgs: ['my-test-id', { name: 'New name' }],
      expectedOutput: ['{"name":"New name","_id":"12345"}'],
    })
  })

  it('should print plain text', async function () {
    await this.testPlainOutput({
      handlerInput: {
        testId: 'my-test-id',
        name: 'New name',
      },
      expectedClientArgs: ['my-test-id', { name: 'New name' }],
      expectedOutput: [['Test updated: New name (12345)']],
    })
  })
})
