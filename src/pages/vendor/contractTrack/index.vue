<template lang="pug">
div
  nav-bar(title="合同跟踪", isBack)
  .head.bg-white(:style="{height: '203rpx'}")
    .serach.flex.align-center.padding-sm
      .col.search-input.text-gray
        .flex.align-center
          .cuIcon-search
          input.full-width.padding-left-sm(v-model="searchVal", type="text", placeholder="合同号/公司名称/状态")
      .search-btn.text-blue(@click="searchOrder") 搜索
      .filter-btn.row(@click="openFilter")
        span 筛选
        .cuIcon-filter
        
    scroll-view.nav(scroll-x)
      .flex.text-center
        .cu-item.flex-sub(v-for="(item,index) in billTab", :class="item.status === tabName?'text-blue cur':''", :key="index", @click="selectTabs(item, index)")
          span {{item.title}}
  swiper.bill-content(@change="swiperChange", :current="swiperCount", :style="{height: scrollHeight+'rpx'}")
    swiper-item(v-for="(tabItem, swiperIdx) in billTab.length", :key="swiperIdx")
      template(v-if="isload")
        time-line(type="mallist")
      template(v-else)
        template(v-if="billTab[swiperIdx].data.length > 0")
          div(:style="{height: scrollHeight+'rpx'}")
            iron-scroll(:swiperIdx="swiperIdx", @scrolltolower="loadMore", heightUnit="rpx", :height="scrollHeight", :refresh="true", @onRefresh="onRefresh", :loadFinish="loadFinish")          
              .bill-list(v-for="(item, itemIdx) in billTab[swiperIdx].data", :key="itemIdx", @click="jumpDetail(item)")
                .bg-white.box
                  .padding-sm
                    .flex.justify-between.padding-bottom-sm
                      .col
                        .flex.align-center
                          .ft-16.padding-right-sm {{item.tstc_no}}
                          img.ding-icon(src="/static/images/ding.png", v-if="item.contract_type === 12")
                          img.dingjin-icon(src="/static/images/dj_icon.png", v-if="item.pay_type === 2")
                      .text-red(v-if="item.status == 14") {{item.status_desc}}
                      .text-gray(v-else) {{item.status_desc}}
                    .text-gray
                      .flex.justify-between.padding-bottom-xs 
                        span {{item.cust_name}}
                        .ft-18.text-black ￥{{item.total_money}}
                      .flex.justify-between.padding-bottom-xs 
                        span 共{{item.total_left_qtt}}支，{{item.total_provided_qtt}}吨
                        span 吊费：¥{{item.lift_money}}
                      //- .flex.justify-between.padding-bottom-xs
                        .col 吊费：¥{{item.lift_charge}}
                  .solid-top.text-black.ft-15.padding-sm.row(v-if="item.status === 15 || item.status === 14")
                    .col
                      template(v-if="item.status === 14")
                        span 倒计时：
                        span.padding-left-xs.text-red {{item.timeDown}}
                      //- template(v-if="item.status === '待补款'")
                        span 待补款：
                        span.padding-left-xs.text-red ￥{{item.paid_price}}
                    .flex
                      .bill-gray-btn.round(v-if="item.cancel_button == 1", @click.stop="billCancel(item)") 取消合同
                      .bill-btn.round.margin-left-sm(v-if="item.edit_button", @click.stop="payBill(item)") 申请修改
                      .bill-btn.round.margin-left-sm(v-if="item.delivery_button", @click.stop="payBill(item)") 制作提单
                      .bill-btn.round.margin-left-sm(v-if="item.payButton", @click.stop="payBill(item)") 去补款
        .text-center.c-gray.pt-100(v-else)
          empty-image(url="bill_empty.png", className="img-empty")
          .empty-content 您暂时没有相关合同        
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      swiperCount: 0,
      billTab: [
        { title: '全部', status: '6', data: [], isActive: true },
        { title: '待付款', status: '1', data: [], isActive: false },
        { title: '已支付待确认', status: '12', data: [], isActive: false },
        { title: '待提货', status: '8', data: [], isActive: false },
        { title: '修改中', status: '10', data: [], isActive: false },
        { title: '已完成', status: '4', data: [], isActive: false }
      ],
      tabName: '6',
      currentPage: 0,
      listData: [],
      triggered: false,
      isload: false,
      startDate: '',
      endDate: '',
      isTabDisabled: false,
      btnDisable: false,
      scrollHeight: '0px',
      timeInterval: '',
      serverTime: '',
      loadFinish: 0,
      pageSize: 10,
      status: ''
    }
  },
  computed: {
    ...mapState({
      tempObject: state => state.tempObject
    })
  },
  onShow () {
    this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - 203
    // this.scrollHeight = this.screenHeight - this.customBar - 98
  },
  beforeMount () {
    this.onRefresh()
  },
  watch: {
    listData: {
      handler (newVal, oldVal) {
        if (this.tabName === '1') {
          let filterArr = newVal.filter(item => item.choosed === true)
          this.totalPrice = 0
          this.totalWeight = 0
          this.totalCount = filterArr.length
          filterArr.map(itm => {
            this.totalPrice += itm.fact_price
            this.totalWeight += itm.total_weight
          })
          this.totalPrice = this.$toFixed(Number(this.totalPrice), 2)
          this.totalWeight = this.$toFixed(Number(this.totalWeight), 3)
        }
      },
      deep: true
    },
    allChoosed (newVal, oldVal) {
      if (newVal) {
        this.listData.map(itm => {
          if (itm.status === 14) itm.choosed = true
        })
      } else {
        this.listData.map(itm => {
          itm.choosed = false
        })
      }
    }
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
  onUnload () {
    clearInterval(this.timeInterval)
  },
  methods: {
    openFilter () {
      this.jump('/pages/vendor/billFilter/main')
    },
    onRefresh (done) {
      this.currentPage = 0
      this.isload = true
      this.refresher(done)
    },
    searchOrder () {
      this.startDate = ''
      this.endDate = ''
      this.listData = []
      this.allChoosed = false
      this.isTabDisabled = true
      this.swiperCount = 0
      this.tabName = '0'
      this.billTab[0].data = []
      this.isload = true
      this.refresher()
    },
    swiperChange (e) {
      this.showLoading()
      const idx = e.mp.detail.current
      this.swiperCount = idx
      this.tabName = this.billTab[idx].status
      // this.billTab[idx].data = []
      this.isTabDisabled = true
      this.onRefresh()
    },
    refresher (done) {
      this.loadFinish = 1
      const me = this
      const sellerOrderList = this.apiList.xy.sellerOrderList
      const url = `${sellerOrderList.url}?current_page=${this.currentPage}&page_size=${this.pageSize}&tab_status=${this.tabName}&user_id=${this.currentUser.user_id}&search=${this.searchVal}&status=${this.status}`
      this.ironRequest(url, '', sellerOrderList.method).then(resp => {
        const idx = me.swiperCount
        this.serverTime = resp.server_time
        if (resp.returncode === '0') {
          let arr = resp.list
          if (arr.length === 0 && me.currentPage === 0) {
            me.listData = []
            me.billTab[idx].data = []
            me.isload = false
          } else if (arr.length > 0 && me.currentPage === 0) {
            me.billTab[idx].data = arr
            me.isload = false
          } else if (arr.length > 0 && me.currentPage > 0) {
            me.billTab[idx].data.push(...arr)
            me.isload = false
          } else {
            me.isload = false
            me.currentPage--
            if (me.billTab[idx].data.length >= 10) me.loadFinish = 2
          }
        }
        me.isTabDisabled = false
        if (me.billTab[idx].data.length < 10) me.loadFinish = 2
        me.hideLoading()
        if (done) done()
      })
    },
    selectTabs (item, idx) {
      this.tabName = item.status
      // this.scrollLeft = (index - 1) * 60
      this.swiperCount = idx
      // this.billTab.map((item, index) => {
      //   item.isActive = this.tabName === item.status
      // })
      // this.billTab[idx].data = []
      // this.currentPage = 0
      // this.startDate = ''
      // this.billNo = ''
      // this.endDate = ''
      // this.listData = []
      // this.allChoosed = false
      // this.isTabDisabled = true
      // this.pageHeight = item.status === '1' ? 150 : 100
      // this.refresher()
    },
    rowBillItem (obj, type) {
      if (type === 'cancel') {
        if (this.tabName === '1') this.listData = this.listData.filter(item => item.id !== obj.id)
        if (this.tabName === '0') {
          let idx = this.listData.findIndex(itm => itm.id === obj.id)
          this.listData[idx].status = '已取消'
        }
      } else if (type === 'toggle') {
        let idx = this.listData.findIndex(item => item.id === obj.id)
        this.listData[idx].choosed = !this.listData[idx].choosed
      }
    },
    batchPay () {
      let filterArr = this.listData.filter(itm => itm.choosed === true)
      if (filterArr.length > 0) {
        let orderNos = filterArr.map(itm => itm.no).join(',')
        this.jump({ path: '/mall/pay', query: { pageType: 'offlinePay', orderNo: orderNos, price: this.totalPrice } })
      }
    },
    countTime () {
      const idx = this.swiperCount
      const arr = this.billTab[idx].data
      arr.map(item => {
        if (item.status === 14) {
          const nowTime = this.serverTime
          const endTimeFormat = item.end_pay_time.replace(/-/g, '/')
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
          if (h + m + s === 0) {
            item.status = 13
          } else {
            h = h < 10 ? '0' + h : h
            m = m < 10 ? '0' + m : m
            s = s < 10 ? '0' + s : s
            item.timeDown = `${h}:${m}:${s}`
          }
        }
      })
      this.$forceUpdate()
    },
    loadData (done) {
      this.loadFinish = 1
      if (this.currentPage === 0) {
        this.isload = true
      } else {
        this.isload = false
      }
      let reqUrl = `orderList.shtml?user_id=${this.currentUser.user_id}&status=${this.tabName}&current_page=${this.currentPage}&page_size=${this.pageSize}&order_no=${this.billNo}&start_date=${this.startDate}&end_date=${this.endDate}`
      const me = this
      this.ironRequest(reqUrl, {}, 'get').then(resp => {
        const idx = me.swiperCount
        this.serverTime = resp.server_time
        if (resp && resp.returncode === '0') {
          let arr = resp.orders
          if (arr.length === 0 && me.currentPage === 0) {
            me.listData = []
            this.billTab[idx].data = []
            me.isload = false
          } else if (arr.length > 0 && me.currentPage === 0) {
            arr.map(itm => {
              itm.choosed = false
              me.listData.push(itm)
              this.billTab[idx].data.push(itm)
            })
            me.isload = false
          } else if (arr.length > 0 && me.currentPage > 0) {
            arr.map(item => {
              item.choosed = false
              me.listData.push(item)
              this.billTab[idx].data.push(item)
            })
            me.isload = false
          } else {
            me.isload = false
            me.currentPage--
            if (me.billTab[idx].data.length >= 10) me.loadFinish = 2
          }
        }
        me.isTabDisabled = false
        me.hideLoading()
        if (me.billTab[idx].data.length < 10) me.loadFinish = 0
        if (done) done()
      })
    },
    loadMore () {
      const me = this
      this.throttle(function () {
        me.currentPage++
        me.refresher()
      }, 300)
    },
    // jumpSearch () {
    //   this.statisticRequest({ event: 'click_app_myorder_search' })
    //   this.jump({ path: '/bill/search' })
    // },
    jumpDetail (item) {
      this.jump(`/pages/billDetail/main?id=${item.no}`)
    },
    billCancel (item) {
      if (this.tabName === '0') this.statisticRequest({ event: 'click_app_myorder_all_cancel' })
      if (this.tabName === '1') this.statisticRequest({ event: 'click_app_myorder_needpay_cancel' })
      const me = this
      this.confirm({ content: '您确定要取消合同吗？' }).then((res) => {
        if (!me.btnDisable && res === 'confirm') {
          me.btnDisable = true
          // me.$ironLoad.show()
          me.ironRequest('cancelOrder.shtml', { user_id: me.currentUser.user_id, discussid: item.id }, 'post').then(res => {
            // me.$ironLoad.hide()
            me.btnDisable = false
            if (res && res.returncode === '0') {
              me.showMsg('合同已取消', 'positive')
              // this.listData = []
              // this.allChoosed = false
              this.isTabDisabled = true
              me.billTab[me.swiperCount].data = []
              this.currentPage = 0
              // me.pageHeight = this.tabName === '1' ? 150 : 100
              this.isload = true
              me.refresher()
              // me.cb(me.billObject, 'cancel')
            } else {
              me.showMsg(res === undefined ? '网络异常' : res.errormsg)
            }
          })
        }
      })
    },
    payBill (item) {
      if (this.tabName === '0') this.statisticRequest({ event: 'click_app_myorder_all_pay' })
      if (this.tabName === '1') this.statisticRequest({ event: 'click_app_myorder_needpay_pay' })
      this.jump(`/pages/pay/main?pageType=offlinePay&orderNo=${item.no}&price=${item.fact_price}`)
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
.dingjin-icon {
  width: 35px;
  height: 20px;
}  
</style>