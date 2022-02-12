<template>
  <div class="comment-item-container">
    <van-cell>
      <van-image class="avatar" slot="icon" round fit="cover" :src="comment.aut_photo" />
      <div slot="title">
        <div class="title-warp">
          <div class="name">{{ comment.aut_name }}</div>
          <div class="like-warp" @click="onCommentLike">
            <van-icon class="like-icon" :name="comment.is_liking ? 'good-job' : 'good-job-o'" :color="comment.is_liking ? '#ee0a24' : ''" />
            <span v-show="comment.like_count > 0" class="like-count">{{ comment.like_count }}</span>
          </div>
        </div>
        <div class="content">{{ comment.content }}</div>
        <div class="pubdate-warp">
          <span class="pubdate">{{ comment.pubdate | datetime('DD-MM HH:mm') }}</span>
          <van-button v-show="isShowReply" class="reply-btn" round size="mini" @click="$emit('reply-click', comment)"
            >{{ comment.reply_count > 0 ? comment.reply_count : '' }}回复</van-button
          >
        </div>
      </div>
    </van-cell>
  </div>
</template>

<script>
import { addCommentLike, deleteCommentLike } from '@/api/comment'
export default {
  name: 'CommentItem',
  props: {
    comment: {
      type: Object,
      required: true
    },
    // 是否显示回复按钮
    isShowReply: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  methods: {
    // 点赞/取消点赞评论
    async onCommentLike() {
      // 判断点赞情况  已点赞--取消点赞  未点赞--添加点赞
      if (this.comment.is_liking) {
        // 已点赞--取消点赞
        await deleteCommentLike(this.comment.com_id.toString())
        this.comment.like_count--
      } else {
        // 未点赞--添加点赞
        await addCommentLike(this.comment.com_id.toString())
        this.comment.like_count++
      }
      // 更新视图
      this.comment.is_liking = !this.comment.is_liking
    }
  }
}
</script>

<style lang="less" scoped>
.comment-item-container {
  .avatar {
    width: 35px;
    height: 35px;
    margin-right: 14px;
  }
  .title-warp {
    display: flex;
    justify-content: space-between;
    .name {
      font-size: 14px;
      color: #406599;
    }
    .like-icon {
      font-size: 15px;
      color: #000;
    }
    .like-count {
      font-size: 9px;
      color: #000;
    }
  }

  .content {
    font-size: 16px;
    color: #222222;
    overflow: hidden;
  }
  .pubdate-warp {
    display: flex;
    align-items: center;
    .pubdate {
      font-size: 10px;
      color: #222222;
      margin-right: 10px;
    }
    .reply-btn {
      min-width: 60px;
      height: 24px;
      font-size: 11px;
      color: #222222;
      background-color: #f4f5f6;
    }
  }
}
</style>
