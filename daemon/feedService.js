var utils = require('../utils')
  , dataStore = require('../dataStore')

  , _ = require('underscore');

// Collection of methods related to feed. Perform 'business operations'
// related to a feed
var feedService = {

  // Fetches entries from the data store. Compares them to the input
  // feed and filters newer entries from the input feed
  // INPUT: feed with entries prop
  // CALLBACK OUTPUT: entries that are newer  than the saved ones
  getNewEntriesFor: function (feed, callback) {
    dataStore.get(utils.generateID(feed.name), function (err, savedEntries) {
      utils.ifErrLogAndExit(err);

      if (savedEntries.length != 0) {
        var freshestEntry = JSON.parse(savedEntries[0]);
        var freshestSavedPubDate = new Date(freshestEntry.pubdate);

        var newEntries = _.filter(feed.entries, function (feedEntry) {
          var entryDate = new Date(feedEntry.pubdate);
          return entryDate > freshestSavedPubDate;
        });

        callback(null, newEntries);
      }
      else {
        callback(null, feed.entries);
      }
    });
  },

  // Saves new entries for a feed into the data store
  // INPUT: feed for which entries should be stored,
  //        new entries (from the new feed)
  save: function (feed, newEntries, callback) {
    var newEntriesJson = _.chain(newEntries)
      .sortBy(function (entry) { return new Date(entry.pubdate); })
      .map(JSON.stringify)
      .value();

    dataStore.push(utils.generateID(feed.name), newEntriesJson, callback);
    dataStore.trimExceptRecent(utils.generateID(feed.name), 10);
  },

  // Updates timestamp of the last update
  saveUpdatedTimeStamp: function (callback) {
    dataStore.saveUpdateTime(callback);
  }
}

module.exports = feedService;