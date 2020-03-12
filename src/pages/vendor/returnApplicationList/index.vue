<template lang="pug">
div
  nav-bar(title="退货申请", isBack)
  .bg-white(:style="{height: '205rpx'}")
    .serach.flex.align-center.padding-sm
      .col.search-input.text-gray
        .flex.align-center
          .cuIcon-search
          input.full-width.padding-left-sm(v-model="searchVal", type="text", placeholder="提单号/客户/业务员/业务部门")
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
                  .ft-16.padding-right-sm.text-blue 
                    span {{item.lad_no}}
                    copy-btn(:copyUrl="item.lad_no")
                div(:class="item.status === 4 ? 'text-red' : 'text-black'") {{statusObj[item.status]}}
              .text-black.padding-bottom-xs 
                span {{item.name}}
              .text-gray
                .padding-bottom-xs 
                  span 共{{item.amount}}支，{{item.weight}}吨
                .padding-bottom-xs
                  span 收货时间：
                  span.padding-left-xs {{item.receive_time}}
                div(v-if="tabName === '-1'")
                  span 申请时间：
                  span.padding-left-xs {{item.applyer_date}}  
              .solid-top.text-black.ft-15.margin-top-xs.padding-top-sm.row.justify-end
                template(v-if="item.status === 4")
                  .bill-red-btn.round.margin-left-sm(@click="application(item)") 取消申请
                  .bill-btn.round.margin-left-sm(@click="application(item)") 查看明细
                template(v-else)  
                  .bill-btn.round.margin-left-sm(@click="application(item, '申请')") 申请
    .text-center.c-gray.pt-100(v-else)
      empty-image(url="bill_empty.png", className="img-empty")      
</template>
<script>
import { mapState } from 'vuex'
import copyBtn from '@/components/CopyBtn.vue'
export default {
  data () {
    return {
      billTab: [
        { title: '待申请', status: '0,2', data: [], isActive: true },
        { title: '申请历史', status: '-1', data: [], isActive: false }
      ],
      isTabDisabled: false,
      tabName: '0,2',
      currentPage: 0,
      listData: [],
      isload: false,
      scrollHeight: 0,
      loadFinish: 0,
      searchVal: '',
      statusObj: {
        '0': '待申请',
        '5': '待审核',
        '3': '财务驳回',
        '4': '待确认',
        '7': '客户取消'
      }
    }
  },
  computed: {
    ...mapState({
      tempObject: state => state.tempObject
    })
  },
  components: {
    copyBtn
  },
  onUnload () {
    this.tabName = '1'
    this.currentPage = 0
    this.listData = []
    this.finished = true
    this.isload = false
    this.scrollHeight = 0
    this.loadFinish = false
  },
  onShow () {
    this.listData = []
    this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - 205
    if (this.$root.$mp.query.tabName) this.tabName = this.$root.$mp.query.tabName
    this.onRefresh()
  },
  methods: {
    jumpDetail (item) {
      this.jump(`/pages/vendor/quotationDetail/main?id=${item.id}`)
    },
    onRefresh (done) {
      this.currentPage = 0
      this.loadData(done)
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
      const returnGoodsList = this.apiList.xy.returnGoodsList
      const url = returnGoodsList.url + '?status=' + this.tabName + '&search=' + this.searchVal + '&current_page=' + this.currentPage + '&page_size=' + this.pageSize
      const me = this
      this.ironRequest(url, '', returnGoodsList.method).then(resp => {
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
    },

    async application (item, flag) {
      try {
        if (flag === '申请') {
          this.jump(`/pages/vendor/returnApplication/main?subsNo=${item.lad_no}&status=${item.status}`)
          return false
        }
        const returnGoods = this.apiList.xy.returnGoods
        const params = {}
        const data = await this.ironRequest(returnGoods.url, params, returnGoods.method)
        console.log(data)
      } catch (err) {
        console.log(err)
      }
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
.bill-btn, .bill-red-btn,.bill-gray-btn
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
.search-input
  background #F6F6F6
  padding 5px 10px
  border-radius 35px
.search-btn
  padding 10px  
</style>