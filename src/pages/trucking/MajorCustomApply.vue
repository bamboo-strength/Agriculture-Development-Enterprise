<template>
  <view style="height: 100%;">
    <view style="height: var(--status-bar-height); background-color: #FFF;"></view>
    <view class="box-bg">
      <uni-nav-bar left-icon="left" title="大客户销售派车申请表" @clickLeft="goBack" />
    </view>

    <uni-card class="ui-card" is-shadow spacing="0" margin="0" padding="0">
      <uni-forms :model="applyForm" ref="applyForm" class="ui-forms" label-align="right" label-width="100">
        <uni-group top="0" class="ui-group">
          <uni-forms-item label="主合同号:">
            <uni-easyinput v-model="applyForm.orderMainNo" type="text" class="uni-input--disabled" :inputBorder="false" disabled suffixIcon="search" placeholder="请选择主合同号" @iconClick="handleClick" />
          </uni-forms-item>
        </uni-group>
        <uni-group top="0" class="ui-group">
          <uni-forms-item label="子合同号:">
            <uni-easyinput v-model="applyForm.orderSubNo" type="text" class="uni-input--disabled" :inputBorder="false" disabled />
          </uni-forms-item>
        </uni-group>
        <uni-group top="0" class="ui-group">
          <uni-forms-item label="单位信息:">
            <uni-easyinput v-model="applyForm.organizationName" type="text" class="uni-input--disabled" :inputBorder="false" disabled />
          </uni-forms-item>
        </uni-group>
        <uni-group top="0" class="ui-group">
          <uni-forms-item label="物资信息:">
            <uni-easyinput v-model="applyForm.materialName" type="text" class="uni-input--disabled" :inputBorder="false" disabled />
          </uni-forms-item>
        </uni-group>
        <uni-group top="0" class="ui-group">
          <uni-forms-item label="客户信息:">
            <uni-easyinput v-model="applyForm.custName" type="text" class="uni-input--disabled" :inputBorder="false" disabled />
          </uni-forms-item>
        </uni-group>
        <uni-group top="0" class="ui-group">
          <uni-forms-item label="车号:">
            <uni-combox
              v-model="applyForm.vehicleNo"
              :candidates="vehicleData"
              combox="vehicleNo"
              title="vehicleNo"
              remote
              :border="false"
              :disabled="editStatus"
              placeholder="请选择车号信息"
              @input="searchVehicle"
              @change="vehicleChange"
              @blur="vehicleBlur"
            ></uni-combox>
          </uni-forms-item>
        </uni-group>
        <uni-group top="0" class="ui-group">
          <uni-forms-item label="司机姓名:">
            <uni-easyinput v-model="applyForm.driverName" type="text" :inputBorder="false" class="uni-input--disabled" :disabled="vehicleDisable || editStatus" placeholder="请输入司机姓名" />
          </uni-forms-item>
        </uni-group>
        <uni-group top="0" class="ui-group">
          <uni-forms-item label="身份证号:">
            <uni-easyinput v-model="applyForm.idCard" type="idcard" :inputBorder="false" class="uni-input--disabled" :disabled="vehicleDisable || editStatus" placeholder="请输入身份证号" />
          </uni-forms-item>
        </uni-group>
        <uni-group top="0" class="ui-group">
          <uni-forms-item label="预装量:">
            <uni-easyinput v-model="applyForm.preamount" type="number" class="uni-input--disabled" :disabled="editStatus" :inputBorder="false" placeholder="预装量">
              <template slot="suffixIcon">
                <text>吨</text>
              </template>
            </uni-easyinput>
          </uni-forms-item>
        </uni-group>
        <uni-group top="0" class="ui-group">
          <uni-forms-item label="发运次数:">
            <uni-easyinput v-model="applyForm.shipmentNum" type="number" class="uni-input--disabled" :disabled="editStatus" :inputBorder="false" placeholder="发运次数" />
          </uni-forms-item>
        </uni-group>
        <uni-group top="0" class="ui-group">
          <uni-forms-item label="超长车标志:">
            <uni-combox v-model="applyForm.isOverLenghFlag" :candidates="isOverStatus" :disabled="editStatus" :border="false" placeholder="请选择超长车标志"></uni-combox>
          </uni-forms-item>
        </uni-group>
      </uni-forms>

      <view class="ui-footer">
        <button v-if="editStatus" type="primary" @click="updateDispatch">修 改</button>
        <button v-else type="primary" @click="submit">提 交</button>
      </view>
    </uni-card>
  </view>
