var moment = require('moment');

var utils = {
  constants: {
    ENTRIES_KEY: 'entries',
    LAST_UPDATE: 'lastUpdate'
  },

  ifErrLogAndExit: function (err) {
    if (err) {
      //todo ivanbokii log the error to the log file
      console.log(err);

      process.exit();
    }
  },

  generateID: function (feedName) {
    return this.constants.ENTRIES_KEY + ':' + feedName;
  },

  toUTC: function (date) {
    return moment(date).utc();
  },

  renderError: function (res) {
    res.send('Error. The doctor does not know his name!');
  }
}

module.exports = utils;