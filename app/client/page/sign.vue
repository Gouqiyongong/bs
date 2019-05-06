<template>
  <div class="content">
    <x-button
      :disabled="disabled"
      :show-loading="disabled"
      @click.native="sign">签到</x-button>
      <alert
        v-model="show"
        @on-hide="onhide"
        title="签到信息">
        <div class="alert">
          <p>签到地点: {{place}}</p>
          <p>签到用户: {{username}}</p>
          <p>签到时间: {{time}}</p>
        </div>
        </alert>
  </div>
</template>
<script>
import { XButton, Alert, dateFormat } from 'vux';
import querystring from 'querystring';
export default {
  components: {
    XButton,
    Alert
  },
  methods: {
    sign() {
      const { source, id } = querystring.parse(location.search);
      this.disabled = true;
      this.$axios.post('/api/room/sign', {
        id,
        source
      }).then(data => {
        console.log(data);
        this.place = data.id;
        this.username = data.username;
        this.time = dateFormat(new Date(data.time), 'YYYY-MM-DD HH:mm');
        this.show = true;
        this.disabled = false;
      }).catch(err => {
        this.$vux.toast.show({
          text: err,
          type: 'text'
        });
        this.disabled = false;
      })
    },
    onhide() {
      this.$router.push('/main')
    }
  },
  data() {
    return {
      disabled: false,
      show: false,
      place: '明理楼A101',
      username: '明理楼A101',
      time: dateFormat(new Date('2019-05-05 08:25:46'), 'YYYY-MM-DD HH:mm')
    }
  }
}
</script>

<style scoped>
  .content {
    padding-top: 2rem;
  }
  .alert>p {
    padding-left: 1rem;
    text-align: left;
  }
</style>