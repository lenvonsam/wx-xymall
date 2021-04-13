<template lang="pug">
.bg-white.h-100
  nav-bar(title="登录", :isBack="true")
  .login-bg
    .ft-20.text-blod.text-center 账号密码登录
    .row.padding-tb-sm.border-bottom-line.margin-top-xl
      .flex-30.text-gray
        icon.ft-18.adjust.cuIcon-people
      .col
        input.no-border.ft-16(placeholder="账户名、昵称、手机号", v-model="uname")
    .row.padding-tb-sm.border-bottom-line.margin-top-xl
      .flex-30.text-gray
        icon.ft-18.adjust.cuIcon-unlock
      .col
        input.no-border.ft-16(placeholder="请输入密码(6-12位)", type="password", v-model="upwd", :maxlength="12")
    .row
      .col.text-blue.padding-top(@click="jumpReg") 立即注册
      .col.text-right.padding-top(@click="jumpForgetPwd") 忘记密码？
    .mt-50.main-btn(hover-class="hover-gray", @click="remoteLogin") 登录
    .margin-top-sm.text-center.text-blue(@click="jumpPhoneLogin") 手机验证码登录
    wxLogin(:backType="wxBack")


</template>
<script>
import { mapState, mapActions } from 'vuex'
import wxLogin from '@/components/WxLogin'
export default {
  data () {
    return {
      uname: '',
      upwd: '',
      // 1 返回 2 跳转首页
      backType: 1,
      canClick: true,
      wxBack: 1
    }
  },
  components: {
    wxLogin
  },
  computed: {
    ...mapState({
      currentVersion: state => state.currentVersion
    })
  },
  onUnload () {
    if (this.backType === 2) this.tab('/pages/index/main')
  },
  onShow () {
    this.uname = ''
    this.upwd = ''
    this.backType = 1
    this.canClick = true
    if (this.$root.$mp.query.type) this.backType = Number(this.$root.$mp.query.type)
    else this.backType = 1
    mpvue.setStorageSync('lastExperienceDay', '')
    mpvue.setStorageSync('overdueReminder', '')
    mpvue.setStorageSync('isAuditingReminder', '')
  },
  onLoad (options) {
    if (options.back) this.wxBack = Number(options.back)
  },
  methods: {
    ...mapActions([
      'setUser',
      'configVal'
    ]),
    // 跳转手机验证码注册页面
    jumpReg () {
      this.statisticRequest({ event: 'click_app_register' })
      this.jump('/pages/account/register/main')
    },
    // 跳转忘记密码页面
    jumpForgetPwd () {
      this.statisticRequest({ event: 'click_app_forgetpwd' })
      this.jump('/pages/account/phoneLogin/main?type=forgetPwd')
    },
    // 跳转手机验证码登陆页面
    jumpPhoneLogin () {
      this.statisticRequest({ event: 'click_app_login_phone' })
      this.jump('/pages/account/phoneLogin/main')
    },
    // 账号密码登陆
    async remoteLogin () {
      try {
        if (this.uname.trim().length === 0) {
          this.showMsg('用户名不能为空')
          return
        }
        if (this.upwd.trim().length === 0) {
          this.showMsg('密码不能为空')
          return
        }
        if (!this.pwdReg.test(this.upwd)) {
          this.showMsg('请输入6-12位密码，只能是数字、字母和下划线')
          return
        }
        if (this.canClick) {
          this.canClick = false
          // const encrptPwd = this.base64Str(this.upwd.trim())
          const paramsObj = {
            loginType: '02',
            userName: this.uname.trim(),
            password: this.upwd
          }
          const data = await this.httpPost(this.apiList.zf.login, paramsObj)
          // console.log('user login', data)
          this.canClick = true
          // 存储用户token和信息user
          this.setUser({token: data.data.token, user: data.data.user})
          // data.pwd = encrptPwd
          const self = this
          // 账号密码登陆成功，获取用户信息
          console.log('账号密码登陆成功，获取用户信息+++++')
          self.httpPost(self.apiList.zf.getPersonInfo, {}).then(res => {
            self.setUser({token: self.token, user: res.data})
            if (res.data.userStatus === '01') {
              self.confirm({ content: '您是新用户，请先完善公司信息' }).then(res => {
                if (res === 'confirm') {
                  self.jump('/pages/account/companyUpdate/main')
                } else {
                  self.tab('/pages/me/main')
                }
              })
            } else {
              this.showMsg('登录成功')
              setTimeout(function () {
                self.canClick = true
                if (self.backType === 1) {
                  self.back()
                } else {
                  self.tab('/pages/index/main')
                }
              }, 500)
            }
          })
          this.configVal({ key: 'oldVersion', val: this.currentVersion })
          // this.getRemoteSearchHistory(data)
          // data.type === 'seller' ? this.statisticRequest({ event: 'click_app_login_seller' }, true) : this.statisticRequest({ event: 'click_app_login' })
          // if (data.isnew) {
          //   this.canClick = true
          //   this.confirm({ content: '您是新用户，请先完善公司信息' }).then(res => {
          //     if (res === 'confirm') {
          //       self.jump('/pages/account/companyUpdate/main')
          //     } else {
          //       self.tab('/pages/index/main')
          //     }
          //   })
          // } else {
          //   this.showMsg('登录成功')
          //   const self = this
          //   setTimeout(function () {
          //     self.canClick = true
          //     if (self.backType === 1) {
          //       self.back()
          //     } else {
          //       self.tab('/pages/index/main')
          //     }
          //   }, 500)
          // }
        }
      } catch (e) {
        console.log('err', e)
        this.showMsg(e.message)
        this.canClick = true
      }
    },
    async getRemoteSearchHistory () {
      try {
        const data = await this.ironRequest(this.apiList.xy.searchHistory.url, {}, this.apiList.xy.searchHistory.method)
        const obj = this.currentUser
        obj.localSearchs = data.history === undefined ? [] : JSON.parse(data.history)
        this.setUser(obj)
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>


<style lang="stylus" scoped>
.login-bg
  background #fff
  overflow hidden
  padding-left 40px
  padding-right 40px
  padding-top 50px
</style>

