<template>
  <view style="height: 100%;">
    <view style="height: var(--status-bar-height); background-color: #FFF;"></view>
    <view class="box-bg">
      <uni-nav-bar left-icon="left" title="基本信息" @clickLeft="goBack" />
    </view>

    <uni-list style="margin-bottom: 8px;">
      <uni-list-item title="姓名" :rightText="userForm.userName" />
      <uni-list-item title="登录名" :rightText="userForm.loginName" />
      <uni-list-item title="身份证号" :rightText="userForm.idCard" />
      <uni-list-item title="类型" :rightText="roleTypes[userForm.roleType]" />
      <uni-list-item v-if="userForm.roleType === '2'" title="车牌号" :rightText="userForm.vehicleNo" />
    </uni-list>

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
        userForm: new Object()
      }
    },

    created() {
      const user = uni.getStorageSync('userBaseEntity');
      this.userForm = user;
    },

    methods: {
      // 后退
      goBack() {
        uni.navigateBack();
      },
    }
  }
</script>
