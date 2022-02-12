<template>
  <div class="search-history-container" v-if="searchHistories.length !== 0">
    <van-cell title="搜索历史">
      <!-- <van-icon v-if="!isShowDelete" name="delete" /> -->
      <div v-if="!isShowDelete" @click="isShowDelete = true">管理</div>
      <div v-else>
        <span @click="$emit('delete', -1)">全部删除&nbsp;</span>
        <span @click="isShowDelete = false">完成</span>
      </div>
    </van-cell>
    <van-cell v-for="(history, index) in searchHistories" :key="index" :title="history" @click="onSearchHistory(history)">
      <van-icon v-show="isShowDelete" name="cross" @click="onDelete(index)" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  props: {
    searchHistories: {
      type: Array
    }
  },
  data() {
    return {
      isShowDelete: false // 是否显示删除按钮
    }
  },
  methods: {
    // 删除单个搜索记录
    onDelete(index) {
      if (this.isShowDelete) {
        // // index为-1即为删除全部
        this.$emit('delete', index)
      }
    },
    // 非编辑状态下点击搜索记录搜索对应的数据
    onSearchHistory(histoy) {
      if (!this.isShowDelete) {
        this.$emit('search', histoy)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search-history-container {
}
</style>
