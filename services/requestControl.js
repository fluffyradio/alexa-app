const log4js = require('log4js');
const constants = require('../constants');
const fluffyApi = require('../services/fluffyApi');

const logger = log4js.getLogger();

module.exports = {
  startRequest() {
   /*
    *  Using the function to search for and process requests
    */
    this.handler.state = constants.states.REQUEST;

    logger.debug(JSON.stringify(this.event.request.intent.slots));
    const searchString = this.event.request.intent.slots.SEARCHSTRING;

    if (!searchString && !searchString.value) {
      // No search string provided, prompt for request string
      logger.debug('Empty request search string');
      this.response.speak(this.t('REQUEST_SEARCH_EMPTY')).listen(this.t('REQUEST_SEARCH_EMPTY_SHORT'));
      this.emit(':responseReady');
    }

    // Start the search process...
    fluffyApi.searchSong(searchString.value).then((songs) => {
      logger.debug(songs);
      // Check for none, one, or many results
      if (songs.length === 0) {
        // No results, reprompt the user, ask if they want to try again
        this.response.speak(this.t('REQUEST_SEARCH_NO_RESULTS')).listen(this.t('REQUEST_SEARCH_NO_RESULTS'));
        this.emit(':responseReady');
      } else if (songs.length === 1) {
        // One result, make sure this is the song they wanted
        this.attributes.PENDING_REQUEST = songs[0].id;
        this.response.speak(`${this.t('REQUEST_SEARCH_RESULT_CONFIRM')} ${songs[0].title} ${this.t('SONG_JOINER')} ${songs[0].artist}?`)
                     .listen(`${this.t('REQUEST_SEARCH_RESULT_CONFIRM')} ${songs[0].title} ${this.t('SONG_JOINER')} ${songs[0].artist}?`);
        this.emit(':responseReady');
      } else {
        // Many results, prompt the user for which song they want
        let length = 3;
        if (songs.length < 3) {
          length = songs.length;
        }

        let output = `${this.t('REQUEST_SEARCH_RESULTS_MANY')} `;
        const requestOptions = [length];
        for (let i = 0; i < length; i += 1) {
          output += `${i + 1}. ${songs[i].title} ${this.t('SONG_JOINER')} ${songs[i].artist}. `;
          requestOptions[i] = songs[i].id;
        }
        this.attributes.REQUEST_RESULTS = requestOptions;
        this.emit(':ask', output);
      }
    }).catch((error) => {
      logger.error(error);
      this.response.speak(this.t('REQUEST_SEARCH_ERROR'));
      this.emit(':responseReady');
    });
  },
  singleYesRequest() {
    const songId = this.attributes.PENDING_REQUEST;
    if (songId === null) {
      // Should not have gotten here
    }

    fluffyApi.requestSong(songId).then((result) => {
      logger.debug(result);
      this.attributes.PENDING_REQUEST = null;
      this.emit(':tell', this.t('REQUEST_RESULT_SUCCESS'));
    }).catch((error) => {
      logger.error(error);
      this.emit(':tell', this.t('REQUEST_RESULT_ERROR'));
    });
  },
  singleNoRequest() {
    this.attributes.PENDING_REQUEST = null;
    this.emit(':tell', this.t('EXIT'));
  },
};
