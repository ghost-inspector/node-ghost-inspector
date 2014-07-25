module.exports = (grunt) ->

  # Grunt configuration
  grunt.initConfig
    bump:
      options:
        files: ['package.json']
        pushTo: 'origin'
    coffee:
      options:
        bare: true
      source:
        expand: true
        cwd: './'
        src: ['index.coffee', 'test/test.coffee']
        dest: './'
        ext: '.js'
    watch:
      backend:
        files: ['index.coffee', 'test/test.coffee']
        tasks: ['coffee']

  # Build project
  grunt.registerTask 'build', [
    'coffee'
  ]

  # Load grunt modules
  grunt.loadNpmTasks('grunt-bump')
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-watch')
  