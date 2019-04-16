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
          <datetime
            title="时间"
            v-model="time"
            placeholder="请选择"
            start-date="2019-04-15"
            @on-change="timeChage"
          ></datetime>
        </group>
      </div>
      <div class="list">
        <div class="list-all">
          <div
            class="list-line"
            v-for="(value, key) in roomList"
            :key="key">
            <div
              class="list-r"
              v-for="(val, k) in value"
              :key="k">
              </div>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
import { PopupPicker, Group, Datetime, dateFormat, querystring } from "vux";
import { appendFile } from 'fs';

export default {
  components: {
    PopupPicker,
    Datetime,
    Group
  },
  async created() {
    this.time = dateFormat(new Date(), "YYYY-MM-DD");

    try {
      let floorList = await this.$axios.get('/api/room/category')
      this.$set(this, 'floorList', floorList);
    } catch(err) {
      this.$vux.toast.show({
        text: err,
        type: 'warn'
      })
    }

    let query = {
      place: this.floor[0],
      floor: this.floor[1].slice(0, -1),
      time: this.time
    };
    this.$axios.get(`/api/room/roomList?${querystring.stringify(query)}`)
      .then(data => {
        this.$set(this, 'roomList', data);
      })
      .catch(err => {
        this.$vux.toast.show({
          text: err,
          type: 'warn'
        })
      }) 

    // this.$set(this, 'roomList', arr);
  },
  methods: {
    timeChage() {
      console.log(this.floor);
      console.log(this.time);
    }
  },
  data() {
    return {
      floor: ["明理楼", "1楼"],
      time: "",
      roomList: [],
      floorList: [
        {
          name: "明理楼",
          value: "明理楼",
          parent: 0
        },
        {
          name: "思学楼",
          value: "思学楼",
          parent: 0
        },
        {
          name: "博学楼",
          value: "博学楼",
          parent: 0
        },
        {
          name: "明德楼",
          value: "明德楼",
          parent: 0
        },
        {
          name: "明志楼",
          value: "明志楼",
          parent: 0
        },
        {
          name: "明德楼",
          value: "明德楼",
          parent: 0
        },
        {
          name: "3楼",
          value: "3楼",
          parent: "明理楼"
        },
        {
          name: "2楼",
          value: "2楼",
          parent: "明理楼"
        },
        {
          name: "1楼",
          value: "1楼",
          parent: "明理楼"
        },
        {
          name: "3楼",
          value: "3楼",
          parent: "明理楼"
        },
        {
          name: "2楼",
          value: "2楼",
          parent: "明德楼"
        }
      ]
    };
  }
};
</script>
<style scoped>
.content {
  background-color: #f8f8f8;
}
.list {
  overflow: auto;
  margin-top: 0.8rem;
  width: 100%;
  height: 8rem;
  background-color: red;
}
.list-all {
  white-space: nowrap;
}
.list-r {
  display: inline-block;
  margin: 0.2em;
  width: 0.5em;
  height: 0.5em;
  background-color: green;
}
</style>


