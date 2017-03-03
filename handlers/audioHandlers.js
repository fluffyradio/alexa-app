const alexa = require('alexa-sdk');
const constants = require('../constants');
const audioControl = require('../services/audioControl');
const apiControl = require('../services/apiControl.js');
const requestControl = require('../services/requestControl');

// Handles all STREAM commands
const audioHandlers = alexa.CreateStateHandler(constants.states.STREAM, {
  LaunchRequest() {
    this.handler.state = constants.states.STREAM;
    this.emit(':askWithCard', this.t('WELCOME'), this.t('WELCOME_SHORT'), this.t('WELCOME_TITLE'), this.t('WELCOME_CONTENT'), constants.fluffyLogo);
  },
  PlayStream() {
    audioControl.play.call(this);
  },
  CurrentSong() {
    apiControl.currentSong.call(this);
  },
  RequestSong() {
    requestControl.startRequest.call(this);
  },
  'AMAZON.ResumeIntent': function resume() {
    audioControl.play.call(this);
  },
  'AMAZON.PauseIntent': function pause() {
    audioControl.stop.call(this);
  },
  'AMAZON.StopIntent': function stop() {
    audioControl.stop.call(this);
  },
  'AMAZON.LoopOffIntent': function loopOff() {
    this.emit(':tell', this.t('STREAM_LOOP'));
  },
  'AMAZON.LoopOnIntent': function loopOn() {
    this.emit(':tell', this.t('STREAM_LOOP'));
  },
  'AMAZON.NextIntent': function next() {
    this.emit(':tell', this.t('STREAM_NEXT'));
  },
  'AMAZON.PreviousIntent': function previous() {
    this.emit(':tell', this.t('STREAM_PREVIOUS'));
  },
  'AMAZON.RepeatIntent': function repeat() {
    this.emit(':tell', this.t('STREAM_REPEAT'));
  },
  'AMAZON.ShuffleOffIntent': function shuffleOff() {
    this.emit(':tell', this.t('STREAM_SHUFFLE_OFF'));
  },
  'AMAZON.ShuffleOnIntent': function shuffleOn() {
    this.emit(':tell', this.t('STREAM_SHUFFLE_ON'));
  },
  'AMAZON.StartOverIntent': function startOver() {
    this.emit(':tell', this.t('STREAM_START_OVER'));
  },
  'AMAZON.CancelIntent': function cancel() {
    this.response.state = constants.states.START;
    this.emit(':tell', this.t('EXIT'));
  },
  'AMAZON.HelpIntent': function help() {
    this.emit(':ask', this.t('STREAM_HELP'), this.t('STREAM_HELP'));
  },
  PlaybackFailed() {
    this.emit(':tell', this.t('STREAM_FAILED'));
  },
  Unhandled() {
    // Manage errors here
    // TODO: Log errors to the logger
    this.emit(':tell', this.t('UNHANDLED'));
  },
});

module.exports = audioHandlers;
