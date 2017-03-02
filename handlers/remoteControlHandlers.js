const alexa = require('alexa-sdk');
const constants = require('../constants');
const audioControl = require('../services/audioControl');

// Handles all STREAM requests originating from a remote control
const remoteControllerHandlers = alexa.CreateStateHandler(constants.states.STREAM, {
  PlayCommandIssued() {
    // Clicked the play button
    audioControl.play.call(this);
  },
  PauseCommandIssued() {
    // Clicked the pause button
    audioControl.stop.call(this);
  },
  NextCommandIssued() {
    // Clicked the next button
    // We stream music so we just return true without doing anything
    return this.context.succeed(true);
  },
  PreviousCommandIssued() {
    // Clicked the previous button
    // We stream music so we just return true without doing anything
    return this.context.succeed(true);
  },
});

module.exports = remoteControllerHandlers;
