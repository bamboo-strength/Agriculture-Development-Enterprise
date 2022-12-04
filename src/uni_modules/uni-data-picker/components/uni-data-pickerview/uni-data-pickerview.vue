<template>
  <view class="uni-data-pickerview">
    <scroll-view class="selected-area" scroll-x="true">
      <view class="selected-list">
        <template v-for="(item, index) in selected">
          <view class="selected-item"
            :key="index"
            :class="{ 'selected-item-active' :index == selectedIndex }"
            v-if="item.text" @click="handleSelect(index)">
            <text>{{ item.text }}</text>
          </view>
        </template>
      </view>
    </scroll-view>
    <view class="tab-c">
      <template v-for="(child, i) in dataList">
        <scroll-view class="list" :key="i" v-if="i==selectedIndex" :scroll-y="true">
          <view class="item" :class="{'is-disabled': !!item.disable}" v-for="(item, j) in child" :key="j"
            @click="handleNodeClick(item, i, j)">
            <text class="item-text">{{item[map.text]}}</text>
            <view class="check" v-if="selected.length > i && item[map.value] == selected[i].value"></view>
          </view>
        </scroll-view>
      </template>

      <view class="loading-cover" v-if="loading">
        <uni-load-more class="load-more" :contentText="loadMore" status="loading"></uni-load-more>
      </view>
      <view class="error-message" v-if="errorMessage">
        <text class="error-text">{{errorMessage}}</text>
      </view>
    </view>
  </view>
</template>

<script>
  import dataPicker from "./uni-data-picker.js"

  /**
   * DataPickerview
   * @description uni-data-pickerview
   * @tutorial https://ext.dcloud.net.cn/plugin?id=3796
   * @property {Array} localdata 本地数据，参考
   * @value true 启用分布查询，仅查询当前选中节点
   * @value false 关闭分布查询，一次查询出所有数据
   */
  export default {
    name: 'UniDataPickerView',
    emits: ['nodeclick', 'change', 'datachange', 'update:modelValue'],
    mixins: [dataPicker],
    props: {
      ellipsis: {
        type: Boolean,
        default: true
      }
    },
    created() {
      this.$nextTick(() => {
        this.loadLocalData();
      })
    },
    methods: {
      onPropsChange() {
        this._treeData = [];
        this.selectedIndex = 0;
        this.$nextTick(() => {
          this.loadLocalData();
        })
      },

      handleSelect(index) {
        this.selectedIndex = index;
      },

      handleNodeClick(item, i, j) {
        if (item.disable) {
          return;
        }

        const node = this.dataList[i][j];
        const text = node[this.map.text];
        const value = node[this.map.value];

        if (i < this.selected.length - 1) {
          this.selected.splice(i, this.selected.length - i)
          this.selected.push({
            text,
            value
          })
        } else if (i === this.selected.length - 1) {
          this.selected.splice(i, 1, {
            text,
            value
          })
        }

        if (node.isleaf) {
          this.onSelectedChange(node, node.isleaf)
          return
        }

        const {
          isleaf,
          hasNodes
        } = this._updateBindData()

        // 本地数据
        this.onSelectedChange(node, (!hasNodes || isleaf))
      },
      updateData(data) {
        this._treeData = data.treeData
        this.selected = data.selected
        if (!this._treeData.length) {
          this.loadLocalData()
        } else {
          //this.selected = data.selected
          this._updateBindData()
        }
      },
      onDataChange() {
        this.$emit('datachange');
      },
      onSelectedChange(node, isleaf) {
        if (isleaf) {
          this._dispatchEvent()
        }

        if (node) {
          this.$emit('nodeclick', node)
        }
      },
      _dispatchEvent() {
        this.$emit('change', this.selected.slice(0))
      }
    }
  }
</script>

<style lang="scss">
	$uni-primary: #007aff !default;

	.uni-data-pickerview {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		overflow: hidden;
		height: 100%;
	}

  .error-text {
    color: #DD524D;
  }

  .loading-cover {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, .5);
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: column;
    align-items: center;
    z-index: 1001;
  }

  .load-more {
    /* #ifndef APP-NVUE */
    margin: auto;
    /* #endif */
  }

  .error-message {
    background-color: #fff;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    padding: 15px;
    opacity: .9;
    z-index: 102;
  }

  /* #ifdef APP-NVUE */
  .selected-area {
    width: 750rpx;
  }
  /* #endif */

  .selected-list {
    /* #ifndef APP-NVUE */
    display: flex;
    flex-wrap: nowrap;
    /* #endif */
    flex-direction: row;
    padding: 0 5px;
    border-bottom: 1px solid #f8f8f8;
  }

  .selected-item {
    margin-left: 10px;
    margin-right: 10px;
    padding: 12px 0;
    text-align: center;
    /* #ifndef APP-NVUE */
    white-space: nowrap;
    /* #endif */
  }

  .selected-item-text-overflow {
    width: 168px;
    /* fix nvue */
    overflow: hidden;
    /* #ifndef APP-NVUE */
    width: 6em;
    white-space: nowrap;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    /* #endif */
  }

	.selected-item-active {
		border-bottom: 2px solid $uni-primary;
	}

	.selected-item-text {
		color: $uni-primary;
	}

  .tab-c {
    position: relative;
    flex: 1;
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: row;
    overflow: hidden;
  }

  .list {
    flex: 1;
  }

  .item {
    padding: 12px 15px;
    /* border-bottom: 1px solid #f0f0f0; */
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: row;
    justify-content: space-between;
  }

  .is-disabled {
    opacity: .5;
  }

  .item-text {
    /* flex: 1; */
    color: #333333;
  }

  .item-text-overflow {
    width: 280px;
    /* fix nvue */
    overflow: hidden;
    /* #ifndef APP-NVUE */
    width: 20em;
    white-space: nowrap;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    /* #endif */
  }

	.check {
		margin-right: 5px;
		border: 2px solid $uni-primary;
		border-left: 0;
		border-top: 0;
		height: 12px;
		width: 6px;
		transform-origin: center;
		/* #ifndef APP-NVUE */
		transition: all 0.3s;
		/* #endif */
		transform: rotate(45deg);
	}
</style>
