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
  modal(v-model="modalShow", :title="modalTitle", :btns="modalBtns", @cb="modalCb")
    .padding-sm(v-if="modalMsg == '1'")
      div 尊敬的用户，您的商城体验权限时间已经结束，如需继续查看商城物资详情，请尽快完善个人信息并等待审核通过
    .padding-sm(v-else-if="modalMsg == '5'")
      div 您的信息审核未通过，如有疑问请联系业务员或咨询客服
    .padding-sm(v-else)
      div 恭喜您成为型云用户，您的信息正在审核中，请耐心等待

</template>
<script>
import { mapState, mapActions } from 'vuex'
import wxLogin from '@/components/WxLogin'
import modal from '@/components/Modal.vue'

export default {
  data () {
    return {
      uname: '',
      upwd: '',
      // 1 返回 2 跳转首页
      backType: 1,
      canClick: true,
      wxBack: 1,
      modalShow: false,
      modalTitle: '提示',
      modalBtns: [{ label: '确定', flag: 'confirm', className: 'main-btn' }],
      modalMsg: '1'
    }
  },
  components: {
    wxLogin,
    modal
  },
  computed: {
    ...mapState({
      currentVersion: state => state.currentVersion
    })
  },
  watch: {
    uname (newVal) {
      // this.uname = newVal.trim()
      this.uname = newVal.replace(/\s/g, '')
    },
    upwd (newVal) {
      // this.upwd = newVal.trim()
      this.upwd = newVal.replace(/\s/g, '')
    }
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
    modalCb () {
      this.modalShow = false
      this.tab('/pages/index/main')
    },
    // 跳转手机验证码注册页面
    jumpReg () {
      this.logEvent({ event: 'click_app_register', type: '01' })
      this.jump('/pages/account/register/main')
    },
    // 跳转忘记密码页面
    jumpForgetPwd () {
      this.logEvent({ event: 'click_app_forgetpwd', type: '01' })
      this.jump('/pages/account/phoneLogin/main?type=forgetPwd')
    },
    // 跳转手机验证码登陆页面
    jumpPhoneLogin () {
      this.logEvent({ event: 'click_app_login_phone', type: '01' })
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
          console.log('user login msg ++++', data)
          this.canClick = true
          // 存储用户token和信息user
          this.setUser({token: data.data.token, user: data.data.user})
          // data.pwd = encrptPwd
          const self = this
          // 账号密码登陆成功，获取用户信息
          console.log('账号密码登陆成功，获取用户信息+++++')
          self.httpPost(self.apiList.zf.getPersonInfo, {}).then(res => {
            console.log(res.data)
            self.setUser({token: self.token, user: res.data})
            res.data.userTypeLogo === '01' ? this.logEvent({event: 'click_app_login', type: '01'}) : this.logEvent({event: 'click_app_login_seller', type: '01'})
            if (res.data.userStatus === '01') {
              const trial = Number(7 - res.data.experienceDays) // 体验期剩余天数
              if (trial >= 0 && trial <= 7) {
                self.confirm({ content: '您是新用户，请先完善公司信息' }).then(res => {
                  if (res === 'confirm') {
                    self.jump('/pages/account/companyUpdate/main')
                  } else {
                    // self.exitUser()
                    self.tab('/pages/me/main')
                  }
                })
              } else {
                this.modalShow = true
                this.modalMsg = '1' // 超过体验期限
              }
            } else if (res.data.userStatus === '02') {
              this.modalShow = true
              this.modalMsg = '2' // 审核中
            } else if (res.data.userStatus === '05') {
              this.modalShow = true
              this.modalMsg = '5' // 审核中
            } else {
              this.showMsg('登录成功')
              // 获取客户对应的业务员
              self.httpGet(self.apiList.zf.salesman, {
                unitNo: res.data.unitId
              }).then(result => {
                // console.log('result++++++', result)
                const salesman = result.data.map(item => item.businessUserName).join()
                // console.log('salesman+++', salesman)
                mpvue.setStorageSync('salesman', salesman)
              }).catch(err => {
                console.log(err)
              })
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
          // data.type === 'seller' ? this.logEvent({ event: 'click_app_login_seller' }) : this.logEvent({ event: 'click_app_login' })
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
        this.canClick = true
        console.log('err', e)
        this.showMsg(e.message)
      }
    }
    // async getRemoteSearchHistory () {
    //   try {
    //     const data = await this.ironRequest(this.apiList.xy.searchHistory.url, {}, this.apiList.xy.searchHistory.method)
    //     const obj = this.currentUser
    //     obj.localSearchs = data.history === undefined ? [] : JSON.parse(data.history)
    //     this.setUser(obj)
    //   } catch (e) {
    //     console.error(e)
    //   }
    // }
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

