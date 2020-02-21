<template lang="pug">
.bg-white.h-100
  nav-bar(:title="pageTitle", isBack, :cb="pageBack")
  .login-bg
    .ft-18.text-center {{pageType == 'smsLogin' ? '手机验证码登录' : '找回密码'}}
    .row.padding-tb-sm.border-bottom-line.margin-top-xl
      .flex-30.row
        .register-icon.phone(:style="{backgroundImage: 'url(' + imgProxy + 'phone_icon.png)'}", v-if="imgProxy")
      .col
        input.no-border(placeholder="请输入手机号", v-model="phone", type="number", :maxlength="11")
    .row.padding-tb-sm.border-bottom-line.margin-top-xl
      .flex-30.row
        .register-icon.code(:style="{backgroundImage: 'url(' + imgProxy + 'code_icon.png)'}", v-if="imgProxy")
      .col
        input.no-border(placeholder="请输入验证码", type="number", v-model="code")
      .flex-90.text-center(style="border-left: 1rpx solid #888", v-show="pageType == 'smsLogin'")
        auth-btn(:phone="phone", :codeType="7", v-if="pageType == 'smsLogin'")
      .flex-90.text-center(style="border-left: 1rpx solid #888", v-show="pageType == 'forgetPwd'")
        auth-btn(:phone="phone", :codeType="2", v-if="pageType == 'forgetPwd'")
    .row.padding-tb-sm.margin-top-xl.border-bottom-line(v-if="pageType === 'forgetPwd'")
      .flex-30
        icon.adjust.cuIcon-lock.text-gray
      .col
        input.no-border(placeholder="请输入新密码", v-model="pwd", type="password")
    .mt-50.main-btn(hover-class="hover-gray", @click="remoteHandler") {{pageType === 'smsLogin' ? '登录' : '提交'}}
</template>

<script>
import authBtn from '@/components/AuthBtn'
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
      canClick: true
    }
  },
  computed: {
    ...mapState({
      currentVersion: state => state.currentVersion,
      currentUser: state => state.user.currentUser
    })
  },
  components: {
    authBtn
  },
  onShow () {
    this.canClick = true
    this.pageType = 'smsLogin'
    if (this.$root.$mp.query.type) this.pageType = this.$root.$mp.query.type
    console.log('pageType:>>', this.pageType)
  },
  methods: {
    ...mapActions([
      'setUser',
      'configVal'
    ]),
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
        if (this.pageType === 'forgetPwd' && this.pwd.lenght === 0) {
          this.showMsg('密码不能为空')
          return
        }
        const params = {}
        if (this.pageType === 'forgetPwd') {
          params.user_pwd = this.base64Str(this.pwd)
          params.user_phone = this.phone
          params.msg_code = this.code
        } else {
          params.phone = this.phone
          params.valid_code = this.code
        }
        if (this.canClick) {
          this.canClick = false
          // 18015816879
          // TODO 接口正在修改
          const data = await this.ironRequest(this.apiList.xy[this.pageType].url, params, this.apiList.xy[this.pageType].method, this)
          const me = this
          me.showMsg(this.pageType === 'forgetPwd' ? '处理成功' : '登录成功')
          setTimeout(function () {
            if (me.pageType === 'smsLogin') {
              me.resetVal()
              me.setUser(data)
              me.configVal({ key: 'oldVersion', val: me.currentVersion })
              me.getRemoteSearchHistory(data)
              if (data.isnew) {
                me.confirm({ title: '您是新用户，请先完成公司信息' }).then(res => {
                  if (res === 'confirm') {
                    me.jump('/pages/account/companyUpdate/main')
                  }
                })
              } else {
                me.tab('/pages/index/main')
              }
            } else {
              me.resetVal()
              me.back()
            }
          }, 2000)
        }
      } catch (e) {
        this.showMsg(e)
        this.canClick = true
      }
    },
    async getRemoteSearchHistory (userData) {
      try {
        const data = await this.ironRequest(this.apiList.xy.searchHistory.url + '?user_id=' + userData.user_id, {}, this.apiList.xy.searchHistory.method, this)
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
