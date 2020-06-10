<template lang="pug">
.row.relation.input-box
  input.col(v-if="inputType === 'number'", :style="inputSty", type="number", v-model="getValue", @blur="getBlur")
  input.col(v-else-if="inputType === 'digit'", :style="inputSty", type="digit", v-model="getValue", maxlength="8", @blur="getBlur")
  input.col(v-else-if="inputType === 'text'", :style="inputSty", type="text", v-model="getValue", maxlength="8", @blur="getBlur")
  //- input.col(v-if="isFocus && inputType === 'number'", :style="inputSty", type="number", v-model="inputVal", :focus="isFocus", :selection-start="0", :selection-end="selectionEnd", maxlength="8", @blur="inputBur")
  //- input.col(v-else-if="isFocus && inputType === 'digit'", :style="inputSty", type="digit", v-model="inputVal", :focus="isFocus", :selection-start="0", :selection-end="selectionEnd", maxlength="8", @blur="inputBur")
  //- input.col(v-else-if="isFocus && inputType === 'text'", :style="inputSty", type="text", v-model="inputVal", :focus="isFocus", :selection-start="0", :selection-end="selectionEnd", maxlength="8", @blur="inputBur")
  //- //- .mask(v-if="!isFocus", @click="inputFocus") {{inputVal}}
  //- input(:class="maskClassName" @click="inputFocus", v-model="inputVal", disabled, :style="inputSty")
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
    },
    minVal: {
      type: Number,
      default: 0
    },
    maxVal: {
      type: Number,
      default: 100000
    },
    cb: ['Function'],
    inputSty: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      inputVal: '',
      isFocus: false,
      selectionEnd: 0,
      maskClassName: 'mask',
      getValue: ''
    }
  },
  onHide () {
    this.isFocus = false
    this.maskClassName = 'mask'
  },
  watch: {
    value (newVal, oldVal) {
      this.getValue = newVal
    },
    isFocus (newVal) {
      this.maskClassName = newVal ? 'none' : 'mask'
    }
  },
  beforeMount () {
    console.log(this.initVal)
    this.inputVal = this.value
    this.getValue = this.value
  },
  methods: {
    getBlur () {
      // 失焦验证输入是否合法
      console.log(this.getValue)
      let val = Number(this.getValue) || 0
      let type = this.type
      switch (type) {
        case 'price':
          if (val === 0) { // 未输入/输入值为0，回写为原值
            val = this.value
          } else {
            val = val < this.minVal ? this.minVal : val
            let newVal = this.numberFormat(val).toString().match(/\d+\.\d{2}/)
            val = newVal ? newVal[0] : this.numberFormat(val)
            if (!val) val = Number(this.getValue)
            // val = this.$toFixed(val, 2)
          }
          break
        case 'number':
          val = val < this.minVal ? this.minVal : val
          val = val > this.maxVal ? this.maxVal : val
          val = this.$toFixed(val, 0)
          break
      }
      this.getValue = val
      setTimeout(() => {
        this.$emit('input', val)
        this.$emit('blur', val)
      }, 100)
    },
    inputFocus () {
      this.selectionEnd = this.inputVal.toString().length
      this.getValue = true
    },
    inputBur () {
      this.selectionEnd = 0
      this.isFocus = false
      let val = this.inputVal || 0
      const type = this.type
      switch (type) {
        case 'price':
          val = val < this.minVal ? this.minVal : val
          const newVal = this.numberFormat(val).toString().match(/\d+\.\d{2}/)
          val = newVal ? newVal[0] : this.numberFormat(val)
          if (!val) val = Number(this.initVal)
          val = this.$toFixed(val, 2)
          break
        case 'number':
          val = val < this.minVal ? this.minVal : val
          val = this.$toFixed(val, 0)
          break
      }
      this.inputVal = val
      const me = this
      setTimeout(() => {
        me.$emit('input', val)
        me.$emit('blur', val)
      }, 100)
    }
  }
}
</script>
<style lang="stylus" scoped>
.none
  display none
.mask
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
  // font-weight bold
</style>