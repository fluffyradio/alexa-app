const log4js = require('log4js');
const utils = require('../utils');
const fluffyApi = require('../services/fluffyApi');

const logger = log4js.getLogger();

module.exports = {
  currentSong() {
    /*
     * Tells the user what the currently playing song is
     */
    fluffyApi.currentSong().then((song) => {
      // Log the response
      logger.debug(song);

      // See if the response is empty or null
      if (!song) {
        // Tell the user we couldn't get the song
        this.emit(':tell', this.t('SONG_NULL'), this.t('SONG_NULL'));
      }

      // Tell the user what the current song is
      this.emit(':tellWithCard',
                  `${song.title} ${this.t('SONG_JOINER')} ${song.artist}`,
                  `${utils.replaceBrackets(song.artist)} - ${utils.replaceBrackets(song.title)}`,
                  `${utils.replaceBrackets(song.artist)} - ${utils.replaceBrackets(song.title)}`,
                  utils.getAlbumArt(song));
    }).catch((error) => {
      // Handle any errors
      logger.error(error);

      // Tell the user there was an error finding the song
      this.emit(':tell', this.t('SONG_NULL'), this.t('SONG_NULL'));
    });
  },
};
