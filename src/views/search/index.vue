<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <form action="/">
      <van-search
        v-model="searchText"
        show-action
        shape="round"
        autofocus
        placeholder="请输入搜索关键词"
        :maxlength="30"
        @search="onSearch(searchText)"
        @cancel="$router.back()"
        @focus="isResultShow = false"
      />
    </form>
    <!-- /搜索栏 -->

    <!-- 搜索结果 -->
    <search-result class="search-result" v-if="isResultShow" :search-text="searchText"></search-result>
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <search-suggestion v-else-if="searchText" :search-text="searchText" @search="onSearch($event)"></search-suggestion>
    <!-- /联想建议 -->

    <!-- 历史记录 -->
    <search-history v-else :searchHistories="searchHistories" @delete="onDeleteHistory" @search="onSearch($event)"></search-history>
    <!-- /历史记录 -->
  </div>
</template>

<script>
import SearchSuggestion from './components/search-suggestion'
import SearchHistory from './components/search-history'
import SearchResult from './components/search-result'
import { setItem, getItem } from '@/utils/storage'
// import { getUserSearchHistories } from '@/api/search'
import { mapState } from 'vuex'

export default {
  name: 'SearchIndex',
  data() {
    return {
      searchText: '',
      isResultShow: false, // 控制搜索结果的显示状态
      searchHistories: getItem('search-histories') || [] // 搜索历史数据（默认读取本地存储中的数据,不存在则为空数组）
    }
  },
  created() {
    // this.loadUserHistories()
  },
  watch: {
    // 监听searchHistories的变换，发生变化就将其存储到本地存储中，避免多次将其存储到本地存储中
    searchHistories() {
      setItem('search-histories', this.searchHistories)
    }
  },
  methods: {
    // 搜索
    onSearch(searchText) {
      this.searchText = searchText
      // 记录搜索历史记录
      // 判断是否在存在重复记录
      const index = this.searchHistories.indexOf(searchText)
      if (index !== -1) {
        // 存在重复--先移除重复项，然后重新添加记录
        // 删除重复项
        this.searchHistories.splice(index, 1)
      }
      // 添加记录
      this.searchHistories.unshift(searchText)
      // 数据持久化 用户登录--存储到服务器（无需设置，后端自动根据搜索设置） 未登录--存储到本地存储
      setItem('search-histories', this.searchHistories)

      // 展示搜索结果
      this.isResultShow = true
    },
    // 获取用户搜索历史(后端默认只记录后四个搜索记录)
    // async loadUserHistories() {
    //   let searchHistories = getItem('search-histories') || []
    //   // 判断用户是否登录 已登录--合并后端数据和本地存储数据 未登录--使用本地存储数据
    //   if (this.user) {
    //     const { data } = await getUserSearchHistories()
    //     // 使用ES6set数组去重
    //     searchHistories = searchHistories = [...new Set([...searchHistories, ...data.data.keywords])]
    //   }
    //   this.searchHistories = searchHistories
    // },
    // 删除历史记录
    onDeleteHistory(index) {
      // 删除单个搜索记录
      // index为-1即为删除全部
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      } else {
        // 删除全部搜索记录
        this.searchHistories = []
      }
      // 数据持久化
      // 判断是否登录 已登录--删除本地和服务端记录 未登录--删除本地记录
      // 注意：此处后端无删除单个历史记录的接口
      // if (this.user && index === -1) {
      // }
      // setItem('search-histories', this.searchHistories)
    }
  },
  components: {
    SearchSuggestion,
    SearchHistory,
    SearchResult
  },
  computed: {
    ...mapState(['user'])
  }
}
</script>

<style lang="less" scoped>
.search-container {
  .search-result {
    position: fixed;
    top: 54px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
  }
}
</style>
