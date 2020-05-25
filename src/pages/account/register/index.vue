<template lang="pug">
.bg-white.h-100
  nav-bar(title="注册", isBack, :cb="pageBack")
  .login-bg
    .ft-20.text-center 快速注册
    .row.padding-tb-sm.border-bottom-line.margin-top-xl
      .flex-30.row
        .register-icon.phone(:style="{backgroundImage: 'url(' + imgProxy + 'phone_icon.png)'}", v-if="imgProxy")
      .col
        input.no-border.ft-16(placeholder="请输入手机号", v-model="phone", type="number", :maxlength="11")
    .row.padding-tb-sm.border-bottom-line.margin-top-xl
      .flex-30.row
        .register-icon.code(:style="{backgroundImage:'url(' + imgProxy + 'code_icon.png)'}", v-if="imgProxy")
      .col
        input.ft-16.no-border(placeholder="请输入验证码", type="number", v-model="code")
      .flex-90.text-center(style="border-left: 1rpx solid #888")
        auth-btn(:phone="phone", v-if="codeBtnShow")
    .row.margin-top.ft-12
      .flex-20(@click="acceptProtocol = !acceptProtocol")
        icon.cuIcon-squarecheck.text-blue.ft-18(v-if="acceptProtocol", style="margin-top: -8rpx")
        icon.cuIcon-square.text-gray.ft-18(v-else, style="margin-top: -8rpx")
      .col
        span(@click="acceptProtocol = !acceptProtocol") 我已经阅读并同意
        span.text-blue(@click="jump('/pages/h5/main?title=用户协议&type=registProtocol')") 《型云软件许可及服务协议》
    .mt-50.main-btn(hover-class="hover-gray", @click="remoteRegister") 注册
</template>

<script>
import authBtn from '@/components/AuthBtn'
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      // pageType: 1,
      phone: '',
      code: '',
      acceptProtocol: false,
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
    console.log('unload')
    this.codeBtnShow = false
    this.resetVal()
  },
  methods: {
    ...mapActions([
      'setUser'
    ]),
    resetVal () {
      this.phone = ''
      this.code = ''
      this.acceptProtocol = false
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
          const data = await this.ironRequest(this.apiList.xy.userRegister.url, {
            user_phone: this.phone,
            msg_code: this.code
          }, this.apiList.xy.userRegister.method)
          console.log('data', data)
          const me = this
          const newUser = {
            account_balance: 0,
            avatar: '/webpage/gzql/for-etrade/images/default_logo.png',
            contact_phone: this.phone,
            credit_balance: 0,
            isnew: 1,
            message_switch: '1',
            nickname: this.phone,
            phone: this.phone,
            user_id: data.user_id,
            user_mark: data.emp_acct,
            server_time: data.server_time,
            type: 'buyer'
          }
          this.setUser(newUser)
          this.confirm({ content: '注册成功，但您是新用户，请先完成公司信息' }).then(res => {
            me.canClick = true
            me.resetVal()
            if (res === 'confirm') {
              me.jump('/pages/account/companyUpdate/main?type=3')
            } else {
              me.tab('/pages/index/main')
            }
          })
        }
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
    width 13px
    height 17px
  &.code
    width 15px
    height 17px
  display inline-block
  background-size cover
</style>
