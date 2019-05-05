<template>
  <div class="content">
      <div>
        <group
          label-width="2em"
          label-align="right"
          gutter="1em"
          label-margin-right="2em">
          <popup-picker
            title="楼层"
            :data="floorList"
            v-model="floor"
            :columns="3"
            placeholder="请选择"
            @on-change="timeChage"
          ></popup-picker>
          <popup-picker
            title="课时"
            :data="clasList"
            v-model="clas"
            placeholder="请选择"
            @on-change="timeChage"
          ></popup-picker>
        </group>
      </div>
      <ul class="ul">
        <li
          :key="index"
          v-for="(item, index) in orderList">
          <div>
             <p>教室: <span>{{item.room}}</span></p>
            <p>大小: <span>{{item.size}}</span></p>
          </div>
          <div>
            <p>用户: <span>{{item.username}}</span></p>
            <p>用途: <span>{{item.des}}</span></p>
          </div>
        </li>
      </ul>
  </div>
</template>
<script>
import { PopupPicker, Group, Datetime, dateFormat } from "vux";

export default {
  components: {
    PopupPicker,
    Datetime,
    Group
  },
  async created() {
    try {
      let floorList = await this.$axios.get('/api/room/category')
      this.$set(this, 'floorList', floorList);
    } catch(err) {
      this.$vux.toast.show({
        text: err,
        type: 'warn'
      })
    }
    let arr = [{
      name: '全部',
      value: 'all'
    }];
    for(let i = 0; i < 12; i++) {
      arr.push({
        name: `第${i + 1}节`,
        value: `第${i + 1}节`
      })
    }
    this.$set(this, 'clasList', [arr])
    this.queryList();
  },
  methods: {
    timeChage() {
      this.queryList();
    },
    queryList() {
      const query = {
        place: this.floor[0],
        floor: this.floor[1].slice(0, -1),
        clas: this.clas[0] === 'all' ? 'all' : this.clas[0].slice(1, -1)
      }
      this.$axios.post('/api/manage/orderList', query)
        .then(data => {
          this.orderList = data
        })
        .catch(err => {
          this.$vux.toast.show({
            text: err,
            type: 'text'
          })
        })
    }
  },
  data() {
    return {
      floor: ["明理楼", "1楼"],
      time: "",
      floorList: [],
      clas: ['all'],
      clasList: [],
      orderList: []
    };
  }
};
</script>
<style scoped>
.content {
  background-color: #f8f8f8;
}
.content-f {
  overflow: hidden;
}
.ul {
  font-size: .5rem;
}

.ul span {
  font-size: .4rem;
  color: #999;
}

.ul>li {
  margin-top: 0.1rem;
  padding: .2rem 0;
  display: flex;
  background-color: #fff;
}

.ul div {
  padding-left: .8rem;
}
</style>


