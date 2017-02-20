const rp = require('request-promise');
const constants = require('../constants');

module.exports = {
  currentSong() {
    const options = {
      method: 'GET',
      uri: `${constants.fluffyApiUrl}/songs/current`,
      json: true,
    };

    return rp(options);
  },
};
