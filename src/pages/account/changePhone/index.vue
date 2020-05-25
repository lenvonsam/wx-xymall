<template lang="pug">
div
  nav-bar(title="修改手机号码", isBack)
  .flex.text-center.nav.bg-white
      .cu-item.flex-sub(:class="{'text-blue cur': tabIndex === 1}", @click="selectTab(1)") 验证原手机号
      .cu-item.flex-sub(:class="{'text-gray': !canActive, 'text-blue cur': tabIndex === 2}", @click="selectTab(2)") 绑定新手机
  div(v-show="tabIndex==1")
    .warning 温馨提示：修改成功后需使用新手机号登录
    .bg-white
      .row.padding.border-bottom-line
        .col {{phone}}
        .flex-90.text-center
          auth-btn(:phone="currentUser.phone", :codeType="3", v-if="tabIndex === 1 && codeBtnShow")
      .padding
        input(placeholder="请输入验证码", v-model="code1", type="number")
    .margin-top-xl.padding
      .main-btn(hover-class="hover-gray", @click="nextStep") 下一步
  div(v-show="tabIndex === 2")
    .bg-white
      .row.padding.border-bottom-line
        .col
          input(placeholder="请输入新手机号", v-model="newPhone", type="number", :maxlength="11")
        .flex-90.text-center
          auth-btn(:phone="newPhone", :codeType="4", v-if="tabIndex === 2", type="number")
      .row.padding
        .col
          input(placeholder="请输入验证码", v-model="code2", type="number")
    .padding.margin-top-xl
      .main-btn(hover-class="hover-gray", @click="bindPhone") 确认
  alert(msg="手机号更改成功，请重新登录", v-model="alertShow", :cb="alertCb")      
</template>

<script>
import authBtn from '@/components/AuthBtn.vue'
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      canActive: false,
      tabIndex: 1,
      phone: '',
      code1: '',
      code2: '',
      newPhone: '',
      nextClick: true,
      bindClick: true,
      codeBtnShow: false,
      alertShow: false
    }
  },
  components: {
    authBtn
  },
  onShow () {
    this.codeBtnShow = true
    this.tabIndex = 1
    this.canActive = false
    this.code1 = ''
    this.nextClick = true
    this.phone = this.maskPhone(this.currentUser.phone)
  },
  onUnload () {
    this.codeBtnShow = false
    this.alertShow = false
  },
  methods: {
    ...mapActions([
      'exitUser'
    ]),
    alertCb () {
      this.exitUser()
      this.bindClick = true
      this.redirect('/pages/account/login/main?type=2')
    },
    selectTab (val) {
      if (val === 2 && !this.canActive) {
        return
      }
      this.tabIndex = val
    },
    async nextStep () {
      try {
        if (this.code1.trim().length === 0) {
          this.showMsg('验证码不能为空')
          return
        }
        if (this.nextClick) {
          this.nextClick = false
          await this.ironRequest(this.apiList.xy.validCaptcha.url + '?user_phone=' + this.currentUser.phone + '&valid_code=' + this.code1, {}, this.apiList.xy.validCaptcha.method)
          this.tabIndex = 2
          this.nextClick = true
          this.canActive = true
          this.newPhone = ''
          this.code2 = ''
          this.bindClick = true
        }
      } catch (e) {
        this.nextClick = true
        this.showMsg(e)
      }
    },
    async bindPhone () {
      try {
        if (this.newPhone.trim().length === 0) {
          this.showMsg('手机号不能为空')
          return
        }
        if (!this.phoneReg.test(this.newPhone)) {
          this.showMsg('请输入正确手机号')
          return
        }
        if (this.code2.trim().length === 0) {
          this.showMsg('验证码不能为空')
          return
        }
        if (this.bindClick) {
          this.bindClick = false
          await this.ironRequest(this.apiList.xy.bindNewPhone.url, { user_id: this.currentUser.user_id, user_phone: this.newPhone, msg_code: this.code2 }, this.apiList.xy.bindNewPhone.method)
          this.exitUser()
          this.alertShow = true
        }
      } catch (e) {
        this.bindClick = true
        this.showMsg(e)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.nav .cu-item.cur
  border-bottom none
  position relative
  &:after
    display block
    content ''
    width 26px
    height 2px
    background #0081ff
    position absolute
    bottom 0
    left 50%
    margin-left -13px
.warning
  background #fefcee
  font-size 14px
  color #e6763d
  padding 8px 10px
</style>
