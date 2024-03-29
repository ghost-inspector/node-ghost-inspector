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

  getOverallResultOutcome(data, field = 'passing') {
    if (data instanceof Array) {
      let passing = data.length ? true : null
      for (const entry of data) {
        passing = passing && entry[field]
      }
      return passing
    } else {
      return data[field] === undefined ? null : data[field]
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

  async download(path, dest, options, callback) {
    if (typeof options === 'function') {
      callback = options
    }

    // Add API key to params
    const params = {
      apiKey: this.apiKey,
    }

    if (options && options.includeImports) {
      params.includeImports = true
    }

    let encoding = 'utf8'
    if (options && options.encoding) {
      encoding = options.encoding
    }

    const requestOptions = {
      method: 'GET',
      uri: this.buildRequestUrl(path) + this.buildQueryString(params),
      headers: {
        'User-Agent': this.userAgent,
      },
    }
    // Send request to API
    let data
    try {
      data = await this._request(requestOptions)
    } catch (err) {
      if (typeof callback === 'function') {
        callback(err)
        return
      }
      throw err
    }
    // check the response for API key issues
    if (data.indexOf('{"code":"ERROR"') > -1) {
      const message = JSON.parse(data).message
      if (typeof callback === 'function') {
        callback(message)
        return
      }
      throw new Error(message)
    }
    // Save response into file
    const err = await new Promise((resolve) => {
      fs.writeFile(dest, data, { encoding }, resolve)
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

  async createFolder(organizationId, folderName, callback) {
    const options = { body: { organization: organizationId, name: folderName } }
    return this.request('POST', '/folders/', options, callback)
  }

  async getFolders(callback) {
    return this.request('GET', '/folders/', callback)
  }

  async getFolder(folderId, callback) {
    return this.request('GET', `/folders/${folderId}/`, callback)
  }

  async updateFolder(folderId, folderName, callback) {
    const options = { body: { name: folderName } }
    return this.request('POST', `/folders/${folderId}/`, options, callback)
  }

  async getFolderSuites(folderId, callback) {
    return this.request('GET', `/folders/${folderId}/suites/`, callback)
  }

  async getSuites(callback) {
    return this.request('GET', '/suites/', callback)
  }

  async createSuite(organizationId, suiteName, callback) {
    const options = { body: { organization: organizationId, name: suiteName } }
    return this.request('POST', '/suites/', options, callback)
  }

  async updateSuite(suiteId, updates, callback) {
    updates = { body: { ...updates } }
    return this.request('POST', `/suites/${suiteId}/`, updates, callback)
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

  async duplicateSuite(suiteId, callback) {
    return this.request('POST', `/suites/${suiteId}/duplicate/`, callback)
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

    // Keep track of whether or not we need to return a single result within an Array, this
    // makes sure that if a CSV gets executed with 1 row, we still return the result in a list
    let returnSingleResult = true
    if (!Array.isArray(data)) {
      data = [data]
    } else {
      returnSingleResult = false
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
      if (data.length === 1 && returnSingleResult) {
        data = data[0]
      }
    }
    // Check results, determine overall pass/fail
    const passing = this.getOverallResultOutcome(data)
    const screenshotPassing = this.getOverallResultOutcome(data, 'screenshotComparePassing')

    // Call back with extra pass/fail parameter
    if (typeof callback === 'function') {
      callback(null, data, passing, screenshotPassing)
    }
    return [data, passing, screenshotPassing]
  }

  // TODO: resulting file appears to be broken on suites with >1 test
  async downloadSuiteSeleniumHtml(suiteId, dest, callback) {
    return this.download(
      `/suites/${suiteId}/export/selenium-html/`,
      dest,
      { encoding: 'binary' },
      callback,
    )
  }

  async downloadSuiteSeleniumJson(suiteId, dest, callback) {
    return this.download(
      `/suites/${suiteId}/export/selenium-json/`,
      dest,
      { encoding: 'binary' },
      callback,
    )
  }

  async downloadSuiteSeleniumSide(suiteId, dest, callback) {
    return this.download(
      `/suites/${suiteId}/export/selenium-side/`,
      dest,
      { encoding: 'binary' },
      callback,
    )
  }

  async downloadSuiteJson(suiteId, dest, options, callback) {
    if (typeof options === 'function') {
      callback = options
    }
    return this.download(
      `/suites/${suiteId}/export/json/`,
      dest,
      { ...options, encoding: 'binary' },
      callback,
    )
  }

  async downloadTestJson(testId, dest, options, callback) {
    if (typeof options === 'function') {
      callback = options
    }
    return this.download(`/tests/${testId}/export/json/`, dest, options, callback)
  }

  async getTests(callback) {
    return this.request('GET', '/tests/', callback)
  }

  async getTest(testId, callback) {
    return this.request('GET', `/tests/${testId}/`, callback)
  }

  async deleteTest(testId, callback) {
    return this.request('DELETE', `/tests/${testId}/`, callback)
  }

  async updateTest(testId, updates, callback) {
    updates = { body: updates }
    return this.request('POST', `/tests/${testId}/`, updates, callback)
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

    // Keep track of whether or not we need to return a single result within an Array, this
    // makes sure that if a CSV gets executed with 1 row, we still return the result in a list
    let returnSingleResult = true
    if (!Array.isArray(data)) {
      data = [data]
    } else {
      returnSingleResult = false
    }

    if (canPoll) {
      data = await Promise.all(
        data.map((item) => {
          return this.waitForTestResult(item._id, options)
        }),
      )
    }

    // Check results, determine overall pass/fail
    const passing = this.getOverallResultOutcome(data)
    const screenshotPassing = this.getOverallResultOutcome(data, 'screenshotComparePassing')

    // map back the single data item
    data = data.length === 1 && returnSingleResult ? data[0] : data

    // Call back with extra pass/fail parameter
    if (typeof callback === 'function') {
      callback(null, data, passing, screenshotPassing)
    }
    return [data, passing, screenshotPassing]
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
    let data
    try {
      data = await this.request(
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

    let returnSingleResult = true
    if (!Array.isArray(data)) {
      data = [data]
    } else {
      returnSingleResult = false
    }

    // maintain support for deprecated 'wait' flag
    let wait = false
    if (options.wait || options.immediate === false) {
      wait = true
    }

    if (wait) {
      data = await Promise.all(
        data.map((item) => {
          const pollFunction = () => this.getTestResult(item._id)
          return this.waitForResult(pollFunction, options, callback)
        }),
      )
    }

    // Check results, determine overall pass/fail
    const passing = this.getOverallResultOutcome(data)
    const screenshotPassing = this.getOverallResultOutcome(data, 'screenshotComparePassing')

    // map back the single data item
    data = data.length === 1 && returnSingleResult ? data[0] : data

    // Call back with extra pass/fail parameter
    if (typeof callback === 'function') {
      callback(null, data, passing, screenshotPassing)
    }
    return [data, passing, screenshotPassing]
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

  // Fetch a list of the currently-executing results for the entire organization and return the results.
  async getAllRunningTests(organizationId, callback) {
    return this.request('GET', `/organizations/${organizationId}/running/`, callback)
  }
}

// Export new GhostInspector instance
module.exports = (apiKey) => new GhostInspector(apiKey)
