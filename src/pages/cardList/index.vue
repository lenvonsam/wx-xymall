<template lang="pug">
div
  nav-bar(:title="pageTitle", :isBack="true")
  template(v-if="isLoad")
    iron-scroll(@scrolltolower="loadMore", :height="screenHeight - customBar", :loadFinish="loadFinish")
      .padding(v-if="pageType === 'notice'")
        .bg-white.margin-bottom(v-for="(data,idx) in listData", :key="idx", style="box-shadow: 0px 0px 2.5px rgba(7,1,2,0.04)", @click="jump('/pages/h5/main?title=公告详情&type=noticeDetail&id=' + data.id)")
          .padding.border-bottom-line
            div {{data.title}}
            .margin-top.text-cut(style="color: #4d4d4d") {{data.summary}}
            .text-right.ft-12.text-gray.margin-top-sm {{data.audittime}}
          .padding.row.text-gray
            .col 查看详情
            .col.text-right
              icon.adjust.cuIcon-right
      .bg-white(v-else-if="pageType === 'noticeList'")
        .row.padding-lr(v-for="(data, idx) in listData", :key="idx", @click="jumpDetail(data)")
          .flex-60.relative
            img(:src="imgProxy + (data.type == 2 ? 'wl_icon.png' : 'xx_icon.png')", style="height: 100rpx; width: 100rpx", v-if="imgProxy")
            .red-dot(style="top: 0px; right: 20rpx", v-if="data.have_read === '0'")
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
              .ft-12.margin-top-sm.text-gray {{data.time}}
            .flex-100.ft-16.text-gray.text-right
              span ￥{{data.price}}
      //- .padding.bg-gray.text-center(v-if="listData.length > 10") 加载中...
  time-line(v-else, type="mainres")
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      isLoad: false,
      pageTitle: '',
      // notice 型云公告 noticeList 通知列表
      pageType: 'notice',
      currentPage: 0,
      listData: [],
      loadFinish: 0,
      listMapKey: {
        'notice': 'notices',
        'noticeList': 'notices',
        'queryWithdrawList': 'withdraw'
      }
    }
  },
  // onReachBottom () {
  //   console.log('reach bottom')
  //   const me = this
  //   this.throttle(function () {
  //     me.currentPage++
  //     me.getListData()
  //   }, 300)
  // },
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
  methods: {
    ...mapActions([
      'configVal'
    ]),
    loadMore () {
      const me = this
      this.throttle(function () {
        me.currentPage++
        me.getListData()
      }, 300)
    },
    jumpDetail (obj) {
      if (Number(obj.have_read) === 0) {
        this.ironRequest(this.apiList.xy.readNotice.url, { id: obj.id }, this.apiList.xy.readNotice.method)
      }
      if (obj.type === 2) {
        const tdno = obj.content.substring(obj.content.indexOf('TD'), obj.content.indexOf('需要'))
        this.jump('/pages/ladbillConfirmDetail/main?no=' + tdno)
      } else {
        this.configVal({ key: 'tempObject', val: obj })
        this.jump('/pages/h5/main?title=消息详情&type=msgDetail')
      }
    },
    async getListData () {
      try {
        if (this.currentPage === 0) this.isLoad = false
        this.loadFinish = 1
        let url = this.apiList.xy[this.pageType].url
        let params = {}
        if (this.pageType === 'notice') {
          url += '?type=1&current_page=' + this.currentPage + '&page_size=' + this.pageSize
        }
        if (this.pageType === 'noticeList') {
          url += '?have_read=-1&user_id=' + this.currentUser.user_id + '&current_page=' + this.currentPage + '&page_size=15'
        }
        const data = await this.ironRequest(url, params, this.apiList.xy[this.pageType].method)
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
          if (this.currentPage > 0) this.loadFinish = 2
        }
        if (this.listData.length < 10) this.loadFinish = 0
      } catch (e) {
        this.showMsg(e)
        this.loadFinish = 0
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

