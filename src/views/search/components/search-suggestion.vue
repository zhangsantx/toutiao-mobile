<template>
  <div class="search-suggestion-container">
    <van-cell v-for="(suggestion, index) in suggestions" :key="index" icon="search" @click="$emit('search', suggestion)">
      <div slot="title" v-html="highlight(suggestion, searchText)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      suggestions: [] // 联想建议数据列表
    }
  },
  watch: {
    // 监听输入框内容发生变化--获取联想建议
    // debounce防抖
    searchText: {
      handler: debounce(async function () {
        const { data } = await getSearchSuggestions(this.searchText)
        this.suggestions = data.data.options
      }, 200),
      immediate: true
    }
  },
  methods: {
    // 处理搜索关键字高亮
    highlight(source, keyword) {
      // /searchContent/ 正则表达式中的一切内容都会当做字符串使用
      // new RegExp 根据字符串创建一个正则表达式
      const reg = new RegExp(keyword, 'gi')
      return source.replace(reg, `<span style="color: #3296fa">${keyword}</span>`)
    }
  }
}
</script>

<style lang="less" scoped>
.search-suggestion-container {
}
</style>
