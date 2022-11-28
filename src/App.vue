<script lang="ts">
    import Vue from 'vue';
    export default Vue.extend({
        mpType: 'app',
        onLaunch() {
          if (!uni.getStorageSync('token')) {
            uni.reLaunch({
              url: '/pages/user/login',
              success() {
                // #ifdef APP-PLUS
                plus.navigator.closeSplashscreen()
                // #endif
              }
            });
          } else {
            uni.reLaunch({
              url: '/pages/index/index',
              success() {
                // #ifdef APP-PLUS
                plus.navigator.closeSplashscreen()
                // #endif
              }
            })
          }
        },
        onShow() {
            console.log('App Show')
        },
        onHide() {
            console.log('App Hide')
        }
    });
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	@import '@/static/customicons.css';
	// 设置整个项目的背景色
	page {
		background-color: #f5f5f5;
    height: 100%;
	}
	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}
</style>
