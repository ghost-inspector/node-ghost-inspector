describe('duplicate', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './suite/duplicate',
      clientMethod: 'duplicateSuite',
      clientMethodResponse: { name: 'My new suite', _id: '98765' },
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
      expectedOutput: ['{"name":"My new suite","_id":"98765"}'],
    })
  })

  it('should print plain text', async function () {
    await this.testPlainOutput({
      handlerInput: {
        suiteId: 'my-suite-id',
      },
      expectedClientArgs: ['my-suite-id'],
      expectedOutput: [['Suite duplicated: My new suite (98765)']],
    })
  })
})
