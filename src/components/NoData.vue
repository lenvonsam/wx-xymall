<template lang="pug">
.content.bg-white.row(:style="{height: height+'rpx'}")
  img.img(src="/static/images/person_icon.png")
  .ft-16.margin-top-lg 您还没有登录哦~
  .row.button-group.margin-top-sm(@click="jump('/pages/account/login/main')")
    .col.text-right 登录
    span.pl-10.pr-10 /
    .col() 注册
  <pick-way></pick-way>
</template>
<script>
import { mapState } from 'vuex'
import pickWay from '@/components/PickWay'
export default {
  components: {
    pickWay
  },
  data () {
    return {
      height: 0
    }
  },
  computed: {
    ...mapState({
      bottomBarHeight: state => state.bottomBarHeight,
      isIpx: state => state.isIpx,
      screenHeight: state => state.screenHeight,
      customBar: state => state.customBar
    })
  },
  beforeMount () {
    this.height = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - this.getRpx(this.bottomBarHeight)
  }
}
</script>
<style lang="stylus" scoped>
.content
  flex-direction column
  justify-content center
.img
  width 80.5px
  height 82.5px
.button-group
  justify-content center
  color #ffffff
  background-color #2485FF
  width 150px
  height 35px
  line-height 35px
  border-radius 20px
</style>