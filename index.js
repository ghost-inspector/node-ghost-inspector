var GhostInspector, https;

https = require('https');

GhostInspector = (function() {
  GhostInspector.prototype.host = 'https://api.ghostinspector.com';

  GhostInspector.prototype.prefix = '/v1';

  function GhostInspector(apiKey) {
    this.apiKey = apiKey;
  }

  GhostInspector.prototype.buildRequestUrl = function(path, params) {
    var i, item, key, len, url, val;
    if (params == null) {
      params = {};
    }
    url = this.host + this.prefix + path + '?';
    params.apiKey = this.apiKey;
    for (key in params) {
      val = params[key];
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
  };

  GhostInspector.prototype.request = function(path, params, callback) {
    var url;
    if (typeof params === 'function') {
      callback = params;
      params = {};
    } else if (!params || typeof params !== 'object') {
      params = {};
    }
    url = this.buildRequestUrl(path, params);
    return https.get(url, function(res) {
      var json;
      json = '';
      res.setTimeout(1800000);
      res.on('data', function(data) {
        return json += data;
      });
      return res.on('end', function() {
        var err, result;
        try {
          result = JSON.parse(json);
        } catch (_error) {
          err = _error;
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
      return typeof callback === "function" ? callback(err.message) : void 0;
    });
  };

  GhostInspector.prototype.download = function(path, callback) {
    var url;
    url = this.buildRequestUrl(path);
    return https.get(url, function(res) {
      var contents;
      contents = '';
      res.on('data', function(data) {
        return contents += data;
      });
      return res.on('end', function() {
        return typeof callback === "function" ? callback(null, contents) : void 0;
      });
    }).on('error', function(err) {
      return typeof callback === "function" ? callback(err.message) : void 0;
    });
  };

  GhostInspector.prototype.getSuites = function(callback) {
    return this.request('/suites/', callback);
  };

  GhostInspector.prototype.getSuite = function(suiteId, callback) {
    return this.request('/suites/' + suiteId + '/', callback);
  };

  GhostInspector.prototype.getSuiteTests = function(suiteId, callback) {
    return this.request('/suites/' + suiteId + '/tests/', callback);
  };

  GhostInspector.prototype.executeSuite = function(suiteId, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    return this.request('/suites/' + suiteId + '/execute/', options, function(err, data) {
      var i, len, passing, test;
      if (err) {
        return typeof callback === "function" ? callback(err) : void 0;
      }
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
  };

  GhostInspector.prototype.downloadSuiteSeleniumHtml = function(suiteId, callback) {
    return this.download('/suites/' + suiteId + '/export/selenium-html/', callback);
  };

  GhostInspector.prototype.getTests = function(callback) {
    return this.request('/tests/', callback);
  };

  GhostInspector.prototype.getTest = function(testId, callback) {
    return this.request('/tests/' + testId + '/', callback);
  };

  GhostInspector.prototype.getTestResults = function(testId, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    return this.request('/tests/' + testId + '/results/', options, callback);
  };

  GhostInspector.prototype.executeTest = function(testId, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    return this.request('/tests/' + testId + '/execute/', options, function(err, data) {
      var passing;
      if (err) {
        return typeof callback === "function" ? callback(err) : void 0;
      }
      passing = data.passing === void 0 ? null : data.passing;
      return typeof callback === "function" ? callback(null, data, passing) : void 0;
    });
  };

  GhostInspector.prototype.downloadTestSeleniumHtml = function(testId, callback) {
    return this.download('/tests/' + testId + '/export/selenium-html/', callback);
  };

  GhostInspector.prototype.getResult = function(resultId, callback) {
    return this.request('/results/' + resultId + '/', callback);
  };

  return GhostInspector;

})();

module.exports = function(param1, param2) {
  return new GhostInspector(param2 ? param2 : param1);
};
