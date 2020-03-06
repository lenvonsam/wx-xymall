<template lang="pug">
.cu-modal(:class="modalName")
  .cu-dialog.bg-white.relation(style="mix-height: 280rpx; width: 70%")
    .close(@click="cancel")
      .cuIcon-close
    .padding.text-xl.text-black.text-center.text-bold {{title}}
    slot
      .padding-left.padding-right.ft-15.text-content {{msg}}
    .padding.row
      .main-btn.confirm-btn(hover-class="hover-gray", @click="btnClick") {{confirmText}}
</template>

<script>
export default {
  props: {
    value: ['Boolean'],
    title: {
      type: String,
      default: '提示信息'
    },
    msg: ['String'],
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
    cancel () {
      this.$emit('input', false)
    },
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
  width 100%
  height 30px
  border-radius 5px
  font-size 12px 
.cu-dialog
  overflow initial!important 
.close
  background rgba(0,0,0,0.5)
  border 1px solid #fff
  width 25px
  height 25px
  line-height 25px
  text-align center
  position absolute
  right -8px
  top -8px
  color #fff
  border-radius 100%
  z-index 1113
</style>
