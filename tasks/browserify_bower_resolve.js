/*
 * grunt-browserify-resolve
 * https://github.com/frankfoerster/grunt-browserify-resolve
 *
 * Copyright (c) 2015 Frank Förster
 * Licensed under the MIT license.
 */
'use strict';
var Runner = require('../lib/runner');
var path = require('path');
var async = require('async');

module.exports = Task;

function Task (grunt) {
  grunt.registerMultiTask('browserifyResolve', 'Grunt task for browserifyResolve.', function () {

    // set default options
    var options = this.options({
      banner: '',
      vendorOnly: this.data.vendorOnly || false,
      require: this.data.require || false
    });

    if (options.vendorOnly === true) {
      Task.runTask(grunt, options, {dest: this.data.dest}, this.async());
    } else {
      async.each(this.files, function (file, next) {
        Task.runTask(grunt, options, file, next);
      }, this.async());
    }
  });
}

Task.runTask = function (grunt, options, file, next) {
  var runner = new Runner({
    writer: grunt.file,
    logger: grunt
  });

  if (!options.vendorOnly) {
    var files = grunt.file.expand({filter: 'isFile'}, file.src).map(function (f) {
      return path.resolve(f);
    });
  }

  runner.run(files || [], file.dest, options, next);
};
