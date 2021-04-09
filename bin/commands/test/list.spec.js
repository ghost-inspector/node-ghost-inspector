describe('list', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './test/list',
      clientMethod: 'getTests',
      clientMethodResponse: [
        { name: 'My test', _id: '98765', passing: true },
        { name: 'My other test', _id: '87654', passing: false },
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
        '[{"name":"My test","_id":"98765","passing":true},{"name":"My other test","_id":"87654","passing":false}]',
      ],
    })
  })

  it('should print plain text', async function () {
    await this.testPlainOutput({
      handlerInput: {},
      expectedClientArgs: [],
      expectedOutput: [
        ['\u001b[32m✓\u001b[39m My test (98765)'],
        ['\u001b[31m✖️\u001b[39m My other test (87654)'],
      ],
    })
  })
})
