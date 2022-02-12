<template>
  <div class="home-container">
    <!-- 顶部搜索框 -->
    <van-nav-bar>
      <template #title>
        <van-button class="search-btn" round icon="search" type="info" to="/search">搜索</van-button>
      </template>
    </van-nav-bar>
    <!-- /顶部搜索框 -->

    <!-- 文章频道列表 -->
    <van-tabs class="channel-tabs" v-model="active" color="#3296fa" swipeable>
      <van-tab v-for="channel in channels" :key="channel.id" :title="channel.name">
        <!-- 文章列表 -->
        <article-list :channel="channel" />
        <!-- /文章列表 -->
      </van-tab>
      <!-- 编辑频道 -->
      <div class="wap-nav-warp" slot="nav-right" @click="isShowChannelEdit = true">
        <van-icon name="wap-nav" />
      </div>
      <!-- 占位元素，防止挡住正常的文档流 -->
      <div class="wap-nav-placeholder" slot="nav-right"></div>
    </van-tabs>
    <!-- /文章频道列表 -->

    <!-- 频道编辑弹出层 -->
    <van-popup
      class="channel-edit-popup"
      v-model="isShowChannelEdit"
      position="bottom"
      closeable
      round
      close-icon-position="top-left"
      :overlay="false"
      get-container="body"
    >
      <channel-edit :user-channels="channels" :active="active" @close="isShowChannelEdit = false" @switch-channel="active = $event"></channel-edit>
    </van-popup>
    <!-- /频道编辑弹出层 -->
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
import { getItem } from '@/utils/storage'
import { mapState } from 'vuex'

export default {
  name: 'HomeIndex',
  data() {
    return {
      active: 0, // 控制激活的标签
      channels: [], // 频道列表
      isShowChannelEdit: false // 控制频道编辑弹出层的显示
    }
  },
  created() {
    this.loadChannels()
  },
  methods: {
    // 获取频道数据
    async loadChannels() {
      let channels = []
      // 判断用户是否登录
      if (!this.user) {
        // 未登录--首先读取本地存储中是否有频道列表，有则显示本地存储中的频道，若无则获取默认推荐的频道列表
        const loaclChannels = getItem('user-channels')
        if (loaclChannels) {
          // 有频道数据--显示本地存储中的频道
          channels = loaclChannels
        } else {
          // 无频道数据--获取默认推荐的频道列表
          const { data } = await getUserChannels()
          channels = data.data.channels
        }
      } else {
        // 已登录--获取用户频道信息
        const { data } = await getUserChannels()
        channels = data.data.channels
      }
      this.channels = channels
    }
  },
  components: {
    ArticleList,
    ChannelEdit
  },
  computed: {
    ...mapState(['user'])
  }
}
</script>

<style lang="less" scoped>
.home-container {
  /deep/.van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 277px;
    height: 32px;
    background-color: #5babfb;
    .van-icon {
      font-size: 18px;
    }
    .van-button__text {
      font-size: 14px;
    }
  }
  .channel-tabs {
    /deep/.van-tabs__wrap {
      border-bottom: 1px solid #edeff3;
    }
    /deep/.van-tab {
      min-width: 96px;
      font-size: 14px;
      color: #777777;
      &:not(:last-child) {
        border-right: 1px solid #edeff3;
      }
    }
    /deep/.van-tab--active {
      font-size: 15px;
      color: #333333;
    }
    /deep/.van-tabs__line {
      bottom: 19px;
      width: 30px;
    }
  }
  .wap-nav-warp {
    position: fixed;
    right: 0;
    height: 43px;
    width: 33px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(255, 255, 255, 0.9);
    font-size: 23px;
    &::before {
      content: '';
      width: 1px;
      height: 29px;
      background: url('./line.png') no-repeat;
      background-size: contain;
      position: absolute;
      top: 6px;
      left: 0;
    }
  }
  .wap-nav-placeholder {
    width: 24px;
    // 固定宽度 不参与flex平分宽度
    flex-shrink: 0;
  }
}
</style>
