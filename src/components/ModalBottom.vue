<template lang="pug">
.cu-modal.bottom-modal(:class="modalName", @click="btnClick('cancel')")
  .cu-dialog.bg-white(:style="{'mix-height': '160rpx', width: '100%'}", @click.stop="")
    slot
    .padding.row.justify-center(v-if="btns.length")
      button.confirm-btn(
        v-for="(item, bIdx) in btns", 
        :key="bIdx", 
        :open-type="item.type",
        hover-class="hover-gray",
        :class="item.className",
        @click.stop="btnClick(item.flag)") {{item.label}}
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
    btnClick (flag) {
      this.$emit('cb', flag)
    }
  }
}
</script>
<style lang="stylus" scoped>
.confirm-btn
  margin 0 auto
  width 40%
  height 40px
  border-radius 5px
  font-size 14px
.cu-dialog
  overflow hidden
  border-radius inherit !important
  border-top-right-radius 10px !important
  border-top-left-radius 10px !important
  // max-height 300px
// .confirm-btn
// margin 0 auto
// width 100px
// height 30px
// line-height 30px
// border-radius 15px
// font-size 12px
button::after
  display none
</style>
