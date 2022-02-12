<template>
  <div class="update-birth-container">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择你的生日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'

export default {
  name: 'UpdateBirth',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      minDate: new Date(1980, 0, 1), // 可选最小时间
      maxDate: new Date(), // 可选最大时间(截止到当前)
      // maxDate: new Date(2050, 0, 1), // 可选最大时间(截止到当前)
      currentDate: new Date(this.value) // 当前选中时间
    }
  },
  methods: {
    // 修改生日
    async onConfirm() {
      this.$toast.loading({
        message: '保存中...',
        forbidclick: true,
        duration: 0 // 持续展示
      })

      const date = dayjs(this.currentDate).format('YYYY-MM-DD')

      await updateUserProfile({
        birthday: date // 生日
      })
      // 关闭弹出层
      this.$emit('close')
      // 更新父组件视图
      this.$emit('input', date)

      this.$toast.success({
        message: '保存成功',
        forbidclick: true
      })
    }
  }
}
</script>

<style lang="less" scoped>
.update-birth-container {
  /deep/.van-picker__confirm {
    color: #3296fa;
  }
}
</style>
