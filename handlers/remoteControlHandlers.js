const alexa = require('alexa-sdk');
const constants = require('../constants');
const audioControl = require('../services/audioControl');

const remoteControllerHandlers = alexa.CreateStateHandler(constants.states.STREAM, {
// All Requests are received using a Remote Control.
  PlayCommandIssued() {
    audioControl.play.call(this);
  },
  PauseCommandIssued() {
    audioControl.stop.call(this);
  },
  NextCommandIssued() {
    return this.context.succeed(true);
  },
  PreviousCommandIssued() {
    return this.context.succeed(true);
  },
});

module.exports = remoteControllerHandlers;
