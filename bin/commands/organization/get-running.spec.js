describe('get-running', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './organization/get-running',
      clientMethod: 'getAllRunningTests',
      clientMethodResponse: [
        { name: 'My test 1', _id: '12345', passing: null },
        { name: 'My test 2', _id: '23455', passing: null },
      ],
    })
  })

  it('should throw an error', async function () {
    await this.testRejection()
  })

  it('should print JSON', async function () {
    await this.testJsonOutput({
      handlerInput: {
        organizationId: 'my-org-id',
      },
      expectedClientArgs: ['my-org-id'],
      expectedOutput: [
        '[{"name":"My test 1","_id":"12345","passing":null},{"name":"My test 2","_id":"23455","passing":null}]',
      ],
    })
  })

  it('should print plain text', async function () {
    await this.testPlainOutput({
      handlerInput: {
        organizationId: 'my-org-id',
        folderName: 'New name',
      },
      expectedClientArgs: ['my-org-id'],
      expectedOutput: [['My test 1 (12345)'], ['My test 2 (23455)']],
    })
  })
})
