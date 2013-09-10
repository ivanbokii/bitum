var dataStore = require('../dataStore')
  , config = require('../config')
  , utils = require('../utils')

  , async = require('async')
  , moment = require('moment')
  , _ = require('underscore');

// Gets feed and entries from the datastore
// INPUT: feed entry from config file
// CALLBACK OUTPUT: feed object with name and entries props
var getFeedFromDataStore = function (feed, callback) {
  dataStore.get(utils.generateID(feed.name), function (err, entries) {
    if (err) {
      utils.renderError(res);
      return;
    }

    var feedInformation = {
      name: feed.name,
      entries: entries.map(JSON.parse).reverse()
    };

    // transformaton to client's time is performed
    // in a browser that is why we need to send all timestamps
    // in utc
    feedInformation.entries.forEach(function (entry) {
      entry.pubdate = utils.toUTC(entry.pubdate);
    });

    callback(err, feedInformation);
  });
}

// Renders page, passes feeds information into it and sends to clients
// INPUT: feeds object with entries
var sendFeedsPageToClient = function (res) {
  return function (err, feedsInformation) {
    dataStore.getUpdateTime(function (updateTimeError, updateTime) {
      if (err || updateTimeError) {
        utils.renderError(res);
        return;
      }

      var names = _.pluck(feedsInformation, 'name');
      var data = JSON.stringify({
        feeds: feedsInformation, 
        time: utils.toUTC(updateTime)
      });
      
      res.render('index', {names: names, data: data });
    });
  }
}

exports.index = function (req, res) {
  async.map(config.feeds, getFeedFromDataStore, sendFeedsPageToClient(res));
};