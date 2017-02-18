'use strict';

// Module Imports
var log4js = require('log4js');
var alexa = require('alexa-sdk');

var constants = require('./constants');
var resourceStrings = require('./resources');

var startHandlers = require('./startHandlers');

// Main Export
exports.handler = function(event, context, callback) {
    var logger = log4js.getLogger();

    logger.info('Preparing Skill');
    var skill = alexa.handler(event, context);

    skill.appId = constants.appId;
    //skill.dynamoDBTableName = constants.dynamoDbTableName;
    skill.resources = resourceStrings;

    logger.info('Registering Skill Handlers');
    skill.registerHandlers(startHandlers);

    // Get Current Song
    // Request a Song
    // Stream Fluffy

    logger.info('Starting Skill');
    skill.execute();
};