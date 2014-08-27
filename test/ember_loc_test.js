'use strict';

var grunt = require('grunt');

exports.json_wrapper = {
    default_options: function (test) {
        test.expect(1);

        var actual = grunt.file.read('tmp/default_options.js');
        var expected = grunt.file.read('test/expected/default_options.js');
        test.equal(actual, expected, 'The results don\'t match the expected default options result.');

        test.done();
    },
    custom_options: function (test) {
        test.expect(1);

        var actual = grunt.file.read('tmp/custom_options.js');
        var expected = grunt.file.read('test/expected/custom_options.js');
        test.equal(actual, expected, 'The results don\'t match the custom options result.');

        test.done();
    }
};