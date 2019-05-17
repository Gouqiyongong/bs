<template>
  <div>
    <ul class="list-ul">
      <li
        :key="index"
        v-for="(item, index) in list"
        class="list-li">
        <div>
          <p>地点: {{item.place}},</p>
          <p>时间: {{date(new Date(item.time), 'YYYY-MM-DD')}} 第{{item.class + 1}}节</p>
          <p v-if="item.state === 0" class="list-min">状态: 已预订</p>
          <p v-if="item.state === 1" class="list-min">状态: 已签到</p>
          <p v-if="item.state === 2" class="list-min">状态: 已过期</p>
          <p v-if="item.state === 3" class="list-min">状态: 被取消</p>
        </div>
        <div class="list-b" v-if="item.state === 0">
          <button @click="failOrder(index)">取消</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { dateFormat } from 'vux';
export default {
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.$axios.get('/api/order/list')
      .then(data => {
        this.$set(this, 'list', data)
      })
      .catch(err => {
        this.$vux.toast.show({
          text: err,
          type: 'text'
        })
      })
    },
    date(...arg) {
      return dateFormat(...arg);
    },
    failOrder(index) {
      const data = this.list[index];
      const query = {
        room_id: data.place,
        time: data.time,
        value: data.class
      }
      this.$axios.post('/api/order/failOrder', query)
        .then(() => {
          this.$vux.toast.show({
            text: '订单已取消'
          })
          this.getList();
        })
        .catch(err => {
          this.$vux.toast.show({
            text: err,
            type: 'warn'
          })
        })
    }
  },
  data() {
    return {
      list: []
    }
  }
}
</script>

<style scoped>
  .list-ul {
    padding-bottom: 1rem;
  }
  .list-li {
    display: flex;
    box-sizing: border-box;
    width: 100%;
    height: 2.7rem;
    padding: .2rem .5rem;
    margin-bottom: .5rem;
    font-size: .5rem;
    background-color: #f8f8f8;
  }

  .list-li>div:first-of-type {
    width: 70%;
  }

  .list-min {
    margin-top: .2rem;
    font-size: .35rem;
    color: gray;
  }

  .list-b>button {
    display: block;
    margin: .1rem .4rem;
    padding: .1rem .2rem;
  }
</style>

