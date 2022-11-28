<template>
  <view class="content">
    <web-view src="/hybrid/html/hikVideo.html"></web-view>
  </view>
</template>
<script>
import Vue from 'vue';

export default {
  data() {
    return {
      title: 'Hello'
    };
  },
  created() {
    plus.navigator.closeSplashscreen();
  }
};
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin: 200rpx auto 50rpx auto;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
