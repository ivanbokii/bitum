var should = require('chai').should()
  , sinon = require('sinon')
  , moment = require('moment')
  , dataStore = require('../../dataStore')
  , feedService = require('../../daemon/feedService')
  , utils = require('../../utils');


describe('feedService', function () {
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
        pubdate: moment().toString(),
        bad: 'bad property'
      },
      {
        title: 'David Tennant', 
        description: 'tenth',
        link: 'test url',
        image: {url: 'test image url'},
        pubdate: moment().toString(),
        bad: 'bad property'
      },
      {
        title: 'Christopher Eccleston', 
        description: 'ninth',
        link: 'test url',
        image: {url: 'test image url'},
        pubdate: moment().add('h', -2).toString(),
        bad: 'bad property'
      }
    ]
  };

  describe('getNewEntriesFor', function () {
    var getStub = null;
    beforeEach(function () {
      getStub = sinon.stub(dataStore, 'get');
    });

    afterEach(function () {
      dataStore.get.restore();
    });

    it('should return new entries for a feed', function () {
      getStub.yields(null, [JSON.stringify({pubdate: moment().add('h', -1).toString()})]);

      feedService.getNewEntriesFor(testFeedData, function (err, result) {
        should.not.exist(err);

        result.should.have.length(2);
        result[0].should.equal(testFeedData.entries[0]);
        result[1].should.equal(testFeedData.entries[1]);
      })
    });

    it('should return all entries from a feed if there are not saved entries for the feed', function () {
      getStub.yields(null, []);

      feedService.getNewEntriesFor(testFeedData, function (err, result) {
        should.not.exist(err);
        result.should.have.length(3);
      });
    });
  });

  describe('save', function () {
    it('should call save method on data store and also call trime method on data store', function () {
      var mock = sinon.mock(dataStore);
      mock.expects('push').withArgs(utils.generateID(testFeedData.name)).once();
      mock.expects('trimExceptRecent').withArgs(utils.generateID(testFeedData.name), 10).once();

      feedService.save(testFeedData, testFeedData.entries, function (err, result) {
        mock.verify();
      });
    });
  });
});