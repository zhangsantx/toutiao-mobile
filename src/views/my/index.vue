<template>
  <div class="my-container">
    <!-- 登陆状态 -->
    <van-cell-group v-if="user" class="my-info">
      <van-cell center class="base-info" :border="false">
        <div slot="icon">
          <van-image class="avatar" round fit="cover" :src="currentUser.photo" />
        </div>
        <div class="name" slot="title">{{ currentUser.name }}</div>
        <van-button class="edit-btn" size="mini" round to="/user/profile">编辑资料</van-button>
      </van-cell>
      <van-grid :border="false" class="data-info">
        <van-grid-item class="data-info-item">
          <span class="text-warp" slot="text">
            <div class="count">{{ currentUser.art_count }}</div>
            <div class="text">发布</div>
          </span>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <span class="text-warp" slot="text">
            <div class="count">{{ currentUser.follow_count }}</div>
            <div class="text">关注</div>
          </span>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <span class="text-warp" slot="text">
            <div class="count">{{ currentUser.fans_count }}</div>
            <div class="text">粉丝</div>
          </span>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <span class="text-warp" slot="text">
            <div class="count">{{ currentUser.like_count }}</div>
            <div class="text">获赞</div>
          </span>
        </van-grid-item>
      </van-grid>
    </van-cell-group>
    <!-- 未登录状态 -->
    <div v-else class="not-login">
      <div
        @click="
          $router.push({
            name: 'login',
            query: {
              redirect: '/my'
            }
          })
        "
      >
        <img class="avator-no-login" src="./avatar-no-login.png" alt="" />
      </div>
      <div class="text">登录 / 注册</div>
    </div>
    <van-grid class="nav-grid mb-4" :column-num="3">
      <van-grid-item class="nav-grid-item" icon-prefix="toutiao" icon="shoucang" text="收藏" />
      <van-grid-item class="nav-grid-item" icon-prefix="toutiao" icon="lishi" text="历史" />
      <van-grid-item class="nav-grid-item" icon-prefix="toutiao" icon="zuopin" text="作品" />
    </van-grid>
    <van-cell title="消息通知" is-link to="" />
    <van-cell class="mb-4" title="实名认证" is-link to="" />
    <van-cell title="小智同学" is-link to="/user/chat" />
    <van-cell title="用户反馈" is-link to="" />
    <van-cell class="mb-4" title="系统设置" is-link to="" />
    <van-cell v-if="user" class="logout-cell" title="退出登录" @click="onLogout" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getCurrentUser } from '@/api/user'
export default {
  name: 'MyIndex',
  data() {
    return {
      currentUser: {} // 当前登录用户信息
    }
  },
  created() {
    this.loadCurrentUser()
  },
  computed: {
    // 将vuex中的user映射到当前组件中，使用方法同计算属性
    ...mapState(['user'])
  },
  methods: {
    // 退出登录
    onLogout() {
      this.$dialog
        .confirm({
          title: '退出提示',
          message: '确认退出吗？'
        })
        .then(() => {
          // 确认退出
          // 清除用户状态
          // 清空vuex中的user(同时映射到本地存储)
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // 取消退出
        })
    },
    // 获取当前登录用户信息
    async loadCurrentUser() {
      // 判断是否登录
      if (this.user) {
        const { data } = await getCurrentUser()
        this.currentUser = data.data
      }
    }
  }
}
</script>

<style lang="less" scoped>
.my-container {
  .my-info {
    background: url('./banner.png') no-repeat;
    background-size: cover;
    /deep/.van-grid-item__content {
      background-color: unset;
    }
    .base-info {
      height: 115px;
      padding-top: 38px;
      padding-bottom: 11px;
      background-color: unset;
      .avatar {
        width: 66px;
        height: 66px;
        border: 1px solid #fff;
        margin-right: 11px;
      }
      .name {
        color: #fff;
        font-size: 15px;
      }
      .van-cell__value {
        display: flex;
        justify-content: right;
        align-items: center;
      }
      .edit-btn {
        height: 20px;
        color: #666;
        font-size: 10px;
      }
    }
    .data-info {
      .data-info-item {
        height: 65px;
        color: #fff;
        .text-warp {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          .count {
            font-size: 18px;
          }
          .text {
            font-size: 11px;
          }
        }
      }
    }
  }
  .not-login {
    height: 180px;
    background: url('./banner.png') no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .avator-no-login {
      width: 66px;
      height: 66px;
    }
    .text {
      color: #fff;
      font-size: 14px;
    }
  }
  .nav-grid {
    .nav-grid-item {
      height: 70px;
      /deep/.toutiao {
        font-size: 22px;
      }
      /deep/.toutiao-shoucang {
        color: #ee6a6b;
      }
      /deep/.toutiao-lishi {
        color: #ffa836;
      }
      /deep/.toutiao-zuopin {
        color: #1bb6fe;
      }
      .van-grid-item__text {
        font-size: 14px;
        color: #333;
      }
    }
  }
  .logout-cell {
    text-align: center;
    color: #eb3941;
  }
  .mb-4 {
    margin-bottom: 4px;
  }
}
</style>
