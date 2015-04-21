# grunt-json-wrapper

> Wraps JSON files in custom wrappers generating a JS file for them. For every wrapper the following placeholders are accepted: {filePath}, {fileName}, {fileExtension}, {filePrefix} and {content}.

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-json-wrapper --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-json-wrapper');
```

## The "json_wrapper" task

### Overview
In your project's Gruntfile, add a section named `json_wrapper` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
    json_wrapper: {
        options: {
            // Task-specific options go here
        },
        files: {
            // Files list
        }
    }
});
```

### Options

#### options.wrapper
Type: `String`
Default value: `'(function() { var json = {content}; })();'`

A string to be used as a wrapper. This string can and should contain placeholders to wrap and identify specifics about the JSON file.

#### options.wrapperFile
Type: `String`
Default value: `null`

A string with a file path containing the wrapping template. The content of this file replaces the value from `options.wrapper`. Keep it empty if you prefer inline wrapper.

#### options.sort
Type: `Boolean`
Default value: `true`

Whether to sort the JSON properties.

#### options.raw
Type: `Boolean`
Default value: `false`

Whether the JSON file should be wrapped as it is.

#### options.minify
Type: `Boolean`
Default value: `false`

Whether the JSON file should be minified by loosing spaces, tabs and new lines.

### Wrapping Template Placeholders

{filePath}, {fileName}, {fileExtension}, {filePrefix} and {content}.

### Wrapping Template Example

```js
(function (App) {
    'use strict';

    App.CultureModel.create({ culture: '{filePrefix}', strings: {content}});

})(App);
```

### Usage Examples

#### Default Options
The default options can be used as the example below. In this case, the 2 language files will have their content
wrapped separately but they will be together in the result file.

```js
grunt.initConfig({
    json_wrapper: {
        options: {},
        files: {
            'tmp/default_options.js': ['test/fixtures/pt-BR.json', 'test/fixtures/en-US.json']
        }
    }
});
```

#### Custom Options
In this example, custom options are used to do something else with whatever else. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result in this case would be `Testing: 1 2 3 !!!`

```js
grunt.initConfig({
    json_wrapper: {
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
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## License
Copyright (c) 2015 Darlesson Oliveira. Licensed under the MIT license.
