<template>
	<view class="user-layout">
    <view></view>
    <v-footer></v-footer>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Footer from '@/components/footer.vue';

@Component({
  name: 'UserLogin',
  components: {
    'v-footer': Footer
  }
})
export default class UserLogin extends Vue {

}
</script>

<style scoped lang="scss">
.user-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: url("../../static/images/login.jpg");
  background-size: 100% 100%;
}
</style>
