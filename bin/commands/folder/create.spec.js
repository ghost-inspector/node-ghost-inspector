describe('create', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './folder/create',
      clientMethod: 'createFolder',
      clientMethodResponse: { name: 'My folder', _id: '12345' },
    })
  })

  it('should throw an error', async function () {
    await this.testRejection()
  })

  it('should print JSON', async function () {
    await this.testJsonOutput({
      handlerInput: {
        organizationId: 'my-org-id',
        folderName: 'Some folder',
      },
      expectedClientArgs: ['my-org-id', 'Some folder'],
      expectedOutput: ['{"name":"My folder","_id":"12345"}'],
    })
  })

  it('should print plain text', async function () {
    await this.testPlainOutput({
      handlerInput: {
        organizationId: 'my-org-id',
        folderName: 'Some folder',
      },
      expectedClientArgs: ['my-org-id', 'Some folder'],
      expectedOutput: [['Folder created: My folder (12345)']],
    })
  })
})
