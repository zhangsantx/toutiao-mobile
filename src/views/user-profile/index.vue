<template>
  <div class="user-profile-container">
    <van-nav-bar title="个人信息" left-arrow @click-left="$router.back()" />
    <input type="file" accept="iamge/*" ref="updateAvatar" hidden @change="onFileChange" />
    <van-cell title="头像" center is-link to="" @click="$refs.updateAvatar.click()">
      <div slot="default">
        <van-image fit="cover" width="35" height="35" round :src="user.photo" />
      </div>
    </van-cell>
    <van-cell title="昵称" is-link to="" :value="user.name" @click="isShowEditName = true" />
    <van-cell title="性别" is-link to="" :value="user.gender === 0 ? '男' : user.gender === 1 ? '女' : '未知'" @click="isShowEditGender = true" />
    <van-cell title="生日" is-link to="" :value="user.birthday" @click="isShowEditBirth = true" />

    <!-- 修改用户名弹出层 -->
    <van-popup v-model="isShowEditName" position="bottom" :style="{ height: '100%' }">
      <update-name v-if="isShowEditName" :name="user.name" @update-name="user.name = $event" @close="isShowEditName = false" />
    </van-popup>
    <!-- /修改用户名弹出层 -->

    <!-- 修改性别弹出层 -->
    <van-popup v-model="isShowEditGender" round position="bottom">
      <update-gender v-if="isShowEditGender" v-model="user.gender" @close="isShowEditGender = false" />
    </van-popup>
    <!-- /修改性别弹出层 -->

    <!-- 修改性别弹出层 -->
    <van-popup v-model="isShowEditBirth" round position="bottom">
      <update-birth v-if="isShowEditBirth" v-model="user.birthday" @close="isShowEditBirth = false" />
    </van-popup>
    <!-- /修改性别弹出层 -->

    <!-- 修改头像弹出层 -->
    <van-popup v-model="isShowEditAvatar" position="bottom" :style="{ height: '100%', backgroundColor: '#000' }">
      <update-avatar v-if="isShowEditAvatar" :file="previewFile" @close="isShowEditAvatar = false" @update-avatar="user.photo = $event" />
    </van-popup>
    <!-- /修改头像弹出层 -->
  </div>
</template>

<script>
import UpdateName from './components/update-name'
import UpdateGender from './components/update-gender'
import UpdateBirth from './components/update-birth'
import UpdateAvatar from './components/update-avatar'
import { getUserProfile } from '@/api/user'
export default {
  name: 'UserProfile',
  data() {
    return {
      user: {}, // 用户个人信息
      isShowEditName: false, // 控制修改用户名弹出层的显示
      isShowEditGender: false, // 控制修改性别弹出层的显示
      isShowEditBirth: false, // 控制修改生日弹出层的显示
      isShowEditAvatar: false, // 控制修改头像弹出层的显示
      previewFile: null // 上传头像预览（文件对象）
    }
  },
  created() {
    this.loadUserProfile()
  },
  methods: {
    // 获取用户个人信息
    async loadUserProfile() {
      const { data } = await getUserProfile()
      this.user = data.data
    },
    // 上传头像选择文件成功
    onFileChange() {
      // 获取选中的图片
      const file = this.$refs.updateAvatar.files[0]
      this.previewFile = file

      this.isShowEditAvatar = true

      // 解决选择同一个文件不触发change事件
      this.$refs.updateAvatar.value = ''
    }
  },
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirth,
    UpdateAvatar
  }
}
</script>

<style lang="less" scoped>
.user-profile-container {
  /deep/.van-popup--bottom.van-popup--round {
    border-radius: 10px 10px 0 0;
  }
}
</style>
