// Import NPM Packages
const newrelic = require('newrelic');
const log4js = require('log4js');
const alexa = require('alexa-sdk');
const AWS = require('aws-sdk');

// Load shared modules
const constants = require('./constants');
const resourceStrings = require('./resources');

// Load alexa handlers
const newSessionHandlers = require('./handlers/newSessionHandlers');
const startHandlers = require('./handlers/startHandlers');
const audioHandlers = require('./handlers/audioHandlers');
const remoteControlHandlers = require('./handlers/remoteControlHandlers');
const requestHandlers = require('./handlers/requestHandlers');

// Main function
exports.handler = function main(event, context) {
  // Wire up a logger
  const logger = log4js.getLogger();
  logger.info('Preparing Skill');

  // Tell the AWS SDK which region to point to
  AWS.config.update({ region: 'us-east-1' });

  // Build the alexa skill handler
  const skill = alexa.handler(event, context);

  // Skill configuration setup
  skill.appId = constants.appId;
  skill.dynamoDBTableName = constants.dynamoDbTableName;
  skill.resources = resourceStrings;

  // Register all alexa handlers
  logger.info('Registering Skill Handlers');
  skill.registerHandlers(newSessionHandlers,
                          startHandlers,
                          audioHandlers,
                          remoteControlHandlers,
                          requestHandlers);

  // Run the alexa skill
  logger.info('Starting Skill');
  skill.execute();

  // New Relic work around to force metrics to be sent in a lambda function
  // eslint-disable-next-line no-underscore-dangle
  if (newrelic.agent._state === 'starting') {
    newrelic.agent.on('connected', () => {
      newrelic.shutdown({ collectPendingData: true });
    });
  } else {
    newrelic.shutdown({ collectPendingData: true });
  }
};
