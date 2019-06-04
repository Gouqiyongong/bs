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
            :start-date="startTime"
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
              :style="{backgroundColor: val ? '#f96' : ''}"
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
          <group :style="{'margin-top': '-.4rem'}">
            <x-input
              :show-clear="false"
              type="number"
              :max="2"
              required
              title="使用人数"
              v-model="people"></x-input>
          </group>
          <div class="radio">
            <label>设备选项</label>
            <div>
              <input type="radio" name="device" id="device1" value="true" v-model="usedevice">
              <label for="device1">使用</label>
              <input type="radio" name="device" id="device2" value="false" v-model="usedevice">
              <label for="device2">不使用</label>
            </div>
          </div>
          <textarea
            class="room_des"
            placeholder="请填写使用理由"
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
      <x-dialog
        :hide-on-blur="true"
        v-model="showRecommendDialog">
        <div class="d-contentRecommend">
          <h4>推荐教室</h4>
          <p>教室：{{recommend.id}}</p>
          <p>大小：{{recommend.size}}</p>
          <p>时间：{{recommend.time}}</p>
          <x-button
            type="primary"
            text="预订"
            @click.native="useRecommend()"></x-button>
          <x-button
            type="primary"
            text="再看看"
            @click.native="useRecommendClose()"></x-button>
        </div>
      </x-dialog>
  </div>
</template>
<script>
import { PopupPicker, Group, XDialog, Datetime, Checker, CheckerItem, XButton, XInput, dateFormat } from "vux";
import querystring from 'querystring';

export default {
  components: {
    PopupPicker,
    Datetime,
    Group,
    XDialog,
    Checker,
    CheckerItem,
    XButton,
    XInput
  },
  async created() {
    this.time = dateFormat(new Date(new Date().getTime() + 1000 * 60 * 60 * 24), "YYYY-MM-DD");
    
    this.$axios.get('/api/room/recommend')
      .then(data => {
        data.time = dateFormat(new Date(data.time), "YYYY-MM-DD")
        this.recommend = data;
        this.showRecommendDialog = true;
      })

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
      console.log(query)
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
      if(power == 2 && state == 1) {
        const query = {
          room_id: this.roomInfo.data.room_id
        }
        return this.$axios.get(`/api/room/roomPower?${querystring.stringify(query)}`)
          .then(() => {
            return true;
          })
          .catch(() => {
            return false;
          })
      }
    },
    order() {
      const { roomValue, des, people, usedevice } = this;
      if(!roomValue) {
        this.$vux.toast.show({
          text: '选择预订课时',
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
      if(!people) {
        this.$vux.toast.show({
          text: '输入使用人数',
          type: 'warn'
        })
        return;
      }

      if(parseInt(people) >= 100) {
        this.$vux.toast.show({
          text: '使用人数不能超过一百人',
          type: 'warn'
        })
        return;
      }
      const state = this.roomInfo.data && this.roomInfo.data.order[this.roomValue].state;
      const { power } = this.$root.userInfo;
      const success = () => {
        this.disable = true;
        this.$axios.post('/api/room/order', {
          room_id: this.roomInfo.data.room_id,
          time: this.roomInfo.data.time,
          value: this.roomValue,
          des,
          people,
          usedevice
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
    },
    useRecommend() {
      this.roomInfo = {
        size: this.recommend.size,
        data: this.recommend.order
      };
      this.roomValue = '';
      this.des = '';
      this.showRecommendDialog = false;
      this.showD = true;
      this.showDialog = true;
    },
    useRecommendClose() {
      this.showRecommendDialog = false;
    }
  },
  data() {
    return {
      people: '',
      usedevice: false,
      roomValue: '',
      des: '',
      roomInfo: {},
      showD: false,
      showDialog: false,
      disable: false,
      showRecommendDialog: false,
      recommend: {},
      floor: ["明理楼", "1楼"],
      time: "",
      startTime: "",
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
  color: #fff;
  background-color: #eee;
}
.list-all {
  white-space: nowrap;
}
.list-r {
  display: inline-block;
  margin: 0.2em;
  width: 1em;
  height: 1em;
  height: 1em;
  text-align: center;
  line-height: 80%;
  border: 5px outset #ccc;
  vertical-align: middle;
  background-color: #fff;
}

.list-r>span {
  font-size: .3rem;
}

.d-content {
  width: 100%;
  height: 10rem;
  overflow: auto;
  background-color: #fff;
}

.d-contentRecommend {
  padding: 1rem .5rem;
  font-size: 16px;
  background-color: #fff;
}

.d-contentRecommend>p {
  text-align: left;
  margin: .2rem 0;
}

.room_des {
  width: 80%;
  height: 3rem;
  margin: .3rem auto 0 auto;
}

.radio {
  padding: 10px 15px;
  position: relative;
  display: flex;
  align-items: center;
  font-size: 17px;
}

.radio>label {
  width: 5em;
  text-align: center;
}

.checker-default {
  margin: .1rem .05rem;
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


