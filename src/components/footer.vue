<template>
	<view>
    {{currentYear}}
	</view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'Footer'
})
export default class Footer extends Vue {
  currentYear: Number = new Date().getFullYear();
}
</script>
