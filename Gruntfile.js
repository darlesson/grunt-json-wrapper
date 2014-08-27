/*
 * grunt-json-wrapper
 * ?
 *
 * Copyright (c) 2014 ?
 * Licensed under the ? license.
 */

'use strict';

module.exports = function (grunt) {
    // load all npm grunt tasks
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp']
        },

        // Configuration to be run (and then tested).
        json_wrapper: {
            default_options: {
                options: { },
                files: {
                    'tmp/default_options.js': ['test/fixtures/pt-BR.json', 'test/fixtures/en-US.json']
                }
            },
            custom_options: {
                options: {
                    wrapper: null,
                    wrapperFile: 'test/wrappers/emberApp.txt',
                    sort: true, // Default value
                    raw: false, // Default value
                    minify: false // Default value
                },
                files: {
                    'tmp/custom_options.js': ['test/fixtures/pt-BR.json', 'test/fixtures/en-US.json']
                }
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'json_wrapper', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};