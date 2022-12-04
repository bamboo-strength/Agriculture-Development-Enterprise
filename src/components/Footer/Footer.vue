<template>
	<view>
    <text>Copyright <text class="iconfont icon icon-copyright" /> {{currentYear}}</text>
	</view>
</template>

<script>
export default {
  data() {
    return {
      currentYear: new Date().getFullYear()
    }
  }
}
</script>
<style lang="scss" scoped>
  .icon {
    font-size: 16px;
    padding: 0 4px;
  }
</style>
