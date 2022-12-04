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
  </view>
</template>

<script>
  import _ from 'lodash';
  import { commonApi } from '@/api/common';
  import { truckingOrder } from './index';

  export default {
    name: 'RetailInverstorApply',
    data() {
      return {
        applyForm: _.cloneDeep(truckingOrder.rApplyForm),
        custData: [],
        materialData: [],
        unitData: [],
        vehicleData: []
      }
    },
    methods: {
      goBack() {
        uni.reLaunch({
          url: '/pages/dashboard/Dashboard'
        })
      },

      getUnit() {
        commonApi.getUnit()
          .then(result => {
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
      },

      // 物资检索
      searchMaterial($event) {
        commonApi.getMaterial({ spellCode: $event })
          .then(result => {
            if (!result.success) {
              this.materialData = [];
              return;
            }
            this.materialData = [
              ...result.list
            ]
          })
      },

      // 客户信息检索
      searchCust($event) {
        commonApi.getCust({ spellCode: $event })
          .then(result => {
            if (!result.success) {
              this.custData = [];
              return;
            }
            this.custData = [
              ...result.list
            ]
          })
      },

      submit() {}
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
