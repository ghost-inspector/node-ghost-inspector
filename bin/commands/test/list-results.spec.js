describe('list-results', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './test/list-results',
      clientMethod: 'getTestResults',
      clientMethodResponse: [
        { name: 'My test', _id: '98765', passing: true },
        { name: 'My other test', _id: '87654', passing: null },
      ],
    })
  })

  it('should throw an error', async function () {
    await this.testRejection()
  })

  it('should print JSON', async function () {
    await this.testJsonOutput({
      handlerInput: {
        testId: 'my-test-id',
        count: 5,
      },
      expectedClientArgs: ['my-test-id', { count: 5 }],
      expectedOutput: [
        '[{"name":"My test","_id":"98765","passing":true},{"name":"My other test","_id":"87654","passing":null}]',
      ],
    })
  })

  it('should print plain text', async function () {
    await this.testPlainOutput({
      handlerInput: {
        testId: 'my-test-id',
        offset: 10,
      },
      expectedClientArgs: ['my-test-id', { offset: 10 }],
      expectedOutput: [['\u001b[32m✓\u001b[39m My test (98765)'], ['? My other test (87654)']],
    })
  })
})
