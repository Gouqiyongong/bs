<template>
  <div>
    <group>
      <Datetime
        format="YYYY/MM/DD"
        placeholder="时间选择"
        v-model="startTime"
        @on-change="timeChange"
        title="开始时间"></Datetime>
      <Datetime
        format="YYYY/MM/DD"
        placeholder="时间选择"
        v-model="endTime"
        @on-change="timeChange"
        title="结束时间"></Datetime>
    </group>
    <chart-area :data="data"></chart-area>
  </div>
</template>
<script>
import { Datetime, Group } from 'vux';
import ChartArea from './chart-area.vue';
const date = new Date(),
      startDate = new Date(date.getTime() - 1000 * 60 * 60 * 24 * 30);
const defaultEnd = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`,
      defaultStart = `${startDate.getFullYear()}/${startDate.getMonth() + 1}/${startDate.getDate()}`;
export default {
  components: {
    ChartArea,
    Datetime,
    Group
  },
  created() {
    this.timeChange();
  },
  methods: {
    timeChange() {
      this.$vux.loading.show();
      this.$axios.get(`/api/manage/chart?start=${this.startTime}&end=${this.endTime}`)
        .then(data => {
          this.data = data;
          this.$vux.loading.hide();
        })
        .catch(err => {
          this.$vux.loading.hide();
          this.$vux.toast.show({
            text: err,
            type: 'text'
          })
        })
    }
  },
  data() {
    return {
      startTime: defaultStart,
      endTime: defaultEnd,
      data: {}
    }
  }
}
</script>

