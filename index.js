const assert = require('assert')
const fs = require('fs')
const request = require('request-promise-native')

const DEFAULT_POLL_INTERVAL = 5000

// Define GhostInspector class
class GhostInspector {
  constructor(apiKey) {
    this.userAgent = 'Ghost Inspector Node.js Client'
    this.host = 'https://api.ghostinspector.com'
    this.prefix = '/v1'
    this.apiKey = apiKey
  }

  // Used for polling
  _wait(time = DEFAULT_POLL_INTERVAL) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, time)
    })
  }

  buildRequestUrl(path) {
    return this.host + this.prefix + path
  }

  buildQueryString(params = {}) {
    let queryString = '?'
    // Add params
    for (const key in params) {
      // handle array params
      const val = params[key]
      if (val instanceof Array) {
        for (const item of val) {
          queryString += key + '[]=' + encodeURIComponent(item) + '&'
        }
      } else {
        queryString += key + '=' + encodeURIComponent(val) + '&'
      }
    }
    return queryString
  }

  deepConvertParamToString(param) {
    if (param instanceof Array) {
      return param.map(this.deepConvertParamToString)
    } else {
      return param.toString()
    }
  }

  buildFormData(params = {}) {
    // Copy over all fields and convert non-arrays to strings
    const formData = {}
    for (const key in params) {
      formData[key] = this.deepConvertParamToString(params[key])
    }
    return formData
  }

  getOverallResultOutcome(data) {
    if (data instanceof Array) {
      let passing = data.length ? true : null
      for (const entry of data) {
        passing = passing && entry.passing
      }
      return passing
    } else {
      return data.passing === undefined ? null : data.passing
    }
  }

  getOverallScreenshotOutcome(data) {
    if (data instanceof Array) {
      let passing = data.length ? true : null
      for (const entry of data) {
        passing = passing && entry.screenshotComparePassing
      }
      return passing
    } else {
      return data.screenshotComparePassing === undefined ? null : data.screenshotComparePassing
    }
  }

  async request(method, path, params, callback, json = true) {
    // Sort out params and callback
    if (typeof params === 'function') {
      callback = params
      params = {}
    } else if (!params || typeof params !== 'object') {
      params = {}
    }
    // Add API key to params
    params.apiKey = this.apiKey
    // Setup initial request options
    const options = {
      method: method,
      uri: this.buildRequestUrl(path),
      headers: {
        'User-Agent': this.userAgent,
      },
      json,
      timeout: 3600000,
    }
    // Customize request based on GET or POST
    if (method === 'POST') {
      if (params.body) {
        options.body = params.body
        options.body.apiKey = this.apiKey
        options.headers['Content-Type'] = 'application/json'
      } else {
        // Add params as form data
        options.formData = this.buildFormData(params)
        // Check for special `dataFile` parameter (path to CSV file) and open read stream for it
        if (params.dataFile) {
          options.formData.dataFile = fs.createReadStream(params.dataFile.toString())
        }
      }
    } else {
      // Add params as query string
      options.uri += this.buildQueryString(params)
    }
    // Send request to API
    let result
    try {
      result = await this._request(options)
    } catch (err) {
      if (typeof callback === 'function') {
        callback(err)
        return
      }
      throw err
    }
    // Process response
    if (json && result.code === 'ERROR') {
      const err = new Error(result.message)
      if (typeof callback === 'function') {
        callback(err)
        return
      }
      throw err
    } else if (json) {
      if (typeof callback === 'function') {
        callback(null, result.data)
      }
      return result.data
    } else {
      if (typeof callback === 'function') {
        callback(null, result)
      }
      return result
    }
  }

  async download(path, dest, callback) {
    // Add API key to params
    const params = {
      apiKey: this.apiKey,
    }
    const options = {
      method: 'GET',
      uri: this.buildRequestUrl(path) + this.buildQueryString(params),
      headers: {
        'User-Agent': this.userAgent,
      },
    }
    // Send request to API
    let data
    try {
      data = await this._request(options)
    } catch (err) {
      if (typeof callback === 'function') {
        callback(err)
        return
      }
      throw err
    }
    // Save response into file
    const err = await new Promise((resolve) => {
      fs.writeFile(dest, data, resolve)
    })
    // Process response
    if (err) {
      if (typeof callback === 'function') {
        callback(err)
        return
      }
      throw err
    } else {
      if (typeof callback === 'function') {
        callback(null, data)
      }
      return data
    }
  }

  /**
   * Wrapper for request-promise-native, used for testing.
   */
  async _request(options) {
    return request(options)
  }

  async getFolders(callback) {
    return this.request('GET', '/folders/', callback)
  }

  async getFolder(folderId, callback) {
    return this.request('GET', `/folders/${folderId}/`, callback)
  }

  async getFolderSuites(folderId, callback) {
    return this.request('GET', `/folders/${folderId}/suites/`, callback)
  }

  async getSuites(callback) {
    return this.request('GET', '/suites/', callback)
  }

  async getSuite(suiteId, callback) {
    return this.request('GET', `/suites/${suiteId}/`, callback)
  }

  async getSuiteTests(suiteId, callback) {
    return this.request('GET', `/suites/${suiteId}/tests/`, callback)
  }

  async getSuiteResults(suiteId, options, callback) {
    return this.request('GET', `/suites/${suiteId}/results/`, options, callback)
  }

  async executeSuite(suiteId, providedOptions, callback) {
    let options = {}
    // Sort out options and callback
    if (typeof providedOptions === 'function') {
      callback = providedOptions
    } else if (providedOptions && typeof providedOptions === 'object') {
      options = JSON.parse(JSON.stringify(providedOptions))
    }
    // we can poll if there's no CSV and immediate=0
    const canPoll = !options.immediate && !options.dataFile
    if (canPoll) {
      options.immediate = true
    }
    // Execute API call
    let data
    try {
      data = await this.request('POST', `/suites/${suiteId}/execute/`, options)
    } catch (err) {
      if (typeof callback === 'function') {
        callback(err)
        return
      }
      throw err
    }

    if (!Array.isArray(data)) {
      data = [data]
    }

    if (canPoll) {
      // wait for the suite to finish
      data = await Promise.all(
        data.map((item) => {
          return this.waitForSuiteResult(item._id, options)
        }),
      )

      // fetch the test results for this execution when executing single suite
      if (data.length === 1) {
        data = await this.getSuiteResultTestResults(data[0]._id)
      }
    } else {
      if (data.length === 1) {
        data = data[0]
      }
    }
    // Check results, determine overall pass/fail
    let passing = this.getOverallResultOutcome(data)

    if (passing && options.useScreenshotForPassingStatus) {
      passing = this.getOverallScreenshotOutcome(data)
    }

    // Call back with extra pass/fail parameter
    if (typeof callback === 'function') {
      callback(null, data, passing)
    }
    return [data, passing]
  }

  async downloadSuiteSeleniumHtml(suiteId, dest, callback) {
    return this.download(`/suites/${suiteId}/export/selenium-html/`, dest, callback)
  }

  async downloadSuiteSeleniumJson(suiteId, dest, callback) {
    return this.download(`/suites/${suiteId}/export/selenium-json/`, dest, callback)
  }

  async downloadSuiteSeleniumSide(suiteId, dest, callback) {
    return this.download(`/suites/${suiteId}/export/selenium-side/`, dest, callback)
  }

  async downloadSuiteJson(suiteId, dest, callback) {
    return this.download(`/suites/${suiteId}/export/json/`, dest, callback)
  }

  async downloadTestJson(testId, dest, callback) {
    return this.download(`/tests/${testId}/export/json/`, dest, callback)
  }

  async getTests(callback) {
    return this.request('GET', '/tests/', callback)
  }

  async getTest(testId, callback) {
    return this.request('GET', `/tests/${testId}/`, callback)
  }

  async getTestResults(testId, options, callback) {
    return this.request('GET', `/tests/${testId}/results/`, options, callback)
  }

  async getTestResultsRunning(testId, callback) {
    return this.request('GET', `/tests/${testId}/running/`, callback)
  }

  async acceptTestScreenshot(testId, callback) {
    return this.request('POST', `/tests/${testId}/accept-screenshot/`, callback)
  }

  async duplicateTest(testId, callback) {
    return this.request('POST', `/tests/${testId}/duplicate/`, callback)
  }

  async executeTest(testId, providedOptions, callback) {
    let options = {}
    // Sort out options and callback
    if (typeof providedOptions === 'function') {
      callback = providedOptions
    } else if (providedOptions && typeof providedOptions === 'object') {
      options = JSON.parse(JSON.stringify(providedOptions))
    }
    // we can poll if there's no CSV and immediate=0
    const canPoll = !options.immediate && !options.dataFile
    if (canPoll) {
      options.immediate = true
    }
    // Execute API call
    let data
    try {
      data = await this.request('POST', `/tests/${testId}/execute/`, options)
    } catch (err) {
      if (typeof callback === 'function') {
        callback(err)
        return
      }
      throw err
    }

    if (!Array.isArray(data)) {
      data = [data]
    }

    if (canPoll) {
      data = await Promise.all(
        data.map((item) => {
          return this.waitForTestResult(item._id, options)
        }),
      )
    }

    // Check results, determine overall pass/fail
    let passing = this.getOverallResultOutcome(data)

    if (passing && options.useScreenshotForPassingStatus) {
      passing = this.getOverallScreenshotOutcome(data)
    }

    // map back the single data item
    data = data.length === 1 ? data[0] : data

    // Call back with extra pass/fail parameter
    if (typeof callback === 'function') {
      callback(null, data, passing)
    }
    return [data, passing]
  }

  async waitForResult(pollFunction, options, callback) {
    if (typeof options === 'function') {
      callback = options
      options = {}
    }
    options.pollInterval = options.pollInterval || DEFAULT_POLL_INTERVAL
    let result
    try {
      let passing = null
      while (passing === null) {
        await this._wait(options.pollInterval)
        result = await pollFunction()
        passing = result.passing
      }
    } catch (err) {
      if (typeof callback === 'function') {
        callback(err)
        return
      }
      throw err
    }
    if (typeof callback === 'function') {
      callback(null, result)
    }
    return result
  }

  async waitForTestResult(resultId, options, callback) {
    const pollFunction = () => this.getTestResult(resultId)
    return this.waitForResult(pollFunction, options, callback)
  }

  async waitForSuiteResult(suiteResultId, options, callback) {
    const pollFunction = () => this.getSuiteResult(suiteResultId)
    return this.waitForResult(pollFunction, options, callback)
  }

  async executeTestOnDemand(organizationId, test, options, callback) {
    assert.ok(test, 'test must be provided.')
    if (typeof options === 'function') {
      callback = options
      options = {}
    }
    options = options || {}
    options.body = test
    let result
    try {
      result = await this.request(
        'POST',
        `/organizations/${organizationId}/on-demand/execute/`,
        options,
      )
    } catch (err) {
      if (typeof callback === 'function') {
        callback(err)
        return
      }
      throw err
    }
    if (options.wait) {
      const pollFunction = () => this.getTestResult(result._id)
      return this.waitForResult(pollFunction, options, callback)
    }
    if (typeof callback === 'function') {
      callback(null, result)
    }
    return result
  }

  async importTest(suiteId, test, callback) {
    const options = {}
    // check for HTML or JSON
    if (typeof test === 'string') {
      options.dataFile = test
    } else {
      options.body = test
    }
    return this.request('POST', `/suites/${suiteId}/import-test`, options, callback)
  }

  async downloadTestSeleniumHtml(testId, dest, callback) {
    return this.download(`/tests/${testId}/export/selenium-html/`, dest, callback)
  }

  async downloadTestSeleniumJson(testId, dest, callback) {
    return this.download(`/tests/${testId}/export/selenium-json/`, dest, callback)
  }

  async downloadTestSeleniumSide(testId, dest, callback) {
    return this.download(`/tests/${testId}/export/selenium-side/`, dest, callback)
  }

  async getSuiteResult(suiteResultId, callback) {
    return this.request('GET', `/suite-results/${suiteResultId}/`, callback)
  }

  async getSuiteResultTestResults(suiteResultId, callback) {
    const count = 50
    let data = []
    let resultCount = 50
    let offset = 0
    while (resultCount >= count) {
      let results
      try {
        results = await this.request('GET', `/suite-results/${suiteResultId}/results/`, {
          count,
          offset,
        })
      } catch (err) {
        if (typeof callback === 'function') {
          callback(err)
          return
        }
        throw err
      }
      data = data.concat(results)
      resultCount = results.length
      offset += count
    }
    if (typeof callback === 'function') {
      callback(null, data)
    }
    return data
  }

  async getSuiteResultXUnit(suiteResultId, callback) {
    return this.request('GET', `/suite-results/${suiteResultId}/xunit/`, {}, callback, false)
  }

  async cancelSuiteResult(suiteResultId, callback) {
    return this.request('POST', `/suite-results/${suiteResultId}/cancel/`, callback)
  }

  async getTestResult(testResultId, callback) {
    return this.request('GET', `/results/${testResultId}/`, callback)
  }

  // Legacy alias for getTestResult()
  async getResult(testResultId, callback) {
    return this.getTestResult(testResultId, callback)
  }

  async cancelTestResult(testResultId, callback) {
    return this.request('POST', `/results/${testResultId}/cancel/`, callback)
  }

  // Legacy alias for cancelTestResult()
  async cancelResult(testResultId, callback) {
    return this.cancelTestResult(testResultId, callback)
  }
}

// Export new GhostInspector instance
module.exports = (apiKey) => new GhostInspector(apiKey)
