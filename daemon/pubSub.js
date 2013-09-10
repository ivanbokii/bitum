var redis = require('redis');

// Notifies subscribers about new feeds and passes feeds
// with new entries to them
// INPUT: feeds with new entries
module.exports.notifyAbout = function (updatedFeeds, callback) {
    var message = JSON.stringify(updatedFeeds);
    
    redis.createClient().publish('news_update', message, callback);
}