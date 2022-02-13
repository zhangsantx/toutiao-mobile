<template>
  <div class="user-chat-container">
    <!-- 导航栏 -->
    <van-nav-bar title="小智同学" left-arrow @click-left="$router.back()" />
    <!-- /导航栏 -->

    <!-- 消息列表 -->
    <van-cell-group class="message-list" ref="messages-list">
      <!-- <van-cell v-for="(item, index) in messages" :key="index" :title="item.msg" /> -->
      <div class="message-item" :class="{ reverse: item.userId === currentUser.id }" v-for="(item, index) in messages" :key="index">
        <van-image class="avatar" round fit="cover" :src="item.photo" />
        <div class="msg-wrap" style="flex: 1">
          <div class="title">{{ item.msg }}</div>
        </div>
      </div>
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
import { mapState } from 'vuex'
import { getUserProfile } from '@/api/user'

export default {
  name: 'UserChat',
  data() {
    return {
      message: '',
      socket: null, // socket通讯对象
      messages: getItem('toutiao-chat-messages') || [], // 消息列表
      currentUser: {} // 当前登录用户
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created() {
    this.loadCurrentUserProfile()
    // 建立连接
    const socket = io('http://toutiao.itheima.net', {
      query: {
        token: this.user.token // 用户token
      },
      transports: ['websocket']
    })
    this.socket = socket
    // 监听事件
    // socket.on('connect', () => {
    //   console.log('连接成功')
    // })
    // socket.on('disconnect', () => {
    //   console.log('连接已断开')
    // })

    // 监听接收消息
    socket.on('message', (data) => {
      data.photo = 'https://z3.ax1x.com/2021/11/14/I6gy5D.jpg'
      this.messages.push(data)
    })
  },
  mounted() {
    // 初始化调用滚动到底部，保证第一次打开消息过多时滚动到底部
    this.scrollToBottom()
  },
  methods: {
    // 获取当前登录用户资料
    async loadCurrentUserProfile() {
      // 判断是否登录
      if (this.user) {
        const { data } = await getUserProfile()
        this.currentUser = data.data
      }
    },
    // 发送消息
    onSend() {
      // 发送消息
      // const data = {
      //   msg: this.message,
      //   timestamp: Date.now()
      // }
      console.log(this.user)
      const data = {
        msg: this.message,
        timestamp: Date.now(),
        userId: this.currentUser.id,
        photo: this.currentUser.photo
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
    // 消息列表
    .message-item {
      display: flex;
      flex-flow: row nowrap; // flex-flow 属性是 flex-direction 和 flex-wrap 属性的复合属性 row 水平显示 nowarp 不换行
      align-items: flex-start; // 从头开始排列
      padding: 10px;
      .msg-wrap {
        word-break: break-all; // word-break 属性规定自动换行的处理方法允许在单词内换行。
        word-wrap: break-word; // break-word 在长单词或 URL 地址内部进行换行。
      }
      .title {
        display: table; // 此元素会作为块级表格来显示（类似 <table>），表格前后带有换行符。
        background: #e0effb;
        border-radius: 6px;
        font-size: 14px;
        padding: 10px 10px;
        margin-right: 45px;
      }
      .avatar {
        width: 40px;
        height: 40px;
        margin-right: 5px;
      }
    }
    // 反转样式
    .reverse {
      flex-direction: row-reverse; // 与 row 相同，但是以相反的顺序。
      .msg-wrap {
        display: flex;
        flex-direction: row-reverse;
        .title {
          margin-right: 5px;
          margin-left: 45px;
        }
      }
    }
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
