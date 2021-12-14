<template>
  <div class="root">
    <el-row>
      <h1 id="title">视频上传</h1>
    </el-row>
    <el-row>
      <span>是否开启分片加密:</span>&nbsp;
      <el-switch
        v-model="section"
        active-color="#13ce66"
        inactive-color="#ff4949">
      </el-switch>
    </el-row>
    <el-row>
      <span>是否开启文件重复检验:</span>&nbsp;
      <el-switch
        v-model="duplicate"
        active-color="#13ce66"
        inactive-color="#ff4949">
      </el-switch>
    </el-row>

    <el-row>
      <dashboard id="dashboard" :uppy="uppy"
                 :props="{
                   theme: 'light',
                   proudlyDisplayPoweredByUppy: false,
                   showProgressDetails: true,
                   width: 500,
                   height: 500,
                   metaFields: [{ id: 'fileName', name: 'fileName', placeholder: 'file name' }],
                 }"
      />
    </el-row>

  </div>
</template>

<script>
import Uppy from "@uppy/core";
import Tus from '@uppy/tus'

import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import {Dashboard} from "@uppy/vue";
import MD5Plugin from "@/views/UploadVideoView/MD5Plugin";

export default {
  name: "UploadVideoView",
  components: {Dashboard},
  data() {
    return {
      section: false,
      duplicate: true,
    }
  },
  watch: {
    section(val) {
      this.uppy.setMeta({section: val})
    },
    duplicate(val) {
      this.uppy.getPlugin('MD5Plugin').setOptions({
        work: val
      });
    }
  },
  computed: {
    uppy() {
      let username = this.$store.state.user.username;
      return new Uppy({
        id: 'videoUploader',
        restrictions: {
          allowedFileTypes: ['video/*']
        },
        meta: {
          username: username,
          section: false
        },
        logger: Uppy.debugLogger
      }).on('error', (error) => {
        console.error(error)
      }).use(Tus, {
        endpoint: `${process.env.VUE_APP_BASEURL}/upload`,
        withCredentials: true,
        retryDelays: [0, 1000, 3000, 5000],
        removeFingerprintOnSuccess: true
      }).use(MD5Plugin, {
        work: true
      });
    }
  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
  text-align: center;
}

#dashboard {
  width: 500px;
  margin: auto;
}
</style>