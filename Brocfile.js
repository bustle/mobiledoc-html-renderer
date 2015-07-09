/* jshint node:true */
'use strict';

var multiBuilder = require('broccoli-multi-builder');
var mergeTrees = require('broccoli-merge-trees');
var testBuilder = require('broccoli-test-builder');

var options = {
  packageName: 'mobiledoc-html-renderer'
};

module.exports = mergeTrees([
  multiBuilder.build('amd', options),
  multiBuilder.build('global', options),
  multiBuilder.build('commonjs', options),
  testBuilder.build()
]);
