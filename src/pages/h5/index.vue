<template lang="pug">
div
  nav-bar(:title="pageTitle", :isBack="!share", :isCustom="share")
  .padding(v-if="pageType === 'noticeDetail'")
    .bg-white.padding(style="box-shadow: 0 0 5rpx rgba(7, 1, 2, 0.04)")
      div {{obj.title}}
      .margin-top
        div(v-html="obj.content", style="color: rgba(77, 77, 77, 1)")
  .padding.bg-white(v-else-if="pageType === 'registProtocol'")
    div(v-for="(pl,idx) in protocol", :key="idx")
      .ft-16.text-bold.padding-tb(v-if="pl.title") {{pl.title}}
      div(v-if="pl.content", v-html="pl.content", :class="{'pl_info': idx > 0}")
  .padding.bg-white(v-else-if="pageType === 'msgDetail'")
    div
      .ft-16.text-blue(style="display:inline-block;") {{tempObject.title}}
      .xt-mark {{tempObject.type == 0 ? '系统' : '其他'}}
    .text-gray.ft-12.margin-top-sm {{tempObject.time}}
    .margin-top-sm
      div(v-html="tempObject.content")
  div(v-else-if="pageType === 'aboutUs'")
    img.full-width(:src="imgProxy + 's_bg1.png'", v-if="imgProxy")
    .padding
      div(v-html="aboutUsInfo")
    img.full-width(:src="imgProxy + 's_bg2.png'", v-if="imgProxy")
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      pageTitle: '',
      pageType: 'noticeDetail',
      obj: {},
      share: false
    }
  },
  computed: {
    ...mapState({
      protocol: state => state.user.protocol,
      tempObject: state => state.tempObject
    })
  },
  onShow () {
    this.pageTitle = ''
    this.pageType = 'noticeDetail'
    this.share = false
    const query = this.$root.$mp.query
    if (query.title) this.pageTitle = query.title
    if (query.type) this.pageType = query.type
    if (query.shareMe) this.share = true
    if (this.pageType !== 'registProtocol' || this.pageTitle !== 'aboutUs') this.getRemoteInfo()
  },
  onShareAppMessage () {
    const query = this.$root.$mp.query
    let path = 'pages/h5/main?shareMe=1&title=' + query.title + '&type=' + query.type
    if (query.type === 'noticeDetail') {
      path += '&id=' + query.id
    }
    console.log('123333', path)
    return {
      title: '公告详情',
      path: path,
      success () {
        this.showMsg('转发成功')
      },
      error () {
        this.showMsg('转发失败')
      }
    }
  },
  methods: {
    async getRemoteInfo () {
      try {
        const query = this.$root.$mp.query
        const params = {}
        let url = this.apiList.xy[this.pageType].url
        if (this.pageType === 'noticeDetail') {
          url += '?id=' + query.id
        }
        const data = await this.ironRequest(url, params, this.apiList.xy[this.pageType].method)
        console.log('data', data)
        this.obj = data
        this[this.pageType + 'Handler']()
      } catch (e) {
        this.showMsg(e)
      }
    },
    noticeDetailHandler () {
      this.obj.content = this.obj.content.replace(/<img src="/g, '<img width="100%" src="' + this.imgOuterUrl)
      console.log(this.obj)
    }
  }
}
</script>

<style lang="stylus" scoped>
.pl_info
  font-size 14px
  color #444
  line-height 1.8
.xt-mark
  position inline-block
  margin-left 15px
  display inline-block
  background #2485FF
  padding-top 1.5px
  border-radius 12px
  text-align center
  font-size 12px
  color #fff
  width 40px
  height 20px
</style>

