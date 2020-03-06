<template lang="pug">
div
  nav-bar(:title="titleMap[type].title", isBack)
  .flex.text-center.nav.bg-white
    .cu-item.flex-sub(v-for="(item,index) in tabs", :class="item.tab === tabName?'text-blue cur':''", :key="index", @click="selectTab(item.tab)")
      span {{item.title}}
  .bg-white(v-if="tabName === 'tab1'")
    template(v-if="type === 'loginPwd' || type === 'payPwd'")
      .warning(v-if="type === 'payPwd'") 温馨提示：初始密码为管理员登录密码
      .row.padding.border-bottom-line
        .flex-100 旧密码
        .col.text-right
          input.text-right(placeholder="请输入旧密码", type="password",v-model="val1")
      .row.padding.border-bottom-line
        .flex-100 新密码
        .col.text-right
          input.text-right(placeholder="请输入新密码", type="password", v-model="val2")
      .row.padding
        .flex-100 确认密码
        .col.text-right
          input.text-right(placeholder="请再次确认新密码", type="password",v-model="val3")
  .bg-white(v-else)
    template(v-if="type === 'loginPwd'|| type === 'payPwd'")
      .row.padding.border-bottom-line
        .flex-100 手机号
        .col
          input.no-border(:disabled="true", :value="val1")
      .row.padding.border-bottom-line
        .flex-100 验证码
        .col
          input(placeholder="请输入验证码", type="number", v-model="val2")
        .flex-90.text-center(style="border-left: 1rpx solid #ddd")
          auth-btn(:phone="currentUser.phone", v-if="currentUser.phone", :codeType="type === 'loginPwd' ? 5 : 6")
      .row.padding
        .flex-100 新密码
        .col
          input(placeholder="请输入密码", type="password",v-model="val3")
  .margin-top-xl.padding
    .main-btn(hover-class="hover-gray", @click="tabHandler") 完成
  alert(:title="alertText", :cb="alertCb", v-model="alertShow")
</template>

<script>
import { mapActions } from 'vuex'
import authBtn from '@/components/AuthBtn.vue'
export default {
  data () {
    return {
      alertText: '',
      alertShow: false,
      tabName: 'tab1',
      type: 'loginPwd',
      canClick: true,
      canHttp: true,
      tabs: [
        { title: '', tab: 'tab1' },
        { title: '', tab: 'tab2' }
      ],
      titleMap: {
        loginPwd: {
          title: '修改登录密码',
          tab1: '使用原密码修改',
          tab2: '手机验证码修改'
        },
        payPwd: {
          title: '修改支付密码',
          tab1: '使用原密码修改',
          tab2: '手机验证码修改'
        }
      },
      val1: '',
      val2: '',
      val3: ''
    }
  },
  components: {
    authBtn
  },
  onShow () {
    this.type = 'loginPwd'
    this.tabName = 'tab1'
    this.val1 = ''
    this.val2 = ''
    this.val3 = ''
    const query = this.$root.$mp.query
    if (query.type) this.type = query.type
    this.tabs[0].title = this.titleMap[this.type].tab1
    this.tabs[1].title = this.titleMap[this.type].tab2
  },
  methods: {
    ...mapActions([
      'exitUser'
    ]),
    alertCb () {
      if (this.type === 'loginPwd') {
        this.exitUser()
        this.redirect('/pages/account/login/main?type=2')
      } else {
        this.back()
      }
    },
    selectTab (tab) {
      this.tabName = tab
      this.val1 = ''
      this.val2 = ''
      this.val3 = ''
      if (this.tabName === 'tab2') {
        if (this.type === 'loginPwd' || this.type === 'payPwd') {
          this.val1 = this.maskPhone(this.currentUser.phone)
        }
      }
    },
    tabHandler () {
      if (this.validate()) {
        if (this.type === 'loginPwd' || this.type === 'payPwd') {
          this.loginPwdHandler()
        }
      }
    },
    validate () {
      let result = true
      let msg = ''
      if (this.tabName === 'tab1') {
        if (this.val1.trim().length === 0) {
          msg = '旧密码不能为空'
          result = false
        } else if (this.val2.trim().length === 0) {
          msg = '新密码不能为空'
          result = false
        } else if (this.val3.trim().length === 0) {
          msg = '确认密码不能为空'
          result = false
        } else if (this.val2 !== this.val3) {
          msg = '新密码和确认密码不一致'
          result = false
        }
      } else {
        if (this.val2.trim().length === 0) {
          msg = '验证码不能为空'
          result = false
        } else if (this.val3.trim().length === 0) {
          msg = '新密码不能为空'
          result = false
        }
      }
      if (!result) this.showMsg(msg)
      return result
    },
    async loginPwdHandler () {
      this.canHttp = true
      const queryObject = {
        user_id: this.currentUser.user_id,
        action_type: 1
      }
      if (this.type === 'payPwd') queryObject.action_type = 2
      if (this.tabName === 'tab1') {
        if (this.val3 !== this.val2) {
          this.showMsg('密码不一致')
          this.canHttp = false
          return
        }
        if (!this.pwdReg.test(this.val2)) {
          this.showMsg('请输入6-12位密码，只能是数字、字母和下划线')
          this.canHttp = false
          return
        }
        queryObject.new_pwd = this.base64Str(this.val2.trim())
        queryObject.old_pwd = this.base64Str(this.val1.trim())
      } else {
        if (!this.pwdReg.test(this.val3)) {
          this.showMsg('请输入6-12位密码，只能是数字、字母和下划线')
          this.canHttp = false
          return
        }
        queryObject.new_pwd = this.base64Str(this.val3)
        queryObject.capatcha = this.val2
        queryObject.user_phone = this.currentUser.phone
      }
      try {
        if (this.canClick && this.canHttp) {
          this.canClick = false
          await this.ironRequest(this.apiList.xy.resetPwd.url, queryObject, this.apiList.xy.resetPwd.method)
          if (this.type === 'loginPwd') {
            this.alertText = '登录密码修改成功，请重新登录'
          } else {
            this.alertText = '支付密码修改成功'
          }
          this.canClick = true
          this.alertShow = true
        }
      } catch (e) {
        this.canClick = true
        this.showMsg(e)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.warning
  background #fefcee
  font-size 14px
  color #e6763d
  padding 8px 10px
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
</style>
