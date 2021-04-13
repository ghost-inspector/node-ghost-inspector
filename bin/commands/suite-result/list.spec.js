describe('list', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './suite-result/list',
      clientMethod: 'getSuiteResults',
      clientMethodResponse: [
        { name: 'My suite result', _id: '12345', passing: true },
        { name: 'My other suite result', _id: '23456', passing: false },
      ],
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
      expectedOutput: [
        '[{"name":"My suite result","_id":"12345","passing":true},{"name":"My other suite result","_id":"23456","passing":false}]',
      ],
    })
  })

  it('should print plain text', async function () {
    await this.testPlainOutput({
      handlerInput: {
        suiteId: 'my-suite-id',
      },
      expectedClientArgs: ['my-suite-id'],
      expectedOutput: [
        ['\u001b[32m✓\u001b[39m My suite result (12345)'],
        ['\u001b[31m✖️\u001b[39m My other suite result (23456)'],
      ],
    })
  })
})
