<template lang="pug">
.bg-white.h-100
  nav-bar(title="登录", :isBack="true")
  .login-bg
    .ft-18.text-blod.text-center 账号密码登录
    .row.padding-tb-sm.border-bottom-line.margin-top-xl
      .flex-30.text-gray
        icon.adjust.cuIcon-people
      .col
        input.no-border(placeholder="请输入用户名", v-model="uname")
    .row.padding-tb-sm.border-bottom-line.margin-top-xl
      .flex-30.text-gray
        icon.adjust.cuIcon-unlock
      .col
        input.no-border(placeholder="请输入密码", type="password", v-model="upwd")
    .row.margin-top
      .col.text-blue(@click="jump('/pages/account/register/main')") 立即注册
      .col.text-right(@click="jump('/pages/account/phoneLogin/main?type=forgetPwd')") 忘记密码？
    .mt-50.main-btn(hover-class="hover-gray", @click="remoteLogin") 登录
    .margin-top-sm.text-center.text-blue(@click="jump('/pages/account/phoneLogin/main')") 手机验证登录


        
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      uname: '',
      upwd: '',
      // 1 返回 2 跳转首页
      backType: 1,
      canClick: true
    }
  },
  computed: {
    ...mapState({
      currentVersion: state => state.currentVersion,
      currentUser: state => state.user.currentUser
    })
  },
  onShow () {
    this.uname = ''
    this.upwd = ''
    this.backType = 1
    this.canClick = true
    if (this.$root.$mp.query.type) this.backType = Number(this.$root.$mp.query.type)
    else this.backType = 1
  },
  methods: {
    ...mapActions([
      'setUser',
      'configVal'
    ]),
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
        if (this.canClick) {
          this.canClick = false
          const encrptPwd = this.base64Str(this.upwd.trim())
          const data = await this.ironRequest(this.apiList.xy.login.url, { user_mark: this.uname.trim(), user_pwd: encrptPwd }, this.apiList.xy.login.method, this)
          console.log('user login', data)
          data.pwd = encrptPwd
          this.setUser(data)
          this.configVal({ key: 'oldVersion', val: this.currentVersion })
          this.getRemoteSearchHistory(data)
          if (data.isnew) {
            this.canClick = true
            const me = this
            this.confirm({ title: '您是新用户，请先完成公司信息' }).then(res => {
              if (res === 'confirm') {
                me.jump('/pages/account/companyUpdate/main')
              }
            })
          } else {
            // FIXME 原生的好项目不具备tab count
            this.showMsg('登录成功')
            const me = this
            setTimeout(function () {
              me.canClick = true
              if (me.backType === 1) {
                me.back()
              } else {
                me.tab('/pages/index/main')
              }
            }, 2000)
          }
        }
      } catch (e) {
        console.log('err', e)
        this.showMsg(e)
        this.canClick = true
      }
    },
    async getRemoteSearchHistory (userData) {
      try {
        const data = await this.ironRequest(this.apiList.xy.searchHistory.url + '?user_id=' + userData.user_id, {}, this.apiList.xy.searchHistory.method, this)
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
  padding-left 50px
  padding-right 50px
  padding-top 50px
</style>

