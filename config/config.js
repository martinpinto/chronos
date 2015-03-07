/* global require, process */

var config = require('config');

exports.host = config.engine.dbConfig.host;
exports.port = config.engine.dbConfig.port;
exports.typeField = config.engine.dbConfig.typeField;
exports.pluginsDir = process.cwd() + '/' + config.plugins.directory;