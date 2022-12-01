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
          { title: '派车单查询', icon: 'trucking-order', className: 'ui-icon', url: '/pages/trucking/Order' }
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
