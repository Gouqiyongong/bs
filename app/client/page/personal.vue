<template>
  <div class="content">
    <x-button
      :disabled="disabled"
      :show-loading="disabled"
      type="warn"
      @click.native="failLogin">退出登录</x-button>
  </div>
</template>

<script>
import { XButton } from 'vux';
export default {
  components: {
    XButton
  },
  methods: {
    failLogin() {
      this.$axios.get('/api/failLogin')
        .then(data => {
          this.$vux.toast.show({
            text: data,
            type: 'text'
          });
          this.$router.push('/login')
        })
    }
  },
  data() {
    return {
      disabled: false
    }
  }
}
</script>

<style scoped>
  .content {
    padding-top: 2rem;
  }
</style>


