const assert = require('assert').strict

const helpers = require('../bin/helpers')

describe('helpers', function () {
  describe('cleanArgs()', function () {
    it(' should clean up provided input', function () {
      const result = helpers.cleanArgs({
        'foo-bar': 'baz',
        fooBar: 'biz',
        _: 'value',
        $0: 'value',
        apiKey: 'value',
        json: true,
        errorOnFail: true,
        errorOnScreenshotFail: true,
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
})
