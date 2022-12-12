<template>
  <view style="height: 100%;">
    <view style="height: var(--status-bar-height); background-color: #FFF;"></view>
    <view class="box-bg">
      <uni-nav-bar left-icon="left" title="实时监控" @clickLeft="goBack" />
    </view>

    <web-view :src="`/hybrid/html/hikVideo.html?realplay=${realplay}`" class="ui-webView" :fullscreen="false" :webview-styles="styles" @message="onPostMessage"></web-view>

    <view class="ui-content" :style="{top: top}">
      <uni-data-select v-model="canvasCode" :localdata="camerasData" :map="defaultProps" @change="canvasChange"></uni-data-select>
    </view>


  </view>
</template>

<script>
  import { hikApi } from '@/api/hik';
  export default {
    data() {
      const barHeight = uni.getSystemInfoSync().statusBarHeight;
      const top = barHeight + 45 + 8;
      const screenWidth = uni.getSystemInfoSync().screenWidth;
      return {
        canvasCode: '524d1ed475cd4d1191140b6e03a127f5',
        camerasData: [],
        defaultProps: {
          text: 'cameraName',
          value: 'cameraIndexCode'
        },
        top: screenWidth + 8 + 'px',
        realplay: '',
        index: 1,
        styles: {
          top: top,
          width: '100%',
          height: screenWidth
        }
      }
    },

    created() {
      this.getToken();
    },

    methods: {
      goBack() {
        plus.screen.lockOrientation('portrait');
        uni.reLaunch({
          url: '/pages/dashboard/Dashboard'
        })
      },

      getToken() {
        hikApi.getToken()
          .then(result => {
            if (result.code !== '0') {
              return uni.showToast({
                icon: 'error',
                title: '系统异常!'
              })
            }

            uni.setStorageSync('accessToken', result.data.access_token);

            this.getCameras();
          })
      },

      getCameras() {
        const params = {
          pageNo: 1,
          pageSize: 100
        }
        hikApi.getCanvas(params)
          .then(result => {
            this.camerasData = result.data.list;
            this.canvasChange(this.canvasCode);
          })
      },

      canvasChange($event) {
        if (!$event) {
          return;
        }

        this.getStreaning($event);
      },

      getStreaning(cameraIndexCode) {
        const params = {
          cameraIndexCode,
          streamType: 0,
          protocol: 'ws',
          transmode: 1,
          expand: 'transcode=0',
          streamform: 'ps'
        };

        hikApi.getStreaning(params)
          .then(result => {
            this.realplay = result.data.url;
          })
      },

      onPostMessage($event) {
        const content = $event.detail.data[0];
        switch (content.type) {
          case 'fullscreen':
            plus.screen.lockOrientation(content.fullscreen ? 'landscape-primary' : 'portrait');
            break;
          case 'error':
            uni.showModal({
              title: '提示',
              content: '视频播放异常, 请重试或切换摄像头!',
              success: result => {
                if (result.confirm) {
                  this.getStreaning(this.canvasCode);
                }
              }
            })
            break;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .ui-content {
    position: relative;
    padding: 8px;
    background-color: #FFF;
  }

  .ui-webView {
    position: relative;
  }
</style>
