describe('get', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './folder/get',
      clientMethod: 'getFolder',
      clientMethodResponse: { name: 'My folder', _id: '12345' },
    })
  })

  it('should throw an error', async function () {
    await this.testRejection()
  })

  it('should print JSON', async function () {
    await this.testJsonOutput({
      handlerInput: {
        folderId: 'my-folder-id',
      },
      expectedClientArgs: ['my-folder-id'],
      expectedOutput: ['{"name":"My folder","_id":"12345"}'],
    })
  })

  it('should print plain text', async function () {
    await this.testPlainOutput({
      handlerInput: {
        folderId: 'my-folder-id',
      },
      expectedClientArgs: ['my-folder-id'],
      expectedOutput: [['My folder (12345)']],
    })
  })
})
