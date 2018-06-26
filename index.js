const https = require('https')
const fs = require('fs')

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

  request (path, params, callback) {
    // Sort out params and callback
    if (typeof params === 'function') {
      callback = params
      params = {}
    } else if (!params || typeof params !== 'object') {
      params = {}
    }
    // Send request to API
    const url = this.buildRequestUrl(path, params)
    https.get(url, (res) => {
      let json = ''
      // Set long timeout (30 mins)
      res.setTimeout(1800000)
      // Get response
      res.on('data', data => { json += data })
      // Process response
      res.on('end', () => {
        let result
        try {
          result = JSON.parse(json)
        } catch (err) {
          result = {
            code: 'ERROR',
            message: 'The Ghost Inspector service is not returning a valid response.'
          }
        }
        if (result.code === 'ERROR') {
          if (typeof callback === 'function') { callback(result.message) }
          return
        }
        if (typeof callback === 'function') { callback(null, result.data) }
      })
    }).on('error', (err) => {
      if (typeof callback === 'function') { callback(err) }
    })
  }

  download (path, dest, callback) {
    const file = fs.createWriteStream(dest)
    // Send request to API
    const url = this.buildRequestUrl(path)
    https.get(url, (res) => {
      // Save response into file
      res.pipe(file)
      file.on('finish', () => {
        file.close(callback)
      })
    }).on('error', (err) => {
      if (typeof callback === 'function') { callback(err) }
    })
  }

  getSuites (callback) {
    this.request('/suites/', callback)
  }

  getSuite (suiteId, callback) {
    this.request(`/suites/${suiteId}/`, callback)
  }

  getSuiteTests (suiteId, callback) {
    this.request(`/suites/${suiteId}/tests/`, callback)
  }

  executeSuite (suiteId, options, callback) {
    // Sort out options and callback
    if (typeof options === 'function') {
      callback = options
      options = {}
    }
    // Execute API call
    this.request(`/suites/${suiteId}/execute/`, options, (err, data) => {
      let passing
      if (err) {
        if (typeof callback === 'function') { callback(err) }
        return
      }
      // Check test results, determine overall pass/fail
      if (data instanceof Array) {
        passing = true
        for (let test of data) {
          passing = passing && test.passing
        }
      } else {
        passing = null
      }
      // Call back with extra pass/fail parameter
      if (typeof callback === 'function') { callback(null, data, passing) }
    })
  }

  downloadSuiteSeleniumHtml (suiteId, dest, callback) {
    this.download(`/suites/${suiteId}/export/selenium-html/`, dest, callback)
  }

  getTests (callback) {
    this.request('/tests/', callback)
  }

  getTest (testId, callback) {
    this.request(`/tests/${testId}/`, callback)
  }

  getTestResults (testId, options, callback) {
    // Sort out options and callback
    if (typeof options === 'function') {
      callback = options
      options = {}
    }
    // Execute API call
    this.request(`/tests/${testId}/results/`, options, callback)
  }

  executeTest (testId, options, callback) {
    // Sort out options and callback
    if (typeof options === 'function') {
      callback = options
      options = {}
    }
    // Execute API call
    this.request(`/tests/${testId}/execute/`, options, (err, data) => {
      if (err) {
        if (typeof callback === 'function') { callback(err) }
        return
      }
      // Call back with extra pass/fail parameter
      const passing = data.passing === undefined ? null : data.passing
      if (typeof callback === 'function') { callback(null, data, passing) }
    })
  }

  downloadTestSeleniumHtml (testId, dest, callback) {
    this.download(`/tests/${testId}/export/selenium-html/`, dest, callback)
  }

  getResult (resultId, callback) {
    this.request(`/results/${resultId}/`, callback)
  }
}

// Export new GhostInspector instance
module.exports = (apiKey) => new GhostInspector(apiKey)
