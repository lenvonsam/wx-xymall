<template lang="pug">
div
  nav-bar(:title="pageTitle", isBack)
  .padding(v-if="pageType === 'noticeDetail'")
    .bg-white.padding(style="box-shadow: 0 0 5rpx rgba(7, 1, 2, 0.04)")
      div {{obj.title}}
      .margin-top
        div(v-html="obj.content", style="color: rgba(77, 77, 77, 1)")
  .padding.bg-white(v-else-if="pageType === 'registProtocol'")
    div(v-for="(pl,idx) in protocol")
      .ft-16.text-bold.padding-tb(v-if="pl.title") {{pl.title}}
      div(v-if="pl.content", v-html="pl.content", :class="{'pl_info': idx > 0}")

</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      pageTitle: '',
      pageType: 'noticeDetail',
      obj: {}
    }
  },
  computed: {
    ...mapState({
      protocol: state => state.user.protocol
    })
  },
  onShow () {
    this.pageTitle = ''
    this.pageType = 'noticeDetail'
    const query = this.$root.$mp.query
    if (query.title) this.pageTitle = query.title
    if (query.type) this.pageType = query.type
    if (this.pageType !== 'registProtocol') this.getRemoteInfo()
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
        const data = await this.ironRequest(url, params, this.apiList.xy[this.pageType].method, this)
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
</style>

