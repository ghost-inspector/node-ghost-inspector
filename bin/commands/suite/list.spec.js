describe('list', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './suite/list',
      clientMethod: 'getSuites',
      clientMethodResponse: [
        { name: 'My suite', _id: '12345', passing: true },
        { name: 'My other suite', _id: '23456', passing: false },
      ],
    })
  })

  it('should throw an error', async function () {
    await this.testRejection()
  })

  it('should print JSON', async function () {
    await this.testJsonOutput({
      handlerInput: {},
      expectedClientArgs: [],
      expectedOutput: [
        '[{"name":"My suite","_id":"12345","passing":true},{"name":"My other suite","_id":"23456","passing":false}]',
      ],
    })
  })

  it('should print plain text', async function () {
    await this.testPlainOutput({
      handlerInput: {},
      expectedClientArgs: [],
      expectedOutput: [
        ['\u001b[32m✓\u001b[39m My suite (12345)'],
        ['\u001b[31m✖️\u001b[39m My other suite (23456)'],
      ],
    })
  })
})
