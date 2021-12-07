<template>
  <div id="player"></div>
</template>

<script>

import Clappr from 'clappr'
import HlsjsPlayback from '@clappr/hlsjs-playback'
import PlaybackRatePlugin from 'clappr-playback-rate-plugin'
import FLVJSPlayback from "@/common/flvPlugin"

export default {
  name: "VideoPlayerTest",
  props: {
    videoSource: {type: String},
  },
  data() {
    return {
      player: null
    }
  },
  mounted() {
    this.player = new Clappr.Player({
      source: this.videoSource,
      parentId: "#player",
      width: '100%',
      height: '338.5px',
      autoPlay: false,
      plugins: [HlsjsPlayback, PlaybackRatePlugin, FLVJSPlayback],
      watermark: this.$store.state.user.waterMark,
      position: 'top-right',
      playbackRateConfig: {
        defaultValue: 1,
        options: [
          {value: 0.5, label: '0.5x'},
          {value: 1, label: '1.0x'},
          {value: 1.5, label: '1.5x'},
          {value: 2, label: '2.0x'}
        ]
      },
      hlsPlayback: {
        customListeners: [
          {
            eventName: 'hlsKeyLoaded', callback: (event, data) => {
              console.log(data)
              let array = data.frag.levelkey.key;
              for (let i = 0; i < array.length; i++) {
                array[i] ^= 1;
              }
            }
          }
        ],
      },
      playback: {
        hlsjsConfig: {
          xhrSetup(xhr, url) {
            if (url.indexOf('ThisIsASecret') === -1) return;
            url = 'http://localhost:8082/decrypt';
            xhr.withCredentials = true;
            xhr.open('GET', url);
          }
        }
      }
    });
  },
  beforeDestroy() {
    this.player.destroy();
  }
}
</script>

<style scoped>
</style>