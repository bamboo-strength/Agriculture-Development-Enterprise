<template>
  <view>
   <uni-grid :column="3" :highlight="true" :showBorder="false" @change="gridClick">
     <template v-for="(item, index) in funcs">
        <uni-grid-item v-if="item.roleTypes.includes(roleType)" :index="index" :key="index">
          <view class="grid-item-box" style="background-color: #fff;">
            <text :class="`iconfont icon-${item.icon} ${item.className}`" />
            <text class="text">{{item.title}}</text>
          </view>
        </uni-grid-item>
      </template>
    </uni-grid>
  </view>
</template>

<script>
  // roleType: '0': '处置端', '1': '地块端', '2': '司机端'
  export default {
    data() {
      return {
        funcs: [
          { title: '派车单查询', icon: 'trucking-order', className: 'ui-icon', url: '/pages/trucking/Order', roleTypes: ['0', '1', '2'] },
          { title: '处置单位派车', icon: 'dispatch', className: 'ui-icon', url: '/pages/trucking/MajorCustomApply', roleTypes: ['0', '1'] },
          { title: '散户销售派车', icon: 'dispatch', className: 'ui-icon', url: '/pages/trucking/RetailInverstorApply', roleTypes: [] },
          { title: '实时监控', icon: 'monitor', className: 'ui-icon', url: '/pages/monitor/Monitor', roleTypes: ['1'] },
          { title: '项目报表', icon: 'report', className: 'ui-icon', url: '/pages/report/report', roleTypes: ['1'] },
          { title: '项目公示', icon: 'project', className: 'ui-icon', url: '/pages/project/project', roleTypes: [] },
          { title: '榜单打印', icon: 'print', className: 'ui-icon', url: '/pages/print/print', roleTypes: [] }
        ],
        roleType: '-1'
      }
    },
    onShow() {
      // #ifdef APP-PLUS
      plus.navigator.setFullscreen(false)
      // #endif
    },
    created() {
      const user = uni.getStorageSync('userBaseEntity');
      this.roleType = user.roleType;
    },
    methods: {
      gridClick(event) {
        const { detail: { index } } = event;
        const item = this.funcs[index];
        uni.reLaunch({
          url: item.url
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .uni-grid-wrap {
    background-color: #FFF;
  }

  .grid-item-box {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 15px 0;
  }

  .ui-icon {
    color: rgb(69, 129, 245);
    font-size: 24px;
  }

  .text {
    font-size: 13px;
    color: #000;
    margin-top: 5px;
  }
</style>
