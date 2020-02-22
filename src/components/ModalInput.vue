<template lang="pug">
.cu-modal(:class="modalName")
  .cu-dialog.bg-white(style="mix-height: 280rpx; width: 70%")
    .padding.text-xl.text-black.text-center {{title}}
    .padding
      input(:placeholder="placeholder", v-model="inputVal", type="password", v-if="type === 'password'", :maxlength="12")
      input(:placeholder="placeholder", v-model="inputVal", v-else)
    .padding.row
      .col.text-center
        .confirm-btn.cancel(hover-class="hover-gray", @click="btnClick('cancel')") 取消
      .col.text-center
        .main-btn.confirm-btn(hover-class="hover-gray", @click="btnClick('confirm')")  {{confirmText}}
</template>

<script>
export default {
  props: {
    value: ['Boolean'],
    title: {
      type: String,
      default: '友情提示'
    },
    type: {
      type: 'String',
      default: 'text'
    },
    placeholder: {
      type: 'String',
      default: '请输入...'
    },
    confirmText: {
      type: 'String',
      default: '确定'
    },
    cb: {
      default: false
    }
  },
  data () {
    return {
      modalName: '',
      inputVal: ''
    }
  },
  beforeMount () {
    this.inputVal = ''
    if (this.value) this.modalName = 'show'
  },
  watch: {
    value (newVal, oldVal) {
      if (newVal) this.modalName = 'show'
      else this.modalName = ''
    }
  },
  methods: {
    btnClick (val) {
      if (this.inputVal.trim().length === 0) {
        this.showMsg('不能为空')
        return
      }
      if (!this.pwdReg.test(this.inputVal)) {
        this.showMsg('请输入6-12位密码，只能是数字、字母和下划线')
        return
      }
      if (this.cb) {
        this.cb({
          type: val,
          val: this.inputVal
        })
      }
      this.$emit('input', false)
      this.inputVal = ''
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
  &.cancel
    border 1px solid #888
    display flex
    align-items center
    justify-content center
</style>
