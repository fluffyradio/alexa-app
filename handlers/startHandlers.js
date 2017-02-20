const alexa = require('alexa-sdk');
const constants = require('../constants');
const audioControl = require('../services/audioControl');
const apiControl = require('../services/apiControl.js');

const startHandlers = alexa.CreateStateHandler(constants.states.START, {
  LaunchRequest() {
    this.response.speak(this.t('WELCOME')).listen(this.t('WELCOME'));
    this.emit(':responseReady');
  },
  PlayStream() {
    audioControl.play.call(this);
  },
  CurrentSong() {
    apiControl.currentSong.call(this);
  },
  SessionEndedRequest() {
    this.emit(':tell', this.t('EXIT'));
  },
  'AMAZON.StopIntent': function stop() {
    this.emit('SessionEndedRequest');
  },
  'AMAZON.CancelIntent': function cancel() {
    this.emit('SessionEndedRequest');
  },
  'AMAZON.HelpIntent': function help() {
    this.response.speak(this.t('STREAM_HELP')).listen(this.t('STREAM_HELP'));
    this.emit(':responseReady');
  },
  Unhandled() {
    this.response.speak(this.t('WELCOME'));
    this.emit(':responseReady');
  },
});

module.exports = startHandlers;
