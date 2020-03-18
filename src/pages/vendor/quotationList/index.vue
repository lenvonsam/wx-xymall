<template lang="pug">
div
  nav-bar(title="报价单管理", isBack)
  .bg-white(:style="{height: '205rpx'}")
    .serach.flex.align-center.padding-sm
      .col.search-input.text-gray
        .flex.align-center
          .cuIcon-search
          input.full-width.padding-left-sm(v-model="searchVal", type="text", placeholder="公司名称/部门/业务员")
          .close-icon(@click="searchVal = ''", v-if="searchVal")
            .cuIcon-roundclosefill.ft-18
      .search-btn.text-blue(@click="onRefresh") 搜索
    .flex.text-center.nav.bg-white.relative(style="height: 90rpx")
      .tab-line
      .cu-item.flex-sub(v-for="(item,index) in billTab", :class="item.status === tabName?'text-blue cur':''", :key="index", @click="selectTabs(item, index)")
        span {{item.title}}
  template(v-if="isload")
    time-line(type="mallist")  
  template(v-else) 
    template(v-if="listData.length > 0")
      iron-scroll(@scrolltolower="loadMore", :height="scrollHeight", heightUnit="rpx", :refresh="true", @onRefresh="onRefresh", :loadFinish="loadFinish")
        .bill-list(v-for="(item, itemIdx) in listData", :key="itemIdx")
          .bg-white.box
            .padding-sm
              .flex.justify-between.padding-bottom-sm
                .col
                  .flex.align-center
                    .ft-16.padding-right-sm {{item.cust_name}}
                .text-black ￥{{item.money}}
              .text-gray
                .flex.justify-between.padding-bottom-xs 
                  span 共{{item.amount}}支，{{item.weight}}吨
                  span {{item.status}}
                .flex.justify-between.padding-bottom-xs 
                  span 报价时间：{{item. create_time}}
              .solid-top.text-black.ft-15.margin-top-xs.padding-top-sm.row.justify-between
                .col
                  div(v-if="tabName === '1,2'")
                    span 失效：
                    span.padding-left-xs.text-red {{item.timeDown}}  
                .row
                  .bill-btn.round.margin-left-sm(@click="copyQuotation(item)", v-if="tabName === '3,4'") 复制到购物车
                  .bill-btn.round.margin-left-sm(@click="jumpDetail(item)") 查看详情
    .text-center.c-gray.pt-100(v-else)
      empty-image(url="bill_empty.png", className="img-empty")
      .text-gray 您暂时没有报价单        
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      billTab: [
        { title: '当前报价单', status: '1,2', data: [], isActive: true },
        { title: '历史报价单', status: '3,4', data: [], isActive: false }
      ],
      isTabDisabled: false,
      tabName: '1,2',
      currentPage: 0,
      listData: [],
      isload: false,
      scrollHeight: 0,
      loadFinish: 0,
      timeInterval: '',
      serverTime: '',
      searchVal: '',
      pageSize: 10
    }
  },
  computed: {
    ...mapState({
      tempObject: state => state.tempObject
    })
  },
  onUnload () {
    this.tabName = '1,2'
    this.currentPage = 0
    this.listData = []
    this.finished = true
    this.isload = false
    this.scrollHeight = 0
    this.loadFinish = 0
    clearInterval(this.timeInterval)
  },
  onShow () {
    this.listData = []
    this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - 205
    if (this.$root.$mp.query.tabName) this.tabName = this.$root.$mp.query.tabName
    this.onRefresh()
  },
  mounted () {
    this.$nextTick(() => {
      const me = this
      this.timeInterval = setInterval(() => {
        me.countTime()
        me.serverTime += 1000
      }, 1000)
    })
  },
  methods: {
    jumpDetail (item) {
      this.jump(`/pages/vendor/quotationDetail/main?id=${item.id}`)
    },
    async copyQuotation (item) {
      try {
        const copyQuotation = this.apiList.xy.copyQuotation
        const params = {
          qut_id: item.id,
          user_id: this.currentUser.user_id
        }
        const data = await this.ironRequest(copyQuotation.url, params, copyQuotation.method)
        if (data.returncode === '0') {
          this.showMsg(data.errormsg)
        }
      } catch (err) {
        this.showMsg(err || '网络错误')
      }
    },
    onRefresh (done) {
      this.currentPage = 0
      this.loadData(done)
    },
    countTime () {
      if (this.tabName === '1,2') {
        const arr = this.listData
        arr.map(item => {
          const nowTime = this.serverTime
          const endTimeFormat = item.end_time.replace(/-/g, '/')
          const endTime = new Date(endTimeFormat).getTime()
          const leftTime = endTime - nowTime
          let h = 0
          let m = 0
          let s = 0
          if (leftTime >= 0) {
            h = Math.floor(leftTime / 1000 / 60 / 60 % 24)
            m = Math.floor(leftTime / 1000 / 60 % 60)
            s = Math.floor(leftTime / 1000 % 60)
          }
          // if (h + m + s === 0) {
          //   this.onRefresh()
          // } else {
          //   h = h < 10 ? '0' + h : h
          //   m = m < 10 ? '0' + m : m
          //   s = s < 10 ? '0' + s : s
          //   item.timeDown = `${h}:${m}:${s}`
          // }
          h = h < 10 ? '0' + h : h
          m = m < 10 ? '0' + m : m
          s = s < 10 ? '0' + s : s
          item.timeDown = `${h}:${m}:${s}`
        })
        this.$forceUpdate()
      }
    },
    selectTabs (item) {
      this.tabName = item.status
      this.listData = []
      this.isTabDisabled = true
      this.onRefresh()
    },
    loadData (done) {
      this.loadFinish = 1
      if (this.currentPage === 0) {
        this.isload = true
      } else {
        this.isload = false
      }
      const quotationList = this.apiList.xy.quotationList
      // const url = quotationList.url + '?status=' + this.tabName + '&search=' + this.searchVal + '&user_id=' + this.currentUser.user_id + '&current_page=' + this.currentPage + '&page_size=' + this.pageSize
      const me = this
      const params = {
        status: this.tabName,
        search: this.searchVal,
        user_id: this.currentUser.user_id,
        current_page: this.currentPage,
        page_size: this.pageSize
      }
      this.ironRequest(quotationList.url, params, quotationList.method).then(resp => {
        this.serverTime = resp.server_time
        if (resp && resp.returncode === '0') {
          let arr = resp.list
          if (arr.length === 0 && me.currentPage === 0) {
            me.listData = []
            me.isload = false
          } else if (arr.length > 0 && me.currentPage === 0) {
            me.listData = arr
            me.isload = false
          } else if (arr.length > 0 && me.currentPage > 0) {
            arr.map(item => {
              me.listData.push(item)
            })
          } else {
            if (me.listData.length >= 10) me.loadFinish = 2
            me.currentPage--
          }
        }
        this.isTabDisabled = false
        if (this.listData.length < 10) this.loadFinish = 0
      })
      if (done) done()
    },
    loadMore () {
      const me = this
      this.throttle(function () {
        me.currentPage++
        this.isTabDisabled = true
        me.loadData()
      }, 300)
    }
  }
}
</script>
<style lang="stylus" scoped>
.bill-list
  margin-bottom 10px
  margin-top 10px
  padding-left 10px
  padding-right 10px
  .box
    border-radius 5px
    overflow hidden
    .solid-top
      border-top 0.5px solid #eee
.bill-btn, .bill-red-btn, .bill-gray-btn
  padding 2px 8px
  text-align center
  font-size 13px
  color #0081ff
.bill-btn
  border 1px #0081ff solid
.bill-red-btn
  border 1px #e54d42 solid
  color #e54d42
.bill-gray-btn
  border 1px #DCDCDC solid
  color #888888
.bill-content
  height 100%
.filter-btn
  padding 10px 0 10px 10px
.search-btn
  padding 10px
.nav
  .tab-line
    display block
    content ''
    height 25px
    width 2px
    position absolute
    left 50%
    margin-left -1px
    top 10px
    background #e6e6e6
.nav .cu-item.cur
  border-bottom none
  position relative
  &:after
    display block
    content ''
    width 26px
    height 2px
    background #0081ff
    position absolute
    bottom 0
    left 50%
    margin-left -13px
    z-index 99
.search-input
  background #F6F6F6
  padding 5px 10px
  border-radius 35px
.search-btn
  padding 10px
</style>