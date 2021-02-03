<template lang="pug">
.bg-white.h-100
  nav-bar(:title="pageTitle", isBack, :cb="pageBack")
  .login-bg
    .ft-20.text-center {{pageType == 'smsLogin' ? '手机验证码登录' : '找回密码'}}
    .row.padding-tb-sm.border-bottom-line.margin-top-xl
      .flex-30.row
        .register-icon.phone(:style="{backgroundImage: 'url(' + imgProxy + 'phone_icon.png)'}", v-if="imgProxy")
      .col
        input.no-border.ft-16(placeholder="请输入手机号", v-model="phone", type="number", :maxlength="11")
    .row.padding-tb-sm.border-bottom-line.margin-top-xl
      .flex-30.row
        .register-icon.code(:style="{backgroundImage: 'url(' + imgProxy + 'code_icon.png)'}", v-if="imgProxy")
      .col
        input.no-border.ft-16(placeholder="请输入验证码", type="number", v-model="code")
      .flex-90.text-center(style="border-left: 1rpx solid #888", v-show="pageType == 'smsLogin'")
        auth-btn(:phone="phone", :codeType="2", v-if="pageType == 'smsLogin' && codeBtnShow", :timeCount="90")
      .flex-90.text-center(style="border-left: 1rpx solid #888", v-show="pageType == 'forgetPwd'")
        auth-btn(:phone="phone", :codeType="1", v-if="pageType == 'forgetPwd' && codeBtnShow")
    .row.padding-tb-sm.margin-top-xl.border-bottom-line(v-if="pageType === 'forgetPwd'")
      .flex-30
        icon.ft-18.adjust.cuIcon-lock.text-gray
      .col
        input.no-border.ft-16(placeholder="请输入新密码(6-12位)", v-model="pwd", type="password", :maxlength="12")
    .row(v-if="pageType=='smsLogin'")
      .col.text-blue.padding-top(@click="jumpReg") 立即注册
      .col.text-right.padding-top(@click="jumpToChildPwd") 忘记密码？
    .mt-50.main-btn(hover-class="hover-gray", @click="remoteHandler") {{pageType === 'smsLogin' ? '登录' : '提交'}}
    .margin-top-sm.text-center.text-blue(@click="jumpBack", v-if="pageType === 'smsLogin'") 账号密码登录
    wxLogin(v-if="pageType == 'smsLogin'")
</template>

<script>
import authBtn from '@/components/AuthBtn'
import wxLogin from '@/components/WxLogin'
import { mapActions, mapState } from 'vuex'
export default {
  data () {
    return {
      // smsLogin 手机验证码登录  forgetPwd 找回密码
      pageType: 'smsLogin',
      pageTitle: '手机登录',
      phone: '',
      code: '',
      pwd: '',
      canClick: true,
      codeBtnShow: false
    }
  },
  computed: {
    ...mapState({
      currentVersion: state => state.currentVersion,
      tempObject: state => state.tempObject,
      token: state => state.user.token
    })
  },
  components: {
    authBtn,
    wxLogin
  },
  onShow () {
    this.codeBtnShow = true
    this.canClick = true
    this.pageType = 'smsLogin'
    if (this.$root.$mp.query.type) this.pageType = this.$root.$mp.query.type
    if (this.tempObject.action && this.tempObject.action === 'pageBack') {
      this.pageType = 'smsLogin'
      this.configVal({ key: 'tempObject', val: {} })
    }
    this.pageType === 'smsLogin' ? this.pageTitle = '手机登录' : this.pageTitle = '找回密码'
    console.log('pageType:>>', this.pageType)
  },
  onUnload () {
    this.codeBtnShow = false
    this.phone = ''
    this.code = ''
    this.pwd = ''
    if (this.tempObject.action && this.tempObject.action === 'pageForward') {
      this.configVal({ key: 'tempObject', val: { action: 'pageBack' } })
    }
  },
  methods: {
    ...mapActions([
      'setUser',
      'configVal'
    ]),
    jumpBack () {
      // this.statisticRequest({ event: 'click_app_login_pwd' })
      this.back()
    },
    jumpReg () {
      // this.statisticRequest({ event: 'click_app_register' })
      this.jump('/pages/account/register/main')
    },
    jumpToChildPwd () {
      // this.statisticRequest({ event: 'click_app_forgetpwd' })
      this.configVal({ key: 'tempObject', val: { action: 'pageForward' } })
      this.jump('/pages/account/phoneLogin/main?type=forgetPwd')
    },
    resetVal () {
      this.phone = ''
      this.code = ''
      this.pwd = ''
      this.canClick = true
    },
    pageBack () {
      this.resetVal()
      this.back()
    },
    async remoteHandler () {
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
        if (this.pageType === 'forgetPwd' && this.pwd.length === 0) {
          this.showMsg('密码不能为空')
          return
        }
        if (this.pageType === 'forgetPwd' && !this.pwdReg.test(this.pwd)) {
          this.showMsg('请输入6-12位密码，只能是数字、字母和下划线')
          return
        }
        let params = {}
        let url = ''
        if (this.pageType === 'forgetPwd') {
          url = this.apiList.zf.resetPassword
          params.phone = this.phone
          params.verifyCode = this.code
          params.password = this.pwd
          params.confirmPassword = this.pwd
        } else {
          url = this.apiList.zf.login
          params.loginType = '01'
          params.phone = this.phone
          params.verifyCode = this.code
        }
        if (this.canClick) {
          this.canClick = false
          const data = await this.httpPost(url, params)
          debugger
          this.setUser(data.data)
          const self = this
          if (self.pageType === 'smsLogin') {
            self.showMsg('登录成功')
            // self.statisticRequest({ event: 'click_app_login' })
          }
          setTimeout(function () {
            if (self.pageType === 'smsLogin') {
              self.resetVal()
              self.httpPost(self.apiList.zf.getPersonInfo, {}).then(res => {
                self.setUser({token: self.token, user: res.data})
                if (res.data.status === 1) {
                  self.confirm({ content: '您是新用户，请先完善公司信息' }).then(res => {
                    if (res === 'confirm') {
                      self.jump('/pages/account/companyUpdate/main')
                    } else {
                      self.tab('/pages/self/main')
                    }
                  })
                } else {
                  self.tab('/pages/self/main')
                }
              })
              self.configVal({ key: 'oldVersion', val: self.currentVersion })
              // self.getRemoteSearchHistory(data)
            } else {
              self.confirm({ title: '友情提示', content: '登录密码修改成功，请重新登录' }).then(res => {
                if (res === 'confirm') {
                  self.resetVal()
                  if (self.tempObject.action && self.tempObject.action === 'pageForward') {
                    self.configVal({ key: 'tempObject', val: {} })
                    self.back(2)
                  } else {
                    self.back()
                  }
                }
              })
            }
          }, 500)
        }
      } catch (e) {
        this.showMsg(e)
        this.canClick = true
      }
    },
    async getRemoteSearchHistory (userData) {
      try {
        const data = await this.ironRequest(this.apiList.xy.searchHistory.url + '?user_id=' + userData.user_id, {}, this.apiList.xy.searchHistory.method)
        const obj = this.currentUser
        obj.localSearchs = data.history === '' ? [] : JSON.parse(data.history)
        this.setUser(obj)
      } catch (e) {
        console.error(e)
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
