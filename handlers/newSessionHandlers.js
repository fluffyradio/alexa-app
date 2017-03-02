const constants = require('../constants');

const newSessionHandlers = {
  LaunchRequest() {
    this.handler.state = constants.states.START;
    this.emitWithState('LaunchRequest', true);
  },
  PlayStream() {
    this.handler.state = constants.states.STREAM;
    this.emitWithState('PlayStream', true);
  },
  CurrentSong() {
    this.handler.state = constants.states.START;
    this.emitWithState('CurrentSong', true);
  },
  RequestSong() {
    this.handler.state = constants.states.REQUEST;
    this.emitWithState('RequestSong', true);
  },
  Unhandled() {
    this.emit(':ask', 'Unhandled', 'Unhandled');
  },
};

module.exports = newSessionHandlers;
