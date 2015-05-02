/*
 * grunt-browserify-resolve
 * https://github.com/frankfoerster/grunt-browserify-resolve
 *
 * Copyright (c) 2015 Frank Förster
 * Licensed under the MIT license.
 */
var _ = require('lodash');
var browserify = require('browserify');
var bowerResolve = require('bower-resolve');
var nodeResolve = require('resolve');

module.exports = BrowserifyResolveRunner;

function BrowserifyResolveRunner(options) {
  this.pkg = options.pkg;
  this.logger = options.logger;
  this.writer = options.writer;
}

BrowserifyResolveRunner.prototype = _.create(BrowserifyResolveRunner.prototype, {

  run: function (files, destination, options, next) {
    var self = this;
    var b = browserify({
      debug: true
    });

    if (options.vendorOnly === true) {
      _.each(getBowerPackageIds(options), function(id) {
        b.require(bowerResolve.fastReadSync(id), { expose: id });
      });
      _.each(getNPMPackageIds(options), function(id) {
        b.require(nodeResolve.sync(id), { expose: id });
      });
    } else {
      _.each(getBowerPackageIds(options), function(id) {
        b.external(id);
      });
      _.each(getNPMPackageIds(options), function(id) {
        b.external(id);
      });
      _.each(files, function(file) {
        b.add(file);
      });
    }
    if (options.require !== false) {
      _.each(options.require, function(path, alias) {
        b.require(path, { expose: alias });
      });
    }

    b.bundle(function(err, buf) {
      self.writer.write(destination, buf);
      next(err);
    });
  }
});

function getBowerPackageIds(options) {
  return _.keys(options.bower.dependencies) || [];

}

function getNPMPackageIds(options) {
  return _.keys(options.pkg.dependencies) || [];
}
