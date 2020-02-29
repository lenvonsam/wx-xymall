<script>
import { mapActions } from 'vuex'
export default {
  methods: {
    ...mapActions([
      'configVal',
      'autoUser'
    ])
  },
  created () {
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
    // 自动登录
    this.autoUser()
    const me = this
    // 设置自定义customer bar
    mpvue.getSystemInfo({
      success (e) {
        console.log(e)
        const statusBar = e.statusBarHeight
        console.log('status bar height:>>', e.statusBarHeight)
        me.configVal({ key: 'screenWidth', val: e.screenWidth })
        me.configVal({ key: 'screenHeight', val: e.screenHeight })
        me.configVal({ key: 'statusBar', val: statusBar })
        me.configVal({ key: 'bottomBarHeight', val: e.screenHeight - e.windowHeight })
        const capsule = wx.getMenuButtonBoundingClientRect()
        if (capsule) {
          me.configVal({ key: 'custom', val: capsule })
          me.configVal({ key: 'customBar', val: capsule.bottom + capsule.top - statusBar })
        } else {
          me.configVal({ key: 'customBar', val: statusBar + 50 })
        }
        console.log('capsule:>>', capsule)
      }
    })
    console.log('this.currentUser', this.currentUser)
  }
}
</script>

<style>
@import url("./css/common.css");
</style>
