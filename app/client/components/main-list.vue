<template>
  <div class="content">
      <div class="content-f">
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
              @click="val && val.data && clickRoom(val)"
              :style="{backgroundColor: val ? 'blue' : ''}"
              class="list-r"
              v-for="(val, k) in value"
              :key="k">
              <span>{{val && val.size}}</span>
            </div>
          </div>
        </div>
      </div>
      <x-dialog
        :hide-on-blur="true"
        v-model="showDialog">
        <div class="d-content" v-if="showD">
          <checker
            default-item-class="checker-default"
            selected-item-class="checker-selected"
            disabled-item-class="checker-disabled"
            radio-required
            v-model="roomValue">
            <checker-item
              :value="index"
              :key="index"
              :disabled="isDisable(item)"
              v-for="(item, index) in roomInfo.data.order">
              {{index + 1}}
            </checker-item>
          </checker>
          <textarea
            class="room_des"
            v-model="des"
            ></textarea>
          <div>
            <x-button
              @click.native="order()"
              type="primary"
              :disabled="disable"
              text="预订" 
              :show-loading="disable"></x-button>
          </div>
        </div>
      </x-dialog>
  </div>
</template>
<script>
import { PopupPicker, Group, XDialog, Datetime, Checker, CheckerItem, XButton, dateFormat, querystring } from "vux";

export default {
  components: {
    PopupPicker,
    Datetime,
    Group,
    XDialog,
    Checker,
    CheckerItem,
    XButton
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
    this.queryList();
  },
  methods: {
    clickRoom(value) {
      this.roomInfo = value;
      console.log('aaaaaaaaa',value);
      this.roomValue = '';
      this.des = '';
      this.showD = true;
      this.showDialog = true;
    },
    timeChage() {
      this.queryList();
    },
    queryList() {
      let query = {
        place: this.floor[0],
        floor: this.floor[1].slice(0, -1),
        time: this.time.replace('-', '/')
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
    },
    isDisable(item) {
      const { state } = item;
      if(state == 0) {
        return true;
      }
      const { power } = this.$root.userInfo;
      if(power == 3 && state === 1) {
        return true;
      }
      let result = false;
      if(power == 2 && state == 1) {
        const query = {
          room_id: this.roomInfo.data.room_id
        }
        this.$axios.get(`/api/room/roomPower?${querystring.stringify(query)}`)
          .then(() => {
            result = true;
          })
      }
      return result;
    },
    order() {
      const { roomValue, des } = this;
      if(!roomValue) {
        this.$vux.toast.show({
          text: '选择预订时间',
          type: 'warn'
        })
        return;
      }
      if(!des) {
        this.$vux.toast.show({
          text: '输入使用理由',
          type: 'warn'
        })
        return;
      }
      const state = this.roomInfo.data || this.roomInfo.data.order[this.roomValue].state;
      const { power } = this.$root.userInfo;
      const success = () => {
        this.disable = true;
        this.$axios.post('/api/room/order', {
          room_id: this.roomInfo.data.room_id,
          time: this.roomInfo.data.time,
          value: this.roomValue,
          des: this.des
        })
        .then(() => {
          this.$vux.toast.show({
            text: '预订成功'
          });
          this.queryList();
          this.showDialog = false;
          this.disable = false;
        })
        .catch(err => {
          this.$vux.toast.show({
            text: err,
            type: 'warn'
          });
          this.disable = false;
        })
      }
      if(state == 1) {
        this.$vux.confirm.show({
          // 组件除show外的属性
          title: '提示',
          content: '改教室已经被预订，是否取消后从新预订',
          onCancel : () => {
            console.log('取消')
          },
          onConfirm : () => {
            success();
          }
        })
        return;
      }
      success();
    }
  },
  computed: {
  },
  data() {
    return {
      roomValue: '',
      des: '',
      roomInfo: {},
      showD: false,
      showDialog: false,
      disable: false,
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
.content-f {
  overflow: hidden;
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
  width: 1em;
  height: 1em;
  text-align: center;
  line-height: 80%;
  vertical-align: middle;
  background-color: green;
}

.list-r>span {
  font-size: .3rem;
}

.d-content {
  width: 100%;
  height: 10rem;
  background-color: #fff;
}

.room_des {
  width: 80%;
  height: 3rem;
  margin: .3rem auto 0 auto;
}

.checker-default {
  padding: .1rem .3rem;
  border: 1px solid #ececec
}

.checker-selected {
  border: 1px solid green;
}

.checker-disabled {
  color: gray;
}
</style>


