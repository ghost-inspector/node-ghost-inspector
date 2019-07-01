const fs = require('fs')
const rp = require('request-promise-native')

// Define GhostInspector class
class GhostInspector {
  constructor (apiKey) {
    this.host = 'https://api.ghostinspector.com'
    this.prefix = '/v1'
    this.apiKey = apiKey
  }

  buildRequestUrl (path, params) {
    // Build request URL
    if (params == null) { params = {} }
    let url = this.host + this.prefix + path + '?'
    // Add auth and other params
    params.apiKey = this.apiKey
    for (let key in params) {
      // handle array params
      const val = params[key]
      if (val instanceof Array) {
        for (let item of val) {
          url += key + '[]=' + encodeURIComponent(item) + '&'
        }
      } else {
        url += key + '=' + encodeURIComponent(val) + '&'
      }
    }
    return url
  }

  async request (path, params, callback) {
    let result
    // Sort out params and callback
    if (typeof params === 'function') {
      callback = params
      params = {}
    } else if (!params || typeof params !== 'object') {
      params = {}
    }
    try {
      // Send request to API
      const options = {
        method: 'GET',
        uri: this.buildRequestUrl(path, params),
        headers: {
          'User-Agent': 'Ghost Inspector Node.js Bindings'
        },
        json: true,
        timeout: 3600000
      }
      result = await rp(options)
    } catch (err) {
      if (typeof callback === 'function') {
        callback(err)
        return
      }
      throw err
    }
    // Process response
    if (result.code === 'ERROR') {
      const err = new Error(result.message)
      if (typeof callback === 'function') {
        callback(err)
        return
      }
      throw err
    } else {
      if (typeof callback === 'function') {
        callback(null, result.data)
      }
      return result.data
    }
  }

  async download (path, dest, callback) {
    let data
    try {
      // Send request to API
      const options = {
        method: 'GET',
        uri: this.buildRequestUrl(path),
        headers: {
          'User-Agent': 'Ghost Inspector Node.js Bindings'
        }
      }
      data = await rp(options)
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

  async getSuites (callback) {
    return await this.request('/suites/', callback)
  }

  async getSuite (suiteId, callback) {
    return await this.request(`/suites/${suiteId}/`, callback)
  }

  async getSuiteTests (suiteId, callback) {
    return await this.request(`/suites/${suiteId}/tests/`, callback)
  }

  async getSuiteResults (suiteId, options, callback) {
    // Sort out options and callback
    if (typeof options === 'function') {
      callback = options
      options = {}
    }
    // Execute API call
    return await this.request(`/suites/${suiteId}/results/`, options, callback)
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
      data = await this.request(`/suites/${suiteId}/execute/`, options)
    } catch (err) {
      if (typeof callback === 'function') {
        callback(err)
        return
      }
      throw err
    }      
    // Check test results, determine overall pass/fail
    let passing
    if (data instanceof Array) {
      passing = true
      for (let test of data) {
        passing = passing && test.passing
      }
    } else {
      passing = null
    }
    // Call back with extra pass/fail parameter
    if (typeof callback === 'function') {
      callback(null, data, passing)
    }
    return [data, passing]
  }

  async downloadSuiteSeleniumHtml (suiteId, dest, callback) {
    return await this.download(`/suites/${suiteId}/export/selenium-html/`, dest, callback)
  }

  async downloadSuiteSeleniumJson (suiteId, dest, callback) {
    return await this.download(`/suites/${suiteId}/export/selenium-json/`, dest, callback)
  }

  async getTests (callback) {
    return await this.request('/tests/', callback)
  }

  async getTest (testId, callback) {
    return await this.request(`/tests/${testId}/`, callback)
  }

  async getTestResults (testId, options, callback) {
    // Sort out options and callback
    if (typeof options === 'function') {
      callback = options
      options = {}
    }
    // Execute API call
    return await this.request(`/tests/${testId}/results/`, options, callback)
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
      data = await this.request(`/tests/${testId}/execute/`, options)
    } catch (err) {
      if (typeof callback === 'function') {
        callback(err)
        return
      }
      throw err
    }   
    // Call back with extra pass/fail parameter
    const passing = data.passing === undefined ? null : data.passing
    if (typeof callback === 'function') {
      callback(null, data, passing)
    }
    return [data, passing]
  }

  async downloadTestSeleniumHtml (testId, dest, callback) {
    return await this.download(`/tests/${testId}/export/selenium-html/`, dest, callback)
  }

  async downloadTestSeleniumJson (testId, dest, callback) {
    return await this.download(`/tests/${testId}/export/selenium-json/`, dest, callback)
  }

  async getSuiteResult (resultId, callback) {
    return await this.request(`/suite-results/${resultId}/`, callback)
  }

  async getSuiteResultTestResults (resultId, callback) {
    return await this.request(`/suite-results/${resultId}/results/`, callback)
  }

  async cancelSuiteResult (resultId, callback) {
    return await this.request(`/suite-results/${resultId}/cancel/`, callback)
  }

  async getTestResult (resultId, callback) {
    return await this.request(`/results/${resultId}/`, callback)
  }

  // Legacy alias for getTestResult()
  async getResult (resultId, callback) {
    return this.getTestResult(resultId, callback)
  }

  async cancelTestResult (resultId, callback) {
    return await this.request(`/results/${resultId}/cancel/`, callback)
  }

  // Legacy alias for cancelTestResult()
  async cancelResult (resultId, callback) {
    return this.cancelTestResult(resultId, callback)
  }
}

// Export new GhostInspector instance
module.exports = (apiKey) => new GhostInspector(apiKey)
