describe('create', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './suite/create',
      clientMethod: 'createSuite',
      clientMethodResponse: { name: 'Some suite', _id: '12345' },
    })
  })

  it('should throw an error', async function () {
    await this.testRejection()
  })

  it('should print JSON', async function () {
    await this.testJsonOutput({
      handlerInput: {
        organizationId: 'my-org-id',
        suiteName: 'Some suite',
      },
      expectedClientArgs: ['my-org-id', 'Some suite'],
      expectedOutput: ['{"name":"Some suite","_id":"12345"}'],
    })
  })

  it('should print plain text', async function () {
    await this.testPlainOutput({
      handlerInput: {
        organizationId: 'my-org-id',
        suiteName: 'Some suite',
      },
      expectedClientArgs: ['my-org-id', 'Some suite'],
      expectedOutput: [['Suite created: Some suite (12345)']],
    })
  })
})
