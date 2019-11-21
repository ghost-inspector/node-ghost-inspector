const fs = require('fs')
const request = require('request-promise-native')

// Define GhostInspector class
class GhostInspector {
  constructor (apiKey) {
    this.userAgent = 'Ghost Inspector Node.js Client'
    this.host = 'https://api.ghostinspector.com'
    this.prefix = '/v1'
    this.apiKey = apiKey
  }

  buildRequestUrl (path) {
    return this.host + this.prefix + path
  }

  buildQueryString (params = {}) {
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

  deepConvertParamToString (param) {
    if (param instanceof Array) {
      return param.map(this.deepConvertParamToString)
    } else {
      return param.toString()
    }
  }

  buildFormData (params = {}) {
    // Copy over all fields and convert non-arrays to strings
    const formData = {}
    for (const key in params) {
      formData[key] = this.deepConvertParamToString(params[key])
    }
    return formData
  }

  getOverallResultOutcome (data) {
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

  async request (method, path, params, callback, json = true) {
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
        'User-Agent': this.userAgent
      },
      json,
      timeout: 3600000
    }
    // Customize request based on GET or POST
    if (method === 'POST') {
      // Add params as form data
      options.formData = this.buildFormData(params)
      // Check for special `dataFile` parameter (path to CSV file) and open read stream for it
      if (params.dataFile) {
        options.formData.dataFile = fs.createReadStream(params.dataFile.toString())
      }
    } else {
      // Add params as query string
      options.uri += this.buildQueryString(params)
    }
    // Send request to API
    let result
    try {
      result = await request(options)
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

  async download (path, dest, callback) {
    // Add API key to params
    const params = {
      apiKey: this.apiKey
    }
    const options = {
      method: 'GET',
      uri: this.buildRequestUrl(path) + this.buildQueryString(params),
      headers: {
        'User-Agent': this.userAgent
      }
    }
    // Send request to API
    let data
    try {
      data = await request(options)
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

  async getFolders (callback) {
    return this.request('GET', '/folders/', callback)
  }

  async getFolder (folderId, callback) {
    return this.request('GET', `/folders/${folderId}/`, callback)
  }

  async getFolderSuites (folderId, callback) {
    return this.request('GET', `/folders/${folderId}/suites/`, callback)
  }

  async getSuites (callback) {
    return this.request('GET', '/suites/', callback)
  }

  async getSuite (suiteId, callback) {
    return this.request('GET', `/suites/${suiteId}/`, callback)
  }

  async getSuiteTests (suiteId, callback) {
    return this.request('GET', `/suites/${suiteId}/tests/`, callback)
  }

  async getSuiteResults (suiteId, options, callback) {
    return this.request('GET', `/suites/${suiteId}/results/`, options, callback)
  }

  async executeSuite (suiteId, options, callback) {
    // Sort out options and callback
    if (typeof options === 'function') {
      callback = options
      options = {}
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
    // Check results, determine overall pass/fail
    const passing = this.getOverallResultOutcome(data)
    // Call back with extra pass/fail parameter
    if (typeof callback === 'function') {
      callback(null, data, passing)
    }
    return [data, passing]
  }

  async downloadSuiteSeleniumHtml (suiteId, dest, callback) {
    return this.download(`/suites/${suiteId}/export/selenium-html/`, dest, callback)
  }

  async downloadSuiteSeleniumJson (suiteId, dest, callback) {
    return this.download(`/suites/${suiteId}/export/selenium-json/`, dest, callback)
  }

  async downloadSuiteSeleniumSide (suiteId, dest, callback) {
    return this.download(`/suites/${suiteId}/export/selenium-side/`, dest, callback)
  }

  async getTests (callback) {
    return this.request('GET', '/tests/', callback)
  }

  async getTest (testId, callback) {
    return this.request('GET', `/tests/${testId}/`, callback)
  }

  async getTestResults (testId, options, callback) {
    return this.request('GET', `/tests/${testId}/results/`, options, callback)
  }

  async getTestResultsRunning (testId, callback) {
    return this.request('GET', `/tests/${testId}/running/`, callback)
  }

  async acceptTestScreenshot (testId, callback) {
    return this.request('POST', `/tests/${testId}/accept-screenshot/`, callback)
  }

  async duplicateTest (testId, callback) {
    return this.request('POST', `/tests/${testId}/duplicate/`, callback)
  }

  async executeTest (testId, options, callback) {
    // Sort out options and callback
    if (typeof options === 'function') {
      callback = options
      options = {}
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
    // Check results, determine overall pass/fail
    const passing = this.getOverallResultOutcome(data)
    // Call back with extra pass/fail parameter
    if (typeof callback === 'function') {
      callback(null, data, passing)
    }
    return [data, passing]
  }

  // async executeOnDemandTest (organizationId, testBody, options, callback) {
  //   const wait = options.wait ? true : false
  //   const response = await this.request()

  // }

  async downloadTestSeleniumHtml (testId, dest, callback) {
    return this.download(`/tests/${testId}/export/selenium-html/`, dest, callback)
  }

  async downloadTestSeleniumJson (testId, dest, callback) {
    return this.download(`/tests/${testId}/export/selenium-json/`, dest, callback)
  }

  async downloadTestSeleniumSide (testId, dest, callback) {
    return this.download(`/tests/${testId}/export/selenium-side/`, dest, callback)
  }

  async getSuiteResult (suiteResultId, callback) {
    return this.request('GET', `/suite-results/${suiteResultId}/`, callback)
  }

  async getSuiteResultTestResults (suiteResultId, callback) {
    return this.request('GET', `/suite-results/${suiteResultId}/results/`, callback)
  }

  async getSuiteResultXUnit (suiteResultId, callback) {
    return this.request('GET', `/suite-results/${suiteResultId}/xunit/`, {}, callback, false)
  }

  async cancelSuiteResult (suiteResultId, callback) {
    return this.request('POST', `/suite-results/${suiteResultId}/cancel/`, callback)
  }

  async getTestResult (testResultId, callback) {
    return this.request('GET', `/results/${testResultId}/`, callback)
  }

  // Legacy alias for getTestResult()
  async getResult (testResultId, callback) {
    return this.getTestResult(testResultId, callback)
  }

  async cancelTestResult (testResultId, callback) {
    return this.request('POST', `/results/${testResultId}/cancel/`, callback)
  }

  // Legacy alias for cancelTestResult()
  async cancelResult (testResultId, callback) {
    return this.cancelTestResult(testResultId, callback)
  }
}

// Export new GhostInspector instance
module.exports = (apiKey) => new GhostInspector(apiKey)
