const alexa = require('alexa-sdk');
const constants = require('../constants');

const audioHandlers = alexa.CreateStateHandler(constants.states.STREAM, {
  PlayStream() {
    this.handler.state = constants.states.STREAM;
    this.response.audioPlayerPlay('REPLACE_ALL', constants.fluffyStreamUrl, '0', null, 0);
    this.emit(':responseReady');
  },
  'AMAZON.ResumeIntent': function () {
    this.emit('PlayRadio');
  },
  'AMAZON.PauseIntent': function () {
    this.response.audioPlayerStop();
    this.emit(':responseReady');
  },
  PlaybackFailed() {
    this.emit(':tell', this.t('STREAM_FAILED'));
  },
  Unhandled() {
    this.emit(':tell', this.t('ERROR'));
  },
});

module.exports = audioHandlers;
