<template lang="pug">
.count-step
  .min.align-center.flex(@click="minus")
    text.cuIcon-move
  .num
    //- input(v-model="num", @blur="inputBlur", type="number")
    z-input(inputType="number", type="number", :initVal="num", :minVal="1", v-model="num", @blur="inputBlur", inputSty="width: 100%; border: 0px; height: 26px; color: '#333'; text-align: center; font-size: 15px;")
  .plus.align-center.flex(@click="add")
    text.cuIcon-add
</template>

<script>
import zInput from '@/components/ZInput.vue'
export default {
  data () {
    return {
      num: 1
    }
  },
  components: {
    zInput
  },
  props: {
    value: {
      required: true
    },
    max: {
      type: Number,
      default: 10
    }
  },
  beforeMount () {
    if (this.max === 0) {
      this.num = 0
      return
    }
    if (this.value) {
      this.num = Number(this.value)
    } else {
      this.num = 1
    }
  },
  watch: {
    value (newVal, oldVal) {
      this.num = Number(newVal)
      // this.$emit('input', this.num)
    }
  },
  methods: {
    add () {
      this.num++
      if (this.max > 0 && this.num > this.max) {
        this.num = this.max
        this.showMsg('购买量不能高于库存' + this.max + '支')
      }
      this.$emit('input', Number(this.num))
      this.$emit('change', Number(this.num))
    },
    minus () {
      this.num--
      if (this.num < 1) {
        this.num = 1
        this.showMsg('购买量不能小于1支')
      }
      this.$emit('input', Number(this.num))
      this.$emit('change', Number(this.num))
    },
    inputBlur () {
      if (this.num.toString().trim().length === 0 || Number(this.num) === 0) {
        this.num = 1
      }
      if (this.num > this.max) {
        this.num = Number(this.max)
      }
      this.$emit('change', Number(this.num))
      this.$emit('input', Number(this.num))
    }
  }
}
</script>

<style lang="stylus", scoped>
.count-step
  display flex
  border 1px solid #ddd
  border-radius 2px
  width 100px
  height 25px
  .min
    border-right 1px solid #ddd
  .plus
    border-left 1px solid #ddd
  .min, .plus
    // padding-left 10px
    // padding-right 10px
    flex 0 0 25px
    display flex
    align-items center
    justify-content center
    font-size 14px
    color #888
  .num
    flex 1
    color #ccc
    input
      width 100%
      border 0px
      font-size 12px
      height 26px
      color #333
      text-align center
      font-size 15px
</style>
