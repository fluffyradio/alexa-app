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
  searchSong(searchString) {
    const options = {
      method: 'GET',
      uri: `${constants.fluffyApiUrl}/songs`,
      qs: {
        q: searchString,
      },
      json: true,
    };

    return rp(options);
  },
  requestSong(songId) {
    const options = {
      method: 'POST',
      uri: `${constants.fluffyApiUrl}/requests/${songId}`,
      json: true,
    };

    return rp(options);
  },
};
