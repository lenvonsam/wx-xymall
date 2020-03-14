<template lang="pug">
div
  nav-bar(title="合同修改", isBack)
  .flex.text-center.nav.bg-white.relative(style="height: 90rpx")
    .tab-line
    .cu-item.flex-sub(v-for="(item,index) in billTab", :class="item.status === tabName?'text-blue cur':''", :key="index", @click="selectTabs(item, index)")
      span {{item.title}}
  .padding-left-sm.padding-right-sm.ft-12(style="background: #FEF7E7; line-height: 70rpx; height: 70rpx", v-if="tabName == '1'")
    span.text-orange 友情提示：仅展示允许修改的合同，修改后出库进行结算
  template(v-if="isload")
    time-line(type="mallist")  
  template(v-else) 
    template(v-if="listData.length > 0")
      iron-scroll(@scrolltolower="loadMore", :height="scrollHeight", heightUnit="rpx", :refresh="true", @onRefresh="onRefresh", :loadFinish="loadFinish")
        //- scroll-view(scroll-y, @scrolltolower="loadMore", :style="{height: screenHeight - 140 +'px'}")  
        .padding-top-sm
          .padding-sm.bg-white.margin-bottom-sm(@click="jumpModifyDetail(item)", v-for="(item, itemIdx) in listData", :key="itemIdx")
            .flex.align-center
              .ft-16.padding-right-sm {{item.tstc_no}}
              img.ding-icon(src="/static/images/ding.png", v-if="item.contract_type == 12")
            .flex.justify-between.text-gray.align-center.margin-top-sm
              .col.text-content
                p {{item.client_name}}
                p 共{{item.amount}}支，{{item.weight}}吨
                p 吊费：¥{{item.lift_price}}
              .card-right
                .ft-16.padding-bottom-xs.text-bold.text-black ￥{{item.price}}
                .text-red.text-right(v-if="item.status === 18") 修改中
                .bill-btn.round(v-else) {{tabName == '1' ? '申请修改' : '去确认'}}
    .text-center.c-gray.pt-100(v-else)
      empty-image(url="bill_empty.png", className="img-empty")
      div 您暂时没有相关合同           
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      swiperCount: 0,
      billTab: [
        { title: '可修改合同', status: '1', data: [], isActive: true },
        { title: '修改中', status: '2', data: [], isActive: false }
      ],
      isTabDisabled: false,
      tabName: '1',
      currentPage: 0,
      listData: [],
      isload: false,
      startDate: '',
      endDate: '',
      billNo: '',
      totalPrice: 0,
      totalWeight: 0,
      totalCount: 0,
      allChoosed: false,
      scrollHeight: 0,
      loadFinish: 0
    }
  },
  computed: {
    ...mapState({
      tempObject: state => state.tempObject
    })
  },
  onUnload () {
    this.swiperCount = 0
    this.tabName = '1'
    this.currentPage = 0
    this.listData = []
    this.finished = true
    this.isload = false
    this.startDate = ''
    this.endDate = ''
    this.billNo = ''
    this.totalPrice = 0
    this.totalWeight = 0
    this.totalCount = 0
    this.allChoosed = false
    this.scrollHeight = 0
    this.loadFinish = false
  },
  onShow () {
    this.listData = []
    this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - 160
    if (this.$root.$mp.query.tabName) this.tabName = this.$root.$mpd.query.tabName
    this.loadData()
  },
  methods: {
    onRefresh (done) {
      this.currentPage = 0
      this.loadData(done)
    },
    selectTabs (item) {
      this.tabName = item.status
      this.currentPage = 0
      this.listData = []
      this.isTabDisabled = true
      if (this.tabName === '1') {
        this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - 160
      } else {
        this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - 90
      }
      this.loadData()
    },
    rowBillItem (obj, type) {
    },
    batchPay () {
    },
    loadData (done) {
      this.loadFinish = 1
      if (this.currentPage === 0) {
        this.isload = true
      } else {
        this.isload = false
      }
      const body = {
        user_id: this.currentUser.user_id,
        status_flag: this.tabName,
        current_page: this.currentPage,
        page_size: this.pageSize
      }
      console.log(body)
      const me = this
      this.ironRequest('contract_edit_app.shtml', body, 'post').then(resp => {
        if (resp && resp.returncode === '0') {
          let arr = resp.notices
          if (arr.length === 0 && me.currentPage === 0) {
            me.listData = []
            me.isload = false
          } else if (arr.length > 0 && me.currentPage === 0) {
            arr.map(itm => {
              itm.choosed = false
            })
            me.listData = arr
            me.isload = false
          } else if (arr.length > 0 && me.currentPage > 0) {
            arr.map(item => {
              item.choosed = false
              me.listData.push(item)
            })
          } else {
            if (me.listData.length >= 10) me.loadFinish = 2
            me.currentPage--
          }
        } else {
          me.msgShow(resp === undefined ? '网络异常' : resp.errormsg)
          me.isload = false
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
    jumpModifyDetail (item) {
      if (this.tabName === '1') this.statisticRequest({ event: 'click_app_editorder_apply' })
      this.jump(`/pages/modifyDetail/main?id=${item.discussid}&type=${this.tabName}`)
    }
  }
}
</script>
<style lang="stylus" scoped>
.bill-btn, .bill-red-btn
  padding 5px 10px
  text-align center
  color #0081ff
.bill-btn
  border 1px #0081ff solid
.bill-red-btn
  border 1px #e54d42 solid
  color #e54d42
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
</style>