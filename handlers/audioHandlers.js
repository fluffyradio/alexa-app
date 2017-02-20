const alexa = require('alexa-sdk');
const constants = require('../constants');
const audioControl = require('../services/audioControl');

const audioHandlers = alexa.CreateStateHandler(constants.states.STREAM, {
  LaunchRequest() {
    this.handler.state = constants.states.START;
    this.response.speak(this.t('WELCOME')).listen(this.t('WELCOME'));
    this.emit(':responseReady');
  },
  PlayStream() {
    audioControl.play.call(this);
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
  'AMAZON.HelpIntent': function help() {
    this.response.speak(this.t('STREAM_HELP')).listen(this.t('STREAM_HELP'));
    this.emit(':responseReady');
  },
  PlaybackFailed() {
    this.emit(':tell', this.t('STREAM_FAILED'));
  },
  Unhandled() {
    // Manage errors here
    // TODO: Log errors to the logger
  },
});

module.exports = audioHandlers;
