<script>
import { mapActions } from 'vuex'
export default {
  methods: {
    ...mapActions([
      'configVal',
      'autoUser',
      'exitUser'
    ])
  },
  created () {
    console.log('App.vue created生命周期')
    // 调用API从本地缓存中获取数据
    /*
     * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
     * 微信：mpvue === wx, mpvuePlatform === 'wx'
     * 头条：mpvue === tt, mpvuePlatform === 'tt'
     * 百度：mpvue === swan, mpvuePlatform === 'swan'
     * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
     */

    // let logs
    // if (mpvuePlatform === 'my') {
    //   logs = mpvue.getStorageSync({ key: 'logs' }).data || []
    //   logs.unshift(Date.now())
    //   mpvue.setStorageSync({
    //     key: 'logs',
    //     data: logs
    //   })
    // } else {
    //   logs = mpvue.getStorageSync('logs') || []
    //   logs.unshift(Date.now())
    //   mpvue.setStorageSync('logs', logs)
    // }
    // 检查userid合法性
    // const currentUser = mpvue.getStorageSync('currentUser')
    const me = this
    me.autoUser()
    console.log('App.vue_currentUser========>' + JSON.stringify(me.currentUser))
    if (me.isLogin) {
      me.showLoading()
      const uid = me.currentUser.user_id
      this.ironRequest(`${this.apiList.xy.checkUUID.url}?user_id=${uid}`, {}, this.apiList.xy.checkUUID.method).then(resp => {
        console.log('checkUUID未失效')
        me.hideLoading()
        // 自动登录
      }).catch((e) => {
        me.hideLoading()
        console.log('App.vue_已失效currentUser_catch========>' + JSON.stringify(e))
        me.showMsg('登录已失效，请重新登录')
        const localSearch = me.currentUser.localSearchs
        me.ironRequest(me.apiList.xy.searchHistory.url, { user_id: me.currentUser.user_id, history: localSearch }, me.apiList.xy.searchHistory.method, me)
        me.ironRequest(`${me.apiList.xy.loginOut.url}?user_id=${me.currentUser.user_id}`, {}, me.apiList.xy.loginOut.method)
        setTimeout(() => {
          me.exitUser()
          me.jump('/pages/account/login/main')
        }, 500)
      })
    } else {
      console.log('未登录me.isLogin======>' + me.isLogin)
    }

    // 设置自定义customer bar
    mpvue.getSystemInfo({
      success (e) {
        console.log(e)
        const statusBar = e.statusBarHeight
        console.log('status bar height:>>', e.statusBarHeight)
        me.configVal({ key: 'screenWidth', val: e.screenWidth })
        me.configVal({ key: 'screenHeight', val: e.screenHeight })
        me.configVal({ key: 'statusBar', val: statusBar })
        me.configVal({ key: 'bottomBarHeight', val: (e.screenHeight - e.windowHeight) })
        const capsule = wx.getMenuButtonBoundingClientRect()
        if (capsule) {
          me.configVal({ key: 'custom', val: capsule })
          me.configVal({ key: 'customBar', val: capsule.bottom + capsule.top - statusBar })
        } else {
          me.configVal({ key: 'customBar', val: statusBar + 50 })
        }
        const model = e.model
        if (/iphone\sx/i.test(model) ||
          (/iphone/i.test(model) && /unknown/.test(model)) ||
          /iphone\s11/i.test(model)) {
          console.log('model', e.model)
          me.configVal({ key: 'isIpx', val: true })
        } else {
          me.configVal({ key: 'isIpx', val: false })
        }
        console.log('capsule:>>', capsule)
      }
    })
  }
}
</script>

<style>
@import url("./css/common.css");
</style>
