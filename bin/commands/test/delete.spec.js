describe('delete', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './test/delete',
      clientMethod: 'deleteTest',
      clientMethodResponse: true,
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
      expectedOutput: ['{"deleted":true}'],
    })
  })

  it('should print plain text', async function () {
    await this.testPlainOutput({
      handlerInput: {
        testId: 'my-test-id',
      },
      expectedClientArgs: ['my-test-id'],
      expectedOutput: [['Test deleted (my-test-id)']],
    })
  })
})
