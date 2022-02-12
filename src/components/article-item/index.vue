<template>
  <div class="article-item-container">
    <van-cell
      class="article-item"
      :to="{
        name: 'article',
        params: {
          articleId: article.art_id
        }
      }"
    >
      <div slot="title">
        <div class="title van-multi-ellipsis--l2">{{ article.title }}</div>
      </div>
      <div slot="label">
        <div class="cover-warp" v-if="article.cover.type === 3">
          <!-- 三图封面 -->
          <div class="cover-warp-item" v-for="cover in article.cover.images" :key="cover.id">
            <van-image class="cover-item" fit="cover" :src="cover">
              <template v-slot:loading>
                <van-loading type="spinner" size="20" />
              </template>
              <template v-slot:error>加载失败</template>
            </van-image>
          </div>
        </div>
        <div class="label-warp">
          <span>{{ article.aut_name }}</span>
          <span>{{ article.comm_count }}评论</span>
          <span>{{ article.pubdate | relativeTime }}</span>
          <span class="close-item-btn"><van-icon name="ellipsis" /></span>
        </div>
      </div>
      <!-- 单图封面 -->
      <div slot="default" v-if="article.cover.type === 1">
        <van-image class="cover-one" fit="cover" :src="article.cover.images[0]">
          <template v-slot:loading>
            <van-loading type="spinner" size="20" />
          </template>
          <template v-slot:error>加载失败</template>
        </van-image>
      </div>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'ArticleItem',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped>
.article-item-container {
  .article-item {
    padding-bottom: 25px;
    border-bottom: 1px solid #edeff3;
  }
  .title {
    font-size: 16px;
    color: #3a3a3a;
    margin-bottom: 12px;
  }
  .van-cell__value {
    flex: unset;
    width: 116px;
    height: 73px;
    margin-left: 12px;
  }
  .cover-warp {
    display: flex;
    flex-wrap: nowrap;
    // padding-top: 15px;
    margin-bottom: 15px;
    .cover-warp-item {
      flex: 1;
      height: 73px;
      // &:nth-child(-n + 2) {
      //   margin-right: 2px;
      // }
      &:not(:last-child) {
        margin-right: 2px;
      }
      .cover-item {
        width: 100%;
        height: 73px;
      }
    }
  }
  .cover-one {
    width: 116px;
    height: 73px;
  }
  .label-warp {
    font-size: 11px;
    color: #b4b4b4;
    position: absolute;
    left: 16px;
    bottom: 5px;
    width: 100%;
    span {
      &:not(:last-child) {
        margin-right: 12px;
      }
    }
    .close-item-btn {
      position: absolute;
      top: 0;
      right: 28px;
    }
  }
  .van-cell__label {
  }
}
</style>
