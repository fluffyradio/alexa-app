// Module Imports
const newrelic = require('newrelic');
const log4js = require('log4js');
const alexa = require('alexa-sdk');
const AWS = require('aws-sdk');

const constants = require('./constants');
const resourceStrings = require('./resources');

const startHandlers = require('./handlers/startHandlers');
const audioHandlers = require('./handlers/audioHandlers');
const remoteControlHandlers = require('./handlers/remoteControlHandlers');
const requestHandlers = require('./handlers/requestHandlers');

// Main Export
exports.handler = function main(event, context) {
  const logger = log4js.getLogger();

  logger.info('Preparing Skill');
  AWS.config.update({ region: 'us-east-1' });
  const skill = alexa.handler(event, context);

  skill.appId = constants.appId;
  skill.dynamoDBTableName = constants.dynamoDbTableName;
  skill.resources = resourceStrings;

  logger.info('Registering Skill Handlers');
  skill.registerHandlers(startHandlers, audioHandlers, remoteControlHandlers, requestHandlers);

  logger.info('Starting Skill');
  skill.execute();

  // eslint-disable-next-line no-underscore-dangle
  if (newrelic.agent._state === 'starting') {
    newrelic.agent.on('connected', () => {
      newrelic.shutdown({ collectPendingData: true });
    });
  } else {
    newrelic.shutdown({ collectPendingData: true });
  }
};
