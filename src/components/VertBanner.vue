<template lang="pug">
.marquee-container(:style="{height: height + 'rpx'}")
  .marquee-content(:style="{transform: 'translate3d(0, -' + (currentIdx * height) + 'rpx, 0)', transition: 'transform ' + noAnimate ? 0 :  duration + 's'}")
    text.marquee-item(v-for="(qe, idx) in quees", :key="idx", @click="jumpNotice(qe.id)") {{qe.title}}
      //- strong 【{{title(qe.title)}}】
      //- span.ml-5(style="color: #666") {{content(qe.title)}}
</template>

<script>
export default {
  props: {
    quees: {
      type: Array,
      required: true
    },
    interval: {
      type: Number,
      default: 3000
    },
    duration: {
      type: Number,
      default: 0.8
    }
  },
  data () {
    return {
      items: 5,
      currentIdx: 0,
      noAnimate: false,
      height: 40
    }
  },
  mounted () {
    this.start()
  },
  beforeDestory () {
    this.timer && clearInterval(this.timer)
  },
  methods: {
    jumpNotice (id) {
      this.logEvent({ event: 'click_app_index_notice', type: '01' })
      this.jump('/pages/h5/main?title=公告详情&type=noticeDetail&id=' + id)
    },
    start () {
      this.timer = setInterval(() => {
        this.currentIdx++
        this.noAnimate = false
        if (this.currentIdx > (this.quees.length - 1)) {
          this.noAnimate = true
          this.currentIdx = 0
        }
      }, this.interval)
    },
    title (ctx) {
      let index = ctx.indexOf('】')
      if (index > 1) {
        return ctx.substring(1, index)
      } else {
        return '公告'
      }
    },
    content (ctx) {
      let index = ctx.indexOf('】')
      if (index > 1) {
        return ctx.substring(index + 1)
      } else {
        return ctx
      }
    }
  }
}
</script>

<style lang="stylus", scoped>
.marquee-container
  display inline-block
  width 100%
  overflow hidden
  .marquee-content
    width 100%
    .marquee-item
      color #262626
      height 20px
      line-height 20px
      overflow hidden
      display -webkit-box
      -webkit-line-clamp 1
      -webkit-box-orient vertical
      text-overflow ellipsis
      @media (min-width: 320px)
        width 245px
      @media (min-width: 375px)
        width 250px
      @media (min-width: 414px)
        width 260px
</style>
