<template>
  <div>
    <group>
      <radio
        :options="radioList"
        v-model="radioValue"></radio>
    </group>
    <div v-show="radioValue === '教室管理'">
      <search
          placeholder="如: 明理楼A101"
          :auto-fixed="false"
          @on-submit="search"
          @on-blur="search"
          @on-clear="clerrSearchValue"
          v-model="searchValue"></search>
      <div v-show="roomData.id">
        <div class="checkList">
          <checklist
            :options="roomData.manager || []"
            v-model="checkList"
            label-position="left"
            :title="roomData.id"></checklist>
        </div>
        <div>
          <x-button
            @click.native="deleteManage"
            type="primary"
            :disabled="disabledDel"
            text="删除"
            :show-loading="disabledDel"></x-button>
        </div>
        <div>
          <search
            placeholder="用户名"
            :auto-fixed="false"
            @on-submit="searchUsername"
            @on-blur="searchUsername"
            @on-clear="clerrSearchUsernameValue"
            v-model="searchUsernameValue"></search>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Search, Checklist, XButton, Radio, Group } from 'vux';
export default {
  components: {
    Search,
    Checklist,
    XButton,
    Radio,
    Group
  },
  methods: {
    clerrSearchValue() {
      this.searchValue = '';
    },
    clerrSearchUsernameValue() {
      this.searchUsername = '';
    },
    search() {
      if(this.searchValue !== '') {
        this.$axios.get(`/api/manage/roomManageList?room_id=${this.searchValue.toUpperCase()}`)
          .then(data => {
            this.$set(this, 'roomData', data);
          })
          .catch(err => {
            this.$vux.toast.show({
              text: err,
              type: 'text'
            });
            this.$set(this, 'roomData', {});
          })
      }
    },
    deleteManage() {
      if(!this.checkList.length) {
        this.$vux.toast.show({
          text: '请选择添加用户',
          text: 'text'
        });
        return;
      }
    },
    searchUsername() {

    }
  },
  data() {
    return {
      radioValue: '教室管理',
      radioList: ['二级管理', '教室管理'],
      searchValue: '',
      searchUsernameValue: '',
      roomData: {
        manager: ["admin", "admin1"],
        id: "明理楼A101"
      },
      checkList: [],
      disabledDel: false
    }
  }
}
</script>
<style scoped>
  .checkList {
    height: 4rem;
    overflow: auto;
  }
</style>

