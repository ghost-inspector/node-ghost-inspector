var GhostInspector, fs, https;

https = require('https');

fs = require('fs');

GhostInspector = (function() {
  // Define GhostInspector class
  class GhostInspector {
    constructor(apiKey) {
      this.apiKey = apiKey;
    }

    buildRequestUrl(path, params = {}) {
      var i, item, key, len, url, val;
      // Build request URL
      url = this.host + this.prefix + path + '?';
      // Add auth and other params
      params.apiKey = this.apiKey;
      for (key in params) {
        val = params[key];
        // handle array params
        if (val instanceof Array) {
          for (i = 0, len = val.length; i < len; i++) {
            item = val[i];
            url += key + '[]=' + encodeURIComponent(item) + '&';
          }
        } else {
          url += key + '=' + encodeURIComponent(val) + '&';
        }
      }
      return url;
    }

    request(path, params, callback) {
      var url;
      // Sort out params and callback
      if (typeof params === 'function') {
        callback = params;
        params = {};
      } else if (!params || typeof params !== 'object') {
        params = {};
      }
      // Send request to API
      url = this.buildRequestUrl(path, params);
      return https.get(url, function(res) {
        var json;
        json = '';
        // Set long timeout (30 mins)
        res.setTimeout(1800000);
        // Get response
        res.on('data', function(data) {
          return json += data;
        });
        // Process response
        return res.on('end', function() {
          var err, result;
          try {
            result = JSON.parse(json);
          } catch (error) {
            err = error;
            result = {
              code: 'ERROR',
              message: 'The Ghost Inspector service is not returning a valid response.'
            };
          }
          if (result.code === 'ERROR') {
            return typeof callback === "function" ? callback(result.message) : void 0;
          }
          return typeof callback === "function" ? callback(null, result.data) : void 0;
        });
      }).on('error', function(err) {
        return typeof callback === "function" ? callback(err) : void 0;
      });
    }

    download(path, dest, callback) {
      var file, url;
      file = fs.createWriteStream(dest);
      // Send request to API
      url = this.buildRequestUrl(path);
      return https.get(url, function(res) {
        // Save response into file
        res.pipe(file);
        return file.on('finish', function() {
          return file.close(callback);
        });
      }).on('error', function(err) {
        return typeof callback === "function" ? callback(err) : void 0;
      });
    }

    getSuites(callback) {
      return this.request('/suites/', callback);
    }

    getSuite(suiteId, callback) {
      return this.request('/suites/' + suiteId + '/', callback);
    }

    getSuiteTests(suiteId, callback) {
      return this.request('/suites/' + suiteId + '/tests/', callback);
    }

    executeSuite(suiteId, options, callback) {
      // Sort out options and callback
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      // Execute API call
      return this.request('/suites/' + suiteId + '/execute/', options, function(err, data) {
        var i, len, passing, test;
        if (err) {
          return typeof callback === "function" ? callback(err) : void 0;
        }
        // Check test results, determine overall pass/fail
        if (data instanceof Array) {
          passing = true;
          for (i = 0, len = data.length; i < len; i++) {
            test = data[i];
            passing = passing && test.passing;
          }
        } else {
          passing = null;
        }
        return typeof callback === "function" ? callback(null, data, passing) : void 0;
      });
    }

    downloadSuiteSeleniumHtml(suiteId, dest, callback) {
      return this.download('/suites/' + suiteId + '/export/selenium-html/', dest, callback);
    }

    getTests(callback) {
      return this.request('/tests/', callback);
    }

    getTest(testId, callback) {
      return this.request('/tests/' + testId + '/', callback);
    }

    getTestResults(testId, options, callback) {
      // Sort out options and callback
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      // Execute API call
      return this.request('/tests/' + testId + '/results/', options, callback);
    }

    executeTest(testId, options, callback) {
      // Sort out options and callback
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      // Execute API call
      return this.request('/tests/' + testId + '/execute/', options, function(err, data) {
        var passing;
        if (err) {
          return typeof callback === "function" ? callback(err) : void 0;
        }
        // Call back with extra pass/fail parameter
        passing = data.passing === void 0 ? null : data.passing;
        return typeof callback === "function" ? callback(null, data, passing) : void 0;
      });
    }

    downloadTestSeleniumHtml(testId, dest, callback) {
      return this.download('/tests/' + testId + '/export/selenium-html/', dest, callback);
    }

    getResult(resultId, callback) {
      return this.request('/results/' + resultId + '/', callback);
    }

  };

  GhostInspector.prototype.host = 'https://api.ghostinspector.com';

  GhostInspector.prototype.prefix = '/v1';

  return GhostInspector;

}).call(this);

// Export new GhostInspector instance
module.exports = function(param1, param2) {
  return new GhostInspector(param2 ? param2 : param1);
};
