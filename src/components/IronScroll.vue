<template lang="pug">
scroll-view.full-width(scroll-y, :style="{height: height + heightUnit}", :class="scrollClass", @touchstart="touchstart", @touchmove="touchmove", @touchend="touchend", @scrolltolower="pushMore", :lower-threshold="lowerThreshold")
  .iron-scroll(:style="{transform: 'translate3d(0, ' + scrollTop + 'px, 0)', top: '-' + headHeight + 'px'}")
    .head.text-gray(:style="{height: headBarHeight + 'px'}")
      span(v-if="refreshState == 1") {{refreshPullingText}}
      span(v-if="refreshState == 2") {{refreshText}}
      span(v-if="refreshState == 3") {{refreshPulledText}}
    slot
    .footer.text-gray(v-if="loadFinish > 0") 
      span(v-if="loadFinish === 2") {{loadFinishText}}
      span(v-else-if="loadFinish === 1") {{loadPushingText}}
</template>

<script>
export default {
  props: {
    swiperIdx: {
      type: 'Number',
      default: 0
    },
    heightUnit: {
      type: 'String',
      default: 'px'
    },
    lowerThreshold: {
      type: Number,
      default: 50
    },
    height: {
      type: Number,
      default: 300
    },
    scrollClass: {
      type: String,
      default: ''
    },
    headHeight: {
      type: Number,
      default: 40
    },
    refreshText: {
      type: String,
      default: '加载中'
    },
    refreshPullingText: {
      type: String,
      default: '下拉刷新'
    },
    refreshPulledText: {
      type: String,
      default: '释放刷新'
    },
    refresh: {
      type: Boolean,
      defautl: false
    },
    loadPushingText: {
      type: String,
      default: '加载中'
    },
    // 0 不显示文字 1 加载中 2 加载完成
    loadFinish: {
      type: Number,
      default: 0
    },
    loadFinishText: {
      type: String,
      default: '加载完成'
    }

  },
  data () {
    return {
      scrollTop: 0,
      finger: {},
      headBarHeight: 40,
      refreshTime: 0,
      timeObject: null,
      // 0 原始状态 1 下拉中 2 到达刷新位置 3释放刷新
      refreshState: 0
    }
  },
  beforeMount () {
    if (this.headHeight) this.headBarHeight = this.headHeight
  },
  methods: {
    touchstart (e) {
      if (!this.refresh) return
      this.finger.startY = e.touches[0].pageY
    },
    touchmove (e) {
      if (!this.refresh) return
      let diff = e.touches[0].pageY - this.finger.startY
      if (diff > 0) {
        e.preventDefault()
        this.scrollTop = Math.pow(diff, 0.8)
        if (this.scrollTop > 0 && this.scrollTop < this.headHeight + 5) {
          this.refreshState = 1
        } else {
          this.refreshState = 3
          this.headBarHeight = this.headHeight + 2
          this.scrollTop = this.headBarHeight
        }
      } else {
        console.log('下拉不做判断，使用原生的')
      }
    },
    touchend (e) {
      if (!this.refresh) return
      if (this.scrollTop < this.headHeight) {
        this.scrollTop = 0
        return
      }
      if (this.scrollTop >= this.headHeight) {
        this.refreshTime = new Date().getTime()
        this.refreshState = 2
        this.$emit('onRefresh', this.finishRefresh)
      }
    },
    pushMore (e) {
      this.$emit('scrolltolower', e)
    },
    finishRefresh () {
      const now = new Date().getTime()
      const diff = now - this.refreshTime
      const me = this
      if (diff < 300) {
        if (this.timeObject) return
        this.timeObject = setTimeout(function () {
          me.timeObject = null
          me.scrollTop = 0
          me.refreshState = 0
        }, 300)
      } else {
        this.timeObject = null
        this.scrollTop = 0
        this.refreshState = 0
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.iron-scroll
  position relative
  transition-duration 300ms
  .head
    display flex
    align-items center
    justify-content center
    font-size 13px
    background #f1f1f1
    overflow hidden
  .footer
    text-align center
    padding 10px
    background #f1f1f1
    font-size 13px
</style>
