<template>
  <user-layout>
    <view style="margin-top: 4px; margin-bottom: 16px;">
      <text class="ui-text">注册</text>
    </view>
    <uni-forms ref="userForms" :model="userForm" :rules="userRule" validateTrigger="bind">
      <uni-forms-item name="roleType">
         <uni-data-select v-model="userForm.roleType" prefixIcon="role" :localdata="roleTypes" :clear="false" @change="onRoleTypeChange"></uni-data-select>
      </uni-forms-item>
      <uni-forms-item name="userName">
        <uni-easyinput v-model="userForm.userName" class="ul-input" type="text" trim prefixIcon="staff" placeholder="姓名" />
      </uni-forms-item>
      <uni-forms-item name="loginName">
        <uni-easyinput v-model="userForm.loginName" class="ul-input" type="text" trim prefixIcon="person" placeholder="登录名" />
      </uni-forms-item>
      <uni-forms-item name="password">
        <uni-easyinput v-model="userForm.password" class="ul-input" type="password" trim prefixIcon="locked" placeholder="密码" />
      </uni-forms-item>
      <uni-forms-item v-if="userForm.roleType === 0" name="custNo">
        <uni-easyinput v-model="userForm.custNo" class="ul-input" type="text" trim prefixIcon="defind iconfont icon-custom" placeholder="客户编号" />
      </uni-forms-item>
      <uni-forms-item v-if="userForm.roleType === 2" name="idCard">
        <uni-easyinput v-model="userForm.idCard" class="ul-input" type="text" trim prefixIcon="defind iconfont icon-idCard" placeholder="身份证号" />
      </uni-forms-item>
      <uni-forms-item v-if="userForm.roleType === 2" name="vehicleNo">
        <uni-easyinput v-model="userForm.vehicleNo" class="ul-input" type="text" trim prefixIcon="defind iconfont icon-vehicleNo" placeholder="车牌号" />
      </uni-forms-item>
      <uni-forms-item v-if="userForm.roleType === 1" name="organizationId">
        <uni-data-picker
          v-model="userForm.organizationId"
          :localdata="unitData"
          prefixIcon="unit"
          placeholder="所属单位"
          popup-title="所属单位"
        />
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
  import { commonApi } from '@/api/common';
  import { user } from './user';

  export default {
    name: 'UserRegister',
    components: {
      'user-layout': UserLayout
    },

    data() {
      return {
        userForm: user.userForm,
        userRule: user.userRule,
        unitData: [],
        roleTypes: [
          { value: 0, text: '客户端' },
          { value: 1, text: '矿方端' },
          { value: 2, text: '司机端' }
        ]
      }
    },

    created() {
      this.getUnit();
    },

    methods: {
      submit() {
        this.$refs.userForms.validate((error, form) => {
          if (!!error) {
            return;
          }

          userApi.accountRegieter(form)
            .then(result => {
              if (!result.success) {
                return uni.showToast({
                  icon: 'none',
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
        })
      },

      // 切换注册类型
      onRoleTypeChange($event) {
        this.$refs.userForms.clearValidate()
        if ($event === 0) {
          if (this.userRule.idCard) delete this.userRule.idCard;
          if (this.userRule.vehicleNo) delete this.userRule.vehicleNo;
          if (this.userRule.organizationId) delete this.userRule.organizationId;
          Object.assign(this.userRule, {
            custNo: {
              rules: [
                {
                  required: true,
                  errorMessage: '请输入客户编号'
                }
              ]
            }
          })
        }

        if ($event === 1) {
          if (this.userRule.idCard) delete this.userRule.idCard;
          if (this.userRule.vehicleNo) delete this.userRule.vehicleNo;
          if (this.userRule.custNo) delete this.userRule.custNo;
          Object.assign(this.userRule, {
            organizationId: {
              rules: [
                {
                  required: true,
                  errorMessage: '请选择单位信息'
                }
              ]
            }
          })
        }

        if ($event === 2) {
          if (this.userRule.custNo) delete this.userRule.custNo;
          if (this.userRule.organizationId) delete this.userRule.organizationId;
          Object.assign(this.userRule, {
            idCard: {
              rules: [
                {
                  required: true,
                  errorMessage: '请输入身份证号'
                },
                {
                  pattern: /^[1-9][0-9]{5}(?:18|19|20)[0-9]{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2][0-9]|30|31)[0-9]{3}[0-9Xx]$/,
                  errorMessage: '请输入有效的身份证号'
                }
              ]
            },
            vehicleNo: {
              rules: [
                {
                  required: true,
                  errorMessage: '请输入车牌号'
                },
                {
                  pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/,
                  errorMessage: '请输入有效的车牌号'
                }
              ]
            }
          })
        }

        this.$refs.userForms.setRules(this.userRule)
      },

      // 获取单位信息
      getUnit() {
        commonApi.getUnit()
          .then(result => {
            if (!result.success) {
              return
            }
            const params = this.convert(result.list);

            this.unitData = [
              ...params
            ]
          })
      },

      //  转换单位信息
      convert(nodes) {
        const result = [];
        const treeObj = params => {
          return {
            value: params.id,
            text: params.name,
            children: []
          }
        }

        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].parentId === '0') {
            const obj = treeObj(nodes[i]);
            result.push(obj);
            nodes.splice(i, 1);
            i--;
          }
        }

        const _generate = (chiArr) => {
          if (!chiArr.length) {
            return;
          }
          for (let i = 0; i < chiArr.length; i++) {
            for (var j = 0; j < nodes.length; j++) {
              if (chiArr[i].value === nodes[j].parentId) {
                const obj = treeObj(nodes[j]);
                chiArr[i].children.push(obj);
                nodes.splice(j, 1);
                j--;
              }
            }

            _generate(chiArr[i].children);
          }
        }

        _generate(result);

        return result;
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
