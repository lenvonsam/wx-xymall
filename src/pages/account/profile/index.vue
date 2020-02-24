<template lang="pug">
div
  nav-bar(title="个人资料", isBack)
  .ft-16
    .bg-white.row.padding
      .col 型云头像
      .col.text-right
        .profile-avatar(:style="{backgroundImage: 'url('+imgOuterUrl+currentUser.avatar+')'}", v-if="imgOuterUrl", @click="avatarUpload")
      .col.flex-25.text-gray.text-right
        icon.adjust.cuIcon-right
    .bg-white.row.padding.margin-top-sm.border-bottom-line(@click="jump('/pages/account/companyInfo/main')")
      .col 公司信息
      .col.text-right.text-gray.text-autohide {{currentUser.cust_name}}
      .col.flex-25.text-gray.text-right
        icon.adjust.cuIcon-right
    //- .bg-white.row.padding.ft-16.border-bottom-line
      .col 用户
      .col.text-right.text-gray {{currentUser.user_mark}}
    .bg-white.row.padding.border-bottom-line
      .col 登录账号
      .col.text-right.text-gray {{currentUser.user_mark}}
    .bg-white.row.padding
      .col 姓名
      .col.text-right.text-gray {{currentUser.nickname}}
    .bg-white.row.ft-16.padding(v-for="(item,idx) in jumpArray", :key="idx", :class="{'margin-top-sm': idx === 0, 'border-bottom-line': (idx < (jumpArray.length - 1))}", @click="jump(item.url)")
      .col {{item.name}}
      .col.text-right.text-gray(v-if="idx == (jumpArray.length - 1)") {{currentUser.phone}}
      .col.flex-25.text-right.text-gray
        icon.adjust.cuIcon-right
  .padding.margin-top-xl
    .main-btn(style="background: #F95353", hover-class="hover-gray", @click="userExit") 退出登录
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      jumpArray: [{
        name: '修改登录密码',
        url: '/pages/account/twoTab/main'
      }, {
        name: '修改支付密码',
        url: '/pages/account/twoTab/main?type=payPwd'
      }, {
        name: '修改手机号码',
        url: '/pages/account/changePhone/main'
      }]
    }
  },
  computed: {
    ...mapState({
      imgOuterUrl: state => state.imgOuterUrl,
      currentUser: state => state.user.currentUser
    })
  },
  onShow () {
    var me = this
    this.ironRequest(this.apiList.xy.queryProfile.url, {}, this.apiList.xy.queryProfile.method, this).then(resp => {
      let obj = me.currentUser
      obj.cust_name = resp.cust_name
      me.setUser(obj)
    })
  },
  methods: {
    ...mapActions([
      'setUser',
      'exitUser'
    ]),
    userExit () {
      const me = this
      this.confirm({ title: '友情提示', content: '您确定要退出吗？' }).then(res => {
        if (res === 'confirm') {
          const localSearch = me.currentUser.localSearchs
          me.ironRequest(me.apiList.xy.searchHistory.url, { user_id: me.currentUser.user_id, history: localSearch }, me.apiList.xy.searchHistory.method, me)
          me.exitUser()
          me.redirect('/pages/account/login/main')
        }
      })
    },
    async avatarUpload () {
      try {
        const data = await this.ironFileUpload('cominfo')
        console.log(data)
        await this.ironRequest(this.apiList.xy.updateProfile.url, { user_id: this.currentUser.user_id, avatar_url: data }, 'post', this)
        const obj = this.currentUser
        obj.avatar = '/filepool' + data
        this.setUser(obj)
        this.showMsg('头像更新成功')
      } catch (e) {
        this.showMsg(e)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.profile-avatar
  width 40px
  height 40px
  background-size cover
  background-position center
  display inline-block
  border-radius 20px
  overflow hidden
  position relative
  .file-avatar
    position absolute
    width 100%
    left 0px
    right 0px
    top 0
    bottom 0
    z-index 20
    opacity 0
</style>
