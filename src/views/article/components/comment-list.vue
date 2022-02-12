<template>
  <div class="comment-list-container">
    <van-cell :title="title"></van-cell>
    <!-- <div>暂无评论</div> -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <comment-item
        :is-show-reply="type === 'c' ? false : true"
        v-for="(comment, index) in list"
        :key="index"
        :comment="comment"
        @reply-click="$emit('reply-click', $event)"
      />
    </van-list>
  </div>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item'
export default {
  name: 'CommentList',
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    type: {
      type: String,
      default: 'a'
    },
    list: {
      type: Array,
      default: () => []
    },
    // 组件标题
    title: {
      type: String,
      default: '全部评论'
    }
  },
  data() {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null, // 获取下一页数据的页码
      limit: 10 // 每页条数
    }
  },
  methods: {
    async onLoad() {
      const { data } = await getComments({
        type: this.type, // a或c 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
        source: this.source.toString(), // 源id，文章id或评论id
        offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
        limit: this.limit // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
      })
      // 将评论总数传递给父组件
      this.$emit('total-count', data.data.total_count)

      const { results } = data.data
      this.list.push(...results)
      // 加载状态结束
      this.loading = false

      // 判断是否还有下一页数据 有--加载下一页数据 无--结束加载
      if (results.length) {
        // 有下一页
        this.offset = data.data.last_id
      } else {
        // 无下一页
        this.finished = true
      }
    }
  },
  components: {
    CommentItem
  }
}
</script>

<style lang="less" scoped>
.comment-list-container {
}
</style>
