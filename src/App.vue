<script>
import { mapActions } from 'vuex'
export default {
  methods: {
    ...mapActions([
      'configVal',
      'autoUser',
      'exitUser',
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
                  mpvue.setStorage({
                    key: 'openId',
                    data: data.openId
                  })
                  // console.log('getStorage("openId")========>' + mpvue.getStorage('openId'))
                  if (data.unionId) {
                    mpvue.setStorage({
                      key: 'unionId',
                      data: data.unionId
                    })
                  }
                }
              }).catch(e => {
                console.error('login fail', e)
              })
            },
            fail (err) {
              console.error('login error', err)
            }
          })
        }
      } catch (e) {
        console.error('get storage info error:>>', e)
      }
    }
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

    // 登陆日志
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

    // 微信小程序登录
    this.wxAuthLogin()
    const me = this
    // 判断是否已经登陆
    console.log('判断用户是否已经登陆++++', me.isLogin)
    // me.getQueryProfile()
    // me.showLoading()
    // const uid = me.currentUser.user_id
    // console.log('App.vue_uid=====>', uid)
    // 获取用户信息
    me.httpPost(me.apiList.zf.getPersonInfo, {}).then(res => {
      console.log('用户已登陆，获取用户信息++++', res)
      // 设置vuex全局状态
      me.autoUser()
      me.setUser({ token: me.token, user: res.data })
      if (res.data.userStatus === '01') {
        me.confirm({ content: '您是新用户，请先完善公司信息' }).then(res => {
          if (res === 'confirm') {
            me.jump('/pages/account/companyUpdate/main')
          }
        })
      }
    }).finally(() => {
      me.hideLoading()
    }).catch(e => {
      me.$store.commit('LOGOUT')
      me.hideLoading()
      me.showMsg('登录已失效，请重新登录')
      setTimeout(() => {
        me.exitUser()
        me.jump('/pages/account/login/main')
      }, 500)
    })
    // this.ironRequest(`${this.apiList.xy.checkUUID.url}?user_id=${uid}`, {}, this.apiList.xy.checkUUID.method).then(resp => {
    //   console.log('checkUUID未失效')
    //   me.hideLoading()
    //   // 自动登录：token是否失效
    // }).catch((e) => {
    //   me.hideLoading()
    //   console.log('App.vue_已失效currentUser_catch========>' + JSON.stringify(e))
    //   me.showMsg('登录已失效，请重新登录')
    //   const localSearch = me.currentUser.localSearchs
    //   me.ironRequest(me.apiList.xy.searchHistory.url, { user_id: me.currentUser.user_id, history: localSearch }, me.apiList.xy.searchHistory.method, me)
    //   me.ironRequest(`${me.apiList.xy.loginOut.url}?user_id=${me.currentUser.user_id}`, {}, me.apiList.xy.loginOut.method)
    //   setTimeout(() => {
    //     me.exitUser()
    //     me.jump('/pages/account/login/main')
    //   }, 500)
    // })
    // if (me.currentUser.type === 'buyer') { // 判断用户type,buyer不需要调接口判断checkUUID失效与否
    //   console.log('App.vue_me.currentUser.type========>' + me.currentUser.type)
    //   me.hideLoading()
    // } else {
    //   this.ironRequest(`${this.apiList.xy.checkUUID.url}?user_id=${uid}`, {}, this.apiList.xy.checkUUID.method).then(resp => {
    //     console.log('checkUUID未失效')
    //     me.hideLoading()
    //   // 自动登录
    //   }).catch((e) => {
    //     me.hideLoading()
    //     console.log('App.vue_已失效currentUser_catch========>' + JSON.stringify(e))
    //     me.showMsg('登录已失效，请重新登录')
    //     const localSearch = me.currentUser.localSearchs
    //     me.ironRequest(me.apiList.xy.searchHistory.url, { user_id: me.currentUser.user_id, history: localSearch }, me.apiList.xy.searchHistory.method, me)
    //     me.ironRequest(`${me.apiList.xy.loginOut.url}?user_id=${me.currentUser.user_id}`, {}, me.apiList.xy.loginOut.method)
    //     setTimeout(() => {
    //       me.exitUser()
    //       me.jump('/pages/account/login/main')
    //     }, 500)
    //   })
    // }

    // 获取系统信息
    // 设置自定义customer bar
    mpvue.getSystemInfo({
      success (e) {
        console.log('获取系统信息+++', e)
        const statusBar = e.statusBarHeight
        console.log('status bar height:>>', e.statusBarHeight)
        me.configVal({ key: 'screenWidth', val: e.screenWidth })
        me.configVal({ key: 'screenHeight', val: e.screenHeight })
        me.configVal({ key: 'statusBar', val: statusBar })
        me.configVal({ key: 'bottomBarHeight', val: (e.screenHeight - e.windowHeight) })
        // 获取菜单按钮（右上角胶囊按钮）的布局位置信息。坐标信息以屏幕左上角为原点。
        const capsule = wx.getMenuButtonBoundingClientRect()
        console.log('获取胶囊信息+++', capsule)
        if (capsule) {
          me.configVal({ key: 'custom', val: capsule })
          me.configVal({ key: 'customBar', val: capsule.bottom + capsule.top - statusBar })
        } else {
          me.configVal({ key: 'customBar', val: statusBar + 50 })
        }
        // 判断机型
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
