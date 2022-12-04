<template>
  <view style="height: 100%;">
    <view style="height: var(--status-bar-height); background-color: #FFF;"></view>
    <view class="box-bg">
      <uni-nav-bar left-icon="left" title="大客户销售派车申请表" @clickLeft="goBack" />
    </view>

    <uni-card class="ui-card" is-shadow spacing="0" margin="0" padding="0">
      <uni-forms :model="applyForm" class="ui-forms" label-align="right" label-width="100">
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
            <uni-easyinput v-model="applyForm.organizationId" type="text" class="uni-input--disabled" :inputBorder="false" disabled />
          </uni-forms-item>
        </uni-group>
        <uni-group top="0" class="ui-group">
          <uni-forms-item label="物资信息:">
            <uni-easyinput v-model="applyForm.materialNo" type="text" class="uni-input--disabled" :inputBorder="false" disabled />
          </uni-forms-item>
        </uni-group>
        <uni-group top="0" class="ui-group">
          <uni-forms-item label="客户信息:">
            <uni-easyinput v-model="applyForm.custNo" type="text" class="uni-input--disabled" :inputBorder="false" disabled />
          </uni-forms-item>
        </uni-group>
        <uni-group top="0" class="ui-group">
          <uni-forms-item label="车号:">
            <uni-combox v-model="applyForm.vehicleNo" :candidates="vehicleData" combox="vehicleNo" title="vehicleNo" remote :border="false" placeholder="请输入车号信息" @input="searchVehicle"></uni-combox>
          </uni-forms-item>
        </uni-group>
        <uni-group top="0" class="ui-group">
          <uni-forms-item label="司机姓名:">
            <uni-easyinput v-model="applyForm.driverName" type="text" :inputBorder="false" placeholder="请输入司机姓名" />
          </uni-forms-item>
        </uni-group>
        <uni-group top="0" class="ui-group">
          <uni-forms-item label="身份证号:">
            <uni-easyinput v-model="applyForm.idCard" type="idcard" :inputBorder="false" placeholder="请输入身份证号" />
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
            <uni-easyinput v-model="applyForm.shipmentNum" type="text" :inputBorder="false" placeholder="发运次数" />
          </uni-forms-item>
        </uni-group>
        <uni-group top="0" class="ui-group">
          <uni-forms-item label="超长车标志:">
            <uni-easyinput v-model="applyForm.isOverLenghFlag" type="text" :inputBorder="false" placeholder="超长车标志" />
          </uni-forms-item>
        </uni-group>
      </uni-forms>

      <view class="ui-footer">
        <button type="primary" @click="submit">提 交</button>
      </view>
    </uni-card>

    <uni-popup ref="popup" background-color="#fff" :is-mask-click="false">
      <view class="popup-header">
        <uni-nav-bar left-icon="closeempty" title="合同信息" @clickLeft="close"></uni-nav-bar>
      </view>
      <Contract @select="handleSelect"></Contract>
    </uni-popup>
  </view>
</template>
<script>
  import _ from 'lodash';
  import { commonApi } from '@/api/common';
  import { truckingOrder } from './index';
  import Contract from '@/components/Contract/Contract';

  export default {
    name: 'MajorCustomApply',

    components: {
      Contract
    },

    data() {
      return {
        applyForm: _.cloneDeep(truckingOrder.mApplyForm),
        vehicleData: []
      }
    },

    methods: {
      // 后退
      goBack() {
        uni.reLaunch({
          url: '/pages/dashboard/Dashboard'
        })
      },

      // 弹出模态框
      handleClick() {
        this.$refs.popup.open('bottom');
      },

      searchVehicle() {

      },

      submit() {

      },

      handleSelect(item) {
        console.log(item);
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
