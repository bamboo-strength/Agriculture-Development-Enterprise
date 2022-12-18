<template>
  <view style="height: 100%;">
    <view class="ui-avatar">
      <view class="ui-avatar-content">
        <image class="ui-avatar_image" src="@/static/images/avatar.png"></image>
        <view class="ui-avatar_info">
          <view>{{ userName }}</view>
          <view>{{ roleTypes[roleType] }}</view>
        </view>
      </view>
    </view>

    <uni-list style="margin-bottom: 8px;">
      <uni-list-item showArrow title="个人信息" to="/pages/personal/essential" />
    </uni-list>

    <view style="padding: 0 8px;">
      <button type="warn" @click="logout">退 出</button>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        roleTypes: {
          '0': '处置端',
          '1': '地块端',
          '2': '司机端'
        },
        userName: null,
        roleType: '-1'
      }
    },
    
    created() {
      const user = uni.getStorageSync('userBaseEntity');
      this.userName = user.userName;
      this.roleType = user.roleType;
    },

    methods: {
      logout() {
        uni.showModal({
          title: '提示',
          content: '是否要进行退出?',
          success: result => {
            if (result.confirm) {
              uni.clearStorageSync();
              uni.reLaunch({
                url: '/pages/user/Login',
                success() {
                  uni.showToast({
                    icon: 'success',
                    title: '退出成功！'
                  })
                }
              });
            }
          }
        })
      }
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
