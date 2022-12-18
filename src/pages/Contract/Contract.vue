<template>
  <view style="height: 100%;">
    <view style="height: var(--status-bar-height); background-color: #FFF;"></view>
    <view class="box-bg">
      <uni-nav-bar left-icon="closeempty" right-icon="search" title="合同信息" @clickLeft="goBack" @clickRight="open" />
    </view>

    <scroll-view scroll-y class="ui-scroll" @scrolltolower="onLoadPager">
      <uni-card
        v-for="(item, index) in contractData"
        :class="{ 'ui-card--border': index === selector}"
        margin="0 16px 16px"
        spacing="0"
        padding="0"
        :key="index"
        is-shadow
        @click="onCardClick(index)">
        <view class="ui-card__header">
          <b>合同信息</b>
          <button v-if="index === selector" type="default" class="ui-card__button" @click="handleSelect(item)">确 定</button>
        </view>
        <view class="ui-card__content">
          <view v-for="(v, i) in contractItem" :key="i" class="ui-list-item">
            <text style="color: #777777;">{{v.title}}</text>
            <b style="float: right; color: #252525;">{{ item[v.prop] }}</b>
          </view>
        </view>
      </uni-card>
    </scroll-view>

    <uni-load-more :status="loadStatus"></uni-load-more>

    <uni-popup ref="popup" background-color="#fff" :is-mask-click="false">
      <view class="popup-header">
        <uni-nav-bar left-icon="closeempty" title="派车单查询" @clickLeft="close"></uni-nav-bar>
      </view>
      <view class="popup-content">
        <uni-forms ref="searchForm" :model="searchForm" class="ui-forms-inline" label-align="right" label-width="100">
          <uni-forms-item v-if="roleType !== '0'" label="处置单位:">
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
  import { commonApi } from '@/api/common';
  import { Contract } from './index.js';
  import CommonMixin from '@/mixins/common.mixin';

  export default {
    name: 'Contract',

    mixins: [CommonMixin],

    data() {
      return {
        contractData: [],
        searchForm: _.cloneDeep(Contract.searchForm),
        contractItem: Contract.contractItem,
        selector: -1,
        roleType: '-1'
      };
    },

    created() {
      const user = uni.getStorageSync('userBaseEntity');
      this.roleType = user.roleType;

      this.searchCust();
      this.searchMaterial();
      this.getUnit();
      this.getPager();
    },

    methods: {
      goBack() {
        uni.navigateBack();
      },

      getPager() {
        const user = uni.getStorageSync('userBaseEntity');
        const params = {
          ...this.selectCache,
          pageNo: this.pageNum,
          pageSize: this.pageSize
        };
        
        if (user.roleType === '0') {
          Object.assign(params, {
            custNo: user.id
          })
        }

        commonApi.getSaleOrder(params)
          .then(result => {
            if (!result.success) {
              this.completed = true;
              this.loadStatus = 'noMore';
              this.close()
              return;
            }

            this.contractData = result.list;
            if (this.pageNum * this.pageSize >= result.total) {
              this.completed = true;
              this.loadStatus = 'noMore';
            }

            this.close()
          })
      },

      open() {
        this.$refs.popup.open('bottom');
      },

      // 关闭弹出框
      close() {
        this.$refs.popup.close();
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

      search() {
        this.pageNum = 1;
        this.contractData = [];
        this.completed = false;
        this.loadStatus = 'more';
        Object.assign(this.selectCache, this.searchForm);
        this.getPager();
      },

      reset() {
        this.searchForm = _.cloneDeep(Contract.searchForm);
      },

      onCardClick($index) {
        this.selector = $index;
      },

      handleSelect(item) {
        const { orderId, orderNo, custNo, custName, organizationId, organizationName, materialCode, materialName } = item;
        const pages = getCurrentPages();
        const prevPage = pages[pages.length - 2];
        Object.assign(prevPage.$vm.applyForm, {
          orderMainNo: orderId,
          orderSubNo: orderNo,
          materialNo: materialCode,
          materialName,
          custNo,
          custName,
          organizationId,
          organizationName
        })
        uni.navigateBack();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .popup-content {
    padding: 16px 8px;
  }

  .ui-card__header {
    height: 32px;
    line-height: 32px;
    padding: 0 16px;
    background-color: #FAFAFA;
    border-bottom: 1px solid #FFF;
  }

  .ui-card__button {
    display: inline-block;
    float: right;
    color: #007aff;
    font-size: 14px;
    padding: 0;
    border: none;
  }

  .ui-card__content {
    padding: 8px 16px;
    background-color: #FAFAFA;

    .ui-list-item {
      height: 32px;
      line-height: 32px;
    }
  }

  uni-button::after {
    border: none;
  }

  .ui-button {
    display: inline-block;
    width: calc(50% - 8px);
    font-size: 14px;
  }

  .ui-card--border {
    border-color: #007aff !important;
  }

  /deep/ .uni-card--border {
    border: 1px solid #FAFAFA;
    border-radius: 16px;
  }

  .ui-scroll {
    height: calc(100% - var(--status-bar-height) - 85px);
    box-sizing: border-box;
    padding-top: 16px;
  }

  .ui-forms-inline .uni-forms-item {
    padding: 0 16px;
  }
</style>
