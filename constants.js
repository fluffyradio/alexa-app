

module.exports = Object.freeze({
  // App-ID
  appId: 'amzn1.echo-sdk-ams.app.58c11aa1-e0e7-4389-b46d-95e9584aaac8',

  // Dynamo Table used for session tracking
  dynamoDbTableName: 'fluffy-radio-alexa-state',

  // Fluffy Radio API URL
  fluffyApiUrl: 'http://api.fluffyradio.com',

    // Fluffy Radio AAC Stream URL
  fluffyStreamUrl: 'https://stream.fluffyradio.com/stream/2/',

 /*
  * States:
  *  START          : Welcome state when the skill is launched.
  *  STREAM         : State when in audio playback mode.
  *  REQUEST        : State when user is searching for a song.
  *  REQUEST_SELECT : State when a search is complete.
  */
  states: {
    START: '_START',
    STREAM: '_STREAM',
    REQUEST: '_REQUEST',
    REQUEST_SELECT: '_REQUEST_SELECT',
  },
});
