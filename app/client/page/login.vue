<template>
  <div class="fix content">
    <flexbox
      orient="vertical"
      :gutter="20"
      justify="center">
      <flexbox-item>
        <x-input
          @on-click-clear-icon="clear('username')"
          v-model="username"
          type="text"
          placeholder="用户名"
          required></x-input>
        <x-input
          @on-click-clear-icon="clear('password')"
          v-model="password"
          type="password"
          placeholder="密码"
          required></x-input>
      </flexbox-item>
      <flexbox-item>
        <x-button
          @click.native="login()"
          type="primary"
          :disabled="isAble"
          text="登录"
          :show-loading="isAble"></x-button>
      </flexbox-item>
    </Flexbox>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem, XButton, XInput } from 'vux';
export default {
  components: {
    Flexbox,
    FlexboxItem,
    XInput,
    XButton
  },
  methods: {
    login() {
      const { username, password } = this;
      if(username !== '' && password !== "") {
        //this.isAble = true;
        this.$axios.post('/api/login', {
          username,
          password: decodeURI(password)
        })
        .then(() => {
          this.$vux.toast.show({
            text: '登陆成功',
            type: 'text'
          })
          this.$router.push('/main')
        })
        .catch(err => {
          this.$vux.toast.show({
            text: err,
            type: 'warn'
          })
        })
      }
    },
    clear(type) {
      console.log(type)
      this[type] = '';
    }
  },
  
  data() {
    return {
      username: '',
      password: '',
      isAble: false
    }
  }
}
</script>

<style scoped>
  .content {
    padding-top: 50%;
    background-color: #f8f8f8;
  }

  /* .vux-flexbox {
    margin-top: 50%;
  } */

  .vux-flexbox-item {
    background-color: #fff;
  }
</style>

