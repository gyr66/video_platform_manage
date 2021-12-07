<template>
  <div class="root">
    <el-container>
      <el-header height="44px">
        <nav-bar>
          <span slot="center">kelikeli后台管理系统</span>
          <el-avatar
            :src="avatar"
            slot="right"
            :size="30"
          >
          </el-avatar>
          <span slot="left" style="font-size: 10px; color: skyblue">欢迎{{ $store.state.user.username }}</span>
        </nav-bar>
      </el-header>
      <el-container class="body">
        <el-aside width="auto">
          <el-menu
            :default-active="$route.path"
            :router="true"
            active-text-color="#ffd04b"
            background-color="#545c64"
            text-color="#fff"
          >
            <el-menu-item index="/main/uploadVideo">
              <span slot="title">视频上传</span>
            </el-menu-item>
            <el-menu-item index="/main/uploadFromUrl">
              <span slot="title">URL上传</span>
            </el-menu-item>
            <el-menu-item index="/main/tagManage" v-if="user_role === 'ROLE_admin'">
              <span slot="title">视频标签管理</span>
            </el-menu-item>
            <el-menu-item index="/main/editVideoInfo">
              <span slot="title">视频信息修改</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <div>
            <keep-alive include="CrawlerManagerView">
              <router-view v-if="isRouterAlive"/>
            </keep-alive>
          </div>
        </el-main>
      </el-container>
    </el-container>


  </div>
</template>

<script>
import NavBar from "@/common/NavBar";
import avatar from "@/assets/avatar.ico"

export default {
  name: "Main",
  provide() {
    return {
      reload: this.reload
    }
  },
  components: {
    NavBar
  },
  data() {
    return {
      avatar: avatar,
      isRouterAlive: true
    }
  },
  computed: {
    user_role() {
      return this.$store.state.user.role;
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => this.isRouterAlive = true);
    }
  },
}
</script>

<style scoped>
.el-header {
  background-color: darkcyan;
  color: darkorange;
}

.body {
  height: calc(100vh - 44px);
}

.el-menu {
  border: 0;
  text-align: center;
  height: 100%;
}

.el-avatar {
  margin-top: 7px;;
}
</style>