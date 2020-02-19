<template lang="pug">
.cu-modal(:class="modalName")
  .cu-dialog.bg-white(style="mix-height: 280rpx; width: 70%")
    .padding.text-xl.text-black.text-center {{title}}
    .padding.row
      .main-btn.confirm-btn(hover-class="hover-gray", @click="btnClick") {{confirmText}}
</template>

<script>
export default {
  props: {
    value: ['Boolean'],
    title: ['String'],
    confirmText: {
      type: String,
      default: '确定'
    },
    cb: {
      default: false
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
  width 100px
  height 30px
  border-radius 15px
  font-size 12px
</style>
