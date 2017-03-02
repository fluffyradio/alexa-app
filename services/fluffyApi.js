const rp = require('request-promise');
const constants = require('../constants');

module.exports = {
  currentSong() {
    /*
     * Returns a promise representing the currently playing song
     */
    const options = {
      method: 'GET',
      uri: `${constants.fluffyApiUrl}/songs/current`,
      json: true,
    };

    return rp(options);
  },
  searchSong(searchString) {
    /*
     * Returns a promise representing the a song search
     */
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
    /*
     * Returns a promise representing a song request
     */
    const options = {
      method: 'POST',
      uri: `${constants.fluffyApiUrl}/requests/${songId}`,
      json: true,
    };

    return rp(options);
  },
};
