<template>
  <div>
    <search
        placeholder="如: 明理楼A101"
        :auto-fixed="false"
        @on-submit="search"
        @on-blur="search"
        @on-clear="clerrSearchValue"
        v-model="searchValue"></search>
  </div>
</template>
<script>
import { Search } from 'vux';
export default {
  components: {
    Search
  },
  methods: {
    clerrSearchValue() {
      this.searchValue = '';
    },
    search() {
      if(this.searchValue !== '') {
        this.$axios.get(`/api/manage/roomManageList?room_id=${this.searchValue.toUpperCase()}`)
      }
    }
  },
  data() {
    return {
      searchValue: ''
    }
  }
}
</script>

