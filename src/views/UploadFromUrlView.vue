<template>
<div class="root">
  <el-row>
    <span>请输入URL:</span>
    <el-input v-model="url" style="width: 50%; margin-left: 50px"/>
    <el-button type="primary" style="margin-left: 30px" @click="handleUploadClicked" v-if="!running">上传</el-button>
  </el-row>
  <el-row>
    <span style="color: lightseagreen">{{ info }}</span>
  </el-row>
</div>
</template>

<script>
export default {
  name: "UploadFromUrlView",
  data() {
    return {
      url: '',
      info: '',
      ws: null,
      running: false
    }
  },
  created() {
    this.ws = new WebSocket("ws://localhost:8082/websocket");
    this.ws.withCredentials = true;
    this.ws.addEventListener('open', this.handleWsOpen.bind(this), false);
    this.ws.addEventListener('close', this.handleWsClose.bind(this), false);
    this.ws.addEventListener('error', this.handleWsError.bind(this), false);
    this.ws.addEventListener('message', this.handleWsMessage.bind(this), false);
  },
  methods: {
    handleWsOpen(e) {
      console.log(e)
    },

    handleWsMessage(e) {
      this.info = e.data;
      if (this.info === 'done') {
        this.running = false;
        this.ws.close();
      }
    },

    handleWsError(e) {
      console.log(e)
    },

    handleWsClose(e) {
      console.log(e)
    },

    handleUploadClicked() {
      this.ws.send(this.url);
      this.running = true;
    }

  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
  text-align: center;
}
</style>