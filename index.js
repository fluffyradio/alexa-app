// Module Imports
const log4js = require('log4js');
const alexa = require('alexa-sdk');
const AWS = require('aws-sdk');

const constants = require('./constants');
const resourceStrings = require('./resources');

const startHandlers = require('./handlers/startHandlers');
const audioHandlers = require('./handlers/audioHandlers');

// Main Export
exports.handler = function (event, context) {
  const logger = log4js.getLogger();

  logger.info('Preparing Skill');
  AWS.config.update({ region: 'us-east-1' });
  const skill = alexa.handler(event, context);

  skill.appId = constants.appId;
  skill.dynamoDBTableName = constants.dynamoDbTableName;
  skill.resources = resourceStrings;

  logger.info('Registering Skill Handlers');
  skill.registerHandlers(startHandlers, audioHandlers);

    // Get Current Song
    // Request a Song
    // Stream Fluffy

  logger.info('Starting Skill');
  skill.execute();
};
