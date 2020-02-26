<template lang="pug">
div
  nav-bar(title="用户设置", isBack)
  .bg-white
    .row.padding.border-bottom-line.ft-16
      .col 消息通知
      .col.text-right
        switch(:checked="toggleNotice", @change="noticeChange")
    .row.padding.border-bottom-line.ft-16
      .col 当前版本
      .col.text-right.c-gray V{{currentVersion}}
    .row.padding.ft-16(@click="jump('/pages/h5/main?type=aboutUs&title=关于我们')")
      .col 关于我们
      .col.text-right.text-gray
        icon.cuIcon-right
  .padding.margin-top-xl
    .main-btn(style="background: #ef5350", hover-class="hover-gray", @click="clickOut") 退出登录 
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      toggleNotice: true
    }
  },
  computed: {
    ...mapState({
      currentVersion: state => state.currentVersion
    })
  },
  methods: {
    ...mapActions([
      'configVal',
      'setUser',
      'exitUser'
    ]),
    noticeChange (e) {
      console.log('change ', e)
      const val = e.mp.detail.value ? '1' : '0'
      this.ironRequest(this.apiList.xy.updateProfile.url, { user_id: this.currentUser.user_id, message_switch: val }, this.apiList.xy.updateProfile.method)
      const obj = this.currentUser
      obj.message_switch = val
      this.setUser(obj)
    },
    clickOut () {
      const me = this
      this.confirm({ content: '您确定要退出吗?', title: '友情提示' }).then(res => {
        if (res === 'confirm') {
          const localSearch = me.currentUser.localSearch
          me.ironRequest(me.apiList.xy.searchHistory.url, { user_id: me.currentUser.user_id, history: localSearch }, me.apiList.xy.searchHistory.method)
          me.exitUser()
          me.jump('/pages/account/login/main?type=2')
        }
      })
    }
  },
  onShow () {
    if (this.currentUser.message_switch && this.currentUser.message_switch === '1') {
      this.toggleNotice = true
    } else {
      this.toggleNotice = false
    }
  }
}
</script>