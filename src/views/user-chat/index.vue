<template>
  <div class="user-chat-container">
    <!-- 导航栏 -->
    <van-nav-bar title="小智同学" left-arrow @click-left="$router.back()" />
    <!-- /导航栏 -->

    <!-- 消息列表 -->
    <van-cell-group class="message-list" ref="messages-list">
      <van-cell v-for="(item, index) in messages" :key="index" :title="item.msg" />
    </van-cell-group>
    <!-- /消息列表 -->

    <!-- 发送消息 -->
    <div class="send-message-warp">
      <van-field v-model="message" center placeholder="请输入">
        <template #button>
          <van-button size="small" round type="info" :disabled="message === ''" @click="onSend">发送</van-button>
        </template>
      </van-field>
    </div>
    <!-- /发送消息 -->
  </div>
</template>

<script>
// 引入
import { io } from 'socket.io-client'
import { getItem, setItem } from '@/utils/storage'

export default {
  name: 'UserChat',
  data() {
    return {
      message: '',
      socket: null, // socket通讯对象
      messages: getItem('toutiao-chat-messages') || [] // 消息列表
    }
  },
  created() {
    // 获取用户token
    const user = getItem('user')
    // 建立连接
    const socket = io('http://toutiao.itheima.net', {
      query: {
        token: user.token // 用户token
      },
      transports: ['websocket']
    })
    this.socket = socket
    // 监听事件
    socket.on('connect', () => {
      console.log('连接成功')
    })
    socket.on('disconnect', () => {
      console.log('连接已断开')
    })

    // 监听接收消息
    socket.on('message', (data) => {
      console.log(data)
      this.messages.push(data)
    })
  },
  mounted() {
    // 初始化调用滚动到底部，保证第一次打开消息过多时滚动到底部
    this.scrollToBottom()
  },
  methods: {
    onSend() {
      // 发送消息
      const data = {
        msg: this.message,
        timestamp: Date.now()
      }
      this.socket.emit('message', data)
      this.messages.push(data)

      // 清空输入框
      this.message = ''
    },
    // 滚动到列表底部
    scrollToBottom() {
      const list = this.$refs['messages-list']
      list.scrollTop = list.scrollHeight
    }
  },
  watch: {
    // 监视messages的变化，持久化存储到本地存储中
    messages() {
      setItem('toutiao-chat-messages', this.messages)
      // 避免DOM更新延迟
      this.$nextTick(() => {
        // 滚动到列表底部
        this.scrollToBottom()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.user-chat-container {
  .message-list {
    position: fixed;
    left: 0;
    right: 0;
    top: 46px;
    bottom: 48px;
    overflow-y: auto;
  }
  .send-message-warp {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    /deep/.van-cell {
      padding: 8px 10px;
      background-color: #f7f7f7;
    }
    /deep/.van-button--small {
      width: 55px;
      height: 30px;
    }
    /deep/.van-field__control {
      height: 30px;
      background-color: #fff;
      border-radius: 20px;
      padding: 0 10px;
      margin-top: 2px;
    }
  }
}
</style>
