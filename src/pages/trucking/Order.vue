<template>
  <view class="ui-body" style="height: 100%;">
    <view style="height: var(--status-bar-height); background-color: #FFF;"></view>
    <view class="box-bg">
      <uni-nav-bar left-icon="left" right-icon="search" title="派车单查询" @clickLeft="goBack" @clickRight="open" />
    </view>

    <scroll-view scroll-y class="ui-scroll" @scrolltolower="onLoadPager">
      <uni-card
        v-for="(item, index) in truckingOrderData"
        margin="0 16px 16px"
        spacing="0"
        padding="0"
        :key="index"
        is-shadow
      >
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
          <button type="primary" class="ui-button--primary" @click="details(item)">查 看</button>
          <button v-if="item.vehicleStatus === '0'" type="primary" class="ui-button--primary" style="margin-left: 16px;" @click="updateDispatch(item)">修 改</button>
          <button v-if="item.vehicleStatus === '0'" type="warn" class="ui-button--warn" style="margin-left: 16px;" @click="deleteDispatch(item)">删 除</button>
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
  import CommonMixin from '@/mixins/common.mixin';

  export default {
    mixins: [CommonMixin],

    data() {
      return {
        searchForm: _.cloneDeep(truckingOrder.truckingOrderForm),
        businessTypes: truckingOrder.businessTypes,
        vehicleStatus: truckingOrder.vehicleStatus,
        truckingOrderData: [],
        orderItem: truckingOrder.orderItem
      }
    },
    created() {
      this.searchCust();
      this.searchMaterial();
      this.getUnit();
      this.getPager();
    },
    methods: {
      goBack() {
        uni.reLaunch({
          url: '/pages/dashboard/Dashboard'
        })
      },

      open() {
        this.$refs.popup.open('bottom');
      },

      close() {
        this.$refs.popup.close();
      },

      details($event) {
        const { id } = $event;
        uni.navigateTo({
          url: `/pages/trucking/details?dispatchId=${id}`
        })
      },

      // 修改页面跳转
      updateDispatch($event) {
        const { shipmentType, id } = $event;
        let url = '/pages/trucking/MajorCustomApply';

        if (shipmentType === '0201') {
          url = '/pages/trucking/RetailInverstorApply';
        }

        uni.navigateTo({
          url: `${url}?dispatchId=${id}`
        });
      },

      // 删除提示信息
      deleteDispatch($event) {
        const { dispatchNo } = $event;
        uni.showModal({
          title: '提示',
          content: `是否要删除派车单号为${dispatchNo}的派车单信息?`,
          success: result => {
            if (result.confirm) {
              this.toDeleteDispatch(dispatchNo)
            }
          }
        })
      },

      toDeleteDispatch(dispatchNo) {
        truckingOrderApi.deleteDispatch({ dispatchNo })
          .then(result => {
            if (!result.success) {
              return uni.showToast({
                icon: 'none',
                title: result.msg
              })
            };

            this.truckingOrderData = [];

            uni.showToast({
              icon: 'success',
              title: result.msg,
              success: () => {
                this.getPager();
              }
            })
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
            if (!result.success) {
              this.truckingOrderData = [];
              this.completed = true;
              this.loadStatus = 'noMore';
              this.close()
              return;
            }
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
    box-sizing: border-box;
    padding-top: 16px;
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
