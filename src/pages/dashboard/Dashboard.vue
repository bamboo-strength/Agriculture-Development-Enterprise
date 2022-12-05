<template>
  <view>
   <uni-grid :column="3" :highlight="true" :showBorder="false" @change="gridClick">
      <uni-grid-item v-for="(item, index) in funcs" :index="index" :key="index">
        <view class="grid-item-box" style="background-color: #fff;">
          <text :class="`iconfont icon-${item.icon} ${item.className}`" />
          <text class="text">{{item.title}}</text>
        </view>
      </uni-grid-item>
    </uni-grid>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        funcs: [
          { title: '派车单查询', icon: 'trucking-order', className: 'ui-icon', url: '/pages/trucking/Order' },
          { title: '大客户销售派车', icon: 'dispatch', className: 'ui-icon', url: '/pages/trucking/MajorCustomApply' },
          { title: '散户销售派车', icon: 'dispatch', className: 'ui-icon', url: '/pages/trucking/RetailInverstorApply' },
          { title: '实时监控', icon: 'monitor', className: 'ui-icon', url: '/pages/monitor/Monitor' },
          { title: '项目报表', icon: 'report', className: 'ui-icon', url: '/pages/report/report' },
          { title: '项目公示', icon: 'project', className: 'ui-icon', url: '/pages/project/project' },
          { title: '榜单打印', icon: 'print', className: 'ui-icon', url: '/pages/print/print' }
        ]
      }
    },
    onShow() {
      // #ifdef APP-PLUS
      plus.navigator.setFullscreen(false)
      // #endif
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
