<template>
  <div>
    <v-chart
      v-if="data.chart1"
      ref="demo"
      :data="data.chart1">
      <v-bar />
      <v-tooltip :show-item-marker="false" />
    </v-chart>
  </div>
</template>

<script>
import { VChart, VLine, VArea, VTooltip, VLegend, VBar, XButton } from 'vux'
import { type } from 'os';

export default {
  components: {
    VChart,
    VLine,
    VArea,
    VTooltip,
    VLegend,
    VBar,
    XButton
  },
  props: {
    data: {
      type: Object,
      default: {}
    },
  },
  data () {
    return {

    }
  }
}
</script>