<template>
  <div class="update-gender-container">
    <van-picker
      title="选择你的性别"
      show-toolbar
      :default-index="defaultIndex"
      :columns="columns"
      @cancel="$emit('close')"
      @confirm="onConfirm"
      @change="onGenderChange"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'

export default {
  name: 'UpdateGender',
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      defaultIndex: this.value,
      columns: ['男', '女']
    }
  },
  methods: {
    onGenderChange(picker, value, index) {
      this.defaultIndex = index
    },
    // 修改性别
    async onConfirm() {
      this.$toast.loading({
        message: '保存中...',
        forbidclick: true,
        duration: 0 // 持续展示

      })
      await updateUserProfile({
        gender: this.defaultIndex // 性别
      })
      // 关闭弹出层
      this.$emit('close')
      // 更新父组件视图
      this.$emit('input', this.defaultIndex)

      this.$toast.success({
        message: '保存成功',
        forbidclick: true
      })
    }
  }
}
</script>

<style lang="less" scoped>
.update-gender-container {
  /deep/.van-picker__confirm {
    color: #3296fa;
  }
}
</style>
