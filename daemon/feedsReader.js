var config = require('../config')
  
  , FeedParser = require('feedparser')
  , request = require('request')
  , async = require('async')
  , _ = require('underscore');

// Reads and parses data from rss channel specified in config file
var feedsReader = {

  // Reads and parses data from a feed url
  // INPUT: feed with the url and name props
  // CALLBACK OUTPUT: parsed feed data
  _runnerBuilder: function (feed) {
    return function (callback) {
      var meta = null;
      var entries = [];

      request(feed.url)
      .pipe(new FeedParser())
      .on('meta', function (data) {
        meta = data;
        meta.name = feed.name;
      })
      .on('error', function (err) {
        callback(err);
      })
      .on('readable', function (data) {
        var stream = this, item;
        while (item = stream.read()) {
          entries.push(item);
        }
      })
      .on('end', function () {
        callback(null, {meta: meta, entries: entries});
      });
    }
  },

  // Filters main feed's entry information
  // OUTPUT: filtered entry
  _filterEntries: function (entries) {
    return _.map(entries, function (entry) {
      return {
        title: entry.title,
        description: entry.description,
        pubdate: entry.pubdate,
        imageUrl: entry.image.url,
        url: entry.link
      };
    })
  },

  // Filters main feed information from other info.
  // INPUT: parsed feeds
  // OUTPUT: filtered feed information
  _filterFeeds: function (feeds) {
    var self = this;
    return _.map(feeds, function (feed) {
      return {
        name: feed.meta.name
        , entries: self._filterEntries(feed.entries)
      };
    });
  },

  // Groups feeds
  // INPUT: parsed feeds
  _processResult: function (finalCallback) {
    var self = this;
    return function (err, feeds) {
      if (err) {
        finalCallback(err);
        return;
      }

      try {
        var filteredInformation = self._filterFeeds(feeds);

        finalCallback(null, filteredInformation);
      }
      catch (error) {
        finalCallback(error);
      }
    }
  },

  // Entry point.
  // CALLBACK OUTPUT: feed object with name and entries props
  read: function (callback) {
    var runners = _.map(config.feeds, this._runnerBuilder);
    async.parallel(runners, this._processResult(callback));
  }
}

module.exports = feedsReader;