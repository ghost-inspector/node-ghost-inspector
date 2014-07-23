https = require 'https'

# Define GhostInspector clas
class GhostInspector
  host:   'api.ghostinspector.com'
  prefix: '/v1'

  constructor: (@userId, @apiKey) ->

  execute: (path, callback) ->
    # Build request URL
    url = 'https://' + @host + @prefix + path + '?userId=' + @userId + '&apiKey=' + @apiKey
    # Send request to API
    https.get url, (res) ->
      json = ''
      # Get response
      res.on 'data', (data) ->
        json += data
      # Process response
      res.on 'end', ->
        result = JSON.parse(json)
        if result.code is 'ERROR' then return callback(result.message)
        return callback(null, result.data)

  getSuites: (callback) ->
    @execute '/suites/', callback

  getSuite: (suiteId, callback) ->
    @execute '/suites/' + suiteId + '/', callback

  getSuiteTests: (suiteId, callback) ->
    @execute '/suites/' + suiteId + '/tests/', callback

  executeSuite: (suiteId, callback) ->
    @execute '/suites/' + suiteId + '/execute/', (err, data) ->
      if err then return callback(err)
      # Check test results, determine overall pass/fail
      passing = true
      for test in data
        passing = passing && test.passing
      # call back with extra pass/fail parameter
      callback(null, data, passing)

  getTests: (callback) ->
    @execute '/tests/', callback

  getTest: (testId, callback) ->
    @execute '/tests/' + testId + '/', callback

  getTestResults: (testId, callback) ->
    @execute '/tests/' + testId + '/results/', callback

  executeTest: (testId, callback) ->
    @execute '/tests/' + testId + '/execute/', (err, data) ->
      if err then return callback(err)
      # call back with extra pass/fail parameter
      callback(null, data, data.passing)

  getResult: (resultId, callback) ->
    @execute '/results/' + resultId + '/', callback

# export new GhostInspector instance
module.exports = (userId, apiKey) ->
  return new GhostInspector(userId, apiKey)