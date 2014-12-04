var GhostInspector, https;

https = require('https');

GhostInspector = (function() {
  GhostInspector.prototype.host = 'https://api.ghostinspector.com';

  GhostInspector.prototype.prefix = '/v1';

  function GhostInspector(apiKey) {
    this.apiKey = apiKey;
  }

  GhostInspector.prototype.execute = function(path, params, callback) {
    var key, url, val;
    if (typeof params === 'function') {
      callback = params;
      params = {};
    } else if (!params || typeof params !== 'object') {
      params = {};
    }
    params.apiKey = this.apiKey;
    url = this.host + this.prefix + path + '?';
    for (key in params) {
      val = params[key];
      url += key + '=' + encodeURIComponent(val) + '&';
    }
    return https.get(url, function(res) {
      var json;
      json = '';
      res.on('data', function(data) {
        return json += data;
      });
      return res.on('end', function() {
        var result;
        result = JSON.parse(json);
        if (result.code === 'ERROR') {
          return typeof callback === "function" ? callback(result.message) : void 0;
        }
        return typeof callback === "function" ? callback(null, result.data) : void 0;
      });
    }).on('error', function(err) {
      return typeof callback === "function" ? callback(err.message) : void 0;
    });
  };

  GhostInspector.prototype.getSuites = function(callback) {
    return this.execute('/suites/', callback);
  };

  GhostInspector.prototype.getSuite = function(suiteId, callback) {
    return this.execute('/suites/' + suiteId + '/', callback);
  };

  GhostInspector.prototype.getSuiteTests = function(suiteId, callback) {
    return this.execute('/suites/' + suiteId + '/tests/', callback);
  };

  GhostInspector.prototype.executeSuite = function(suiteId, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    return this.execute('/suites/' + suiteId + '/execute/', options, function(err, data) {
      var passing, test, _i, _len;
      if (err) {
        return typeof callback === "function" ? callback(err) : void 0;
      }
      passing = true;
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        test = data[_i];
        passing = passing && test.passing;
      }
      return typeof callback === "function" ? callback(null, data, passing) : void 0;
    });
  };

  GhostInspector.prototype.getTests = function(callback) {
    return this.execute('/tests/', callback);
  };

  GhostInspector.prototype.getTest = function(testId, callback) {
    return this.execute('/tests/' + testId + '/', callback);
  };

  GhostInspector.prototype.getTestResults = function(testId, callback) {
    return this.execute('/tests/' + testId + '/results/', callback);
  };

  GhostInspector.prototype.executeTest = function(testId, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    return this.execute('/tests/' + testId + '/execute/', options, function(err, data) {
      if (err) {
        return typeof callback === "function" ? callback(err) : void 0;
      }
      return typeof callback === "function" ? callback(null, data, data.passing) : void 0;
    });
  };

  GhostInspector.prototype.getResult = function(resultId, callback) {
    return this.execute('/results/' + resultId + '/', callback);
  };

  return GhostInspector;

})();

module.exports = function(param1, param2) {
  return new GhostInspector(param2 ? param2 : param1);
};
