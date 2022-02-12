<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar left-arrow @click-left="$router.back()">
      <div slot="right">
        <van-icon class="more" name="ellipsis" />
      </div>
    </van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-warp">
      <h1 class="title">{{ article.title }}</h1>
      <van-cell center class="user-info">
        <van-image class="avatar" slot="icon" round fit="cover" :src="article.aut_photo" />
        <div class="name" slot="title">{{ article.aut_name }}</div>
        <div class="pubdate" slot="label">{{ article.pubdate | relativeTime }}</div>
        <van-button
          v-show="!isSelf"
          class="follow-btn"
          :icon="article.is_followed ? '' : 'plus'"
          :plain="article.is_followed"
          round
          size="small"
          type="info"
          :loading="isFollowLoading"
          :disabled="isFollowLoading"
          loading-type="spinner"
          @click="onFollow"
          >{{ article.is_followed ? '已关注' : '关注' }}</van-button
        >
      </van-cell>

      <!-- 文章正文 -->
      <div class="content markdown-body" ref="article-content" v-html="article.content"></div>
      <!-- /文章正文 -->

      <!-- 文章评论列表 -->
      <comment-list :source="this.articleId" :list="commentList" @total-count="totalCount = $event" @reply-click="onReplyCilck"></comment-list>
      <!-- /文章评论列表 -->
    </div>

    <!-- 底部区域 -->
    <div class="article-bottom">
      <van-button class="comment-btn" round @click="isShowPostPopup = true">写评论</van-button>
      <div class="btns-warp">
        <van-icon name="chat-o" :badge="totalCount > 0 ? totalCount : ''" />
        <van-icon :name="article.attitude === 1 ? 'good-job' : 'good-job-o'" :color="article.attitude === 1 ? '#ee0a24' : ''" @click="onLike" />
        <van-icon :name="article.is_collected ? 'star' : 'star-o'" :color="article.is_collected ? '#ff8344' : ''" @click="onCollect" />
        <van-icon name="guide-o" />
      </div>
    </div>
    <!-- /底部区域 -->

    <!-- 发布评论 -->
    <van-popup v-model="isShowPostPopup" position="bottom">
      <post-comment :target="articleId" @post-success="onPostSuccess"></post-comment>
    </van-popup>
    <!-- /发布评论 -->

    <!-- 回复评论 -->
    <van-popup class="reply-warp" v-model="isShowReplyPopup" closeable close-icon-position="top-left" position="bottom">
      <comment-reply v-if="isShowReplyPopup" :comment="replyComment" :article-id="articleId"></comment-reply>
    </van-popup>
    <!-- /回复评论 -->
  </div>
</template>

<script>
import './github-markdown.css'
import { getArticleInfo, addCollect, deleteCollect, addLike, deleteLike } from '@/api/article'
import { ImagePreview } from 'vant'
import { addFollow, deleteFollow, getCurrentUser } from '@/api/user'
import CommentList from './components/comment-list'
import PostComment from './components/post-comment'
import CommentReply from './components/comment-reply'

