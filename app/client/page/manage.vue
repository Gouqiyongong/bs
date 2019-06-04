<template>
  <div>
    <tab bar-position="top">
      <tab-item selected @on-item-click="onItemClick('chart')">统计图表</tab-item>
      <tab-item @on-item-click="onItemClick('order')">订单信息</tab-item>
      <tab-item v-if="isShowTab" @on-item-click="onItemClick('power')">权限管理</tab-item>
    </tab>
    <manage-chart v-show="tabType === 'chart'"></manage-chart>
    <manage-order v-if="tabType === 'order'"></manage-order>
    <manage-search v-if="tabType === 'power'"></manage-search>
  </div>
</template>

<script>
import { Tab, TabItem } from 'vux'

import ManageSearch from '../components/manage-search.vue';
import ManageOrder from '../components/manage-order.vue';
import ManageChart from '../components/manage-chart/index.vue';

export default {
  components: {
    Tab,
    TabItem,
    ManageSearch,
    ManageOrder,
    ManageChart
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


