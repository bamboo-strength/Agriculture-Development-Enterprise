<template>
  <user-layout>
    <view style="margin-top: 4px; margin-bottom: 16px;">
      <text class="ui-text">重置密码</text>
    </view>
    <uni-forms ref="userForms" :model="userForm" :rules="userRule" validateTrigger="bind">
      <uni-forms-item name="loginName">
        <uni-easyinput v-model="userForm.loginName" class="ul-input" type="text" trim prefixIcon="person" placeholder="登录名" />
      </uni-forms-item>
      <uni-forms-item name="oldPassword">
        <uni-easyinput v-model="userForm.oldPassword" class="ul-input" type="password" trim prefixIcon="locked" placeholder="旧密码" />
      </uni-forms-item>
      <uni-forms-item name="password">
        <uni-easyinput v-model="userForm.password" class="ul-input" type="password" trim prefixIcon="locked" placeholder="密码" />
      </uni-forms-item>
      <button type="primary" @click="submit">重置密码</button>
      <view class="ui-view">
        <navigator url="/pages/user/Login" animation-type="fade-in" class="ui-login">去登录</navigator>
      </view>
    </uni-forms>
  </user-layout>
</template>

<script>
  import UserLayout from './UserLayout.vue';
  import { userApi } from '@/api/user';
  import { user } from './user';

  export default {
    name: 'UserForgetPwd',
    components: {
      'user-layout': UserLayout

    },
    data() {
      return {
        userForm: user.userForgetForm,
        userRule: user.userForgetRule
      }
    },
    methods: {
      submit() {
        this.$refs.userForms.validate((error, form) => {
          if (!!error) {
            return;
          }

          uni.showLoading({
            title: '正在修改密码，请稍后...'
          })

          userApi.updatePwd(form)
            .then(result => {
              uni.hideLoading();
              const { success, msg } = result;

              if (!success) {
                return uni.showToast({
                  icon: 'error',
                  title: msg || '账户或密码错误!'
                })
              }

              uni.showToast({
                icon: 'success',
                title: '密码修改成功！',
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
  }

  /deep/ .ul-input {
    .uni-easyinput__content-input {
      height: 40px;
    }
  }

  .ui-view {
    text-align: right;
  }

  .ui-login {
    display: inline-block;
    color: #1890FF;
    margin: 16px 0 0;
  }
</style>
