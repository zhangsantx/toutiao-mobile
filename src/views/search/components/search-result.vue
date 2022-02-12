<template>
  <div class="search-result-container">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell class="van-multi-ellipsis--l2" v-for="article in list" :key="article.art_id" :title="article.title" />
    </van-list>
  </div>
</template>

<script>
import { getSearchResults } from '@/api/search'
export default {
  name: 'SearchResult',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      list: [], // 搜索结果列表
      loading: false,
      finished: false,
      page: 1, // 页码
      perPage: 10 // 每页大小
    }
  },
  methods: {
    async onLoad() {
      const { data } = await getSearchResults({
        page: this.page, // 页码
        per_page: this.perPage, // 每页大小
        q: this.searchText // 搜索关键词
      })
      const { results } = data.data
      this.list.push(...results)

      // 加载状态结束
      this.loading = false

      if (results.length) {
        // 如果还有下一页数据，则获取下一页数据
        this.page++
      } else {
        // 如果无，则完成加载
        // 数据全部加载完成
        this.finished = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search-result-container {
}
</style>
