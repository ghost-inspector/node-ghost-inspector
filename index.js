/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const https = require('https');
const fs = require('fs');


// Define GhostInspector class
class GhostInspector {
  static initClass() {
    this.prototype.host =   'https://api.ghostinspector.com';
    this.prototype.prefix = '/v1';
  }

  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  buildRequestUrl(path, params) {
    // Build request URL
    if (params == null) { params = {}; }
    let url = this.host + this.prefix + path + '?';
    // Add auth and other params
    params.apiKey = this.apiKey;
    for (let key in params) {
      // handle array params
      const val = params[key];
      if (val instanceof Array) {
        for (let item of Array.from(val)) {
          url += key + '[]=' + encodeURIComponent(item) + '&';
        }
      } else {
        url += key + '=' + encodeURIComponent(val) + '&';
      }
    }
    return url;
  }

  request(path, params, callback) {
    // Sort out params and callback
    if (typeof params === 'function') {
      callback = params;
      params = {};
    } else if (!params || (typeof params !== 'object')) {
      params = {};
    }
    // Send request to API
    const url = this.buildRequestUrl(path, params);
    return https.get(url, function(res) {
      let json = '';
      // Set long timeout (30 mins)
      res.setTimeout(1800000);
      // Get response
      res.on('data', data => json += data);
      // Process response
      return res.on('end', function() {
        let result;
        try {
          result = JSON.parse(json);
        } catch (err) {
          result = {
            code: 'ERROR',
            message: 'The Ghost Inspector service is not returning a valid response.'
          };
        }
        if (result.code === 'ERROR') { return (typeof callback === 'function' ? callback(result.message) : undefined); }
        return (typeof callback === 'function' ? callback(null, result.data) : undefined);
      });
  }).on('error', err => typeof callback === 'function' ? callback(err) : undefined);
  }

  download(path, dest, callback) {
    const file = fs.createWriteStream(dest);
    // Send request to API
    const url = this.buildRequestUrl(path);
    return https.get(url, function(res) {
      // Save response into file
      res.pipe(file);
      return file.on('finish', () => file.close(callback));
  }).on('error', err => typeof callback === 'function' ? callback(err) : undefined);
  }

  getSuites(callback) {
    return this.request('/suites/', callback);
  }

  getSuite(suiteId, callback) {
    return this.request(`/suites/${suiteId}/`, callback);
  }

  getSuiteTests(suiteId, callback) {
    return this.request(`/suites/${suiteId}/tests/`, callback);
  }

  executeSuite(suiteId, options, callback) {
    // Sort out options and callback
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    // Execute API call
    return this.request(`/suites/${suiteId}/execute/`, options, function(err, data) {
      let passing;
      if (err) { return (typeof callback === 'function' ? callback(err) : undefined); }
      // Check test results, determine overall pass/fail
      if (data instanceof Array) {
        passing = true;
        for (let test of Array.from(data)) {
          passing = passing && test.passing;
        }
      } else {
        passing = null;
      }
      // Call back with extra pass/fail parameter
      return (typeof callback === 'function' ? callback(null, data, passing) : undefined);
    });
  }

  downloadSuiteSeleniumHtml(suiteId, dest, callback) {
    return this.download(`/suites/${suiteId}/export/selenium-html/`, dest, callback);
  }

  getTests(callback) {
    return this.request('/tests/', callback);
  }

  getTest(testId, callback) {
    return this.request(`/tests/${testId}/`, callback);
  }

  getTestResults(testId, options, callback) {
    // Sort out options and callback
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    // Execute API call
    return this.request(`/tests/${testId}/results/`, options, callback);
  }

  executeTest(testId, options, callback) {
    // Sort out options and callback
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    // Execute API call
    return this.request(`/tests/${testId}/execute/`, options, function(err, data) {
      if (err) { return (typeof callback === 'function' ? callback(err) : undefined); }
      // Call back with extra pass/fail parameter
      const passing = data.passing === undefined ? null : data.passing;
      return (typeof callback === 'function' ? callback(null, data, passing) : undefined);
    });
  }

  downloadTestSeleniumHtml(testId, dest, callback) {
    return this.download(`/tests/${testId}/export/selenium-html/`, dest, callback);
  }

  getResult(resultId, callback) {
    return this.request(`/results/${resultId}/`, callback);
  }
}
GhostInspector.initClass();


// Export new GhostInspector instance
module.exports = (param1, param2) => new GhostInspector(param2 ? param2 : param1);
