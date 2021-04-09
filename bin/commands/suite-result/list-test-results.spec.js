describe('list-test-results', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './suite-result/list-test-results',
      clientMethod: 'getSuiteResultTestResults',
      clientMethodResponse: [
        { name: 'My result', _id: '12345', passing: true },
        { name: 'My other result', _id: '23456', passing: false },
      ],
    })
  })

  it('should throw an error', async function () {
    await this.testRejection()
  })

  it('should print JSON', async function () {
    await this.testJsonOutput({
      handlerInput: {
        suiteResultId: 'my-suite-result-id',
        offset: 5,
      },
      expectedClientArgs: ['my-suite-result-id', { offset: 5 }],
      expectedOutput: [
        '[{"name":"My result","_id":"12345","passing":true},{"name":"My other result","_id":"23456","passing":false}]',
      ],
    })
  })

  it('should print plain text', async function () {
    await this.testPlainOutput({
      handlerInput: {
        suiteResultId: 'my-suite-result-id',
        offset: 5,
      },
      expectedClientArgs: ['my-suite-result-id', { offset: 5 }],
      expectedOutput: [
        ['\u001b[32m✓\u001b[39m My result (12345)'],
        ['\u001b[31m✖️\u001b[39m My other result (23456)'],
      ],
    })
  })
})
