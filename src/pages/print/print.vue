<template>
  <view class="ui-body" style="height: 100%;">
    <view style="height: var(--status-bar-height); background-color: #FFF;"></view>
    <view class="box-bg">
      <uni-nav-bar left-icon="left" title="榜单打印" @clickLeft="goBack" />
    </view>

    <button @click="print">打印</button>
  </view>
</template>

<script>
  const printer = uni.requireNativePlugin('LcPrinter');
  export default {
    data() {
      return {

      }
    },
    created() {
      const system = uni.getSystemInfoSync();
      const globalEvent = uni.requireNativePlugin('globalEvent');

      printer.getInstance();

      printer.getPrintUtil(event => {
        
      })

      globalEvent.addEventListener('onPrintCallback', function(e) {
        console.log(e);
      });

      globalEvent.addEventListener('onVersion', function(e) {
        console.log(e);
      })
    },
    methods: {
      goBack() {
        uni.reLaunch({
          url: '/pages/dashboard/Dashboard'
        })
      },
      print() {
        printer.setUnwindPaperLen(30);
        printer.printEnableMark(false);
        printer.printConcentration(25);
        printer.printText("打印文本 1");
        printer.printGoToNextMark();

        printer.start();
      }
    }
  }
</script>

<style>

</style>
