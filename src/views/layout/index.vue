<template>
  <div class="layout-container">
    <!-- 子路由出口 -->
    <keep-alive :exclude="['MyIndex']">
      <router-view></router-view>
    </keep-alive>
    <!-- 底部tabbar -->
    <van-tabbar v-model="active" route active-color="#3296fa">
      <van-tabbar-item to="/">
        首页
        <template #icon="props">
          <van-icon :name="props.active ? 'wap-home' : 'wap-home-o'" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/qa">
        问答
        <template #icon="props">
          <van-icon :name="props.active ? 'comment' : 'comment-o'" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/video">
        视频
        <template #icon="props">
          <van-icon :name="props.active ? 'video' : 'video-o'" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/my">
        我的
        <template #icon="props">
          <van-icon :name="props.active ? 'manager' : 'manager-o'" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'LayoutIndex',
  data() {
    return {
      active: 0
    }
  },
  mounted() {
    this.$store.commit('addCachePage', 'LayoutIndex')
  }
}
</script>

<style lang="less" scoped>
.layout-container {
}
</style>
