<template>
  <div class="fix">
    <router-view></router-view>
    <tabbar>
      <tabbar-item selected link="/main">
        <i slot="icon" class="iconfont">&#xe63d;</i>
        <span slot="label">主页</span>
      </tabbar-item>
      <tabbar-item link="/login">
        <i slot="icon" class="iconfont">&#xe63d;</i>
        <span slot="label">主页</span>
      </tabbar-item>
      <tabbar-item>
        <i slot="icon" class="iconfont">&#xe63d;</i>
        <span slot="label">主页</span>
      </tabbar-item>
      <tabbar-item>
        <i slot="icon" class="iconfont">&#xe63d;</i>
        <span slot="label">主页</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>
<script>
import { Tabbar, TabbarItem } from 'vux'
export default {
  components: {
    Tabbar,
    TabbarItem
  },
  created() {
    this.$axios.get('/api/getUserInfo')
      .then(data => {
        this.$root.userInfo = data;
      })
  }
}
</script>
<style scoped>

</style>


