const alexa = require('alexa-sdk');
const constants = require('../constants');
const requestControl = require('../services/requestControl');

// Handles all REQUEST commands
const requestHandlers = alexa.CreateStateHandler(constants.states.REQUEST, {
  LaunchRequest() {
    this.handler.state = constants.states.REQUEST;
    this.response.speak('In Request Mode').listen('What now?');
    this.emit(':responseReady');
  },
  RequestSong() {
    requestControl.startRequest.call(this);
  },
  SelectSong() {
    requestControl.finishRequest.call(this);
  },
  'AMAZON.YesIntent': function yes() {
    requestControl.singleYesRequest.call(this);
  },
  'AMAZON.NoIntent': function no() {
    requestControl.singleNoRequest.call(this);
  },
  SessionEndedRequest() {
    this.response.speak(this.t('EXIT'));
    this.handler.state = constants.states.START;
    this.emit(':responseReady');
  },
  'AMAZON.StopIntent': function stop() {
    this.emit('SessionEndedRequest');
  },
  'AMAZON.CancelIntent': function cancel() {
    this.emit('SessionEndedRequest');
  },
});

module.exports = requestHandlers;
