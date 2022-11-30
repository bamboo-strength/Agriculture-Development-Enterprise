<template>
	<view class="user-layout">
    <view class="user-content">
      <view style="height: var(--status-bar-height)"></view>
      <view class="user-layout-header">农发公司</view>
      <view class="user-layout-desc">（司机端）</view>
      <view class="user-main">
        <slot></slot>
      </view>
    </view>
    <v-footer class="user-footer"></v-footer>
  </view>
</template>

<script>
  import Footer from '@/components/footer.vue';

  export default {
    name: 'UserLayout',
    components: {
      'v-footer': Footer
    }
  }
</script>

<style scoped lang="scss">
  .user-layout {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    background: url("../../static/images/login.jpg");
    background-size: 100% 100%;
  }

  .user-content {
    flex: 1;
    padding: 48px 0;
  }

  .user-layout-header {
    position: relative;
    padding-top: 24px;
    height: 50px;
    line-height: 44px;
    color: white;
    font-weight: 600;
    font-size: 33px;
    text-align: center;
  }

  .user-layout-desc {
    height: 34px;
    line-height: 44px;
    color: white;
    text-align: center;
  }

  .user-main {
    margin: 0 20px;
    padding: 15px;
    border-radius: 10px;
    background-color: #FFF;
  }

  .user-footer {
    text-align: center;
    font-size: 18px;
    height: 48px;
    line-height: 48px;
    color: #FFF;
  }
</style>
