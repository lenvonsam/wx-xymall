<template lang="pug">
.cu-modal(:class="modalName")
  .cu-dialog.bg-white(style="mix-height: 280rpx; width: 60%")
    .close(@click="btnClick('cancel')")
      .cuIcon-close
    .padding.text-xl.text-black.text-center.text-bold {{title}}
    slot
      .padding.padding-lr-lg
        .bg-gray.input-box
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
    },
    emptyMsg: {
      type: 'String',
      default: '不能为空'
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
      if (val === 'confirm' && this.type !== 'customize') {
        if (this.inputVal.trim().length === 0) {
          this.showMsg(this.emptyMsg)
          return
        }
        if (!this.pwdReg.test(this.inputVal)) {
          this.showMsg('请输入6-12位密码，只能是数字、字母和下划线')
          return
        }
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
  width 80px
  height 40px
  border-radius 5px
  font-size 14px
  &.cancel
    background #c9c9c9
    color #fff
    display flex
    align-items center
    justify-content center
.input-box
  border-radius 5px
  width 100%
  height 40px
  input
    height 40px
    width 100%
.cu-dialog
  overflow initial !important
.close
  background rgba(0, 0, 0, 0.5)
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
