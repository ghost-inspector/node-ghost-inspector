describe('duplicate', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './test/duplicate',
      clientMethod: 'duplicateTest',
      clientMethodResponse: { name: 'My new test', _id: '98765' },
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
      expectedOutput: ['{"name":"My new test","_id":"98765"}'],
    })
  })

  it('should print plain text', async function () {
    await this.testPlainOutput({
      handlerInput: {
        testId: 'my-test-id',
      },
      expectedClientArgs: ['my-test-id'],
      expectedOutput: [['Test duplicated: My new test (98765)']],
    })
  })
})
