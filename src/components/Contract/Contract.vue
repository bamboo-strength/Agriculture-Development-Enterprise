<template>
  <view class="popup-content">
    <uni-collapse ref="collapse">
      <uni-collapse-item title="合同查询">
        <uni-forms ref="searchForm" :model="searchForm" class="ui-forms-inline" label-align="right" label-width="100">
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
          <uni-forms-item label="开始时间:">
            <uni-datetime-picker v-model="searchForm.startDate" type="datetime" />
          </uni-forms-item>
          <uni-forms-item label="结束时间:">
            <uni-datetime-picker v-model="searchForm.endDate" type="datetime" />
          </uni-forms-item>
          <view style="padding: 0 16px;">
            <button type="primary" @click="search">查 询</button>
          </view>
        </uni-forms>
      </uni-collapse-item>
    </uni-collapse>

    <scroll-view scroll-y class="ui-scroll" @scrolltolower="onLoadPager">
      <uni-card
        v-for="(item, index) in contractData"
        :class="{ 'ui-card--border': index === selector}"
        margin="0 0 16px 0"
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
  </view>
</template>

<script>
  import { commonApi } from '@/api/common';
  import { Contract } from './index.js';

  export default {
    name: 'Contract',

    data() {
      return {
        contractData: [],
        custData: [],
        materialData: [],
        unitData: [],
        searchForm: _.cloneDeep(Contract.searchForm),
        contractItem: Contract.contractItem,
        selector: -1,
        selectCache: {},
        pageNum: 1,
        pageSize: 5,
        completed: false,
        loadStatus: 'more'
      };
    },

    created() {
      this.getPager();
    },

    methods: {
      getPager() {
        const params = {
          ...this.selectCache,
          pageNo: this.pageNum,
          pageSize: this.pageSize
        };

        commonApi.getSaleOrder(params)
          .then(result => {
            this.contractData = result.list;

            if (this.pageNum * this.pageSize >= result.total) {
              this.completed = true;
              this.loadStatus = 'noMore';
            }
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

      search() {
        this.pageNum = 1;
        this.contractData = [];
        this.completed = false;
        this.loadStatus = 'more';
        Object.assign(this.selectCache, this.searchForm);
        this.getPager();
      },

      onCardClick($index) {
        this.selector = $index;
      },
      
      handleSelect(item) {
        this.$emit('select', item);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .popup-content {
    height: 80vh;
    display: flex;
    flex-direction: column;
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

  .ui-card--border {
    border-color: #007aff !important;
  }

  /deep/ .uni-card--border {
    border: 1px solid #FAFAFA;
    border-radius: 16px;
  }

  .ui-scroll {
    flex: 1;
    box-sizing: border-box;
    padding: 16px;
  }

  .ui-forms-inline .uni-forms-item {
    padding: 0 16px;
  }
</style>
