<template>
  <div>
    <group>
      <radio
        :options="radioList"
        v-model="radioValue"></radio>
    </group>
    <div v-show="radioValue === '二级管理'">
      <div class="checkList">
        <checklist
          :options="manage2List || []"
          v-model="manage2checkList"
          label-position="left"
          title="已有管理"></checklist>
      </div>
      <div v-if="!manage2List.length">暂无</div>
      <div>
        <x-button
          @click.native="deleteManage2"
          type="primary"
          :disabled="!manage2List.length || disabledDelManage2"
          text="删除"
          :show-loading="disabledDelManage2"></x-button>
      </div>
      <div v-if="manage2UserList.length" class="checkList">
        <group>
          <radio
            :options="manage2UserList"
            v-model="manage2UserRadioValue"></radio>
        </group>
      </div>
      <div v-else>暂无数据</div>
      <x-button
        @click.native="andManage2"
        type="primary"
        :disabled="!manage2UserList.length || disabledAnd2Manage2"
        text="添加"
        :show-loading="disabledAnd2Manage2"></x-button>
    </div>
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
        <div v-show="roomData.id">
          <search
            placeholder="用户名"
            :auto-fixed="false"
            @on-change="searchUsernameChange"
            @on-clear="clerrSearchUsernameValue"
            v-model="searchUsernameValue"></search>
          <div v-if="searchUserList.length" class="checkList">
            <group>
              <radio
                :options="searchUserList"
                v-model="searchUserRadioValue"></radio>
            </group>
          </div>
          <div v-if="searchUserRadioValue && !searchUserList.length">没有搜索到</div>
          <x-button
            v-else
            @click.native="andManage"
            type="primary"
            :disabled="disabledAnd"
            text="添加"
            :show-loading="disabledAnd"></x-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Search, Checklist, XButton, Radio, Group, debounce } from 'vux';
export default {
  components: {
    Search,
    Checklist,
    XButton,
    Radio,
    Group
  },
  created() {
    this.getManage2Data();
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
          this.checkList = [];
      }
    },
    searchUsernameChange: debounce(function() {
      if(this.searchUsername === '') {
        return;
      }
      this.$axios.get(`/api/manage/userList?username=${this.searchUsernameValue}`)
        .then(data => {
         data = data.filter(username => {
            return !this.roomData.manager.some(a => {
              return a === username;
            })
          })
          this.searchUserList = data;
        })
      this.searchUserRadioValue = '';
    }, 300),
    deleteManage() {
      if(!this.checkList.length) {
        this.$vux.toast.show({
          text: '请选择删除用户',
          type: 'text'
        });
        return;
      }
      this.disabledDel = true;
      this.$axios.post('/api/manage/deleteManage', {
        id: this.roomData.id,
        username: JSON.stringify(this.checkList)
      }).then(data => {
        this.$vux.toast.show({
          text: data,
          type: 'text'
        });
        this.disabledDel = false;
        this.search();
      })
      .catch(err => {
        this.$vux.toast.show({
          text: err,
          type: 'text'
        });
        this.disabledDel = false;
      })
    },
    andManage() {
      if(!this.searchUserList.length) {
        this.$vux.toast.show({
          text: '请搜索用户',
          type: 'text'
        });
        return;
      }
      if(!this.searchUserRadioValue) {
        this.$vux.toast.show({
          text: '请选择添加的用户',
          type: 'text'
        });
        return;
      }
      this.disabledAnd = true;
      this.$axios.post('/api/manage/addManage', {
        id: this.roomData.id,
        username: this.searchUserRadioValue
      }).then(data => {
        this.$vux.toast.show({
          text: data,
          type: 'text'
        });
        this.disabledAnd = false;
        this.search();
        this.searchUsernameChange();
      })
      .catch(err => {
        this.$vux.toast.show({
          text: err,
          type: 'text'
        });
        this.disabledAnd = false;
      })
    },
    getManage2Data() {
      this.$axios.get('/api/manage/get2ManageAbout')
        .then(data => {
          this.manage2List = data.manage2;
          this.manage2UserList = data.canManage2;
        })
        .catch(err => {
          this.$vux.toast.show({
            type: 'text',
            text: err
          })
        })
      this.manage2checkList = [];
      this.manage2UserRadioValue = '';
    },
    deleteManage2() {
      if(!this.manage2checkList.length) {
        this.$vux.toast.show({
          text: '请选择删除用户',
          type: 'text'
        });
        return;
      }
      this.disabledDelManage2 = true;
      this.$axios.post('/api/manage/deleteManage2', {
        username: JSON.stringify(this.manage2checkList)
      }).then(data => {
        this.$vux.toast.show({
          text: data,
          type: 'text'
        });
        this.disabledDelManage2 = false;
        this.getManage2Data();
      })
      .catch(err => {
        this.$vux.toast.show({
          text: err,
          type: 'text'
        });
        this.disabledDelManage2 = false;
      })
    },
    andManage2() {
      if(!this.manage2UserRadioValue && this.manage2UserList.length) {
        this.$vux.toast.show({
          text: '请选择添加的用户',
          type: 'text'
        });
        return;
      }
      this.disabledAnd2Manage2 = true;
      this.$axios.post('/api/manage/addManage2', {
        username: this.manage2UserRadioValue
      }).then(data => {
        this.$vux.toast.show({
          text: data,
          type: 'text'
        });
        this.disabledAnd2Manage2 = false;
        this.getManage2Data()
      })
      .catch(err => {
        this.$vux.toast.show({
          text: err,
          type: 'text'
        });
        this.disabledAnd2Manage2 = false;
      })
    }
  },
  data() {
    return {
      radioValue: '二级管理',
      radioList: ['二级管理', '教室管理'],
      searchValue: '',
      searchUsernameValue: '',
      roomData: {},
      checkList: [],
      searchUserList: [],
      searchUserRadioValue: '',
      disabledDel: false,
      disabledAnd: false,
      manage2List: [],
      manage2checkList: [],
      disabledDelManage2: false,
      manage2UserList: [],
      manage2UserRadioValue: '',
      disabledAnd2Manage2: false
    }
  }
}
</script>
<style scoped>
  .checkList {
    max-height: 3.5rem;
    overflow: auto;
  }
</style>

