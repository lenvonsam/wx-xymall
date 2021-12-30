<template lang="pug">
  div.mt-50(@click="bindWxBtn")
    img(src="/static/images/wechat_img.png")
    .margin-top-sm.text-center 微信登录
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'wxLogin',
  props: {
    backType: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      bindwx: false,
      openId: '',
      onpresscTime: 0 // 阻止短时间内连续点击
    }
  },
  onLoad () {
    // this.openId = mpvue.getStorageSync('openId')
    // console.log('openId===>' + this.openId)
    this.wxAuthLogin()
  },
  methods: {
    ...mapActions([
      'setUser'
    ]),
    // 微信小程序登陆
    wxAuthLogin () {
      const me = this
      try {
        const localOpenId = mpvue.getStorageSync('openId') || false
        if (!localOpenId) {
          mpvue.login({
            success (res) {
              console.log('login data', res)
              me.request(me.scpProxy + me.apiList.scp.login.url, { code: res.code, appKey: me.appKey }, me.apiList.scp.login.method).then(data => {
                if (data.return_code === 0 && data.openId) {
                  me.openId = data.openId
                  mpvue.setStorage({
                    key: 'openId',
                    data: data.openId
                  })
                  me.bindwx = true
                }
              }).catch(e => {
                console.error('login fail', e)
              })
            },
            fail (err) {
              console.error('login error', err)
            }
          })
        } else {
          me.openId = mpvue.getStorageSync('openId')
        }
      } catch (e) {
        console.error('get storage info error:>>', e)
      }
    },
    bindWxBtn () {
      console.log('aaaa++++')
      console.log('self.bindwx===>' + this.bindwx)
      let self = this
      if ((Date.now() - this.onpresscTime) > 2000) {
        this.onpresscTime = Date.now()
        /** 判断是否已绑定微信（通过接口返回判断）
       * 已绑定==》自动登录，跳转用户中心
       * 未绑定==》跳转账号绑定页面
       */
        if (self.bindwx) {
          // 微信自动登录接口
          let paramsObj = {
            openId: self.openId,
            unionId: mpvue.getStorageSync('unionId')
          }
          self.httpGet(self.apiList.zf.wxLogin, paramsObj).then(res => {
            self.setUser({token: res.data.token, user: res.data.user})
            self.httpPost(self.apiList.zf.getPersonInfo, {}).then(res => {
              self.setUser({user: res.data})
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
                    console.log('+++++++aaa')
                    self.back()
                  } else {
                    console.log('+++++++bbb')
                    self.tab('/pages/index/main')
                  }
                }, 500)
              }
            })
          }).catch(e => {
            console.log('微信未绑定过手机号，登陆失败——+++')
            console.log(e)
            self.jump('/pages/account/wxBind/main')
          })

          // self.ironRequest(this.apiList.xy.wxLogin.url, { openid: self.openId }, this.apiList.xy.wxLogin.method).then((res) => {
          //   console.log('res===>' + JSON.stringify(res))
          //   self.setUser(res)
          //   self.showMsg(res.errormsg)
          //   setTimeout(function () {
          //     if (self.backType === 1) {
          //       self.back()
          //     } else {
          //       if (res.isnew === 1) {
          //         self.jump('/pages/account/companyUpdate/main?type=3')
          //       } else {
          //         self.tab('/pages/me/main')
          //       }
          //     }
          //   }, 1500)
          // }).catch(e => {
          //   console.log('catch===>' + JSON.stringify(e))
          //   self.jump('/pages/account/wxBind/main')
          //   // modal提示是否绑定
          // })
        } else {
          self.jump('/pages/account/wxBind/main')
        }
      } else {
        self.showMsg('点击过于频繁，请稍等！')
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
img
  display block
  width 40px
  height 40px
  margin 0 auto
</style>
