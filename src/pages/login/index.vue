<template lang="pug">
div
  nav-bar(title="登录", :isBack="true")
  .login-bg(:style="{height: 'calc(100vh - '+customBar+'px)'}")
    .ft-18.text-blod.text-center 账号密码登录
    .row.padding-tb-sm.border-bottom-line.margin-top-xl
      .flex-30.text-gray
        icon.cuIcon-people
      .col
        input.no-border(placeholder="请输入用户名", v-model="uname")
    .row.padding-tb-sm.border-bottom-line.margin-top-xl
      .flex-30.text-gray
        icon.cuIcon-unlock
      .col
        input.no-border(placeholder="请输入密码", type="password", v-model="upwd")
    .row.margin-top
      .col.text-blue 立即注册
      .col.text-right 忘记密码？
    .mt-50.main-btn(hover-class="hover-gray", @click="remoteLogin") 登录
    .margin-top-sm.text-center.text-blue 手机验证登录


        
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
      customBar: state => state.customBar,
      currentVersion: state => state.currentVersion
    })
  },
  onShow () {
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
          if (data.isnew) {
            this.canClick = true
            this.confirm({ title: '您是新用户，请先完成公司信息' }).then(res => {
              if (res === 'confirm') {
                // jump to company profile
                this.showMsg('jump to company profile')
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
            }, 3000)
          }
        }
      } catch (e) {
        console.log('err', e)
        this.showMsg(e)
        this.canClick = true
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
  /deep/[class*='cuIcon-']
    margin-top -8px
</style>

