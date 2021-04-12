const assert = require('assert').strict
const helpers = require('../../helpers')

const loadedTest = { name: 'My loaded test' }

describe('import-test - JSON', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './suite/import-test',
      clientMethod: 'importTest',
      clientMethodResponse: { name: 'My test', _id: '12345' },
    })

    // stub for file loading
    this.loadJsonStub = this.sandbox.stub(helpers, 'loadJsonFile').returns(loadedTest)
  })

  it('should throw an error', async function () {
    await this.testRejection()
  })

  it('should print JSON', async function () {
    await this.testJsonOutput({
      handlerInput: {
        suiteId: 'my-suite-id',
        file: 'my-file.json',
      },
      expectedClientArgs: ['my-suite-id', loadedTest],
      expectedOutput: ['{"name":"My test","_id":"12345"}'],
    })

    // assert json file was loaded
    assert.ok(this.loadJsonStub.called)
    assert.ok(this.loadJsonStub.args[0], 'my-file.json')
  })

  it('should print plain text', async function () {
    await this.testPlainOutput({
      handlerInput: {
        suiteId: 'my-suite-id',
        file: 'my-file.json',
      },
      expectedClientArgs: ['my-suite-id', loadedTest],
      expectedOutput: [['Test imported: My test (12345)']],
    })

    // assert json file was loaded
    assert.ok(this.loadJsonStub.called)
    assert.ok(this.loadJsonStub.args[0], 'my-file.json')
  })
})

describe('import-test - HTML', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './suite/import-test',
      clientMethod: 'importTest',
      clientMethodResponse: { name: 'My test', _id: '12345' },
    })

    // stub for file loading
    this.loadJsonStub = this.sandbox.stub(helpers, 'loadJsonFile').throws(new Error('some error'))
  })

  it('should print JSON', async function () {
    await this.testJsonOutput({
      handlerInput: {
        suiteId: 'my-suite-id',
        file: 'my-file.html',
      },
      expectedClientArgs: ['my-suite-id', 'my-file.html'],
      expectedOutput: ['{"name":"My test","_id":"12345"}'],
    })
  })

  it('should print plain text', async function () {
    await this.testPlainOutput({
      handlerInput: {
        suiteId: 'my-suite-id',
        file: 'my-file.html',
      },
      expectedClientArgs: ['my-suite-id', 'my-file.html'],
      expectedOutput: [['Test imported: My test (12345)']],
    })
  })
})
