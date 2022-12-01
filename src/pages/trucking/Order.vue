<template>
  <view>
    <view class="box-bg">
      <uni-nav-bar shadow left-icon="left" right-icon="search" title="派车单查询" @clickLeft="goBack" @clickRight="search" />
    </view>

    <uni-popup ref="popup" background-color="#fff">
      <view class="popup-content">
        <text class="text">popup 内容</text>
      </view>
    </uni-popup>
  </view>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    methods: {
      goBack() {
        uni.navigateBack({
          delta: 1
        })
      },
      
      search() {
        this.$refs.popup.open('top');
      }
    }
  }
</script>

<style>

</style>