export default {
  name: 'ArticleIndex',
  props: {
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  },
  data() {
    return {
      article: {}, // 文章详情
      isFollowLoading: false, // 关注用户按钮loading
      isCollectLoading: false, // 收藏文章按钮loading
      isLikeLoading: false, // 点赞文章按钮loading
      isSelf: false, // 控制关注按钮的显示，未用户本人则不显示
      isShowPostPopup: false, // 发布评论弹出层是否显示
      isShowReplyPopup: false, // 回复评论弹出层是否显示
      commentList: [], // 文章评论列表
      totalCount: 0, // 文章评论总数
      replyComment: {} // 当前点击评论项
    }
  },
  created() {
    this.loadAricleInfo()
  },
  methods: {
    // 获取文章信息
    async loadAricleInfo() {
      const { data } = await getArticleInfo(this.articleId)
      this.article = data.data

      // 如果文章用户为当前用户本人则不显示关注按钮
      this.isCurrentUser()

      this.$nextTick(() => {
        this.handelPreviewImg()
      })
    },
    // 判断文章作者是否为登录用户
    async isCurrentUser() {
      // 获取当前登录用户信息
      const { data } = await getCurrentUser()
      if (this.article.aut_id === data.data.id) {
        this.isSelf = true
      }
    },
    // 图片预览
    handelPreviewImg() {
      // 获取DOM容器
      const articleContent = this.$refs['article-content']
      // 注意：此处无法直接获取图片，因为页面可能还没渲染完成，获取的结果为空，需要结合$nextTick使用
      const imgs = articleContent.querySelectorAll('img')
      const imgPaths = []

      imgs.forEach((img, index) => {
        imgPaths.push(img.src)
        img.onclick = function () {
          // 调用图片预览
          ImagePreview({
            images: imgPaths, // 预览图片列表
            startPosition: index // 起始位置
          })
        }
      })
    },
    // 关注/取消关注
    async onFollow() {
      // 判断关注情况  已关注--取消关注  未关注--添加关注
      // 开启loading
      this.isFollowLoading = true
      if (this.article.is_followed) {
        // 已关注--取消关注
        this.$dialog
          .confirm({
            title: '取消关注',
            message: '确认要取消关注吗？'
          })

          .then(async () => {
            // on confirm
            await deleteFollow(this.article.aut_id)
          })
          .catch(() => {
            // on cancel
            this.article.is_followed = true
          })
      } else {
        // 未关注--添加关注
        try {
          await addFollow(this.article.aut_id)
        } catch (error) {
          console.log(error.data.status)
        }
      }
      // 更新视图
      this.article.is_followed = !this.article.is_followed
      // 关闭loading
      this.isFollowLoading = false
    },
    // 收藏/取消收藏
    async onCollect() {
      // 判断收藏情况  已收藏--取消收藏  未收藏--添加收藏
      // 开启loading
      this.isCollectLoading = true
      if (this.article.is_collected) {
        // 已收藏--取消收藏
        await deleteCollect(this.article.art_id)
      } else {
        // 未收藏--添加收藏
        await addCollect(this.article.art_id)
      }
      // 更新视图
      this.article.is_collected = !this.article.is_collected
      this.$toast.success(this.article.is_collected ? '收藏成功' : '已取消')
      // 关闭loading
      this.isCollectLoading = false
    },
    // 点赞/取消点赞
    async onLike() {
      // 判断点赞情况  已点赞--取消点赞  未点赞--添加点赞
      // 开启loading
      this.isLikeLoading = true
      if (this.article.attitude === 1) {
        // 已点赞--取消点赞
        await deleteLike(this.article.art_id)
        // 更新视图
        this.article.attitude = -1
      } else {
        // 未点赞--添加点赞
        await addLike(this.article.art_id)
        // 更新视图
        this.article.attitude = 1
      }
      // 关闭loading
      this.isLikeLoading = false
    },
    // 评论发布成功
    onPostSuccess(comment) {
      // 更新视图
      this.commentList.unshift(comment)
      // 更新评论总数量
      this.totalCount++
      // 关闭弹出层
      this.isShowPostPopup = false
    },
    // 点击评论回复按钮
    async onReplyCilck(comment) {
      // 存放点击的评论项
      this.replyComment = comment
      // 显示评论回复
      this.isShowReplyPopup = true
    }
  },
  components: {
    CommentList,
    PostComment,
    CommentReply
  }
}
</script>

<style lang="less" scoped>
.article-container {
  .more {
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .main-warp {
    position: fixed;
    top: 46px;
    bottom: 45px;
    left: 0;
    right: 0;
    overflow-y: auto;
    .title {
      font-size: 20px;
      color: #3a3a3a;
      padding: 10px 14px;
      margin: 0;
      background-color: #fff;
    }
    .user-info {
      .avatar {
        width: 35px;
        height: 35px;
        margin-right: 8px;
      }
      .name {
        font-size: 14px;
        color: #333;
      }
      .pubdate {
        font-size: 10px;
        color: #b4b4b4;
      }
      .follow-btn {
        min-width: 85px;
        height: 29px;
      }
    }
    .content {
      padding: 14px;
      background-color: #fff;
    }
  }

  .article-bottom {
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
      width: 200px;
      height: 25px;
      font-size: 13px;
      color: #a7a7a7;
      .van-button__content {
        justify-content: left;
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
  .reply-warp {
    padding-bottom: 45px;
  }
}
</style>
