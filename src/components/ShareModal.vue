<template lang="pug">
.cu-modal(:class="{'show': localShow}", style="overflow: hidden", @click="closeModal")
  img.top-share-line(src="/static/images/share_line.png", :style="{top: customBar + 'px'}")
  .ft-16.text-bold.title(:style="{top: (customBar + 55) + 'px' }") 
    span.margin-right-xl 添加小程序
    span 买钢不迷路
  .title(:style="{top: (customBar + 85) + 'px'}") 1.点击右上角... 再点击“添加到我的小程序”
  .share-menu(:style="{top: (customBar + 120) + 'px'}")
    .share-menu-item.first 转发
    .share-menu-item.sec 添加到我的小程序
    .share-menu-item.third 关于型云商城
  .title(:style="{top: (customBar + 215) + 'px'}") 2.下拉微信首页，随时快速进入型云商城
  .share-tab(:style="{top: (customBar + 255) + 'px'}")
    .content 小程序
    .row.mt-5
      .col
        img(:src="imgProxy + 'logo.png'", style="width: 72rpx;height: 72rpx;", v-if="imgProxy")
        .ft-12.text-gray 型云商城
      .col
        .pie
        .pie-content
      .col
        .pie
        .pie-content
  .share-btn(:style="{top: (customBar + 375) + 'px'}") 我知道了
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    value: ['Boolean']
  },
  data () {
    return {
      localShow: false
    }
  },
  computed: {
    ...mapState({
      customBar: state => state.customBar
    })
  },
  beforeMount () {
    if (this.value) this.localShow = this.value
    this.autoHideTab()
  },
  watch: {
    value (newVal, oldVal) {
      this.localShow = newVal
      this.autoHideTab()
    }
  },
  methods: {
    autoHideTab () {
      this.localShow ? mpvue.hideTabBar() : mpvue.showTabBar()
    },
    closeModal () {
      this.localShow = false
      this.$emit('input', false)
      this.autoHideTab()
    }
  }
}
</script>

<style lang="stylus" scoped>
.top-share-line
  width 180px
  position absolute
  height 45px
  right 50px
/deep/ .cu-modal
  color #fff
.title
  position absolute
  left 15%
.share-menu
  position absolute
  left 25%
  width 150px
  height 75px
  color #262626
  font-size 13px
  .share-menu-item
    background #fff
    text-align center
    height 25px
    &.first
      height 30px
      padding-top 5px
      border-top-left-radius 10px
      border-top-right-radius 10px
    &.sec
      margin-left -3px
      margin-right -3px
      border-radius 2px
    &.third
      border-bottom-left-radius 10px
      border-bottom-right-radius 10px
.share-tab
  position absolute
  left 15%
  background #080102
  opacity 0.9
  width 230px
  height 95px
  border-radius 5px
  padding-top 6px
  text-align center
  padding-left 10px
  padding-right 10px
  .content
    color #888
  .pie
    display inline-block
    width 36px
    height 36px
    border-radius 18px
    background #888
  .pie-content
    height 16px
.share-btn
  position absolute
  left 25%
  width 150px
  height 40px
  border-radius 20px
  display flex
  align-items center
  justify-content center
  border 1px solid #fff
  font-size 16px
</style>
