<template lang="pug">
.bg-white.h-100
  nav-bar(title="注册", isBack, :cb="pageBack")
  .login-bg
    .ft-18.text-center 快速注册
    .row.padding-tb-sm.border-bottom-line.margin-top-xl
      .flex-30.row
        .register-icon.phone(:style="{backgroundImage: 'url(' + imgProxy + 'phone_icon.png)'}", v-if="imgProxy")
      .col
        input.no-border(placeholder="请输入手机号", v-model="phone", type="number", :maxlength="11")
    .row.padding-tb-sm.border-bottom-line.margin-top-xl
      .flex-30.row
        .register-icon.code(:style="{backgroundImage:'url(' + imgProxy + 'code_icon.png)'}", v-if="imgProxy")
      .col
        input.no-border(placeholder="请输入验证码", type="number", v-model="code")
      .flex-90.text-center(style="border-left: 1rpx solid #888")
        auth-btn(:phone="phone", v-if="codeBtnShow")
    .row.margin-top.ft-12
      .flex-20
        checkbox(style="transform: scale(0.8,0.8)", :checked="acceptProtocol", color="#0081ff")
      .col
        span(@click="acceptProtocol = !acceptProtocol") 我已经阅读并同意
        span.text-blue(@click="jump('/pages/h5/main?title=用户协议&type=registProtocol')") 《型云软件许可及服务协议》
    .mt-50.main-btn(hover-class="hover-gray", @click="remoteRegister") 注册
</template>

<script>
import authBtn from '@/components/AuthBtn'
export default {
  data () {
    return {
      // pageType: 1,
      phone: '',
      code: '',
      acceptProtocol: true,
      canClick: true,
      codeBtnShow: false
    }
  },
  components: {
    authBtn
  },
  onShow () {
    this.canClick = true
    this.codeBtnShow = true
  },
  onUnload () {
    this.codeBtnShow = false
  },
  methods: {
    resetVal () {
      this.phone = ''
      this.code = ''
      this.acceptProtocol = true
      this.canClick = true
    },
    pageBack () {
      this.resetVal()
      this.back()
    },
    async remoteRegister () {
      try {
        if (this.phone.trim().length === 0) {
          this.showMsg('手机号不能为空')
          return
        }
        if (!this.phoneReg.test(this.phone)) {
          this.showMsg('请输入正确手机号')
          return
        }
        if (this.code.trim().length === 0) {
          this.showMsg('验证码不能为空')
          return
        }
        if (!this.acceptProtocol) {
          this.showMsg('您未同意用户协议')
          return
        }
        if (this.canClick) {
          this.canClick = false
        }
        // 18015816879
        // TODO 接口正在修改
        await this.ironRequest(this.apiList.xy.userRegister.url, {
          user_phone: this.phone,
          msg_code: this.code
        }, this.apiList.xy.userRegister.method, this)
        const me = this
        me.showMsg('注册成功')
        setTimeout(function () {
          me.resetVal()
          me.back()
        }, 2000)
      } catch (e) {
        this.showMsg(e)
        this.canClick = true
      }
    }
  }
}
</script>


<style lang="stylus" scoped>
.register-icon
  &.phone
    width 14px
    height 19px
  &.code
    width 15px
    height 17px
  display inline-block
  background-size cover
</style>
