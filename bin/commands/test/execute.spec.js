describe('execute', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './test/execute',
      clientMethod: 'executeTest',
      clientMethodResponse: [{ name: 'My test', _id: '98765' }, true, false],
    })
  })

  it('should throw an error', async function () {
    await this.testRejection()
  })

  it('should print JSON', async function () {
    await this.testJsonOutput({
      handlerInput: {
        testId: 'my-test-id',
        myVar: 'foobar',
        immediate: true,
      },
      expectedClientArgs: ['my-test-id', { myVar: 'foobar', immediate: true }],
      expectedOutput: ['{"name":"My test","_id":"98765"}'],
    })
  })

  it('should print plain text', async function () {
    await this.testPlainOutput({
      handlerInput: {
        testId: 'my-test-id',
        myVar: 'foobar',
      },
      expectedClientArgs: ['my-test-id', { myVar: 'foobar' }],
      expectedOutput: [['Result: My test (98765)']],
    })
  })
})
