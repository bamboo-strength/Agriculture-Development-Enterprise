<template>
	<user-layout>
    <view class="user-tab">
      <text class="user-tab-text">账户密码登录</text>
    </view>
    <uni-forms ref="userForms" :model="userForm" :rules="userRule" validateTrigger="bind">
      <uni-forms-item name="loginName">
        <uni-easyinput v-model="userForm.loginName" class="ul-input" type="text" trim prefixIcon="person" placeholder="用户名" />
      </uni-forms-item>
      <uni-forms-item name="password">
        <uni-easyinput v-model="userForm.password" class="ul-input" type="password" trim prefixIcon="locked" placeholder="密码" />
      </uni-forms-item>
      <view>
        <uni-data-checkbox v-model="remember" multiple :localdata="localData"></uni-data-checkbox>
      </view>
      <button type="primary" class="ui-button" @click="submit">登 录</button>
      <view>
        <navigator url="/pages/user/Register" animation-type="fade-in" class="ui-register">注册账户</navigator>
        <navigator url="/pages/user/ForgetPwd" animation-type="fade-in" style="float: right;" class="ui-register">重置密码</navigator>
      </view>
    </uni-forms>
  </user-layout>
</template>

<script>
  import UserLayout from './UserLayout.vue';
  import { user } from './user';
  import axios from 'axios';
  import { userApi } from '@/api/user';

  export default {
    name: 'UserLogin',
    components: {
      'user-layout': UserLayout
    },
    data() {
      return {
        userForm: user.userLoginForm,
        userRule: user.userLoginRule,
        remember: [],
        localData: [
          { value: 0, text: '记住密码' }
        ]
      }
    },
    mounted() {
      const userForm = uni.getStorageSync('userForm');
      if (userForm) {
        Object.assign(this.userForm, userForm);
        this.remember.push(0)
      }
    },
    methods: {
      submit() {
        this.$refs.userForms.validate((error, form) => {
          if (!!error) {
            return;
          }

          uni.showLoading({
            title: '正在登录, 请稍后...'
          })

          userApi.accountLogin(form)
            .then(params => {
              uni.hideLoading();
              if (!params.success) {
                return uni.showToast({
                  icon: 'error',
                  title: '账户或密码错误!'
                })
              }

              if (this.remember.includes(0)) {
                uni.setStorageSync('userForm', form);
              }

              uni.setStorageSync('token', form.loginName);
              uni.showToast({
                icon: 'success',
                title: '登录成功！',
                success() {
                  uni.reLaunch({
                    url: '/pages/dashboard/Dashboard'
                  })
                }
              })
            })
            .catch(error => {
              uni.hideLoading();
            })
        })
      }
    },
    options: {
      styleIsolation: 'shared'
    },
    onBackPress(options) {
      console.log(options);
    }
  }
</script>

<style scoped lang="scss">
  .user-tab {
    text-align: center;
    margin-bottom: 24px;

    &-text {
      display: inline-block;
      padding: 12px 16px;
      font-size: 14px;
      color: #1890FF;
      border-bottom: 2px solid #1890FF;
    }
  }

  /deep/ .ul-input {
    .uni-easyinput__content-input {
      height: 40px;
    }
  }

  .ui-button {
    margin: 8px 0;
  }

  .ui-register {
    display: inline-block;
    color: #1890FF;
  }
</style>
