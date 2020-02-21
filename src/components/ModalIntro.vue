<template lang="pug">
.cu-modal(:class="modalName")
  swiper.container(:current="currentIndex")
    swiper-item(v-for="(img, idx) in images", :key="idx")
      img(:src="imgProxy + img", v-if="imgProxy", @click="nextImg(idx)")
</template>

<script>
export default {
  props: {
    value: [Boolean],
    images: [Array],
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
  img
    width 100%
    height 100%
</style>



