<template lang="pug">
.cu-modal(:class="modalName")
  //- 首页
  .container.mask.active(v-if="type === 'activity'", :style="{paddingTop: customBar + 'px'}", @click="hide")
    img.activity(:src="imgProxy + 'activity-100.gif'")
  .container.mask.active(v-else-if="type === 'downtime'", :style="{paddingTop: customBar + 'px'}", @click="hide")
    img.activity(:src="imgProxy + 'downtime.png'")
  .container.mask.mall(v-else-if="type === 'home'", :style="{paddingTop: customBar + 55 + 'px'}", @click="hide")
    img.arrow(src="/static/images/mall_arrow.png", :style="{top: customBar + 'px'}")
    img.body(:src="imgProxy + 'mall_body.png'")
  //- 商城
  swiper.container(:current="currentIndex", v-else)
    swiper-item(v-for="(img, idx) in images", :key="idx")
      img(:src="imgProxy + img", v-if="imgProxy", @click="nextImg(idx)")
</template>

<script>
export default {
  props: {
    value: [Boolean],
    images: [Array],
    type: {
      type: String,
      default: 'mall'
    },
    cb: {
      default: false
    }
  },
  data () {
    return {
      modalName: '',
      currentIndex: 0
    }
  },
  beforeMount () {
    if (this.value) this.modalName = 'show'
  },
  watch: {
    value (newVal, oldVal) {
      if (newVal) this.modalName = 'show'
      else this.modalName = ''
    }
  },
  methods: {
    nextImg (idx) {
      idx++
      if (idx > this.images.length - 1) {
        if (this.cb) this.cb()
        this.currentIndex = 0
        this.$emit('input', false)
      } else {
        this.currentIndex = idx
      }
    },
    hide () {
      this.$emit('input', false)
    }
  }
}
</script>

<style lang="stylus" scoped>
.container
  position absolute
  z-index 30
  top 0
  left 0
  right 0
  bottom 0
  overflow hidden
  &.mask
    background rgba(0, 0, 0, 0.3)
  &.mall
    .arrow
      position absolute
      right 18%
      height 47px
      width 177px
      z-index 20
    .body
      width 300px
      height 406px
      margin 0 auto
  &.active
    display flex
    justify-content center
    align-items center
    .activity
      width 250px
      height 250px
  img
    width 100%
    height 100%
</style>



