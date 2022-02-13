<template>
  <div class="login-container">
    <van-nav-bar title="登录 / 注册" left-arrow @click-left="$router.back()" />
    <!-- 登录表单 -->
    <van-form :show-error-message="false" :show-error="false" validate-first ref="login-form" @submit="onLogin" @failed="onFiled">
      <van-cell-group>
        <van-field
          class="text-mobile"
          v-model="user.mobile"
          icon-prefix="toutiao"
          left-icon="shouji"
          placeholder="请输入手机号"
          name="mobile"
          :rules="formRules.mobile"
        />
        <van-field v-model="user.code" icon-prefix="toutiao" clearable left-icon="yanzhengma" placeholder="请输入验证码" name="code" :rules="formRules.code">
          <template #button>
            <van-button v-if="!isShowCountDown" class="send-btn" border size="mini" type="info" round :loading="isSendSmsLoading" @click.prevent="onSendSms"
              >获取验证码</van-button
            >
            <van-button v-else class="send-btn-countdown" border size="mini" type="default" round disabled>
              <van-count-down :time="1000 * 60" format="sss后重新获取" @finish="isShowCountDown = false" />
            </van-button>
          </template>
        </van-field>
      </van-cell-group>
      <div class="login-btn-warp">
        <van-button type="info" block class="login-btn">登录</van-button>
      </div>
    </van-form>
    <div class="clause-warp">
      <span class="clause-info">隐私政策</span>
    </div>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
export default {
  name: 'LoginIndex',
  data() {
    return {
      user: {
        mobile: '13911111111', // 手机号
        code: '246810' // 验证码
      },
      formRules: {
        mobile: [
          { required: true, message: '请输入手机号' },
          { pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/, message: '手机号格式错误' }
        ],
        code: [
          { required: true, message: '请输入验证码' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      },
      isShowCountDown: false, // 控制倒计时和发送验证码按钮状态
      isSendSmsLoading: false // 控制发送验证码按钮的loading状态
    }
  },
  methods: {
    // 用户登录
    async onLogin() {
      // 开启loading
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      try {
        const { data } = await login(this.user)
        // 登录成功
        this.$toast.success('登录成功')
        // 存储用户登录状态token等数据报错到vuex中
        console.log(data.data)
        this.$store.commit('setUser', data.data)

        // 移除layout页面缓存，重新渲染
        this.$store.commit('removeCachePage', 'LayoutIndex')

        // 跳转原来的页面(临时解决方案)
        // this.$router.back()
        this.$router.push(this.$route.query.redirect || '/')
      } catch (err) {
        // 登录失败
        this.$toast({
          message: '手机号或验证码错误',
          position: 'top'
        })
      }
    },
    // 表单验证失败
    onFiled(err) {
      if (err.errors[0]) {
        this.$toast({
          message: err.errors[0].message,
          position: 'top'
        })
      }
    },
    // 获取验证码
    async onSendSms() {
      // 校验手机号
      try {
        await this.$refs['login-form'].validate('mobile')
        // 验证成功
        // 开启loading
        this.isSendSmsLoading = true
        await sendSms(this.user.mobile)
        this.isShowCountDown = true
        this.$toast({
          message: '验证码发送成功，请注意查收',
          position: 'top'
        })
      } catch (err) {
        // 验证失败
        let message = ''
        if (err && err.response && err.response.status === 429) {
          // 验证码发送频繁
          message = '操作太频繁了，请稍后重试'
        } else if (err.name === 'mobile') {
          // 手机号校验失败
          message = err.message
        } else {
          // 未知错误
          message = '验证码发送失败'
        }
        this.$toast({
          message,
          position: 'top'
        })
      }
      // 关闭loading
      this.isSendSmsLoading = false
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  position: relative;
  height: 100vh;
  .login-btn-warp {
    padding: 26px 16px;
    .login-btn {
      border: none;
      border-radius: 5px;
      .van-button__text {
        font-size: 15px;
      }
    }
  }
  .text-mobile {
    padding-left: 0;
    padding-right: 0;
    margin: 0 15px;
    width: 92%;
    border-bottom: 1px solid #eee;
  }
  .send-btn {
    position: relative;
    height: 23px;
    min-width: 76px;
    font-size: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .send-btn-countdown {
    background-color: #ededed;
    display: flex;
    align-items: center;
    justify-content: center;
    .van-count-down {
      font-size: 11px;
      color: #666666;
    }
  }
  .clause-warp {
    .clause-info {
      position: absolute;
      bottom: 27px;
      left: 50%;
      transform: translateX(-50%);
      color: #666;
      font-size: 12px;
    }
  }
}
</style>
