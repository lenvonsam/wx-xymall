<template lang="pug">
div
  nav-bar(title="应收款预警", isBack)
  .head.bg-white(:style="{height: '115rpx'}")
    .serach.flex.align-center.padding-sm
      .col.search-input.text-gray
        .flex.align-center
          .cuIcon-search
          input.full-width.padding-left-sm(v-model="searchVal", type="text", placeholder="公司名称/部门/业务员", @confirm="searchOrder")
          .close-icon(@click="searchVal = ''", v-if="searchVal")
            .cuIcon-roundclosefill.ft-18
      .search-btn.text-blue(@click="searchOrder") 搜索
  template(v-if="isload")
    time-line(type="mallist")
  template(v-else)
    template(v-if="listData.length > 0")
      div(:style="{height: scrollHeight+'rpx'}")
        iron-scroll(@scrolltolower="loadMore", heightUnit="rpx", :height="scrollHeight", :refresh="true", @onRefresh="onRefresh", :loadFinish="loadFinish")          
          .bill-list(v-for="(item, itemIdx) in listData", :key="itemIdx")
            .bg-white.box
              .padding-sm
                .flex.justify-between.padding-bottom-sm
                  .col
                    .flex.align-center
                      .ft-16.padding-right-sm {{item.datas_balcorpname}}
                  .text-black ￥{{item.zh}}
                .text-gray
                  .padding-bottom-xs 
                    span 智恒达：￥{{item.aa}}
                    span.padding-left-xs 岳阳通：￥{{item.bb}}
                  .padding-bottom-xs
                    span {{item.dept_name}}
                    span.padding-left-xs {{item. employee_name}}
                .solid-top.text-black.ft-15.margin-top-xs.padding-top-sm.row.justify-between(v-if="item.bankroll_date")
                  .col
                    span 最近应收：
                    span.padding-left-xs.text-red {{item.bankroll_date}}  
                  span {{item.ts}}天
    .text-center.c-gray.pt-100(v-else)
      empty-image(url="bill_empty.png", className="img-empty")
 
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      currentPage: 0,
      listData: [],
      isload: false,
      searchVal: '',
      isTabDisabled: false,
      scrollHeight: '0px',
      loadFinish: 0,
      pageSize: 10
    }
  },
  computed: {
    ...mapState({
      tempObject: state => state.tempObject
    })
  },
  onShow () {
    this.onRefresh()
    this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - 115
  },
  methods: {
    onRefresh (done) {
      this.currentPage = 0
      this.showLoading()
      this.refresher(done)
    },
    searchOrder () {
      this.listData = []
      this.isTabDisabled = true
      this.isload = true
      this.refresher()
    },
    refresher (done) {
      this.loadFinish = 1
      const me = this
      const gatherinsgBeforeWarning = this.apiList.xy.gatherinsgBeforeWarning
      const params = {
        current_page: this.currentPage,
        page_size: this.pageSize
      }
      if (this.searchVal) {
        params.search = this.searchVal
      }
      this.ironRequest(gatherinsgBeforeWarning.url, params, gatherinsgBeforeWarning.method).then(resp => {
        if (resp.returncode === '0') {
          let arr = resp.data
          if (arr.length === 0 && me.currentPage === 0) {
            me.listData = []
            me.isload = false
          } else if (arr.length > 0 && me.currentPage === 0) {
            me.listData = arr
            me.isload = false
          } else if (arr.length > 0 && me.currentPage > 0) {
            me.listData.push(...arr)
            me.isload = false
          } else {
            me.isload = false
            me.currentPage--
            if (me.listData.length >= 10) me.loadFinish = 2
          }
        }
        me.isTabDisabled = false
        if (me.listData.length < 10) me.loadFinish = 2
        me.hideLoading()
        if (done) done()
      })
    },
    loadMore () {
      const me = this
      this.throttle(function () {
        me.currentPage++
        me.refresher()
      }, 300)
    }
  }
}
</script>
<style lang="stylus" scoped>
.head
  // position fixed
  // left 0
  // right 0
  // z-index 99
  // height 98px
// .bill-box
.search-input
  background #F6F6F6
  padding 5px 10px
  border-radius 35px
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
.dingjin-icon
  width 35px
  height 20px
.cuIcon-box
  width 160px
  margin 0 auto
.cuIcon-item
  border 1px #c9c9c9 solid
  color #c9c9c9
  font-weight bold
  font-size 18px
  text-align center
  width 45px
  height 35px
  line-height 35px
  border-radius 5px
.input-box
  border-radius 5px
  width 100%
  height 40px
  input
    height 40px
    width 100%
</style>