const constants = require('./constants');

module.exports = {
  getAlbumArt(song) {
    // Build the album art object
    let albumArt = constants.fluffyLogo;
    if (!song.album_art_url === '') {
      albumArt = {
        smallImageUrl: song.album_art_url,
        largeImageUrl: song.album_art_url,
      };
    }
    return albumArt;
  },
  replaceBrackets(prop) {
    let result = prop.replace('[', '(');
    result = result.replace(']', ')');
    return result;
  },
};
