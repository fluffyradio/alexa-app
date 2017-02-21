const alexa = require('alexa-sdk');
const constants = require('../constants');

const requestHandlers = alexa.CreateStateHandler(constants.states.REQUEST, {
  LaunchRequest() {
    this.handler.state = constants.states.REQUEST;
    this.emit(':responseReady');
  },
});

module.exports = requestHandlers;
