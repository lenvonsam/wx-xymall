<template lang="pug">
.row.relation.input-box
  input.col(v-if="isFocus && inputType === 'number'", type="number", v-model="inputVal", :focus="isFocus", :selection-start="0", :selection-end="selectionEnd", maxlength="8", @blur="inputBur")
  input.col(v-else-if="isFocus && inputType === 'digit'", type="digit", v-model="inputVal", :focus="isFocus", :selection-start="0", :selection-end="selectionEnd", maxlength="8", @blur="inputBur")
  input.col(v-else="isFocus", type="text", v-model="inputVal", :focus="isFocus", :selection-start="0", :selection-end="selectionEnd", maxlength="8", @blur="inputBur")
  .mask(v-if="!isFocus", @click="inputFocus") {{inputVal}}
  //- input.mask(v-if="!isFocus", @click="inputFocus", :value="inputVal", disabled)
</template>
<script>
export default {
  props: {
    inputType: {
      type: String,
      default: 'text'
    },
    type: ['String'],
    value: ['String', 'Number'],
    maxlength: ['Number'],
    initVal: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      inputVal: '',
      isFocus: false,
      selectionEnd: 0
    }
  },
  beforeMount () {
    debugger
    this.inputVal = this.value
  },
  methods: {
    inputFocus () {
      debugger
      this.selectionEnd = this.inputVal.toString().length
      this.isFocus = true
    },
    inputBur () {
      debugger
      this.selectionEnd = 0
      this.isFocus = false
      let val = this.inputVal
      switch (this.type) {
        case 'price':
          const newVal = this.numberFormat(val).toString().match(/\d+\.\d{2}/)
          val = newVal ? newVal[0] : this.numberFormat(val)
          if (!val) val = Number(this.initVal)
          val = this.$toFixed(val, 2)
          break
        case 'weight':
          break
      }
      // wx.hideKeyboard()
      // this.$emit('input')
      this.$emit('change', val)
    }
  }
}
</script>
<style lang="stylus" scoped>
.mask
  display flex
  width 100%
  align-items center
  background rgba(255, 255, 255, 0)
  cursor auto
  display block
  text-overflow clip
  overflow hidden
  white-space nowrap
  box-sizing border-box
.relation
  position relative
.input-box
  min-height 25px
  display flex
  align-items center
input, .mask
  min-height 25px
  line-height 25px
  color #333
  font-size 30rpx
  font-weight bold
</style>