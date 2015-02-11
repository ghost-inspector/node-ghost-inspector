https = require('https')


# Define GhostInspector class
class GhostInspector
  host:   'https://api.ghostinspector.com'
  prefix: '/v1'

  constructor: (@apiKey) ->

  execute: (path, params, callback) ->
    # Sort out params and callback
    if typeof params is 'function'
      callback = params
      params = {}
    else if not params or typeof params isnt 'object'
      params = {}
    # add auth to params
    params.apiKey = @apiKey
    # Build request URL
    url = @host + @prefix + path + '?'
    for key, val of params
      # handle array params
      if val instanceof Array
        for item in val
          url += key + '[]=' + encodeURIComponent(item) + '&'
      else
        url += key + '=' + encodeURIComponent(val) + '&'
    # Send request to API
    https.get url, (res) ->
      json = ''
      # Get response
      res.on 'data', (data) ->
        json += data
      # Process response
      res.on 'end', ->
        try
          result = JSON.parse(json)
        catch err
          result =
            code: 'ERROR'
            message: 'The Ghost Inspector service is not returning a valid response.'
        if result.code is 'ERROR' then return callback?(result.message)
        return callback?(null, result.data)
    .on 'error', (err) ->
      callback?(err.message)

  getSuites: (callback) ->
    @execute '/suites/', callback

  getSuite: (suiteId, callback) ->
    @execute '/suites/' + suiteId + '/', callback

  getSuiteTests: (suiteId, callback) ->
    @execute '/suites/' + suiteId + '/tests/', callback

  executeSuite: (suiteId, options, callback) ->
    # Sort out options and callback
    if typeof options is 'function'
      callback = options
      options = {}
    # Execute API call
    @execute '/suites/' + suiteId + '/execute/', options, (err, data) ->
      if err then return callback?(err)
      # Check test results, determine overall pass/fail
      passing = true
      for test in data
        passing = passing && test.passing
      # Call back with extra pass/fail parameter
      callback?(null, data, passing)

  getTests: (callback) ->
    @execute '/tests/', callback

  getTest: (testId, callback) ->
    @execute '/tests/' + testId + '/', callback

  getTestResults: (testId, callback) ->
    @execute '/tests/' + testId + '/results/', callback

  executeTest: (testId, options, callback) ->
    # Sort out options and callback
    if typeof options is 'function'
      callback = options
      options = {}
    # Execute API call
    @execute '/tests/' + testId + '/execute/', options, (err, data) ->
      if err then return callback?(err)
      # Call back with extra pass/fail parameter
      callback?(null, data, data.passing)

  getResult: (resultId, callback) ->
    @execute '/results/' + resultId + '/', callback

# Export new GhostInspector instance
module.exports = (param1, param2) ->
  return new GhostInspector(if param2 then param2 else param1)
