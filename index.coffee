https = require('https')
fs = require('fs')


# Define GhostInspector class
class GhostInspector
  host:   'https://api.ghostinspector.com'
  prefix: '/v1'

  constructor: (@apiKey) ->

  buildRequestUrl: (path, params = {}) ->
    # Build request URL
    url = @host + @prefix + path + '?'
    # Add auth and other params
    params.apiKey = @apiKey
    for key, val of params
      # handle array params
      if val instanceof Array
        for item in val
          url += key + '[]=' + encodeURIComponent(item) + '&'
      else
        url += key + '=' + encodeURIComponent(val) + '&'
    return url

  request: (path, params, callback) ->
    # Sort out params and callback
    if typeof params is 'function'
      callback = params
      params = {}
    else if not params or typeof params isnt 'object'
      params = {}
    # Send request to API
    url = @buildRequestUrl(path, params)
    https.get url, (res) ->
      json = ''
      # Set long timeout (30 mins)
      res.setTimeout(1800000)
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
      callback?(err)

  download: (path, dest, callback) ->
    file = fs.createWriteStream(dest)
    # Send request to API
    url = @buildRequestUrl(path)
    https.get url, (res) ->
      # Save response into file
      res.pipe(file)
      file.on 'finish', ->
        file.close(callback)
    .on 'error', (err) ->
      callback?(err)

  getSuites: (callback) ->
    @request '/suites/', callback

  getSuite: (suiteId, callback) ->
    @request '/suites/' + suiteId + '/', callback

  getSuiteTests: (suiteId, callback) ->
    @request '/suites/' + suiteId + '/tests/', callback

  executeSuite: (suiteId, options, callback) ->
    # Sort out options and callback
    if typeof options is 'function'
      callback = options
      options = {}
    # Execute API call
    @request '/suites/' + suiteId + '/execute/', options, (err, data) ->
      if err then return callback?(err)
      # Check test results, determine overall pass/fail
      if data instanceof Array
        passing = true
        for test in data
          passing = passing && test.passing
      else
        passing = null
      # Call back with extra pass/fail parameter
      callback?(null, data, passing)

  downloadSuiteSeleniumHtml: (suiteId, dest, callback) ->
    @download '/suites/' + suiteId + '/export/selenium-html/', dest, callback

  getTests: (callback) ->
    @request '/tests/', callback

  getTest: (testId, callback) ->
    @request '/tests/' + testId + '/', callback

  getTestResults: (testId, options, callback) ->
    # Sort out options and callback
    if typeof options is 'function'
      callback = options
      options = {}
    # Execute API call
    @request '/tests/' + testId + '/results/', options, callback

  executeTest: (testId, options, callback) ->
    # Sort out options and callback
    if typeof options is 'function'
      callback = options
      options = {}
    # Execute API call
    @request '/tests/' + testId + '/execute/', options, (err, data) ->
      if err then return callback?(err)
      # Call back with extra pass/fail parameter
      passing = if data.passing is undefined then null else data.passing
      callback?(null, data, passing)

  downloadTestSeleniumHtml: (testId, dest, callback) ->
    @download '/tests/' + testId + '/export/selenium-html/', dest, callback

  getResult: (resultId, callback) ->
    @request '/results/' + resultId + '/', callback


# Export new GhostInspector instance
module.exports = (param1, param2) ->
  return new GhostInspector(if param2 then param2 else param1)
