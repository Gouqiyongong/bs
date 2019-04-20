<template>
  <div class="fix">
    <router-view></router-view>
    <tabbar>
      <tabbar-item :selected="selected === '/main'" link="/main">
        <i slot="icon" class="iconfont">&#xe63d;</i>
        <span slot="label">主页</span>
      </tabbar-item>
      <tabbar-item :selected="selected === '/main/order'" link="/main/order">
        <i slot="icon" class="iconfont">&#xe63d;</i>
        <span slot="label">订单</span>
      </tabbar-item>
      <tabbar-item v-if="power === '0' || power === '1'" :selected="selected === '/main/manage'" link="/main/manage">
        <i slot="icon" class="iconfont">&#xe63d;</i>
        <span slot="label">管理</span>
      </tabbar-item>
      <tabbar-item :selected="selected === '/main/personal'" link="/main/personal">
        <i slot="icon" class="iconfont">&#xe63d;</i>
        <span slot="label">个人</span>
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
        this.power = data.power;
      })
      .catch(() => {
        this.$vux.toast.show({
          text: '登录状态失效',
          type: 'text'
        });
        this.$router.push('/login')
      });
    this.selected = this.$route.path;
  },
  data() {
    return {
      selected: '/main',
      power: 3
    }
  }
}
</script>
<style scoped>
  .weui-tabbar {
    position: fixed;
  }
</style>


