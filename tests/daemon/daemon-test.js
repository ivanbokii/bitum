var should = require('chai').should()
  , sinon = require('sinon')
  , daemon = require('../../daemon/daemon')
  , feedService = require('../../daemon/feedService')
  , feedsReader = require('../../daemon/feedsReader')
  , pubSub = require('../../daemon/pubSub');

describe('daemon', function () {
  var testFeedData = {};

  var feedServiceMock = null;

  beforeEach(function () {
    feedServiceMock = sinon.mock(feedService);
  });

  afterEach(function () {
    feedServiceMock.verify();
  });

  describe('_checkForNewAndSave', function () {
    it('should call feed service to get new entries for a feed', function (done) {
      feedServiceMock.expects('getNewEntriesFor')
        .once()
        .withArgs(testFeedData)
        .yields(null, []);

      daemon._checkForNewAndSave(testFeedData, done);
    });

    it('should call feed service to save new entries if any', function (done) {
      var newEntriesStub = [sinon.stub()];

      feedServiceMock.expects('getNewEntriesFor').yields(null, newEntriesStub);
      feedServiceMock.expects('save')
        .once()
        .withArgs(testFeedData, newEntriesStub)
        .yields(null);

      daemon._checkForNewAndSave(testFeedData, done);
    });
  });
});