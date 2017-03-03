const log4js = require('log4js');
const constants = require('../constants');
const utils = require('../utils');
const fluffyApi = require('../services/fluffyApi');

const logger = log4js.getLogger();

module.exports = {
  startRequest() {
   /*
    *  Using the function to search for and process requests
    */

    // Set state to request
    this.handler.state = constants.states.REQUEST;

    // Grab the intent slot and search value
    logger.debug(JSON.stringify(this.event.request.intent.slots));
    const searchString = this.event.request.intent.slots.SEARCHSTRING;

    // Make sure the slot and slot value aren't empty or null
    if (!searchString && !searchString.value) {
      // Ask the user what they wanted
      this.emit(':ask', this.t('REQUEST_SEARCH_EMPTY'), this.t('REQUEST_SEARCH_EMPTY'));
    }

    // Start the search process...
    fluffyApi.searchSong(searchString.value).then((songs) => {
      // Log response
      logger.debug(songs);

      /*
       * Result are handled in one of three ways:
       *   1. No results returned, have the user try again, or
       *   2. One result returned, confirm this is the one the user wants, or
       *   3. Many results returned, prompt the user to select one.
       */

      if (songs.length === 0) {
        // No results, tell the user to try again
        this.emit(':tell', this.t('REQUEST_SEARCH_NO_RESULTS'), this.t('REQUEST_SEARCH_NO_RESULTS'));
      } else if (songs.length === 1) {
        // One result, make sure this is the song they wanted
        this.attributes.PENDING_REQUEST = songs[0].id;
        this.emit(':ask',
                    `${this.t('REQUEST_SEARCH_RESULT_CONFIRM')} ${songs[0].title} ${this.t('SONG_JOINER')} ${songs[0].artist}?`,
                    `${this.t('REQUEST_SEARCH_RESULT_CONFIRM')} ${songs[0].title} ${this.t('SONG_JOINER')} ${songs[0].artist}?`);
      } else {
        // Many results, prompt the user for which song they want
        // For simplicity sake, we only give the user the first three results back
        // TODO: Add a mechanism to page or move through more than three results
        let length = 3;
        if (songs.length < 3) {
          length = songs.length;
        }

        // Prep the response phrase and session objects
        let output = `${this.t('REQUEST_SEARCH_RESULTS_MANY')} `;
        const requestOptions = [length];

        // Loop through the songs to build the response and session object
        for (let i = 0; i < length; i += 1) {
          // Add the song record to the response phrase...
          output += `${i + 1}. ${songs[i].title} ${this.t('SONG_JOINER')} ${songs[i].artist}. `;

          // Add the song to the session so we can grab it later...
          requestOptions[i] = {
            id: songs[i].id,
            title: songs[i].title,
            artist: songs[i].artist,
          };
        }

        // Save the session object and send the response
        this.attributes.REQUEST_RESULTS = requestOptions;
        this.emit(':ask', output, output);
      }
    }).catch((error) => {
      // HTTP Request errored out, log it and tell the user
      logger.error(error);

      // Set state to main menu so the user can start over
      this.handler.state = constants.states.START;

      // Send the response
      this.emit(':tell', this.t('REQUEST_SEARCH_ERROR'), this.t('REQUEST_SEARCH_ERROR'));
    });
  },
  finishRequest() {
   /*
    *  Takes a song selection and submits a request
    */

    // Grab the intent slot
    logger.debug(JSON.stringify(this.event.request.intent.slots));
    const songSelection = this.event.request.intent.slots.SONGSELECTION;

    // Ensure the selection was provided
    if (!songSelection && !songSelection.value) {
      this.emit(':ask', this.t('REQUEST_SELECT_EMPTY'), this.t('REQUEST_SELECT_EMPTY'));
    }

    // Ensure the selected value is less than 3
    // We only support three song options for now
    if (songSelection.value > 3) {
      this.emit(':ask', this.t('REQUEST_SELECT_TOO_HIGH'), this.t('REQUEST_SELECT_TOO_HIGH'));
    }

    // Get the index for the selected song
    const i = songSelection.value - 1;

    // Get the song the user selected from session
    const song = this.attributes.REQUEST_RESULTS[i];

    // If we get this far send the user back to the main menu if something breaks to try again
    this.handler.state = constants.states.START;

    // Ensure the song isn't empty or null
    if (!song) {
      this.emit(':tell', this.t('REQUEST_RESULT_ERROR'), this.t('REQUEST_RESULT_ERROR'));
    }

    // Start the request process
    fluffyApi.requestSong(song.id).then((result) => {
      // Log the response
      logger.debug(result);

      // Clear the session objects
      this.attributes.REQUEST_RESULTS = null;

      // Tell the user it's requested
      this.emit(':tellWithCard',
                  this.t('REQUEST_RESULT_SUCCESS'),
                  `${utils.replaceBrackets(song.artist)} - ${utils.replaceBrackets(song.title)}`,
                  `${utils.replaceBrackets(song.artist)} - ${utils.replaceBrackets(song.title)}`,
                  utils.getAlbumArt(song));
    }).catch((error) => {
      // Log the error
      logger.error(error);

      // Clear the session objects
      this.attributes.REQUEST_RESULTS = null;

      // Check if the back-end API throttled the request or errored out
      if (error.statusCode === 429) {
        // User has submitted too many requests - HTTP 429 Thottled
        this.emit(':tell', this.t('REQUEST_RESULT_THROTTLE'), this.t('REQUEST_RESULT_THROTTLE'));
      } else {
        // Something else went wrong
        this.emit(':tell', this.t('REQUEST_RESULT_ERROR'), this.t('REQUEST_RESULT_ERROR'));
      }
    });
  },
  singleYesRequest() {
    /*
    *  Takes a song selection and submits a request
    */

    // Send the user back to the main menu when complete
    this.handler.state = constants.states.START;

    // Grab the desired song
    const songId = this.attributes.PENDING_REQUEST;

    // Ensure the value isn't empty or null
    if (songId === null) {
      this.emit(':tell', this.t('REQUEST_RESULT_ERROR'), this.t('REQUEST_RESULT_ERROR'));
    }

    // Start the request process
    fluffyApi.requestSong(songId).then((result) => {
      // Log the response
      logger.debug(result);

      // Clear the session objects
      this.attributes.PENDING_REQUEST = null;

      // Tell the user we requested the song
      this.emit(':tell', this.t('REQUEST_RESULT_SUCCESS'), this.t('REQUEST_RESULT_SUCCESS'));
    }).catch((error) => {
      // Log the error
      logger.error(error);

      // Clear the session objects
      this.attributes.PENDING_REQUEST = null;

      // Check if the back-end API throttled the request or errored out
      if (error.statusCode === 429) {
        // User has submitted too many requests - HTTP 429 Thottled
        this.emit(':tell', this.t('REQUEST_RESULT_THROTTLE'), this.t('REQUEST_RESULT_THROTTLE'));
      } else {
        // Something else went wrong
        this.emit(':tell', this.t('REQUEST_RESULT_ERROR'), this.t('REQUEST_RESULT_ERROR'));
      }
    });
  },
  singleNoRequest() {
   /*
    *  Handles a user not confirming a song selection
    */

    // Send the user back to the main menu
    this.handler.state = constants.states.START;

    // Clear session bojects
    this.attributes.PENDING_REQUEST = null;

    // Exit the app
    this.emit(':tell', this.t('EXIT'));
  },
};
