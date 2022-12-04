<template>
  <view class="ui-body" style="height: 100%;">
    <view style="height: var(--status-bar-height); background-color: #FFF;"></view>
    <view class="box-bg">
      <uni-nav-bar left-icon="left" right-icon="search" title="派车单查询" @clickLeft="goBack" @clickRight="open" />
    </view>

    <scroll-view scroll-y class="ui-scroll" @scrolltolower="onLoadPager">
      <uni-card
        v-for="(item, index) in truckingOrderData"
        spacing="0"
        padding="0"
        :key="index"
        is-shadow>

        <view class="ui-card__content">
          <view class="ui-list-item">
            <text style="color: #777777;">派车单号</text>
            <b style="float: right; color: #252525;">{{ item.dispatchNo }}</b>
          </view>
          <view v-for="(v, i) in orderItem" :key="i" class="ui-list-item">
            <text style="color: #777777;">{{v.title}}</text>
            <b style="float: right; color: #252525;">{{ item[v.prop] }}</b>
          </view>
        </view>
        <div class="ui-card__footer">
          <button type="primary" class="ui-button--primary">修 改</button>
          <button type="warn" class="ui-button--warn">删 除</button>
        </div>
      </uni-card>
    </scroll-view>

    <uni-load-more :status="loadStatus"></uni-load-more>

    <uni-popup ref="popup" background-color="#fff" :is-mask-click="false">
      <view class="popup-header">
        <uni-nav-bar left-icon="closeempty" title="派车单查询" @clickLeft="close"></uni-nav-bar>
      </view>
      <view class="popup-content">
        <uni-forms ref="searchForm" :model="searchForm" label-align="right" label-width="100">
          <uni-forms-item label="客户信息:">
            <uni-combox v-model="searchForm.custNo" :candidates="custData" combox="custNo" title="custName" remote placeholder="请输入客户简码进行检索" @input="searchCust"></uni-combox>
          </uni-forms-item>
          <uni-forms-item label="物资信息:">
            <uni-combox v-model="searchForm.materialNo" :candidates="materialData" combox="materialCode" title="materialName" remote placeholder="请输入物资简码进行检索" @input="searchMaterial"></uni-combox>
          </uni-forms-item>
          <uni-forms-item label="所属单位:">
            <uni-data-picker
              v-model="searchForm.organizationId"
              :localdata="unitData"
              placeholder="请选择所属单位"
              popup-title="请选择所属单位"
            />
          </uni-forms-item>
          <uni-forms-item label="业务类型:">
            <uni-data-select v-model="searchForm.businessType" :localdata="businessTypes" clear placeholder="请选择业务类型" />
          </uni-forms-item>
          <uni-forms-item label="车辆状态:">
            <uni-data-select v-model="searchForm.vehicleStatus" :localdata="vehicleStatus" clear placeholder="请选择车辆状态" />
          </uni-forms-item>
          <uni-forms-item label="开始时间:">
            <uni-datetime-picker v-model="searchForm.startDate" type="datetime" />
          </uni-forms-item>
          <uni-forms-item label="结束时间:">
            <uni-datetime-picker v-model="searchForm.endDate" type="datetime" />
          </uni-forms-item>

          <view style="text-align: right;">
            <button type="primary" class="ui-button" style="margin-right: 8px;" @click="search">查 询</button>
            <button type="default" class="ui-button" style="margin-left: 8px;" @click="reset">重 置</button>
          </view>
        </uni-forms>
      </view>
    </uni-popup>
  </view>
</template>

<script>
  import _ from 'lodash';
  import { truckingOrder } from './index';
  import { commonApi } from '@/api/common';
  import { truckingOrderApi } from '@/api/truckingOrder';

  export default {
    data() {
      return {
        searchForm: _.cloneDeep(truckingOrder.truckingOrderForm),
        custData: [],
        materialData: [],
        unitData: [],
        businessTypes: truckingOrder.businessTypes,
        vehicleStatus: truckingOrder.vehicleStatus,
        selectCache: {},
        pageNum: 1,
        pageSize: 5,
        truckingOrderData: [],
        orderItem: truckingOrder.orderItem,
        completed: false,
        loadStatus: 'more'
      }
    },
    created() {
      this.getUnit();
      this.getPager();
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

      open() {
        this.$refs.popup.open('bottom');
      },

      close() {
        this.$refs.popup.close();
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

      onLoadPager() {
        if (this.completed) {
          this.loadStatus = 'noMore';
          return;
        }
        this.pageNum++;
        this.loadStatus = 'loading';
        this.getPager();
      },

      // 查询
      search() {
        this.pageNum = 1;
        this.truckingOrderData = [];
        this.completed = false;
        this.loadStatus = 'more';
        Object.assign(this.selectCache, this.searchForm);
        this.getPager();
      },

      // 重置
      reset() {
        this.searchForm = _.cloneDeep(truckingOrder.truckingOrderForm);
      },

      getPager() {
        const vehicleNo = uni.getStorageSync('vehicleNo');
        const params = {
          ...this.selectCache,
          // vehicleNo,
          pageNo: this.pageNum,
          pageSize: this.pageSize
        };

        truckingOrderApi.getDispatch(params)
          .then(result => {
            this.truckingOrderData = this.truckingOrderData.concat(result.list);

            this.loadStatus = 'more';

            if (this.pageNum * this.pageSize >= result.total) {
              this.completed = true;
              this.loadStatus = 'noMore';
            }

            this.close()
          })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .ui-body {
    background-color: #FFF;
  }

  .popup-content {
    padding: 16px 8px;
  }

  .ui-button {
    display: inline-block;
    width: calc(50% - 8px);
    font-size: 14px;
  }

  .ui-scroll {
    height: calc(100% - var(--status-bar-height) - 85px);
  }

  /deep/ .uni-card--border {
    border: 1px solid #FAFAFA !important;
    border-radius: 16px !important;
  }

  .ui-card__content {
    padding: 16px 16px 8px;
    background-color: #FAFAFA;

    border-bottom: 1px solid #FFF;

    .ui-list-item {
      height: 32px;
      line-height: 32px;
    }
  }

  .ui-card__footer {
    padding: 8px 16px 0;
    text-align: right;
    background-color: #FAFAFA;

    .ui-button--primary {
      width: 64px;
      font-size: 14px;
      display: inline-block;
      margin-right: 16px;
      border: 1px solid #007aff;
      color: #007aff;
      background-color: #FFF;
      padding: 0 8px;
      line-height: 32px;
    }

    .ui-button--warn {
      width: 64px;
      font-size: 14px;
      display: inline-block;
      border: 1px solid #e64340;
      color: #e64340;
      background-color: #FFF;
      padding: 0 8px;
      line-height: 32px;
    }
  }


</style>
<style lang="scss" src="@/uni_modules/uni-card/components/uni-card/uni-card.scss"></style>
