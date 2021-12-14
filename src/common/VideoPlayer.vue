<template>
  <div>
    <video ref="videoPlayer" controls="controls" disablePictureInPicture></video>
  </div>
</template>

<script>
import Hls from 'hls.js'
import flvjs from 'flv.js'


export default {
  name: "VideoPlayer",
  props: {
    videoSource: {type: String}
  },
  data() {
    return {
      hls: null,
      player: null,
      flvPlayer: null
    }
  },
  mounted() {
    this.player = this.$refs.videoPlayer;
    if (this.videoSource.indexOf('m3u8') === -1) {
      if (this.videoSource.indexOf('flv') !== -1) {
        this.flvPlayer = flvjs.createPlayer({
          type: 'flv',
          url: this.videoSource,
        });
        this.flvPlayer.attachMediaElement(this.player);
        this.flvPlayer.load();
        this.flvPlayer.play();
      } else this.player.src = this.videoSource;
      return;
    }

    let config = {
      xhrSetup(xhr, url) {
        if (url.indexOf('ThisIsASecret') === -1) return;
        url = `${process.env.VUE_APP_BASEURL}/decrypt`;
        xhr.withCredentials = true;
        xhr.open('GET', url);
      }
    };
    this.hls = new Hls(config);
    this.hls.loadSource(this.videoSource);
    this.hls.attachMedia(this.player);
    this.hls.on(Hls.Events.KEY_LOADED, (event, data) => {
      let array = data.frag.levelkey.key;
      for (let i = 0; i < array.length; i++) {
        array[i] ^= 1;
      }
    });
  },
  beforeDestroy() {
    if (this.player) {
      this.player.src = '';
    }
    if (this.flvPlayer) {
      this.flvPlayer.unload();
      this.flvPlayer.detachMediaElement();
      this.flvPlayer.destroy();
    }
    if (this.hls)
      this.hls.destroy();
  }
}
</script>

<style scoped>
video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>