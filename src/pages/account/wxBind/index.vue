<template lang="pug">
.bg-white.h-100
  nav-bar(title="账号绑定", isBack, :cb="pageBack")
  .login-bg
    div.dis-flex.flex-dir-row.jc-sb.padding-lr
      div(v-for="(item,index) in tabs", :class="item.id === selectTabId?'text-blue cur':''", :key="index", @click="selectTab(item.id)")
        .ft-16.text-center {{item.tabTitle}}
    div(v-if="selectTabId === 0")  
      .row.padding-tb-sm.border-bottom-line.margin-top-xl
        .flex-30.text-gray
          icon.ft-18.adjust.cuIcon-people
        .col
          input.no-border.ft-16(placeholder="请输入密码账户名", v-model="userName")
      .row.padding-tb-sm.border-bottom-line.margin-top-xl
        .flex-30.text-gray
          icon.ft-18.adjust.cuIcon-unlock
        .col
          input.no-border.ft-16(placeholder="请输入密码(6-12位)", type="password", v-model="password", :maxlength="12")
      .row
        .col.text-blue.padding-top.ft-12(@click="newUserRegister") 新用户注册绑定
    div(v-else)
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
        .flex-90.text-center(style="border-left: 1rpx solid #888")
          auth-btn(:phone="phone",v-if="codeBtnShow",:codeType="1", :cb="authBtnCB")
      .row
        .col.padding-top.ft-12 新用户绑定即完成注册
  .padding-40
    .main-btn(hover-class="hover-gray", @click="bindAndLogin") 绑定账号并登录
  .margin-top-sm.text-center 绑定后，您的微信和型云账号都可以登录
  alert(:msg="alertText", :cb="alertCb", v-model="alertShow", :force="type === 'loginPwd'")
  modal(v-model="modalShow", @cb="modalCb", :title="modalTitle")
    div
      .padding-sm {{modalMsg}}
      span.text-blue(@click="jump('/pages/h5/main?title=用户协议&type=registProtocol')") 《型云软件许可及服务协议》
