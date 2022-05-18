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
    },
    // 微信小程序版本更新
    autoUpdate () {
      console.log(new Date())
      // 获取小程序更新机制兼容
      if (wx.canIUse('getUpdateManager')) {
        const updateManager = wx.getUpdateManager()
        // 1. 检查小程序是否有新版本发布
        updateManager.onCheckForUpdate(res => {
          // 请求完新版本信息的回调
          if (res.hasUpdate) {
            // 2. 小程序有新版本，则静默下载新版本，做好更新准备
            updateManager.onUpdateReady(() => {
              console.log(new Date())
              wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: res => {
                  if (res.confirm) {
                    // 3. 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    updateManager.applyUpdate()
                  } else if (res.cancel) {
                    // 如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
                    wx.showModal({
                      title: '温馨提示~',
                      content: '本次版本更新涉及到新的功能添加，建议您更新后使用~',
                      success: res => {
                        // 第二次提示后，强制更新
                        if (res.confirm) {
                          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                          updateManager.applyUpdate()
                        } else if (res.cancel) {
                          // 重新回到版本更新提示
                          // this.autoUpdate()
                          console.log('用户取消版本更新')
                        }
                      }
                    })
                  }
                }
              })
            })
            updateManager.onUpdateFailed(function () {
              // 新的版本下载失败
              wx.showModal({
                title: '发现新版本',
                content: '请您删除当前小程序，重新搜索打开'
              })
            })
          }
        })
      } else {
        // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
        wx.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
        })
      }
    }
  },
  created () {
    // 微信小程序版本更新
    this.autoUpdate()

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

    // 设置vuex全局状态
    me.autoUser()

    // 获取用户信息
    if (me.isLogin) {
      me.httpPost(me.apiList.zf.getPersonInfo, {fromApp: true}).then(res => {
        console.log('用户已登陆，获取用户信息++++', res)
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
        console.log('失效111')
        me.showMsg('登录已失效，请重新登录')
        setTimeout(() => {
          me.exitUser()
          me.jump('/pages/account/login/main')
        }, 500)
      })
    }
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
        console.log('model', e.model)
        if (/iphone\sx/i.test(model) ||
          (/iphone/i.test(model) && /unknown/.test(model)) ||
          /iphone\s11/i.test(model)) {
          console.log('x机型+++++')
          me.configVal({ key: 'isIpx', val: true })
        } else {
          console.log('非x机型+++++')
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
