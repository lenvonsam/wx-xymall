<template lang="pug">
  .my-toast(v-if="toastShow")
    .my-toast-wrap
      .my-toast-text {{toastMsg}}
</template>

<script>
export default {
  props: {
    toastShow: {
      type: Boolean,
      defualt: true
    },
    toastMsg: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="stylus" scoped>
  .my-toast
    position fixed
    top 0
    left 0
    bottom 0
    right 0
    z-index 9
    display flex
    justify-content center
    align-items center
    .my-toast-wrap
      width 50%
      font-size 26rpx
      color #fff
      padding 36rpx
      background-color #464646
      border-radius 24rpx
      text-align center
      .my-toast-text
        padding 10rpx
        display: -webkit-box
        -webkit-box-orient: vertical
        -webkit-line-clamp: 8
        overflow hidden
        text-overflow: ellipsis
        line-height: 1.8

</style>



