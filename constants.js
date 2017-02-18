

module.exports = Object.freeze({
    // App-ID
  appId: 'amzn1.echo-sdk-ams.app.58c11aa1-e0e7-4389-b46d-95e9584aaac8',

  dynamoDbTableName: 'fluffy-radio-alexa-state',

    // Fluffy Radio Stream URL
  fluffyStreamUrl: 'https://stream.fluffyradio.com/stream/2/',

    /*
     *  States:
     *  START_MODE : Welcome state when the skill is launched.
     */
  states: {
    START: '',
    STREAM: '_STREAM',
  },
});
