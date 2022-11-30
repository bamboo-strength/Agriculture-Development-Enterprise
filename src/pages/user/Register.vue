<template>
  <user-layout>
    <view style="margin-top: 4px; margin-bottom: 16px;">
      <text class="ui-text">注册</text>
    </view>
    <uni-forms ref="userForms" :model="userForm" :rules="userRule" validateTrigger="bind">
      <uni-forms-item name="userName">
        <uni-easyinput v-model="userForm.userName" class="ul-input" type="text" trim prefixIcon="staff" placeholder="姓名" />
      </uni-forms-item>
      <uni-forms-item name="loginName">
        <uni-easyinput v-model="userForm.loginName" class="ul-input" type="text" trim prefixIcon="person" placeholder="登录名" />
      </uni-forms-item>
      <uni-forms-item name="password">
        <uni-easyinput v-model="userForm.password" class="ul-input" type="password" trim prefixIcon="locked" placeholder="密码" />
      </uni-forms-item>
      <uni-forms-item name="idCard">
        <uni-easyinput v-model="userForm.idCard" class="ul-input" type="text" trim prefixIcon="defind iconfont icon-idCard" placeholder="身份证号" />
      </uni-forms-item>
      <uni-forms-item name="vehicleNo">
        <uni-easyinput v-model="userForm.vehicleNo" class="ul-input" type="text" trim prefixIcon="defind iconfont icon-vehicleNo" placeholder="车牌号" />
      </uni-forms-item>
      <view>
        <button type="primary" class="ui-button" @click="submit">注册账户</button>
        <navigator style="float: right;" url="/pages/user/Login" animation-type="fade-in" class="ui-register">使用已有账户登录</navigator>
      </view>
    </uni-forms>
  </user-layout>
</template>

<script>
  import UserLayout from './UserLayout.vue';
  import { userApi } from '@/api/user';
  import { user } from './user';

  export default {
    name: 'UserRegister',
    components: {
      'user-layout': UserLayout
    },
    data() {
      return {
        userForm: user.userForm,
        userRule: user.userRule
      }
    },
    methods: {
      submit() {
        this.$refs.userForms.validate((error, form) => {
          if (!!error) {
            return;
          }

          const params = {
            ...form,
            roleType: 2
          };

          uni.showLoading({
            title: '正在进行账户注册, 请稍后...'
          })

          userApi.accountRegieter(params)
            .then(result => {
              uni.hideLoading();
              if (!result.success) {
                return uni.showToast({
                  icon: 'error',
                  title: result.msg
                })
              }

              uni.showToast({
                icon: 'success',
                title: '账户注册成功！',
                success() {
                  uni.reLaunch({
                    url: '/pages/user/Login'
                  })
                }
              })
            })
            .catch(error => {
              uni.hideLoading();
            })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .ui-text {
    font-size: 20px;
    font-weight: bold;
    color: #E77918;
  }

  /deep/ .ul-input {
    .uni-easyinput__content-input {
      height: 40px;
    }
  }

  .ui-button {
    display: inline-block;
    width: 50%;
  }

  .ui-register {
    display: inline-block;
    color: #1890FF;
    margin: 12px 0;
  }
</style>
