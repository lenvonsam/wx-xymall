<template lang="pug">
.cu-modal(:class="modalName")
  .cu-dialog.bg-white(:style="{'mix-height': '280rpx', width: width}")
    img(src="/static/images/warning.png", alt="alt", v-if="showWarningIcon")
    .padding.text-xl.text-black.text-center {{title}}
    slot
    .padding.row.justify-center
      button.confirm-btn(
        v-for="(item, bIdx) in btns",
        :key="bIdx",
        :open-type="item.type",
        hover-class="hover-gray",
        :class="item.className",
        @click="btnClick(item.flag)") {{item.label}}
</template>
<script>
export default {
  props: {
    value: ['Boolean'],
    title: {
      type: String,
      default: '提示'
    },
    btns: {
      type: Array,
      default: [
        { label: '取消', flag: 'cancel', className: 'bg-gray' },
        { label: '确定', flag: 'confirm', className: 'main-btn' }
      ]
    },
    width: {
      type: String,
      default: '75%'
    },
    showWarningIcon: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      modalName: '',
      btnDisabled: false
    }
  },
  beforeMount () {
    if (this.value) this.modalName = 'show'
  },
  watch: {
    value (newVal, oldVal) {
      console.log('modalName变化++', newVal)
      if (newVal) this.modalName = 'show'
      else this.modalName = ''
    }
  },
  methods: {
    btnClick (flag) {
      if (this.btnDisabled) return false
      this.btnDisabled = true
      const me = this
      setTimeout(() => {
        me.btnDisabled = false
      }, 1000)
      this.$emit('cb', flag)
    }
  }
}
</script>
<style lang="stylus" scoped>
.confirm-btn
  margin 0 10px
  width 40%
  height 40px
  border-radius 5px
  font-size 14px
  display flex
  flex 1
  align-items center
  justify-content center
  letter-spacing 6rpx
// .confirm-btn
// margin 0 auto
// width 100px
// height 30px
// line-height 30px
// border-radius 15px
// font-size 12px
button::after
  display none
img
  width 40px
  height 40px
  margin 20px auto -10px
</style>
