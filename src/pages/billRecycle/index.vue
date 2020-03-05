<template lang="pug">
div
  nav-bar(title="合同回收站", isBack)
  .head.bg-white(:style="{height: '110rpx'}")
    .serach.flex.align-center.padding-sm
      .col.search-input.text-gray
        .flex.align-center
          .cuIcon-search
          input.full-width.padding-left-sm(v-model="billNo", type="text", placeholder="合同号", confirm-type="search", @confirm="searchOrder")
          .close-icon(@click="billNo = ''", v-if="billNo")
            .cuIcon-close
      .search-btn.text-blue.padding-left-sm(@click="searchOrder") 搜索
  .margin-top-sm
    template(v-if="isload")
      time-line(type="mallist")
    template(v-else)
      template(v-if="listData.length > 0")
        scroll-view.scroll-view(scroll-y, @scrolltolower="loadMore", :style="{height: scrollHeight}")
          //- .scroll-view.bg-white(scroll-y, :style="{top:customBar + 40 + 'px'}")
          .bg-white.padding-sm.margin-bottom-sm(v-for="(item, itemIdx) in listData", :key="itemIdx")
            .flex.justify-between.padding-bottom-sm
              .col
                .flex.align-center
                  .ft-16.padding-right-sm {{item.no}}
                  img.ding-icon(src="/static/images/ding.png", v-if="item.is_dx")
              .text-red {{item.status}}
            .text-gray
              .padding-bottom-xs {{item.supply_name}}
              .flex.justify-between.padding-bottom-xs 
                span 共{{item.total_count}}支，{{item.total_weight}}吨
                .ft-16.text-black ￥{{item.fact_price}}
              .flex.justify-between
                .col 
                  .padding-bottom-xs 吊费：¥{{item.lift_charge}}
                  .padding-bottom-xs 合同生成日期：{{item.create_time}}
                div
                  .bill-btn.round(@click="jumpDetail(item.no)") 恢复
          .padding.text-gray.ft-13.text-center(v-if="loading") 努力加载中...
          .padding.text-gray.ft-13.text-center(v-if="finished") 加载完成
      .text-center.c-gray.pt-100(v-else)
        empty-image(url="bill_empty.png", className="img-empty")
        .empty-content 您暂时没有相关合同
</template>
<script>
import timeLine from '@/components/TimeLine.vue'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      listData: [],
      finished: false,
      currentPage: 0,
      isload: false,
      billNo: '',
      scrollHeight: 0,
      loading: false,
      disabled: false
    }
  },
  computed: {
    ...mapState({
      tempObject: state => state.tempObject
    })
  },
  components: {
    timeLine
  },
  onUnload () {
    this.listData = []
    this.finished = false
    this.currentPage = 0
    this.isload = false
    this.billNo = ''
    this.scrollHeight = 0
    this.loading = false
    this.disabled = false
  },
  onShow () {
    this.disabled = false
    this.loadData()
    this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - 130 + 'rpx'
  },
  // beforeMount () {
  //   this.loadData()
  // },
  methods: {
    jumpDetail (no) {
      if (this.disabled) return false
      this.disabled = true
      this.jump('/pages/billRecycleDetail/main?no=' + no)
    },
    searchOrder () {
      this.currentPage = 0
      this.loadData()
    },
    loadMore () {
      this.currentPage++
      this.loadData()
    },
    loadData () {
      if (this.currentPage === 0) {
        this.isload = true
      } else {
        this.isload = false
      }
      this.loading = true
      let reqUrl = 'recycleList.shtml?user_id=' + this.currentUser.user_id + '&tstc_no=' + this.billNo + '&current_page=' + this.currentPage + '&page_size=' + this.pageSize
      this.ironRequest(reqUrl, {}, 'get').then(resp => {
        if (resp && resp.returncode === '0') {
          let arr = resp.orders
          arr.map(item => {
            item.fact_price = this.$toFixed(item.fact_price, 2)
          })
          if (arr.length === 0 && this.currentPage === 0) {
            this.listData = []
            this.finished = true
            this.isload = false
          } else if (arr.length > 0 && this.currentPage === 0) {
            this.listData = arr
            this.isload = false
            if (arr.length > 8) this.finished = false
          } else if (arr.length > 0 && this.currentPage > 0) {
            arr.map(itm => {
              this.listData.push(itm)
            })
            this.finished = false
          } else {
            this.finished = true
            this.currentPage--
          }
        } else {
          this.showMsg(resp === undefined ? '网络异常' : resp.errormsg)
          this.isload = false
        }
        this.loading = false
      }).catch(err => {
        this.showMsg(err || '网络异常')
        this.loading = false
      })
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
  // height 64px
// .bill-box
.search-input
  background #F6F6F6
  padding 5px 10px
  border-radius 35px
.bill-btn, .bill-red-btn
  padding 5px 15px
  text-align center
  color #0081ff
.bill-btn
  border 1px #0081ff solid
.bill-red-btn
  border 1px #e54d42 solid
  color #e54d42
.bill-content
  height 100%
  margin-top 108px
</style>