var should = require('chai').should()
  , sinon = require('sinon')
  , _ = require('underscore')
  , feedsReader = require('../../daemon/feedsReader')
  , config = require('../../config');

describe('feedsReader', function () {
  var testFeedData = {
    meta: {
      name: 'test name'
    },

    entries: [
      {
        title: 'Matt Smith', 
        description: 'eleventh',
        link: 'test url',
        image: {url: 'test image url'},
        pubdate: 'test pub property',
        bad: 'bad property'
      },
      {
        title: 'David Tennant', 
        description: 'tenth',
        link: 'test url',
        image: {url: 'test image url'},
        pubdate: 'test pub property',
        bad: 'bad property'
      }
    ]
  };

  var testRunnerBuilder = function (feed) {
    return function (callback) {
      callback(null, testFeedData);
    }
  }

  var badTestRunnerBuilder = function (feed) {
    return function (callback) {
      callback('Exterminate!');
    }
  }

  //calls callback with broken test feed data
  var deceitfulTestRunnerBuilder = function (feed) {
    return function (callback) {
      callback(null, {});
    }
  }

  beforeEach(function () {
    //substitute feeds property in config to have only one
    //set of feed information in results array
    config.feeds = ["test and unimportant feed"];
    sinon.stub(feedsReader, '_runnerBuilder', testRunnerBuilder);
  });

  afterEach(function () {
    feedsReader._runnerBuilder.restore();
  })

  it('should get feeds, parse and filter meta, title and description without any errors', 
    function () {
      feedsReader.read(function (err, result) {
        should.not.exist(err);

        result[0].name.should.equal(testFeedData.meta.name);

        _.each(result[0].entries, function (entry, index) {
          entry.title.should.equal(testFeedData.entries[index].title);
          entry.description.should.equal(testFeedData.entries[index].description);
          entry.pubdate.should.equal(testFeedData.entries[index].pubdate);
          entry.imageUrl.should.equal(testFeedData.entries[index].image.url);
          entry.url.should.equal(testFeedData.entries[index].link);
        });
      });
  });

  it('should filter not improtant properties in feeds', 
    function () {
      feedsReader.read(function (err, result) {
        should.not.exist(err);

        _.each(result[0].entries, function (entry, index) {
          should.not.exist(entry.bad);
        });
      });
  });

  it('should pass error to final callback in case of errors in feed fetching',
    function () {
      feedsReader._runnerBuilder.restore();
      sinon.stub(feedsReader, '_runnerBuilder', badTestRunnerBuilder);

      feedsReader.read(function (err, result) {
        err.should.equal('Exterminate!');

        should.not.exist(result);
      });
  });

  it('should pass error to final callback in case of errors in feeds filtering',
    function () {
      feedsReader.read(function (err, result) {
        feedsReader._runnerBuilder.restore();
        sinon.stub(feedsReader, '_runnerBuilder', deceitfulTestRunnerBuilder);

        feedsReader.read(function (err, result) {
          should.exist(err);
        })
      });
  });
});