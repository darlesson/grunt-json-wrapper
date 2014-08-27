/*
 * grunt-json-wrapper
 * https://github.com/darlesson/grunt-json-wrapper
 *
 * Copyright (c) 2014 Darlesson Oliveira
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    /**
     * A set of helpers for the task.
     *
     * @type {Object}
     */
    var helpers = {

        /**
         * Beautify and minify the JSON returning a string.
         *
         * @param {Object} json The JSON object to be beautified.
         * @param {Boolean} minify Whether the result should be minified.
         * @returns {String} The JSON stringfied result.
         */
        beautify: function (json, minify) {

            var results = '{',
                prefix = minify ? '' : '\r\n    ',
                spacing = minify ? '' : ' ',
                suffix = minify ? '' : '\n';

            for (var prop in json) {

                results += (prefix + '"' + prop + ('":' + spacing + '"') + json[prop].replace(/\"/g, '\\"') + '",');

            }

            results = ((results.substring(0, results.length - 1) || '{') + (suffix + '}'));

            return results;
        },

        /**
         * Sort the JSON file alphabetically.
         *
         * @param {Object} json The parsed JSON object.
         * @returns {Object} A new sorted JSON object.
         */
        sort: function (json) {

            var results = {},
                array = [];

            for (var prop in json) {

                array.push({
                    key: prop,
                    value: json[prop]
                });

            }

            array.sort(function (a, b) {

                if (a.key < b.key) {
                    return -1;
                } else if (a.key > b.key) {
                    return 1;
                }

                return 0;

            });

            array.forEach(function (item) {

                results[item.key] = item.value;

            });

            return results;

        },

        /**
         * Get the wrapper to be used. The wrapper from the file replaces the inline wrapper.
         *
         * @param {String} wrapper The inline wrapper.
         * @param {String} filePath The file wrapper path. It replaces the inline wrapper.
         * @returns {String} The wrapping content.
         */
        wrapper: function (wrapper, filePath) {

            var content = '';

            if (filePath && typeof filePath === 'string' && grunt.file.exists(filePath)) {
                content = grunt.file.read(filePath);
            } else {
                content = wrapper;
            }

            return typeof content === 'string' ? content : '';
        }
    };

    grunt.registerMultiTask('json_wrapper',
        'Wraps JSON files in custom wrappers generating a JS file for them. For every wrapper the following placeholders are accepted:' +
        '{filePath}, {fileName}, {fileExtension}, {filePrefix} and {content}.', function () {

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
                wrapper: '(function() { var json = {content}; })();',
                wrapperFile: null,
                sort: true,
                raw: false,
                minify: false
            }),
            wrapper = options.wrapper || '';

        this.files.forEach(function (file) {

            var src = file.src.filter(function (filePath) {

                    if (!grunt.file.exists(filePath)) {

                        grunt.log.warn('Source file "' + filePath + '" not found.');

                        return false;
                    }

                    return true;
                })
                .map(function (filePath) {

                    var wrapper = helpers.wrapper(options.wrapper, options.wrapperFile),
                        content = grunt.file.read(filePath),
                        lastIndexOf = filePath.lastIndexOf('/'),
                        fileName = filePath.substr(lastIndexOf > -1 ? lastIndexOf + 1 : 0);

                    lastIndexOf = fileName.lastIndexOf('.');

                    var fileExtension = fileName.substr(lastIndexOf > -1 ? lastIndexOf + 1 : fileName.length),
                        filePrefix = fileName.substr(0, fileName.length - (fileExtension.length ? fileExtension.length + 1 : 0));

                    if (content) {

                        // Beautify the JSON content
                        if (options.raw !== true) {
                            try {

                                var json = JSON.parse(content);

                                // Sort the JSON content
                                if (options.sort === true) {
                                    json = helpers.sort(json);
                                }

                                // Beautify the JSON content and minify if desired
                                content = helpers.beautify(json, options.minify);
                            } catch (errorEvent) {

                                grunt.log.warn('There is an issue with the JSON format for "' + filePath + '".');

                            }
                        }

                        // Do any text placeholder replacement
                        return wrapper
                            .replace(/({filePath})/gi, filePath)
                            .replace(/({fileName})/gi, fileName)
                            .replace(/({fileExtension})/gi, fileExtension)
                            .replace(/({filePrefix})/gi, filePrefix)
                            .replace(/({content})/gi, content);
                    }

                    return content;
                })
                .filter(function (content) {

                    // Remove blank content
                    return content ? true : false;

                })
                .join('\r');

            // Write the converted file to its destination
            grunt.file.write(file.dest, src);

            grunt.log.writeln('File "' + file.dest + '" created.');
        });
    });

};