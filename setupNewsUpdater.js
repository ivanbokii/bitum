var redis = require('redis')
  , pubSub = redis.createClient()
  , worker = redis.createClient()
  , moment = require('moment')

  , utils = require('./utils');

module.exports = function () {
  pubSub.subscribe('news_update');

  pubSub.on('message', function (channel, updateMessage) {
    var parsedMessage = JSON.parse(updateMessage);

    var feedsInformation = {
      feeds: parsedMessage,
      time: utils.toUTC(Date.now())
    };

    // transformaton to client's time is performed
    // in a browser that is why we need to send all timestamps
    // in utc
    feedsInformation.feeds.forEach(function (feed) {
      feed.entries.forEach(function (entry) {
        entry.pubdate = utils.toUTC(entry.pubdate);
      });
    });

    global.sockets.forEach(function (socket) {
      socket.emit('message', feedsInformation);
    });
  });
}