describe('list', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './folder/list',
      clientMethod: 'getFolders',
      clientMethodResponse: [
        { name: 'My folder', _id: '12345' },
        { name: 'My other folder', _id: '23456' },
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
        '[{"name":"My folder","_id":"12345"},{"name":"My other folder","_id":"23456"}]',
      ],
    })
  })

  it('should print plain text', async function () {
    await this.testPlainOutput({
      handlerInput: {},
      expectedClientArgs: [],
      expectedOutput: [['My folder (12345)'], ['My other folder (23456)']],
    })
  })
})
