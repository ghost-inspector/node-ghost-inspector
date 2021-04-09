describe('get-xunit-report', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './suite-result/get-xunit-report',
      clientMethod: 'getSuiteResultXUnit',
      clientMethodResponse: '<some-report></some-report>',
    })
  })

  it('should throw an error', async function () {
    await this.testRejection()
  })

  it('should print plain text', async function () {
    await this.testPlainOutput({
      handlerInput: {
        suiteResultId: 'my-suite-result-id',
      },
      expectedClientArgs: ['my-suite-result-id'],
      expectedOutput: [['<some-report></some-report>']],
    })
  })
})
