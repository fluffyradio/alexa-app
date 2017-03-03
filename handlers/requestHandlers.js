'use strict';

const alexa = require('alexa-sdk');
const constants = require('../constants');
const requestControl = require('../services/requestControl');

// Handles all REQUEST commands
const requestHandlers = alexa.CreateStateHandler(constants.states.REQUEST, {
  LaunchRequest() {
    this.handler.state = constants.states.REQUEST;
    this.emit(':askWithCard', this.t('WELCOME'), this.t('WELCOME_SHORT'), this.t('WELCOME_TITLE'), this.t('WELCOME_CONTENT'), constants.fluffyLogo);
  },
  RequestSong() {
    requestControl.startRequest.call(this);
  },
  SelectSong() {
    requestControl.finishRequest.call(this);
  },
  NoSelection() {
    requestControl.singleNoRequest.call(this);
  },
  'AMAZON.YesIntent': function yes() {
    requestControl.singleYesRequest.call(this);
  },
  'AMAZON.NoIntent': function no() {
    requestControl.singleNoRequest.call(this);
  },
  'AMAZON.StopIntent': function stop() {
    this.response.state = constants.states.START;
    this.emit(':tell', this.t('EXIT'));
  },
  'AMAZON.CancelIntent': function cancel() {
    this.response.state = constants.states.START;
    this.emit(':tell', this.t('EXIT'));
  },
  Unhandled() {
    // Manage errors here
    // TODO: Log errors to the logger
    this.response.state = constants.states.START;
    this.emit(':tell', this.t('UNHANDLED'));
  },
});

module.exports = requestHandlers;
