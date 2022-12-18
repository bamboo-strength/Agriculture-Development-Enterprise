<template>
  <view style="height: 100%;">
    <view style="height: var(--status-bar-height); background-color: #FFF;"></view>
    <view class="box-bg">
      <uni-nav-bar left-icon="left" title="派车单详情" @clickLeft="goBack" />
    </view>

    <view class="uni-content">
      <view class="uni-tabs">
        <text class="uni-tabs-pane" :class="{ 'active': tabsIndex === 0 }" @click="tabsClick(0)">基本信息</text>
        <text class="uni-tabs-pane" :class="{ 'active': tabsIndex === 1 }" @click="tabsClick(1)">磅单信息</text>

      </view>

      <view class="uni-tabs--content">
        <view v-if="tabsIndex === 0">
          <uni-list style="margin-top: 4px;">
            <uni-list-item title="派车单号" :rightText="dispatchForm.dispatchNo">
              <template #extra>
                <button class="v-btn-print" :disabled="printerDisabled" @click="print">打印</button>
              </template>
            </uni-list-item>
            <uni-list-item title="所属机构" :rightText="dispatchForm.organization.name"></uni-list-item>
            <uni-list-item title="业务类型" :rightText="businessType[dispatchForm.businessType]"></uni-list-item>
            <uni-list-item title="发运类型" :rightText="dispatchForm.shipmentTypeName"></uni-list-item>
            <uni-list-item title="物资名称" :rightText="dispatchForm.materialName"></uni-list-item>
            <uni-list-item title="处置单位" :rightText="dispatchForm.custName"></uni-list-item>
            <uni-list-item title="车号" :rightText="dispatchForm.vehicleNo"></uni-list-item>
            <uni-list-item title="车辆状态" :rightText="vehicleStatus[dispatchForm.vehicleStatus]"></uni-list-item>
            <uni-list-item title="预装量" :rightText="`${dispatchForm.preamount} 吨`"></uni-list-item>
            <uni-list-item title="司机姓名" :rightText="dispatchForm.driverName"></uni-list-item>
            <uni-list-item title="身份证号" :rightText="dispatchForm.idCard"></uni-list-item>
            <uni-list-item title="超长车标识" :rightText="dispatchForm.isOverLenghFlag === '1' ? '是' : '否'"></uni-list-item>
            <uni-list-item title="循环次数" :rightText="dispatchForm.shipmentNum === 0 ? '不限制' : `${dispatchForm.shipmentNum}次`"></uni-list-item>
          </uni-list>
          <u-qrcode style="margin: 16px auto;" canvasId="qr" :value="baseCode"></u-qrcode>
        </view>
        <view v-else>
          <uni-list style="margin-top: 4px;">
            <uni-empty v-if="dispatchForm.vehicleStatus === '0'" description="暂无磅单信息"></uni-empty>
            <template v-else>
              <uni-list-item title="称重序号" :rightText="dispatchForm.weightNo"></uni-list-item>
              <uni-list-item title="皮重" :rightText="`${dispatchForm.tareWeight} 吨`"></uni-list-item>
              <uni-list-item title="毛重" :rightText="`${dispatchForm.grossWeight} 吨`"></uni-list-item>
              <uni-list-item title="净重" :rightText="`${dispatchForm.netWeight} 吨`"></uni-list-item>
              <uni-list-item title="预装量" :rightText="`${dispatchForm.preamount} 吨`"></uni-list-item>
              <uni-list-item title="实收量" :rightText="`${dispatchForm.receiveAmount ? dispatchForm.receiveAmount : 0} 吨`"></uni-list-item>
              <uni-list-item title="空车时间" :rightText="dispatchForm.firstTime"></uni-list-item>
              <uni-list-item title="重车时间" :rightText="dispatchForm.secondTime"></uni-list-item>
            </template>
          </uni-list>

          <u-qrcode style="margin: 16px auto;" canvasId="qr" :value="weightCode"></u-qrcode>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import { truckingOrderApi } from '@/api/truckingOrder';
  import { printConfig } from '@/utils/print.js';

  const businessType = {
    '01': '销售',
    '02': '采购'
  };

  const vehicleStatus = {
    '0': '已派车',
    '2': '已进门',
    '3': '一次过磅',
    '5': '二次过磅',
    '6': '已出厂'
  }

  export default {
    data() {
      return {
        tabsIndex: 0,
        dispatchForm: {
          organization: {}
        },
        businessType,
        vehicleStatus,
        baseCode: '',
        weightCode: '',
        printer: null,
        printerDisabled: false
      }
    },

    onLoad(data) {
       this.getDispatch(data.dispatchId);
    },

    created() {
      const system = uni.getSystemInfoSync();
      if (system.platform !== 'android') {
        return;
      }

      // #ifdef APP-PLUS
      const printer = uni.requireNativePlugin('LcPrinter');

      printer.getInstance();

      printer.printEnableMark(false);

      this.printer = printer;

      const globalEvent = uni.requireNativePlugin('globalEvent');

      globalEvent.addEventListener('onPrintCallback', function(e) {
        this.printerDisabled = false;
      });

      globalEvent.addEventListener('onVersion', function(e) {
        console.log(e);
      });
      // #endif
    },

    methods: {
      goBack() {
        uni.navigateBack();
      },

      getDispatch(dispatchId) {
        truckingOrderApi.getDispatchById({ id: dispatchId })
          .then(result => {
            Object.assign(this.dispatchForm, result);
            this.baseCode = result.dispatchNo;
            this.weightCode = `磅单编号: ${result.weightNo}\n 所属机构: ${result.organization.name}\n` +
              `处置单位: ${result.custName}\n 物资名称: ${result.materialName}\n 车牌号: ${result.vehicleNo}\n` +
              `皮重(t): ${result.tareWeight}\n 毛重(t): ${result.grossWeight}\n 净重(t): ${result.netWeight}\n` +
              `发运类型: ${result.shipmentTypeName}\n 空车时间: ${result.firstTime}\n 重车时间: ${result.secondTime}`
          })
      },

      print() {
        const { printer } = this;
        const { organization, weightNo, custName, materialName, vehicleNo, tareWeight, grossWeight, netWeight, shipmentTypeName, firstTime, secondTime } = this.dispatchForm;

        this.printerDisabled = true;
        printer.setUnwindPaperLen(1000);

        printer.printText(this.normailzation(printConfig.align.ALIGN_CENTER, printConfig.fontSize.TOP_FONT_SIZE_MIDDLE, false, false, '------------------------------------------------------\n'));
        printer.printText(this.normailzation(printConfig.align.ALIGN_CENTER, printConfig.fontSize.TOP_FONT_SIZE_XMIDDLE, true, true, `${organization.name}过磅单\n`));
        printer.printText(this.normailzation(printConfig.align.ALIGN_CENTER, printConfig.fontSize.TOP_FONT_SIZE_MIDDLE, false, false, '------------------------------------------------------\n'));

        printer.printLine(1);

        printer.printText(this.normailzation(printConfig.align.ALIGN_LEFT, printConfig.fontSize.TOP_FONT_SIZE_MIDDLE, false, false, `磅单编号: ${weightNo}\n`));
        printer.printText(this.normailzation(printConfig.align.ALIGN_LEFT, printConfig.fontSize.TOP_FONT_SIZE_MIDDLE, false, false, `所属机构: ${organization.name}\n`));
        printer.printText(this.normailzation(printConfig.align.ALIGN_LEFT, printConfig.fontSize.TOP_FONT_SIZE_MIDDLE, false, false, `处置单位: ${custName}\n`));
        printer.printText(this.normailzation(printConfig.align.ALIGN_LEFT, printConfig.fontSize.TOP_FONT_SIZE_MIDDLE, false, false, `物资名称: ${materialName}\n`));
        printer.printText(this.normailzation(printConfig.align.ALIGN_LEFT, printConfig.fontSize.TOP_FONT_SIZE_MIDDLE, false, false, `车    号: ${vehicleNo}\n`));
        printer.printText(this.normailzation(printConfig.align.ALIGN_LEFT, printConfig.fontSize.TOP_FONT_SIZE_MIDDLE, false, false, `皮 重(t): ${tareWeight}\n`));
        printer.printText(this.normailzation(printConfig.align.ALIGN_LEFT, printConfig.fontSize.TOP_FONT_SIZE_MIDDLE, false, false, `毛 重(t): ${grossWeight}\n`));
        printer.printText(this.normailzation(printConfig.align.ALIGN_LEFT, printConfig.fontSize.TOP_FONT_SIZE_MIDDLE, false, false, `净 重(t): ${netWeight}\n`));
        printer.printText(this.normailzation(printConfig.align.ALIGN_LEFT, printConfig.fontSize.TOP_FONT_SIZE_MIDDLE, false, false, `发运类型: ${shipmentTypeName}\n`));
        printer.printText(this.normailzation(printConfig.align.ALIGN_LEFT, printConfig.fontSize.TOP_FONT_SIZE_MIDDLE, false, false, `空车时间: ${firstTime}\n`));
        printer.printText(this.normailzation(printConfig.align.ALIGN_LEFT, printConfig.fontSize.TOP_FONT_SIZE_MIDDLE, false, false, `空车时间: ${secondTime}\n`));

        printer.printText(this.normailzation(printConfig.align.ALIGN_CENTER, printConfig.fontSize.TOP_FONT_SIZE_MIDDLE, false, false, '------------------------------------------------------\n'));

        printer.printQR({
          offset: printConfig.align.ALIGN_CENTER,
          height: 300,
          content: this.weightCode
        });

        printer.printText(this.normailzation(printConfig.align.ALIGN_CENTER, printConfig.fontSize.TOP_FONT_SIZE_MIDDLE, false, false, '------------------------------------------------------\n'));

        printer.printLine(6);

        printer.start();
      },

      normailzation(offset, fontSize, isBold, isUnderLine, content) {
        return {
          offset,
          fontSize,
          isBold,
          isUnderLine,
          content
        }
      },

      tabsClick($event) {
        this.tabsIndex = $event;
      }
    },

    onUnload() {
      // #ifdef APP-PLUS
      this.printer.onDestroy();
      this.printer = null;
      // #endif
    }
  }
</script>

<style lang="scss" scoped>
  .uni-content {
    height: calc(100% - var(--status-bar-height) - 45px);
  }

  .uni-tabs {
    height: 36px;
    background-color: #FFF;
  }

  .uni-tabs-pane {
    height: 24px;
    line-height: 24px;
    font-size: 16px;
    display: inline-block;
    margin: 8px 16px 0;
  }

  .active {
    color: #007aff;
  }

  .uni-tabs--content {
    height: calc(100% - 48px);
    overflow: auto;
  }

  .v-btn-print {
    padding: 0 8px;
    font-size: 14px;
    margin-right: 16px;
    border: 1px solid #007aff;
    color: #007aff;
    background-color: #FFF;
    height: 32px;
    line-height: 32px;
  }
</style>
