<template>
	<user-layout>
    <view class="user-main">
      <view class="user-tab">
        <text class="user-tab-text">账户密码登录</text>
      </view>
      <uni-forms ref="userForms" :model="userForm" :rules="userRules" validateTrigger="bind">
        <uni-forms-item name="loginName">
          <uni-easyinput v-model="userForm.loginName" class="ul-input" type="text" prefixIcon="person" placeholder="用户名" />
        </uni-forms-item>
        <uni-forms-item name="password">
          <uni-easyinput v-model="userForm.password" class="ul-input" type="password" prefixIcon="locked" placeholder="密码" />
        </uni-forms-item>
        <button type="primary" @click="submit">登 录</button>
      </uni-forms>
    </view>
  </user-layout>
</template>

<script>
import UserLayout from './UserLayout.vue';
import { user } from './user';
import axios from 'axios';

export default {
  name: 'UserLogin',
  components: {
    'user-layout': UserLayout
  },
  data() {
    return {
      userForm: {
        loginName: null,
        password: null
      },
      userRules: user.userRules
    }
  },
  created() {
    console.log(process.env.VUE_APP_MAGIC_VAL);
    this.getUrl();
  },
  methods: {
    submit() {
      const userForm = this.$refs.userForms;
      userForm.validate((error, form) => {
        console.log(error);
        console.log(form);
      })
    },

    getUrl() {
      axios.get('http://120.224.215.75:8010/nfjt/app/vehicleaxle/query')
        .then(result => {
          console.log(result);
        })
    }
  },
  options: {
    styleIsolation: 'shared'
  }
}
</script>

<style scoped lang="scss">
  .user-main {
    margin: 0 20px;
    padding: 16px;
    border-radius: 10px;
    background-color: #FFF;
  }

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
</style>
