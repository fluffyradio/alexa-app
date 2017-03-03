'use strict';

const alexa = require('alexa-sdk');
const constants = require('../constants');
const audioControl = require('../services/audioControl');
const apiControl = require('../services/apiControl.js');
const requestControl = require('../services/requestControl');

// Handles all START commands
const startHandlers = alexa.CreateStateHandler(constants.states.START, {
  LaunchRequest() {
    this.attributes.PENDING_REQUEST = null;
    this.attributes.REQUEST_RESULTS = null;
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
  'AMAZON.StopIntent': function stop() {
    this.response.state = constants.states.START;
    this.emit(':tell', this.t('EXIT'));
  },
  'AMAZON.CancelIntent': function cancel() {
    this.response.state = constants.states.START;
    this.emit(':tell', this.t('EXIT'));
  },
  'AMAZON.HelpIntent': function help() {
    this.emit(':ask', this.t('START_HELP'), this.t('START_HELP'));
  },
  Unhandled() {
    this.emit(':tell', this.t('UNHANDLED'));
  },
});

module.exports = startHandlers;
