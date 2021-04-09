describe('execute', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './suite/execute',
      clientMethod: 'executeSuite',
      clientMethodResponse: [{ name: 'My suite', _id: '98765' }, true, false],
    })
  })

  it('should throw an error', async function () {
    await this.testRejection()
  })

  it('should print JSON', async function () {
    await this.testJsonOutput({
      handlerInput: {
        suiteId: 'my-suite-id',
        myVar: 'foobar',
        immediate: true,
      },
      expectedClientArgs: ['my-suite-id', { myVar: 'foobar', immediate: true }],
      expectedOutput: ['{"name":"My suite","_id":"98765"}'],
    })
  })

  it('should print plain text', async function () {
    await this.testPlainOutput({
      handlerInput: {
        suiteId: 'my-suite-id',
        myVar: 'foobar',
      },
      expectedClientArgs: ['my-suite-id', { myVar: 'foobar' }],
      expectedOutput: [['Suite result: My suite (98765)']],
    })
  })
})
