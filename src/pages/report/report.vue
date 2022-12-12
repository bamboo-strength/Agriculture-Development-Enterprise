<template>
  <view class="ui-body" style="height: 100%;">
    <view style="height: var(--status-bar-height); background-color: #FFF;"></view>
    <view class="box-bg">
      <uni-nav-bar left-icon="left" right-icon="search" title="项目报表" @clickLeft="goBack" @clickRight="open" />
    </view>

    <scroll-view scroll-y class="ui-scroll" @scrolltolower="onLoadPager">
      <uni-card v-for="(item, index) in reportData" margin="0 16px 16px" spacing="0" padding="0" :key="index" is-shadow>
        <view class="ui-card__content">
          <view v-for="(v, i) in reportItem" :key="i" class="ui-list-item">
            <text style="color: #777777;">{{v.title}}</text>
            <b v-if="v.dict" style="float: right; color: #252525;">
              {{ v.dict[item[v.prop]] }}
            </b>
            <b v-else style="float: right; color: #252525;">{{ item[v.prop] }}{{ v.suffix }}</b>
          </view>
        </view>
      </uni-card>
    </scroll-view>

    <uni-load-more :status="loadStatus"></uni-load-more>

    <uni-popup ref="popup" background-color="#fff" :is-mask-click="false">
      <view class="popup-header">
        <uni-nav-bar left-icon="closeempty" title="项目查询" @clickLeft="close"></uni-nav-bar>
      </view>

      <view class="popup-content">
        <uni-forms :model="searchForm" label-align="right" label-width="100">
          <uni-forms-item label="项目名称:">
            <uni-easyinput v-model="searchForm.itemname" type="text" placeholder="请输入项目名称" />
          </uni-forms-item>
          <uni-forms-item label="项目编号:">
            <uni-easyinput v-model="searchForm.projectNo" type="text" placeholder="请输入项目编号" />
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
  import { report } from './index';
  import { reportApi } from '@/api/report';
  import CommonMixin from '@/mixins/common.mixin';

  export default {
    name: 'report',

    mixins: [CommonMixin],

    data() {
      return {
        searchForm: _.cloneDeep(report.searchForm),
        reportData: [],
        reportItem: report.reportItem
      }
    },

    created() {
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
        this.reportData = [];
        this.completed = false;
        this.loadStatus = 'more';
        Object.assign(this.selectCache, this.searchForm);
        this.getPager();
      },

      reset() {
        this.searchForm = _.cloneDeep(report.searchForm);
      },

      getPager() {
        const params = {
          ...this.selectCache,
          pageNo: this.pageNum,
          pageSize: this.pageSize
        };
        reportApi.getProject(params)
          .then(result => {
            if (!result.success) {
              this.reportData = [];
              this.completed = true;
              this.loadStatus = 'noMore';
              this.close()
              return;
            }

            this.reportData = this.reportData.concat(result.list);

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
    padding-top: 16px
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
</style>
<style lang="scss" src="@/uni_modules/uni-card/components/uni-card/uni-card.scss"></style>
