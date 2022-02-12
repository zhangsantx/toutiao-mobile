<template>
  <div class="update-avatar-container">
    <div class="preview-image-warp"><img class="preview-image" ref="preview-image" :src="image" alt="" /></div>
    <van-nav-bar class="toolbar" left-text="取消" right-text="确认" @click-left="$emit('close')" @click-right="onConfirm"></van-nav-bar>
  </div>
</template>

<script>
import { updateUserPhoto } from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
export default {
  name: 'UpdateAvatar',
  props: {
    file: {
      required: true
    }
  },
  data() {
    return {
      image: window.URL.createObjectURL(this.file), // 预览图片
      cropper: null // 裁切器实例
    }
  },
  mounted() {
    if (this.cropper) {
      this.cropper.replace(this.previewImage)
      return
    }

    // 获取图片DOM
    const image = this.$refs['preview-image']
    // 初始化裁切器()
    // 注意：第一次初始化完成之后，预览裁切的图片发生变化时，裁切器默认不会更新(一直显示第一次的图片)，解决方式：1.调用.replace()方法 2.销毁裁切器 .destroy()，重新初始化
    this.cropper = new Cropper(image, {
      // aspectRatio 裁切器比例 1/1 可以直接写 1
      // aspectRatio: 1 / 1
      aspectRatio: 1,
      //  viewMode: 1 限制裁切框不超出图片
      viewMode: 1,
      // 是否允许图片拖动 none/move
      dragMode: 'move',
      // 是否显示像素背景
      background: false
    })
  },
  methods: {
    // 获取裁切后的图片
    getCroppedCanvas() {
      return new Promise((resolve) => {
        this.cropper.getCroppedCanvas().toBlob((blob) => {
          resolve(blob)
        })
      })
    },
    // 修改头像
    async onConfirm() {
      this.$toast.loading({
        message: '保存中...',
        forbidclick: true,
        duration: 0 // 持续展示
      })

      const file = await this.getCroppedCanvas()

      // 如果要求Content-Type的multipart/form-data，则需要提交FormData数据对象
      const fd = new FormData()
      // fd.append('photo', 文件对象)
      fd.append('photo', file)

      const { data } = await updateUserPhoto(fd)

      // 关闭弹出层
      this.$emit('close')
      // 更新父组件视图
      this.$emit('update-avatar', data.data.photo)

      this.$toast.success({
        message: '保存成功',
        forbidclick: true
      })
    }
  }
}
</script>
0

<style lang="less" scoped>
.update-avatar-container {
  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: unset;
  }
  .preview-image-warp {
    margin-top: 20px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    .preview-image {
      display: block;
      max-width: 100%;
    }
  }
}
</style>
