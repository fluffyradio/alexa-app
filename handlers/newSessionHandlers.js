const constants = require('../constants');

const newSessionHandlers = {
  LaunchRequest() {
    // All default requests to the skill
    this.handler.state = constants.states.START;
    this.emitWithState('LaunchRequest', true);
  },
  PlayStream() {
    // Play the stream
    this.handler.state = constants.states.STREAM;
    this.emitWithState('PlayStream', true);
  },
  CurrentSong() {
    // Get the current song
    this.handler.state = constants.states.START;
    this.emitWithState('CurrentSong', true);
  },
  RequestSong() {
    // Request a song
    this.handler.state = constants.states.REQUEST;
    this.emitWithState('RequestSong', true);
  },
  Unhandled() {
    // Not sure what to do
    this.emit(':tell', this.t('UNHANDLED'));
  },
};

module.exports = newSessionHandlers;
