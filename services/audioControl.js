const constants = require('../constants');

const audioControl = function controller() {
  return {
    play() {
     /*
      *  Using the function to begin playing audio when:
      *      Play Audio intent invoked.
      *      Resuming audio when stopped/paused.
      *      Next/Previous commands issued.
      */
      this.handler.state = constants.states.STREAM;
      this.response.audioPlayerPlay('REPLACE_ALL', constants.fluffyStreamUrl, '0', null, 0);
      this.emit(':responseReady');
    },
    stop() {
     /*
      *  Issuing AudioPlayer.Stop directive to stop the audio.
      *  Attributes already stored when AudioPlayer.Stopped request received.
      */
      this.response.audioPlayerStop();
      this.emit(':responseReady');
    },
  };
};

module.exports = audioControl;
