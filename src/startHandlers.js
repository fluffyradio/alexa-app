'use strict';

var alexa = require('alexa-sdk');
var constants = require('./constants');

var startHandlers = {
    'LaunchRequest': function() {
        this.response.speak(this.t('WELCOME')).listen(this.t('WELCOME'));
        this.emit(':responseReady');
    }
}

module.exports = startHandlers;