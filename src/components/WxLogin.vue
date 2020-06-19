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
    this.openId = mpvue.getStorageSync('openId')
    console.log('openId===>' + this.openId)
    if (typeof this.openId !== 'undefined' && this.openId) {
      this.bindwx = true
    }
  },
  methods: {
    ...mapActions([
      'setUser'
    ]),
    bindWxBtn () {
      let self = this
      if ((Date.now() - this.onpresscTime) > 2000) {
        this.onpresscTime = Date.now()
        /** 判断是否已绑定微信（通过接口返回判断）
       * 已绑定==》自动登录，跳转用户中心
       * 未绑定==》跳转账号绑定页面
       */
        if (self.bindwx) {
          // 微信自动登录接口
          console.log('self.bindwx===>' + self.bindwx)
          self.ironRequest(this.apiList.xy.wxLogin.url, { openid: self.openId }, this.apiList.xy.wxLogin.method).then((res) => {
            console.log('res===>' + JSON.stringify(res))
            self.setUser(res)
            self.showMsg(res.errormsg)
            setTimeout(function () {
              if (self.backType === 1) {
                self.back()
              } else {
                if (res.isnew === 1) {
                  self.jump('/pages/account/companyUpdate/main?type=3')
                } else {
                  self.tab('/pages/me/main')
                }
              }
            }, 1500)
          }).catch(e => {
            console.log('catch===>' + JSON.stringify(e))
            self.jump('/pages/account/wxBind/main')
            // modal提示是否绑定
          })
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