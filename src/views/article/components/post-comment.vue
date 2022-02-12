<template>
  <div class="post-comment-container">
    <van-field v-model="message" rows="2" autofocus autosize type="textarea" maxlength="50" placeholder="请输入评论" show-word-limit />
    <van-button class="send-btn" type="info" size="small" :disabled="!message" @click="onPost">发布</van-button>
  </div>
</template>

<script>
import { addComment } from '@/api/comment'
import { getCurrentUser } from '@/api/user'

export default {
  name: 'PostComment',
  props: {
    target: {
      type: [Number, String, Object],
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      default: null
    }
  },
  data() {
    return {
      message: ''
    }
  },
  methods: {
    // 发布评论
    async onPost() {
      const { data } = await addComment({
        target: this.target.toString(), // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
        content: this.message, // 评论内容
        art_id: this.articleId ? this.articleId.toString() : null // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
      })
      // 获取登录用户信息
      const user = await getCurrentUser()
      // 最新评论内容
      const newComment = {
        com_id: data.data.com_id.toString(),
        aut_id: user.data.data.id,
        pubdate: Date.now(),
        content: this.message,
        is_top: 0,
        aut_name: user.data.data.name,
        aut_photo: user.data.data.photo,
        like_count: 0,
        reply_count: 0,
        is_liking: false
      }
      // 清空输入框
      this.message = ''
      this.$emit('post-success', newComment)
    }
  }
}
</script>

<style lang="less" scoped>
.post-comment-container {
  display: flex;
  align-items: center;
  .send-btn {
    min-width: 60px;
    margin-right: 10px;
  }
}
</style>
