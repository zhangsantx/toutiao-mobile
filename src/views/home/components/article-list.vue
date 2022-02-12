<template>
  <div class="article-list-container" ref="article-list">
    <van-pull-refresh v-model="isPullDownLoading" :success-text="refreshText" :success-duration="1000" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <article-item v-for="article in articles" :key="article.art_id.toString()" :article="article"></article-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item/'
import { debounce } from 'lodash'
export default {
  name: 'ArticleList',
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      articles: [],
      loading: false,
      finished: false,
      timestamp: null, // 获取下一页数据的时间戳
      isPullDownLoading: false, // 控制下拉刷新
      refreshText: '',
      scrollTop: 0 // 列表滚动距离顶部的距离
    }
  },
  methods: {
    // 获取频道文章列表
    async onLoad() {
      const { data } = await getArticles({
        channel_id: this.channel.id, // 频道id
        timestamp: this.timestamp || 1556789000001, // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
        with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
      })
      const { results } = data.data
      this.articles = [...this.articles, ...results]

      // 加载状态结束
      this.loading = false

      // 上拉加载更多
      if (results.length !== 0) {
        // 获取下一页
        this.timestamp = data.data.pre_timestamp
      } else {
        // 加载完毕
        this.finished = true
      }
    },
    // 下拉刷新
    async onRefresh() {
      const { data } = await getArticles({
        channel_id: this.channel.id, // 频道id
        timestamp: Date.now(), // 下拉刷新传当前最新时间戳 接口已失效
        with_top: 1
      })
      const { results } = data.data
      this.articles.unshift(...results)

      if (results.length === 0) {
        this.refreshText = '没有更多数据了'
      } else {
        this.refreshText = `更新了${results.length}条数据`
      }

      // 关闭刷新
      this.isPullDownLoading = false
    }
  },
  components: {
    ArticleItem
  },
  mounted() {
    // 记录滚动距离，配合组件缓存，避免返回时自动滚动到页面顶部
    const articleList = this.$refs['article-list']
    // debounce 添加防抖
    articleList.onscroll = debounce(() => {
      this.scrollTop = articleList.scrollTop // 获取滚顶距离
    }, 50)
  },
  // 被激活执行的生命周期函数
  activated() {
    // 将记录的顶部距离重置给list
    this.$refs['article-list'].scrollTop = this.scrollTop
  }
}
</script>

<style lang="less" scoped>
.article-list-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 90px;
  bottom: 50px;
  overflow-y: auto;
}
</style>
