<template>
  <div>
    <tab bar-position="top">
      <tab-item selected @on-item-click="onItemClick('chart')">统计图表</tab-item>
      <tab-item @on-item-click="onItemClick('order')">订单信息</tab-item>
      <tab-item v-if="isShowTab" @on-item-click="onItemClick('power')">权限管理</tab-item>
    </tab>
    <div v-show="tabType === 'chart'">a</div>
    <div v-show="tabType === 'order'">s</div>
    <manage-search v-show="tabType === 'power'"></manage-search>
  </div>
</template>

<script>
import { Tab, TabItem } from 'vux'

import ManageSearch from '../components/manage-search.vue';

export default {
  components: {
    Tab,
    TabItem,
    ManageSearch
  },
  created() {
    setTimeout(() => {
      const { power } = this.$root.userInfo;
      if(power == 0) {
        this.isShowTab = true;
      }
    }, 200)
  },
  methods: {
    onItemClick(type) {
      this.tabType = type;
    },
  },
  data() {
    return {
      tabType: 'chart',
      isShowTab: false
    }
  }
}
</script>
<style scoped>

</style>


