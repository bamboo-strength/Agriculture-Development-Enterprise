<template>
  <view style="height: 100%;">
    <view class="ui-avatar">
      <view class="ui-avatar-content">
        <image class="ui-avatar_image" src="@/static/images/avatar.png"></image>
        <view class="ui-avatar_info">
          <view>张三</view>
          <view>企业端</view>
        </view>
      </view>
    </view>

    <uni-list style="margin-bottom: 8px;">
      <uni-list-item showArrow title="个人信息" />
    </uni-list>

    <view style="padding: 0 8px;">
      <button type="warn">退 出</button>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    methods: {

    }
  }
</script>

<style lang="scss" scoped>
  .ui-avatar {
    padding: 32px 32px;
    background-color: #FFF;
    margin-bottom: 8px;

    &-content {
      display: flex;
    }

    &_image {
      height: 56px;
      width: 56px;
    }

    &_info {
      margin-left: 20px;
      flex: 1;
    }
  }
</style>
