<template lang="pug">
  <div>
  .pick-title(:style="{top: customBar+'px'}")
    .flex.padding-sm.bg-white.align-center.justify-between(style="height: 100rpx;color: #999999;")
      .flex.align-center(@click.stop="openPickWay")
        .cuIcon-location
        .padding-left-xs 提货方式
        .padding-left-xs.cuIcon-unfold
  .address-dialog(@click.stop="openPickWay", :style="{top: customBar + 40 + 'px'}", v-show="pickWayShow")
      .bg-white
        .solid-top.padding(v-for="(item, pickIdx) in pickWayList", :key="pickIdx")
          .text-bold.ft-15 {{item.title}}
          .text-gray.padding-top-sm {{item.content}}
  </div>
</template>
<script>
export default {
  data () {
    return {
      pickWayShow: false,
      pickWayList: [
        { title: '自提点1-常州东港库', content: '江苏省常州市武进区湖塘-常州东港A库(1，2，3，4，5，6，7号门)G库(8，9，10，11号门)' },
        { title: '自提点2-合肥徽商库', content: '合肥市庐阳区徽商钢材市场' },
        { title: '自提点3-合肥东港库', content: '合肥市大兴镇南淝河旁，合肥东港码头w' }
      ]
    }
  },
  methods: {
    openPickWay (type) {
      this.logEvent({ event: 'click_app_cart_address', type: '01' })
      this.pickWayShow = !this.pickWayShow
    }
  }
}
</script>
<style lang="stylus" scoped>
.pick-title
  width 100%
  position absolute
  left 0
.address-dialog
  position fixed
  left 0
  right 0
  z-index 99
  background rgba(0, 0, 0, 0.5)
  bottom 0
</style>
