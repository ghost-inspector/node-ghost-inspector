var GhostInspector, https;

https = require('https');

GhostInspector = (function() {
  GhostInspector.prototype.host = 'api.ghostinspector.com';

  GhostInspector.prototype.prefix = '/v1';

  function GhostInspector(userId, apiKey) {
    this.userId = userId;
    this.apiKey = apiKey;
  }

  GhostInspector.prototype.execute = function(path, callback) {
    var url;
    url = 'https://' + this.host + this.prefix + path + '?userId=' + this.userId + '&apiKey=' + this.apiKey;
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

  GhostInspector.prototype.executeSuite = function(suiteId, callback) {
    return this.execute('/suites/' + suiteId + '/execute/', function(err, data) {
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

  GhostInspector.prototype.executeTest = function(testId, callback) {
    return this.execute('/tests/' + testId + '/execute/', function(err, data) {
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

module.exports = function(userId, apiKey) {
  return new GhostInspector(userId, apiKey);
};
