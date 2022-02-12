<template>
  <div class="update-name-container">
    <van-nav-bar title="修改昵称" left-text="取消" @click-left="$emit('close')">
      <div slot="right">
        <van-button class="save-btn" :disabled="name !== localName.trim() ? false : true" @click="onSaveName">保存</van-button>
      </div>
    </van-nav-bar>
    <van-field class="username-dialog" v-model="localName" autofocus placeholder="请输入昵称" maxlength="7" show-word-limit />
    <!-- <span class="notice"> 请设置1-7个字符，好的昵称更容易让人记住哦 </span> -->
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateName',
  props: {
    name: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      localName: this.name
    }
  },
  methods: {
    // 保存昵称
    async onSaveName() {
      this.$toast.loading({
        message: '保存中...',
        forbidclick: true,
        duration: 0 // 持续展示
      })
      try {
        await updateUserProfile({
          name: this.localName // 昵称
        })

        // 关闭弹出层
        this.$emit('close')
        // 更新父组件视图
        this.$emit('update-name', this.localName)

        this.$toast.success({
          message: '保存成功',
          forbidclick: true
        })
      } catch (err) {
        if (err && err.response && err.response.status === 409) {
          this.$toast('该昵称已存在')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.update-name-container {
  /deep/.van-nav-bar {
    background-color: unset;
    .van-nav-bar__title {
      color: #333;
    }
    .van-nav-bar__left {
      .van-nav-bar__text {
        color: #6e6e6e;
      }
    }
    .save-btn {
      background-color: unset;
      border: none;
      width: 60px;
      position: absolute;
      top: 0px;
      right: 0;
      color: #3296fa;
      font-size: 15px;
    }
  }
  .username-dialog {
    padding-bottom: 0;
    /deep/.van-field__body {
      height: 35px;
      font-size: 15px;
      border-bottom: 1px solid #dcdfe6;
      padding: 0 10px;
    }
    /deep/.van-field__word-limit {
      position: absolute;
      top: 10px;
      right: 8px;
      margin-top: 0;
    }
  }
  // .notice {
  //   font-size: 13px;
  //   color: #e0e0e0;
  //   margin-left: 15px;
  // }
}
</style>
