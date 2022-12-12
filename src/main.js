import Vue from 'vue'
import App from './App'
import Empty from '@/components/Empty/Empty.vue';

Vue.config.productionTip = false;
Vue.component('uni-empty', Empty);

App.mpType = 'app';

const app = new Vue({
  ...App
})
app.$mount()