</template>
<script>
import modal from '@/components/Modal.vue'
import authBtn from '@/components/AuthBtn'
import { mapActions, mapState } from 'vuex'
export default {
  data () {
    return {
      openId: '',
      unionId: '',
      isNew: true,
      userName: '',
      password: '',
      phone: '',
      code: '',
      alertShow: false,
      selectTabId: 0,
      tabs: [
        { id: 0, tabTitle: '账号密码绑定' },
        { id: 1, tabTitle: '手机验证码绑定' }
      ],
      codeBtnShow: false,
      acceptProtocol: false,
      modalShow: false,
      modalTitle: '确认协议',
      modalMsg: '我已经阅读并同意',
      onpresscTime: 0 // 阻止短时间内连续点击
    }
  },
  computed: {
    ...mapState({
      qrCodeForGoodsName: state => state.qrCodeForGoodsName
    })
  },
  components: {
    authBtn,
    modal
  },
  onShow () {
    // this.selectTabId = 0
    this.codeBtnShow = true
    this.openId = mpvue.getStorageSync('openId')
    this.unionId = mpvue.getStorageSync('unionId')
  },
  onLoad () {
    this.selectTabId = 0
  },
  onUnload () {
    console.log('onUnload--------wxbind')
    this.userName = ''
    this.password = ''
    this.phone = ''
    this.code = ''
    this.modalShow = false
  },
  onHide () {
    console.log('onHide--------wxbind')
  },
  methods: {
    ...mapActions([
      'setUser'
    ]),
    selectTab (id) {
      this.selectTabId = id
    },
    newUserRegister () {
      this.selectTab(1)
    },
    // 获取微信手机号信息
    // getPhoneNumber (e) {
    //   let self = this
    //   console.log(e)
    //   if (e.mp.detail.errMsg === 'getPhoneNumber:ok') {
    //     self.request(self.scpProxy + self.apiList.scp.phoneInfo.url, { appKey: self.appKey, encryptedData: e.mp.detail.encryptedData, iv: e.mp.detail.iv, openId: self.openId }, self.apiList.scp.phoneInfo.method).then((res) => {
    //       console.log('获取微信手机号信息res------------>' + JSON.stringify(res))
    //       if (res.return_code === 0) {
    //         self.phone = res.purePhone
    //         self.ironRequest(self.apiList.xy.captcha.url + '?user_phone=' + res.purePhone + '&type=1',
    //           {},
    //           self.apiList.xy.captcha.method).then((r) => {
    //           console.log('注册验证码接口结果r------------>' + JSON.stringify(r))
    //           if (res.return_code === 0) {
    //             self.isNew = true
    //           }
    //         }).catch((err) => {
    //           console.log('注册验证码接口结果err------------>' + JSON.stringify(err))
    //           self.isNew = false
    //         })
    //       }
    //     })
    //   } else {
    //     this.phone = ''
    //   }
    // },
    // 失焦判断手机号是否已注册
    // testPhoneNum () {
    //   let self = this
    //   if (self.mobileReg(self.phone)) {
    //     self.ironRequest(self.apiList.xy.captcha.url + '?user_phone=' + this.phone + '&type=1',
    //       {},
    //       self.apiList.xy.captcha.method).then((r) => {
    //       console.log('注册验证码接口结果r------------>' + JSON.stringify(r))
    //       if (r.returncode.toString() === '0') {
    //         self.isNew = true
    //       }
    //     }).catch((err) => {
    //       console.log('注册验证码接口结果err------------>' + JSON.stringify(err))
    //       self.isNew = false
    //     })
    //   } else {
    //     self.showMsg('手机号码不合法，请重新输入！')
    //   }
    // },
    authBtnCB (obj) {
      let self = this
      console.log('authBtnCB(obj)======>' + JSON.stringify(obj))
      if (obj.toString() === '手机号已被注册') { // 已注册
        self.isNew = false
        self.ironRequest(self.apiList.xy.captcha.url + '?user_phone=' + this.phone + '&type=7',
          {},
          self.apiList.xy.captcha.method).then((r) => {
          console.log('已注册获取登录验证码r------------>' + JSON.stringify(r))
          if (r.returncode.toString() === '0') {
          }
        }).catch((err) => {
          console.log('已注册获取登录验证码err------------>' + JSON.stringify(err))
        })
      } else if (obj.errormsg === '获取验证码成功') { // 未注册
        self.isNew = true
      }
    },
    // 登录
    bindAndLogin () {
      let self = this
      let canHttp = true
      const body = {
        openid: self.openId, unionid: self.unionId
      }
      if (self.selectTabId === 0) {
        if (self.userName.trim().length === 0) {
          self.showMsg('用户名不能为空')
          canHttp = false
          return
        }
        if (self.password.trim().length === 0) {
          self.showMsg('密码不能为空')
          canHttp = false
          return
        }
        let userPwd = self.base64Str(self.password.trim())
        body.user_mark = self.userName.trim()
        body.user_pwd = userPwd
      } else {
        if (self.phone.trim().length === 0) {
          self.showMsg('手机号码不能为空')
          canHttp = false
          return
        }
        if (self.code.trim().length === 0) {
          self.showMsg('验证码不能为空')
          canHttp = false
          return
        }
        body.phone = self.phone.trim()
        body.valid_code = self.code.trim()
      }

      if (self.selectTabId === 1 && self.isNew) {
        self.modalShow = true
        canHttp = false
        return
      }
      if (canHttp) {
        if ((Date.now() - this.onpresscTime) > 1500) {
          this.onpresscTime = Date.now()
          const qrParams = self.getQrParams()
          console.log('qrParams:>>', qrParams)
          if (qrParams !== '-1') {
            const arr = qrParams.split('|')
            const q = arr[1] + '_' + self.qrCodeForGoodsName[arr[0]]
            body.promotion = q
          }
          self.ironRequest(self.apiList.xy.wxBind.url, body, self.apiList.xy.wxBind.method).then((res) => {
            console.log('page_wxBind_res===>' + JSON.stringify(res))
            if (res.returncode.toString() === '0') {
              if (qrParams !== '-1') self.removeStoreKey('qrp')
              self.setUser(res)
              self.showMsg(res.errormsg)
              // 微信绑定手机号注册成功，新用户res.isnew == 1跳转完善信息页面
              setTimeout(function () {
                if (res.isnew === 1) {
                  self.jump('/pages/account/companyUpdate/main?type=3')
                } else {
                  self.tab('/pages/me/main')
                }
              }, 1500)
            }
          }).catch(e => {
            console.log('page_wxBind_catch===>' + JSON.stringify(e))
            self.modalShow = false
            self.showMsg(e)
          })
        } else {
          self.showMsg('点击过于频繁，请稍等！')
        }
      }
    },
    modalCb (flag) {
      let self = this
      console.log('modalCb------->' + flag)
      if (flag === 'confirm') {
        self.isNew = false
        self.bindAndLogin()
      } else {
        self.modalShow = false
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.dis-flex
  display flex
.flex-dir-row
  flex-direction row
.jc-sb
  justify-content space-between
.padding-lr
  padding 0 20px
.margin-a
  margin 40px
  .padding-b-10
    padding-bottom 10px
.padding-40
  padding 40px 40px 10px 40px
button
  background-color #F1F1F1
  border none
  text-align left
  padding-left 0
  outline none
button::after
  border 0
.register-icon
  &.phone
    width 13px
    height 17px
  &.code
    width 15px
    height 17px
  display inline-block
  background-size cover
.fs-italic
  font-style italic
</style>