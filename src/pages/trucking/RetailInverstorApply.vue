<template>
  <view style="height: 100%;">
    <view style="height: var(--status-bar-height); background-color: #FFF;"></view>
    <view class="box-bg">
      <uni-nav-bar left-icon="left" title="散户销售派车申请表" @clickLeft="goBack" />
    </view>

    <uni-card class="ui-card" is-shadow spacing="0" margin="0" padding="0">
      <uni-forms :model="applyForm" class="ui-forms" label-align="right" label-width="100">
        <uni-group top="0" class="ui-group">
          <uni-forms-item label="所属单位:">
            <uni-data-picker
              v-model="applyForm.organizationId"
              :localdata="unitData"
              :border="false"
              placeholder="请选择所属单位"
              popup-title="请选择所属单位"
            />
          </uni-forms-item>
        </uni-group>
        <uni-group top="0" class="ui-group">
          <uni-forms-item label="物资信息:">
            <uni-combox v-model="applyForm.materialNo" :candidates="materialData" combox="materialCode" title="materialName" remote :border="false" placeholder="请输入物资简码进行检索" @input="searchMaterial"></uni-combox>
          </uni-forms-item>
        </uni-group>
        <uni-group top="0" class="ui-group">
          <uni-forms-item label="客户信息:">
            <uni-combox v-model="applyForm.custNo" :candidates="custData" combox="custNo" title="custName" remote :border="false" placeholder="请输入客户简码进行检索" @input="searchCust"></uni-combox>
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
              placeholder="请选择车号信息"
              @input="searchVehicle"
              @change="vehicleChange"
              @blur="vehicleBlur"
            ></uni-combox>
          </uni-forms-item>
        </uni-group>
        <uni-group top="0" class="ui-group">
          <uni-forms-item label="司机姓名:">
            <uni-easyinput v-model="applyForm.driverName" type="text" :inputBorder="false" class="uni-input--disabled" :disabled="vehicleDisable" placeholder="请输入司机姓名" />
          </uni-forms-item>
        </uni-group>
        <uni-group top="0" class="ui-group">
          <uni-forms-item label="身份证号:">
            <uni-easyinput v-model="applyForm.idCard" type="idcard" :inputBorder="false" class="uni-input--disabled" :disabled="vehicleDisable" placeholder="请输入身份证号" />
          </uni-forms-item>
        </uni-group>
        <uni-group top="0" class="ui-group">
          <uni-forms-item label="预装量:">
            <uni-easyinput v-model="applyForm.preamount" type="number" :inputBorder="false" placeholder="预装量">
              <template slot="suffixIcon">
                <text>吨</text>
              </template>
            </uni-easyinput>
          </uni-forms-item>
        </uni-group>
        <uni-group top="0" class="ui-group">
          <uni-forms-item label="发运次数:">
            <uni-easyinput v-model="applyForm.shipmentNum" type="number" :inputBorder="false" placeholder="发运次数" />
          </uni-forms-item>
        </uni-group>
        <uni-group top="0" class="ui-group">
          <uni-forms-item label="超长车标志:">
            <uni-combox v-model="applyForm.isOverLenghFlag" :candidates="isOverStatus" :border="false" placeholder="请选择超长车标志"></uni-combox>
          </uni-forms-item>
        </uni-group>
      </uni-forms>

      <view class="ui-footer">
        <button type="primary" @click="submit">提 交</button>
      </view>
    </uni-card>
  </view>
</template>

<script>
  import _ from 'lodash';
  import { commonApi } from '@/api/common';
  import { truckingOrderApi } from '@/api/truckingOrder';
  import { truckingOrder } from './index';
  import CommonMixin from '@/mixins/common.mixin';

  export default {
    name: 'RetailInverstorApply',

    mixins: [CommonMixin],

    data() {
      return {
        applyForm: _.cloneDeep(truckingOrder.rApplyForm),
        vehicleDisable: true,
        isOverStatus: truckingOrder.isOverStatus,
        dispatchId: null
      }
    },

    created() {
      this.searchVehicle();
      this.searchCust();
      this.searchMaterial();
      this.getUnit();
    },

    onLoad(data) {
      if (Object.keys(data).length) {
        this.dispatchId = data.dispatchId;

        console.log(data);

        this.getDispatch(data.dispatchId);
      }
    },

    methods: {
      goBack() {
        uni.reLaunch({
          url: '/pages/dashboard/Dashboard'
        })
      },

      getDispatch(dispatchId) {
        truckingOrderApi.getDispatchById({ id: dispatchId })
          .then(result => {
            const { dispatchNo, custNo, materialNo, organization,
              vehicleNo, driverName, idCard, preamount, shipmentNum, isOverLenghFlag } = result;

            Object.assign(this.applyForm, {
              dispatchNo,
              custNo,
              materialNo,
              organizationId: organization.id,
              vehicleNo,
              driverName,
              idCard,
              preamount,
              shipmentNum,
              isOverLenghFlag
            })
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
          organizationId: '请选择所属单位!',
          materialNo: '请选择物资信息!',
          custNo: '请选择客户信息!',
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

        truckingOrderApi.insertSaleRetail(params)
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
