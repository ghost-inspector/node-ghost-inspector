describe('update', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './folder/update',
      clientMethod: 'updateFolder',
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
        folderName: 'New name',
      },
      expectedClientArgs: ['my-folder-id', 'New name'],
      expectedOutput: ['{"name":"My folder","_id":"12345"}'],
    })
  })

  it('should print plain text', async function () {
    await this.testPlainOutput({
      handlerInput: {
        folderId: 'my-folder-id',
        folderName: 'New name',
      },
      expectedClientArgs: ['my-folder-id', 'New name'],
      expectedOutput: [['Folder updated: My folder (12345)']],
    })
  })
})
