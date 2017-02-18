const alexa = require('alexa-sdk');
const constants = require('../constants');

const startHandlers = alexa.CreateStateHandler(constants.states.START, {
  LaunchRequest() {
    this.response.speak(this.t('WELCOME')).listen(this.t('WELCOME'));
    this.emit(':responseReady');
  },
  PlayStream() {
    this.handler.state = constants.states.STREAM;
    this.response.audioPlayerPlay('REPLACE_ALL', constants.fluffyStreamUrl, '0', null, 0);
    this.emit(':responseReady');
  },
  SessionEndedRequest() {
    this.emit(':tell', this.t('EXIT'));
  },
  'AMAZON.StopIntent': function () {
    this.emit('SessionEndedRequest');
  },
  'AMAZON.CancelIntent': function () {
    this.emit('SessionEndedRequest');
  },
  Unhandled() {
    this.response.speak(this.t('WELCOME'));
    this.emit(':responseReady');
  },
});

module.exports = startHandlers;
