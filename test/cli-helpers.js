const assert = require('assert').strict
const ngrok = require('ngrok')
const sinon = require('sinon')

const helpers = require('../bin/helpers')

describe('helpers', function () {
  describe('cleanArgs()', function () {
    it('should clean up provided input', function () {
      const result = helpers.cleanArgs({
        'foo-bar': 'baz',
        fooBar: 'biz',
        _: 'value',
        $0: 'value',
        apiKey: 'value',
        json: true,
        errorOnFail: true,
        errorOnScreenshotFail: true,
        ngrokTunnel: 5000,
        ngrokUrlVariable: 'foo',
        ngrokHostHeader: 'bar',
        ngrokToken: '1234',
      })

      assert.deepEqual(result, { fooBar: 'biz', 'foo-bar': 'baz' })
    })
  })

  describe('resolvePassingStatus()', function () {
    describe('--immediate=true', function () {
      it('should exit with success', function () {
        const args = { immediate: true }
        const { overallPassing, exitOk } = helpers.resolvePassingStatus(args, null, null)
        assert.equal(overallPassing, null)
        assert.ok(exitOk)
      })
    })

    describe('--immediate=false', function () {
      it('should exit 0 with null status from test', function () {
        const args = { immediate: false }
        const { overallPassing, exitOk } = helpers.resolvePassingStatus(args, null, true)
        assert.equal(overallPassing, null)
        assert.ok(exitOk)
      })
    })

    describe('--immediate=false --errorOnFail', function () {
      before(function () {
        this.args = { immediate: false, errorOnFail: true, errorOnScreenshotFail: false }
      })
      it('should exit 1 with null status from test', function () {
        const { overallPassing, exitOk } = helpers.resolvePassingStatus(this.args, null, true)
        assert.equal(overallPassing, null)
        assert.equal(exitOk, false)
      })

      it('should exit 1 with null status from test', function () {
        const { overallPassing, exitOk } = helpers.resolvePassingStatus(this.args, false, true)
        assert.equal(overallPassing, false)
        assert.equal(exitOk, false)
      })

      it('should exit 0 with passing status from test', function () {
        const { overallPassing, exitOk } = helpers.resolvePassingStatus(this.args, true, false)
        assert.equal(overallPassing, true)
        assert.equal(exitOk, true)
      })
    })

    describe('--immediate=false --errorOnScreenshotFail', function () {
      before(function () {
        this.args = { immediate: false, errorOnFail: false, errorOnScreenshotFail: true }
      })
      it('should exit 1 with null status from screenshot', function () {
        const { overallPassing, exitOk } = helpers.resolvePassingStatus(this.args, true, null)
        assert.equal(overallPassing, null)
        assert.equal(exitOk, false)
      })

      it('should exit 1 with null status from screenshot', function () {
        const { overallPassing, exitOk } = helpers.resolvePassingStatus(this.args, true, false)
        assert.equal(overallPassing, false)
        assert.equal(exitOk, false)
      })

      it('should exit 0 with passing status from test', function () {
        const { overallPassing, exitOk } = helpers.resolvePassingStatus(this.args, false, true)
        assert.equal(overallPassing, true)
        assert.equal(exitOk, true)
      })
    })

    describe('--immediate=false --errorOnFail --errorOnScreenshotFail', function () {
      before(function () {
        this.args = { immediate: false, errorOnFail: true, errorOnScreenshotFail: true }
      })
      it('should exit 1 with null status from test', function () {
        const { overallPassing, exitOk } = helpers.resolvePassingStatus(this.args, null, true)
        assert.equal(overallPassing, null)
        assert.equal(exitOk, false)
      })
      it('should exit 1 with null status from screenshot', function () {
        const { overallPassing, exitOk } = helpers.resolvePassingStatus(this.args, true, null)
        assert.equal(overallPassing, null)
        assert.equal(exitOk, false)
      })

      it('should exit 1 with false status from test', function () {
        const { overallPassing, exitOk } = helpers.resolvePassingStatus(this.args, false, true)
        assert.equal(overallPassing, false)
        assert.equal(exitOk, false)
      })

      it('should exit 1 with false status from screenshot', function () {
        const { overallPassing, exitOk } = helpers.resolvePassingStatus(this.args, true, false)
        assert.equal(overallPassing, false)
        assert.equal(exitOk, false)
      })

      it('should exit 0', function () {
        const { overallPassing, exitOk } = helpers.resolvePassingStatus(this.args, true, true)
        assert.equal(overallPassing, true)
        assert.equal(exitOk, true)
      })
    })
  })

  describe('ngrokSetup', function () {
    beforeEach(function () {
      this.sandbox = sinon.createSandbox()
      this.connectStub = this.sandbox.stub(ngrok, 'connect').resolves('some-url')
    })

    afterEach(function () {
      this.sandbox.restore()
    })

    it('should throw and error when used with --immediate', async function () {
      const input = {
        ngrokTunnel: 8000,
        immediate: true,
      }
      await assert.rejects(helpers.ngrokSetup(input), {
        message: 'Cannot use --ngrokTunnel with --immediate',
      })
    })

    it('should throw and error when no ngrok token', async function () {
      const input = {
        ngrokTunnel: 8000,
      }
      await assert.rejects(helpers.ngrokSetup(input), {
        message: 'ngrokToken is required',
      })
    })

    it('should connect', async function () {
      const input = {
        ngrokTunnel: 8000,
        ngrokToken: 'foo',
      }
      await helpers.ngrokSetup(input)
      assert.deepEqual(this.connectStub.args[0][0], { addr: 8000, authtoken: 'foo' })
    })

    it('should assign ngrok url to specified variable', async function () {
      const input = {
        ngrokTunnel: 8000,
        ngrokToken: 'foo',
        ngrokUrlVariable: 'myTunnelUrl',
      }
      const output = await helpers.ngrokSetup(input)
      assert.deepEqual(output, {
        ngrokToken: 'foo',
        ngrokTunnel: 8000,
        ngrokUrlVariable: 'myTunnelUrl',
        myTunnelUrl: 'some-url',
      })
    })
  })
})
