<template lang="pug">
div
  nav-bar(:title="pageTitle", :isBack="true")
  template(v-if="isLoad")
    .padding(v-if="pageType === 'notice'")
      .bg-white.margin-bottom(v-for="(data,idx) in listData", :key="idx", style="box-shadow: 0px 0px 2.5px rgba(7,1,2,0.04)", @click="jump('/pages/h5/main?title=公告详情&type=noticeDetail&id=' + data.id)")
        .padding.border-bottom-line
          div {{data.title}}
          .margin-top(style="color: #4d4d4d") 12333344555
          .text-right.ft-12.text-gray.mt-5 2019-03-39 10:00
        .padding.row.text-gray
          .col 查看详情
          .col.text-right
            icon.adjust.cuIcon-right
    .bg-white(v-else-if="pageType === 'noticeList'")
      .row.padding-lr(v-for="(data, idx) in listData", :key="idx", @click="jumpDetail(data)")
        .flex-60
          img(:src="imgProxy + (data.type == 2 ? 'wl_icon.png' : 'xx_icon.png')", style="height: 100rpx; width: 100rpx", v-if="imgProxy")
        .col.row.border-bottom-line(style="height: 140rpx")
          .full-width
            .row
              .col {{data.title}}
              .col.text-right
                time-text(:content="data.time", v-if="data.time")
            .mt-5.ft-12.text-gray.notice-line
              div(v-html="data.content")
    .bg-white(v-else-if="pageType === 'queryWithdrawList'")
      .padding.border-bottom-line(v-for="(data, idx) in listData", :key="idx")
        .row
          .col
            .ft-16 {{data.status}}
            .ft-12.margin-top-sm.text-gray.text-right {{data.time}}
          .flex-100.ft-16.text-gray ￥{{data.price}}
  time-line(v-else, type="mainres")
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      isLoad: false,
      pageTitle: '',
      // notice 型云公告 noticeList 通知列表
      pageType: 'notice',
      currentPage: 0,
      listData: [],
      listMapKey: {
        'notice': 'notices',
        'noticeList': 'notices',
        'queryWithdrawList': 'withdraw'
      }
    }
  },
  onReachBottom () {
    console.log('reach bottom')
    const me = this
    this.throttle(function () {
      me.currentPage++
      me.getListData()
    }, 300)
  },
  onShow () {
    const query = this.$root.$mp.query
    this.pageTitle = ''
    this.pageType = 'notice'
    console.log('query:>>', query)
    if (query.title) this.pageTitle = query.title
    if (query.type) this.pageType = query.type
    this.currentPage = 0
    this.listData = []
    this.getListData()
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser
    })
  },
  methods: {
    ...mapActions([
      'configVal'
    ]),
    jumpDetail (obj) {
      if (obj.type === 2) {
        const tdno = obj.content.substring(obj.content.indexOf('TD'), obj.content.indexOf('需要'))
        this.jump({ path: '/ladbill/confirm/detail?no=' + tdno })
      } else {
        this.configVal({ key: 'tempObject', val: obj })
        this.jump('/pages/h5/main?title=消息详情&type=msgDetail')
      }
    },
    async getListData () {
      try {
        if (this.currentPage === 0) this.isLoad = false
        let url = this.apiList.xy[this.pageType].url
        let params = {}
        if (this.pageType === 'notice') {
          url += '?type=1&current_page=' + this.currentPage + '&page_size=' + this.pageSize
        }
        if (this.pageType === 'noticeList') {
          url += '?have_read=-1&user_id=' + this.currentUser.user_id + '&current_page=' + this.currentPage + '&page_size=' + this.pageSize
        }
        const data = await this.ironRequest(url, params, this.apiList.xy[this.pageType].method, this)
        console.log('get data', data)
        this.isLoad = true
        const arr = data[this.listMapKey[this.pageType]]
        if (this.currentPage === 0 && arr.length > 0) {
          this.listData = arr
        } else if (this.currentPage > 0 && arr.length > 0) {
          arr.map(itm => {
            this.listData.push(itm)
          })
        } else {
          this.currentPage--
          if (this.currentPage < 0) this.currentPage = 0
        }
      } catch (e) {
        this.showMsg(e)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.notice-line
  position relative
  height 16px
  overflow hidden
</style>

