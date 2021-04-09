const assert = require('assert')
const helpers = require('../../helpers')

const onDemandTest = { name: 'My on-demand test' }

describe('execute-on-demand', function () {
  beforeEach(function () {
    this.setUpHandler({
      commandModule: './test/execute-on-demand',
      clientMethod: 'executeTestOnDemand',
      clientMethodResponse: [{ name: 'My test', _id: '98765', passing: null }, true, false],
    })

    // stub for file loading
    this.loadJsonStub = this.sandbox.stub(helpers, 'loadJsonFile').returns(onDemandTest)
  })

  it('should throw an error', async function () {
    await this.testRejection()
  })

  it('should print JSON', async function () {
    await this.testJsonOutput({
      handlerInput: {
        organizationId: 'my-org-id',
        file: 'my-on-demand-test.json',
        immediate: true,
      },
      expectedClientArgs: ['my-org-id', { name: 'My on-demand test' }, { wait: false }],
      expectedOutput: ['{"name":"My test","_id":"98765","passing":null}'],
    })

    // assert json file was loaded
    assert.ok(this.loadJsonStub.called)
    assert.ok(this.loadJsonStub.args[0], 'my-on-demand-test.json')
  })

  it('should print plain text', async function () {
    await this.testPlainOutput({
      handlerInput: {
        organizationId: 'my-test-id',
        immediate: false,
      },
      expectedClientArgs: ['my-test-id', { name: 'My on-demand test' }, { wait: true }],
      expectedOutput: [['Result: My test (98765)']],
    })

    // assert json file was loaded
    assert.ok(this.loadJsonStub.called)
    assert.ok(this.loadJsonStub.args[0], 'my-on-demand-test.json')
  })
})
