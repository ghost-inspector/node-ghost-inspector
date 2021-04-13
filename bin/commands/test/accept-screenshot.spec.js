describe('accept-screenshot', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './test/accept-screenshot',
      clientMethod: 'acceptTestScreenshot',
      clientMethodResponse: { name: 'My test', _id: '12345' },
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
      expectedOutput: ['{"name":"My test","_id":"12345"}'],
    })
  })

  it('should print plain text', async function () {
    await this.testPlainOutput({
      handlerInput: {
        testId: 'my-test-id',
      },
      expectedClientArgs: ['my-test-id'],
      expectedOutput: [['Screenshot accepted: My test (12345)']],
    })
  })
})
