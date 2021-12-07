<template>
  <div id="app">
    <router-view v-wechat-title="$route.meta.title"/>
  </div>
</template>

<script>

export default {
  name: 'App',
}
</script>

<style>
html, body {
  margin: 0;
}

#app {
  height: 100vh;
}
</style>
