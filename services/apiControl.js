const log4js = require('log4js');
const fluffyApi = require('../services/fluffyApi');

const logger = log4js.getLogger();

module.exports = {
  currentSong() {
    fluffyApi.currentSong().then((song) => {
      if (song === null) {
        this.emit(':tell', this.t('SONG_NULL'));
      }
      this.emit(':tell', `${song.title} ${this.t('SONG_JOINER')} ${song.artist}`);
    }).catch((error) => {
      logger.error(error);
      this.emit(':tell', this.t('SONG_NULL'));
    });
  },
};
