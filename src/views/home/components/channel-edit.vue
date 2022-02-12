<template>
  <div class="channel-edit-container">
    <van-cell center :border="false">
      <div class="channel-title" slot="title">
        我的频道<span>{{ isEdit ? '点击移除频道' : '点击进入频道' }}</span>
      </div>
      <van-button class="edit-btn" type="danger" plain round size="mini" @click="isEdit = !isEdit">{{ isEdit ? '完成' : '编辑' }}</van-button>
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item
        :icon="isEdit && index !== 0 ? 'close' : ''"
        class="grid-item van-ellipsis"
        :class="{ active: active === index }"
        v-for="(channel, index) in userChannels"
        :key="channel.id"
        :text="channel.name"
        @click="onUserChannelClick(index, channel)"
      />
    </van-grid>

    <van-cell center :border="false">
      <div class="channel-title" slot="title">频道推荐<span>点击添加频道</span></div>
    </van-cell>
    <van-grid :gutter="10" v-if="recommandChannels.length > 0">
      <van-grid-item
        class="grid-item van-ellipsis"
        v-for="channel in recommandChannels"
        :key="channel.id"
        :text="channel.name"
        @click="onAddChannel(channel)"
      />
    </van-grid>
    <van-cell center :border="false" v-else>
      <div class="channel-empty">暂无数据</div>
    </van-cell>
  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  props: {
    userChannels: {
      type: Array,
      require: true
    },
    active: {
      type: Number,
      require: true
    }
  },
  data() {
    return {
      allChannels: [], // 所有频道列表
      isEdit: false // 控制移除频道icon的显示
    }
  },
  created() {
    this.loadAllChannels()
  },
  methods: {
    // 获取所有频道
    async loadAllChannels() {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
    },
    // 点击用户频道
    onUserChannelClick(index, channel) {
      if (this.isEdit && index > 0) {
        // 编辑状态--删除频道
        // 0为推荐频道，不可删除
        this.onSubChannel(index, channel)
      } else {
        // 非编辑状态，切换频道
        this.switchChannel(index)
      }
    },
    // 添加频道
    async onAddChannel(channel) {
      if (this.isEdit) {
        this.userChannels.push(channel)
        // 数据持久化
        if (!this.user) {
          // 未登录--保存到本地
          setItem('user-channels', this.userChannels)
        } else {
          // 已登录--保存到服务器
          await addUserChannel({
            channels: [
              {
                id: channel.id,
                seq: this.userChannels.length
              }
            ]
          })
        }
      }
    },
    // 移除频道
    async onSubChannel(index, channel) {
      // 当删除激活频道之前的频道时，需要更新索引保证激活的始终为同一个
      if (index <= this.active) {
        // 更新激活频道的索引
        this.$emit('switch-channel', this.active - 1)
      }
      this.userChannels.splice(index, 1)

      // 数据持久化
      if (!this.user) {
        // 未登录--保存到本地
        setItem('user-channels', this.userChannels)
      } else {
        // 已登录--保存到服务器
        await deleteUserChannel(channel.id)
      }
    },
    // 切换频道
    switchChannel(index) {
      // 关闭弹出层
      this.$emit('close')
      // 切换显示的频道列表
      this.$emit('switch-channel', index)
    }
  },
  computed: {
    ...mapState(['user']),
    // 推荐频道
    recommandChannels() {
      // 所有频道 — 用户频道 = 推荐频道
      return this.allChannels.filter((channel) => {
        // 判断当前channel是否属于用户频道
        return !this.userChannels.find((userChannel) => {
          return userChannel.id === channel.id
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.channel-edit-container {
  position: fixed;
  top: 54px;
  left: 0;
  right: 0;
  bottom: 0;
  padding-bottom: 10px;
  overflow-y: auto;
  .channel-title {
    font-size: 16px;
    color: #333;
    span {
      font-size: 12px;
      margin-left: 10px;
      color: #999;
    }
  }
  .edit-btn {
    height: 24px;
    width: 52px;
    font-size: 13px;
  }
  .grid-item {
    width: 80px;
    height: 43px;
    border-radius: 6px;
    /deep/.van-grid-item__content {
      background-color: #f4f5f6;
      border-radius: 6px;
      .van-grid-item__text {
        font-size: 14px;
        color: #222;
        margin-top: 0;
      }
    }
    /deep/.van-grid-item__icon {
      position: absolute;
      top: 1px;
      right: 1px;
      font-size: 16px;
      color: #ccc;
    }
  }
  .active {
    /deep/.van-grid-item__content {
      border: 2px solid #3296fa;
      // background-color: #3296fa;
      .van-grid-item__text {
        color: #3296fa;
        // color: #fff;
      }
    }
  }
  /deep/.van-grid-item__content--surround::after {
    border-width: 0;
  }
  .channel-empty {
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px dashed #999;
    border-radius: 10px;
  }
}
</style>