</template>
<script>
  import _ from 'lodash';
  import { commonApi } from '@/api/common';
  import { truckingOrder } from './index';
  import { truckingOrderApi } from '@/api/truckingOrder';
  import CommonMixin from '@/mixins/common.mixin';

  export default {
    name: 'MajorCustomApply',

    mixins: [CommonMixin],

    data() {
      return {
        applyForm: _.cloneDeep(truckingOrder.mApplyForm),
        vehicleDisable: true,
        isOverStatus: truckingOrder.isOverStatus,
        dispatchId: null,
        editStatus: false
      }
    },

    created() {
      this.searchVehicle();
    },

    onLoad(data) {
      if (Object.keys(data).length) {
        this.dispatchId = data.dispatchId;
        this.editStatus = true;

        this.getDispatch(data.dispatchId);
      }
    },

    methods: {
      // 后退
      goBack() {
        if (this.editStatus) {
          return uni.navigateBack();
        }
        uni.reLaunch({
          url: '/pages/dashboard/Dashboard'
        })
      },

      getDispatch(dispatchId) {
        truckingOrderApi.getDispatchById({ id: dispatchId })
          .then(result => {
            const { dispatchNo, orderMainNo, orderSubNo, custNo, custName,
              materialNo, materialName, organization,
              vehicleNo, driverName, idCard, preamount, shipmentNum, isOverLenghFlag } = result;

            Object.assign(this.applyForm, {
              dispatchNo,
              orderMainNo,
              orderSubNo,
              custNo,
              custName,
              materialNo,
              materialName,
              organizationId: organization.id,
              organizationName: organization.name,
              vehicleNo,
              driverName,
              idCard,
              preamount,
              shipmentNum,
              isOverLenghFlag
            })
          })
      },

      // 弹出模态框
      handleClick() {
        uni.navigateTo({
          url: '/pages/Contract/Contract'
        })
      },

      // 车号信息选中处理。
      vehicleChange($event) {
        const { driverName, idCard } = $event;
        this.vehicleDisable = true;
        Object.assign(this.applyForm, {
          driverName,
          idCard
        })
      },

      vehicleBlur() {
        this.vehicleDisable = false;
      },

      validate() {
        let flag = false;
        const keys = {
          orderMainNo: '请选择主合同号!',
          vehicleNo: '请选择车号信息!',
          driverName: '请输入司机姓名!',
          preamount: '请输入预装量!',
          shipmentNum: '请输入发运次数!',
          isOverLenghFlag: '请选择超长车标志'
        }
        Object.keys(keys).forEach(v => {
          if (flag) {
            return false
          }
          if (!this.applyForm[v]) {
            flag = true;
            uni.showToast({
              icon: 'none',
              title: keys[v]
            })
          }
        })
        return flag;
      },

      submit() {
        if (this.validate()) {
          return;
        }

        const user = uni.getStorageSync('userBaseEntity');
        const params = {
          ...this.applyForm,
          appcreateBy: user.id
        }

        truckingOrderApi.insertCustomOrder(params)
          .then(result => {
            if (!result.success) {
              return uni.showToast({
                icon: 'none',
                title: result.msg
              })
            }

            uni.showToast({
              icon: 'success',
              title: result.msg,
              success: () => {
                uni.reLaunch({
                  url: '/pages/trucking/Order'
                })
              }
            })
          })
      },

      /**
       * 修改派车单信息
       */
      updateDispatch() {
        const user = uni.getStorageSync('userBaseEntity');
        const params = {
          ...this.applyForm,
          appupdateBy: user.id
        };

        truckingOrderApi.updateDispatch(params)
          .then(result => {
            if (!result.success) {
              return uni.showToast({
                icon: 'none',
                title: result.msg
              })
            }

            uni.showToast({
              icon: 'success',
              title: result.msg,
              success: () => {
                uni.reLaunch({
                  url: '/pages/trucking/Order'
                })
              }
            })
          })
      },

      // 关闭弹出框
      close() {
        this.$refs.popup.close();
      }
    }
  }
</script>

<style lang="scss" scoped>
  /deep/ .uni-input--disabled
    > .uni-easyinput__content {
    background-color: #FFF !important;
    color: rgb(51, 51, 51);

    .uni-easyinput__placeholder-class {
      color: #999 !important;
    }
  }

  /deep/ .ui-card.uni-card {
    height: calc(100% - var(--status-bar-height) - 47px);

    .uni-card__content {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .uni-forms {
      overflow-y: auto;
      flex: 1;
    }
  }

  .ui-footer {
    padding: 8px;
  }

  /deep/ .ui-group {
    border-bottom: 1px solid #eee;

    .uni-group__content {
      padding: 8px 16px;
    }
  }

  /deep/ .ui-forms .uni-forms-item {
    margin-bottom: 0;

    .uni-forms-item__label {
      width: 90px;
      text-align: right;
    }
  }

</style>
