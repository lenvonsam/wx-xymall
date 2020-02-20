<template lang="pug">
.cu-modal(:class="modalName")
  .cu-dialog.bg-white(style="mix-height: 280rpx; width: 80%")
    .padding.text-xl.text-black.text-center.ft-16.text-blue 特殊说明
    .ft-13(style="width:440rpx;margin: 0 auto")
      .text-left 三证审核通过后方可交易
      .text-left 开票资料示范如下（不可缺省信息 以税务局登记开票资料为准！）
    .padding-sm
      img.full-width(:src="imgOuterUrl + '/webpage/gzql/for-etrade/images/kaipiao1.jpg'", v-if="imgOuterUrl")
    .padding-bottom
      .main-btn.confirm-btn(hover-class="hover-gray", @click="btnClick") 确定
</template>

<script>
export default {
  props: {
    value: ['Boolean'],
    cb: {
      default: null
    }
  },
  data () {
    return {
      modalName: ''
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
    btnClick () {
      if (this.cb) this.cb()
      this.$emit('input', false)
    }
  }
}
</script>


<style lang="stylus" scoped>
.confirm-btn
  margin 0 auto
  width 180px
  height 36px
  border-radius 15px
  font-size 12px
</style>