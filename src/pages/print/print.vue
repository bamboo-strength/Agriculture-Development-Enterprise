<template>
  <view class="ui-body" style="height: 100%;">
    <view style="height: var(--status-bar-height); background-color: #FFF;"></view>
    <view class="box-bg">
      <uni-nav-bar left-icon="left" title="榜单打印" @clickLeft="goBack" />
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    created() {
      const system = uni.getSystemInfoSync();
      const Content = plus.android.importClass('android.content.Context');
      const print = uni.requireNativePlugin('PrintModule');

      console.log(print);
    },
    methods: {
      goBack() {
        uni.reLaunch({
          url: '/pages/dashboard/Dashboard'
        })
      }
    }
  }
</script>

<style>

</style>
