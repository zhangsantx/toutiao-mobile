<template>
  <div class="comment-reply-container">
    <!-- 头部信息 -->

    <div class="title-header">{{ comment.reply_count }}条回复</div>
    <!-- /头部信息 -->

    <!-- 当前评论项 -->
    <comment-item :is-show-reply="false" :comment="comment" />
    <!-- /当前评论项 -->

    <!-- 所有回复列表 -->
    <!-- <van-cell title="所有回复"></van-cell> -->
    <comment-list :source="comment.com_id" type="c" :list="commentList" title="全部回复"></comment-list>
    <!-- /所有回复 -->

    <!-- 底部区域 -->
    <div class="comment-reply">
      <van-button class="comment-btn" round @click="isShowPostPopup = true">写回复</van-button>
    </div>
    <!-- /底部区域 -->

    <!-- 发布回复 -->
    <van-popup v-model="isShowPostPopup" position="bottom">
      <post-comment :target="comment.com_id" :articleId="articleId" @post-success="onPostSuccess"></post-comment>
    </van-popup>
    <!-- /发布回复 -->
  </div>
</template>

<script>
import CommentItem from './comment-item'
import CommentList from './comment-list'
import PostComment from './post-comment'

export default {
  name: 'CommentReply',
  props: {
    // 查看回复评论项
    comment: {
      type: Object,
      required: true
    },
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  },
  data() {
    return {
      isShowPostPopup: false, // 发布回复弹出层
      commentList: [] // 评论回复列表
    }
  },
  methods: {
    // 发布评论回复成功
    onPostSuccess(comment) {
      // 数组追加
      this.commentList.unshift(comment)
      // 更新评论回复总数
      this.comment.reply_count++
      // 关闭弹出层
      this.isShowPostPopup = false
    }
  },
  components: {
    CommentItem,
    CommentList,
    PostComment
  }
}
</script>

<style lang="less" scoped>
.comment-reply-container {
  .title-header {
    width: 100%;
    height: 45px;
    line-height: 35px;
    text-align: center;
    margin-top: 10px;
    font-size: 16px;
  }
  .comment-reply {
    width: 100%;
    height: 45px;
    background-color: #fff;
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #d8d8d8;
    padding: 0 14px;
    .comment-btn {
      width: 100%;
      height: 30px;
      font-size: 13px;
      color: #a7a7a7;
      .van-button__content {
        justify-content: center;
      }
    }
    .btns-warp {
      .van-icon {
        color: #777777;
        margin-left: 15px;
        font-size: 20px;
      }
    }
  }
}
</style>
