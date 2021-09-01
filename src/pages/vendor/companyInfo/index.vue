<template lang="pug">
div
  nav-bar(title="公司介绍", isBack)
  .fixed-top.flex
    .top-cell.ft-16(@click="selectTab('1')", :class="tabIndex === '1' ? 'active-tab' : ''") 智恒达
    .top-cell.ft-16(@click="selectTab('2')", :class="tabIndex === '2' ? 'active-tab' : ''") 型云
  .go.text-bold.ft-14 去型云采购
</template>
<script>

export default {
  components: {

  },
  data () {
    return {
      tabIndex: '1'
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.showShareMall()
    })
  },
  methods: {
    selectTab (val) {
      this.tabIndex = val
    }
  }
}
</script>
<style lang="stylus" scoped>
.fixed-top
  width 100%
  position fixed
  top 128rpx
  left 0
  background-color #fff
  border-bottom 1rpx solid #eee
  .top-cell
    width 50%
    height 100rpx
    line-height 100rpx
    text-align center
  .active-tab
    position relative
    color #2485FF
    display inline-block
    &::after
      content: "";
      position absolute
      left 50%;
      bottom 0;
      transform translateX(-50%)
      height 6rpx
      width 42rpx
      background-color: #2485FF
.go
  width 100%
  height 98rpx
  line-height 98rpx
  text-align center
  background #FFFFFF
  box-shadow 0px -2px 10px 0px rgba(0, 0, 0, 0.09)
  position fixed
  bottom 0
  left 0
</style>
