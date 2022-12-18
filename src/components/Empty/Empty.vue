<template>
  <view class="uni-empty">
    <view class="uni-empty__image">
      
    </view>

    <view class="uni-empty__description">
      <p>{{ description }}</p>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'UniEmpty',
    props: {
      description: {
        type: String,
        default: ''
      }
    },

    data() {
      return {

      }
    },
    methods: {

    }
  }
</script>

<style lang="scss" scoped>
  .uni-empty {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
    box-sizing: border-box;
    padding: 40px 0;
  }

  .uni-empty__image {
    width: 160px;
  }

  .uni-empty__description {
    margin-top: 20px;
  }

  .uni-empty__bg {
    background-image: url('../../static/empty.svg')
  }
</style>
