var redis = require('redis')
  , utils = require('./utils')
  , moment = require('moment');

module.exports.push = function (id, values, callback) {
  values.unshift(id);
  values.push(callback);

  var client = redis.createClient()
  client.lpush.apply(client, values);
}

module.exports.get = function (id, callback) {
  redis.createClient().lrange(id, 0, -1, callback);
}

module.exports.trimExceptRecent = function (id, numberOfEntries, callback) {
  redis.createClient().ltrim(id, 0, numberOfEntries - 1, callback);
}

module.exports.saveUpdateTime = function (callback) {
  redis.createClient().set(utils.constants.LAST_UPDATE, moment(), callback);
}

module.exports.getUpdateTime = function (callback) {
  redis.createClient().get(utils.constants.LAST_UPDATE, callback);
}