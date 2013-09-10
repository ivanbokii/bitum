var feedsReader = require('./feedsReader')
  , utils = require('../utils')
  , pubSub = require('./pubSub')
  , feedService = require('./feedService')

  , _ = require('underscore')
  , async = require('async');

// Fills data store with 10 latest news for RSS feeds from config file
var daemon = {

  // Checks that feed has new entries and if it has, saves them to the
  // data store.
  // INPUT: feed object with name and entries props
  // CALLBACK OUTPUT: feed object with entries prop set to the new entries array
  _checkForNewAndSave: function (feed, callback) {
    feedService.getNewEntriesFor(feed, function (err, newEntries) {
      utils.ifErrLogAndExit(err);

      if (newEntries.length > 0) {
        feedService.save(feed, newEntries, function (err, result) {
          utils.ifErrLogAndExit(err);

          //set entries in feed to only new entries
          //it's bad to modify input data but feed already contains
          //everything we need to publish except new entries
          feed.entries = newEntries;
          callback(null, feed);
        });
      }
      else {
        callback();
      }
    });
  },

  // Entry point to the script
  run: function () {
    var self = this;

    feedsReader.read(function (err, feeds) {
      utils.ifErrLogAndExit(err);

      // Check each received feed
      async.map(feeds, self._checkForNewAndSave, function (err, feedsWithNewEntries) {
        utils.ifErrLogAndExit(err);
        
        // Save current date and time for information purpose
        feedService.saveUpdatedTimeStamp();

        // We need to use compact here because _checkForNewAndSave
        // method returns undefined if there are no new entries
        pubSub.notifyAbout(_.compact(feedsWithNewEntries), function () {
          process.exit();
        });

      });
    });
  }
}

module.exports = daemon