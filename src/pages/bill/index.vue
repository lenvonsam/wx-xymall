<template lang="pug">
div
  nav-bar(title="我的合同", isBack)
  .head.bg-white(:style="{height: '200rpx'}")
    .serach.flex.align-center.padding-sm
      .col.search-input.text-gray
        .flex.align-center
          .cuIcon-search
          input.full-width.padding-left-sm(v-model="billNo", type="text", placeholder="合同号", confirm-type="search", @confirm="searchOrder")
          .close-icon(@click="clearBillNo", v-if="billNo")
            .cuIcon-roundclosefill.ft-18
      .search-btn.text-blue.padding-left-sm(@click="searchOrder") 搜索
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
                .bg-white.box(v-if="item")
                  .padding-sm
                    .flex.justify-between.padding-bottom-sm
                      .col
                        .flex.align-center
                          .ft-16.padding-right-sm {{item.saleContractNo}}
                          img.ding-icon(src="/static/images/ding.png", v-if="item.payMethod == '02'")
                      .text-gray(v-if="item.status === '已完成' || item.status === '违约' || item.status === '已取消'") {{item.status}}
                      .text-red(v-else) {{item.status}}
                    .text-gray
                      .padding-bottom-xs {{item.orgName}}
                      .flex.justify-between.padding-bottom-xs
                        span 共{{item.contractAmount}}支，{{item.estimatedTonnage}}吨
                        .ft-18.text-black ￥{{item.inTaxReceiveMoney}}
                      .flex.justify-between.padding-bottom-xs
                        span 吊费：¥{{item.liftingFeeMoney}}
                        span(v-if="item.status === '已付款'", style="display: flex;")
                          span(v-if="item.status === '已付款' && !item.overdue") 提货倒计时：
                          span(v-else) 提货已超时：
                          span.text-blue(v-if="item.status === '已付款' && !item.overdue") {{item.timeDown}}
                          span.text-red(v-else) {{item.timeDown}}
                  .solid-top.text-black.ft-15.padding-sm.row(v-if="item.status === '待支付'")
                    .col
                      template(v-if="item.status === '待支付'")
                        span 倒计时：
                        span.padding-left-xs.text-red {{item.timeDown}}
                      // template(v-if="item.status === '待补款'")
                      //   span 待补款：
                      //   span.padding-left-xs.text-red ￥{{item.paid_price}}
                    .flex
                      template(v-if="item.status === '待支付'")
                        .bill-btn.round(@click.stop="payBill(item)") 去付款
                        .bill-red-btn.round.margin-left-sm(@click.stop="billCancel(item)") 取消
                      // template(v-if="item.status === '待补款'")
                      //   .bill-btn.round 待补款
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
        { title: '全部', status: '', data: [], isActive: true },
        { title: '待付款', status: '01', data: [], isActive: false },
        { title: '待补款', status: '09', data: [], isActive: false },
        { title: '待提货', status: '02', data: [], isActive: false },
        { title: '已完成', status: '04', data: [], isActive: false }
      ],
      tabName: '0',
      currentPage: 1,
      listData: [],
      triggered: false,
      isload: false,
      startDate: '',
      endDate: '',
      billNo: '',
      totalPrice: 0,
      totalWeight: 0,
      totalCount: 0,
      allChoosed: false,
      isTabDisabled: false,
      pageHeight: 150,
      btnDisable: false,
      scrollHeight: '0px',
      timeInterval: '',
      serverTime: '',
      loadFinish: 0,
      queryObj: {
        contractStateType: '',
        xingyunContractStatus: '',
        saleContractNo: '',
        pageSize: 10,
        pageNum: 1
      }
    }
  },
  computed: {
    ...mapState({
      tempObject: state => state.tempObject,
      contractStatus: state => state.contractStatus
    })
  },
  onShow () {
    this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - 200
    // this.scrollHeight = this.screenHeight - this.customBar - 98
  },
  beforeMount () {
    this.tabName = this.$root.$mp.query.tabName || ''
    if (this.tabName === '01') {
      this.queryObj.contractStateType = '01'
      this.queryObj.xingyunContractStatus = ''
    } else if (this.tabName === '02') {
      this.queryObj.contractStateType = '02'
      this.queryObj.xingyunContractStatus = ''
    } else if (this.tabName === '03') {
      this.queryObj.contractStateType = '09'
      this.queryObj.xingyunContractStatus = ''
    } else if (this.tabName === '04') {
      this.queryObj.contractStateType = '04'
      this.queryObj.xingyunContractStatus = ''
    }
    const idx = this.billTab.findIndex(item => item.status === this.tabName)
    if (this.tempObject.startDate) this.startDate = this.tempObject.startDate
    if (this.tempObject.endDate) this.endDate = this.tempObject.endDate
    if (this.tempObject.billNo) this.billNo = this.tempObject.billNo
    if (this.tempObject.billTabName) this.tabName = this.tempObject.billTabName.toString()
    this.pageHeight = this.tabName === '1' ? 150 : 100
    this.billTab[idx].data = []
    if (this.swiperCount !== idx) {
      this.swiperCount = idx
    } else {
      this.onRefresh()
    }
    // if (!this.swiperCount) {
    //   this.loadData()
    // }
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
          if (itm.status === '待支付') itm.choosed = true
        })
      } else {
        this.listData.map(itm => {
          itm.choosed = false
        })
      }
    }
  },
  onLoad () {
    this.$nextTick(() => {
      const me = this
      this.timeInterval = setInterval(() => {
        me.countTime()
        // me.serverTime += 1000
      }, 1000)
    })
  },
  onUnload () {
    clearInterval(this.timeInterval)
  },
  methods: {
    // 清除搜索
    clearBillNo () {
      this.billNo = ''
      this.queryObj.saleContractNo = ''
    },
    // 刷新页面
    onRefresh (done) {
      this.currentPage = 1
      this.refresher(done)
    },
    // 搜索合同
    searchOrder () {
      this.logEventGet({ event: 'click_app_order_search', type: '01' })
      this.startDate = ''
      this.endDate = ''
      this.listData = []
      this.allChoosed = false
      this.isTabDisabled = true
      this.swiperCount = 0
      this.billTab[0].data = []
      this.pageHeight = this.tabName === '1' ? 150 : 100
      this.queryObj.saleContractNo = this.billNo
      // if (this.tabName === '0') {
      //   this.refresher()
      // } else {
      //   this.tabName = '0'
      // }
      this.refresher()
    },
    // 轮播切换
    swiperChange (e) {
      this.showLoading()
      const idx = e.mp.detail.current
      this.swiperCount = idx
      this.tabName = this.billTab[idx].status
      this.queryObj.contractStateType = this.tabName
      this.billTab[idx].data = []
      this.currentPage = 1
      this.startDate = ''
      // this.billNo = ''
      this.endDate = ''
      this.listData = []
      this.allChoosed = false
      this.isTabDisabled = true
      this.pageHeight = this.tabName.status === '1' ? 150 : 100
      this.loadData()
      // const me = this
      // this.throttle(function () {
      //   me.loadData()
      // }, 300)
    },
    // 刷新
    refresher (done) {
      console.log('刷新+++++')
      this.loadFinish = 1
      const self = this
      this.isLoad = true
      this.currentPage = 1
      // const reqUrl = `orderList.shtml?user_id=${me.currentUser.user_id}&status=${this.tabName}&current_page=${this.currentPage}&page_size=${this.pageSize}&order_no=${this.billNo}&start_date=${this.startDate}&end_date=${this.endDate}`
      // this.ironRequest(reqUrl, {}, 'get').then(resp => {
      //   const idx = me.swiperCount
      //   me.billTab[idx].data = []
      //   this.serverTime = resp.server_time
      //   if (resp.returncode === '0') {
      //     let arr = resp.orders
      //     if (arr.length > 0 && me.currentPage === 0) {
      //       const list = []
      //       arr.map(itm => {
      //         itm.choosed = false
      //         list.push(itm)
      //       })
      //       me.billTab[idx].data = list
      //       me.listData = list
      //       me.isLoad = false
      //     } else if (arr.length === 0 && me.currentPage === 0) {
      //       me.listData = []
      //       this.billTab[idx].data = []
      //       me.isload = false
      //     }
      //   }
      //   me.isTabDisabled = false
      //   if (me.billTab[idx].data.length < 10) me.loadFinish = 3
      //   if (done) done()
      // })
      self.queryObj.pageNum = this.currentPage
      self.httpPost(self.apiList.zf.contractList, self.queryObj).then(res => {
        const idx = self.swiperCount
        self.billTab[idx].data = []
        if (res.data[0].length) {
          this.serverTime = new Date(res.data[0].currentDate.replace(/-/g, '/')).getTime()
        }
        let arr = res.data
        if (arr.length > 0 && self.currentPage === 1) {
          const list = []
          arr.map(item => {
            item.choosed = false
            item.overdue = false
            item.timeDown = ''
            item.timeDiff = new Date(item.currentDate).getTime() - new Date().getTime() // 服务器时间与本地时间的差额
            item.timeEnd = new Date(item.invalidDate).getTime()
            item.timeEndLading = new Date(item.ladingInvalidDate).getTime()
            item.status = self.contractStatus.find(c => {
              return c.id === item.xingyunContractStatus
            }).name
            // console.log(item.status)
            // if (!(self.swiperIdx === 1 && item.status === '违约')) {
            //   list.push(item)
            // }
            list.push(item)
          })
          console.log('>>>>', list)
          self.billTab[idx].data = list
          console.log(idx, self.billTab[idx].data)
          self.listData = list
          self.isLoad = false
        } else if (arr.length === 0 && self.currentPage === 1) {
          self.listData = []
          this.billTab[idx].data = []
          self.isload = false
        }
        self.isTabDisabled = false
        if (self.billTab[idx].data.length < 10) self.loadFinish = 3
        if (done) done()
      })
    },
    // 点击切换tab
    selectTabs (item, idx) {
      if (item.status === '10') {
        this.queryObj.contractStateType = ''
        this.queryObj.xingyunContractStatus = '02'
      } else {
        this.queryObj.contractStateType = item.status
        this.queryObj.xingyunContractStatus = ''
      }
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
        let orderNos = filterArr.map(itm => itm.saleContractId).join(',')
        this.jump({ path: '/mall/pay', query: { pageType: 'offlinePay', orderNo: orderNos, price: this.totalPrice } })
      }
    },
    // 倒计时
    countTime () {
      const idx = this.swiperCount
      const arr = this.billTab[idx].data
      arr.map((item, index) => {
        // const nowTime = this.serverTime
        // const endTimeFormat = item.status === '已付款' ? item.end_pack_time.replace(/-/g, '/') : item.end_pay_time.replace(/-/g, '/')
        // const nowTime = item.currentDate
        // const endTimeFormat = item.invalidDate
        // const endTime = new Date(endTimeFormat.replace(/-/g, '/')).getTime()
        // const leftTime = Number(endTime - nowTime)
        // if (index === 0) {
        //   console.log('timeDiff', item.timeDiff)
        //   console.log('timeEnd', item.timeEnd)
        //   console.log('leftTime', item.timeEnd - (new Date().getTime() + item.timeDiff))
        // }
        if (item.timeDiff && (item.timeEnd || item.timeEndLading)) {
          if (item.status === '待支付') {
            const leftTime = item.timeEnd - (new Date().getTime() + item.timeDiff)
            const seconds = Math.floor(leftTime / 1000) % 60
            const minutes = Math.floor(leftTime / 1000 / 60) % 60
            const hours = Math.floor(leftTime / 1000 / 60 / 60) % 24
            // const day = Math.floor(leftTime / 1000 / 60 / 60 / 24)
            const h = Math.abs(hours) >= 10 ? Math.abs(hours) + '' : '0' + Math.abs(hours)
            const m = Math.abs(minutes) >= 10 ? Math.abs(minutes) + '' : '0' + Math.abs(minutes)
            const s = Math.abs(seconds) >= 10 ? Math.abs(seconds) + '' : '0' + Math.abs(seconds)
            if (leftTime >= 0) {
              // item.name = '待支付'
              item.timeDown = `${h}:${m}:${s}`
            } else {
              item.timeDown = '00:00:00'
              // item.name = '已超时'
              // item.value = `${h}:${m}:${s}`
            }
          } else if (item.status === '已付款') {
            const leftTime = item.timeEndLading - new Date().getTime() + item.timeDiff
            // console.log(leftTime)
            // const seconds = Math.floor(leftTime / 1000) % 60
            const minutes = Math.floor(leftTime / 1000 / 60) % 60
            const hours = Math.floor(leftTime / 1000 / 60 / 60) % 24
            const day = Math.abs(Math.floor(leftTime / 1000 / 60 / 60 / 24))
            const h = Math.abs(hours) >= 10 ? Math.abs(hours) + '' : '0' + Math.abs(hours)
            const m = Math.abs(minutes) >= 10 ? Math.abs(minutes) + '' : '0' + Math.abs(minutes)
            // const s = Math.abs(seconds) >= 10 ? Math.abs(seconds) + '' : '0' + Math.abs(seconds)
            // console.log(`${day}天${h}时${m}分`)
            if (leftTime >= 0) {
              item.overdue = false
              item.timeDown = `${day}天${h}时${m}分`
            } else {
              item.overdue = true
              item.timeDown = `${day}天${h}时${m}分`
            }
          }
        }
      })
      console.log('倒计时', arr)
      this.$forceUpdate()
    },
    // 获取合同列表
    loadData (done) {
      this.loadFinish = 1
      if (this.currentPage === 1) {
        this.isload = true
      } else {
        this.isload = false
      }
      const self = this
      self.queryObj.pageNum = this.currentPage
      self.httpPost(self.apiList.zf.contractList, self.queryObj).then(res => {
        const idx = self.swiperCount
        // self.billTab[idx].data = []
        let arr = res.data
        // if (res.data.length) {
        //   this.serverTime = new Date(res.data[0].currentDate.replace(/-/g, '/')).getTime()
        // }
        console.log(arr.length, self.currentPage, '+++++')
        if (arr.length > 0 && self.currentPage === 1) {
          let list = []
          arr.map(item => {
            item.choosed = false
            item.choosed = false
            item.overdue = false
            item.timeDiff = new Date(item.currentDate).getTime() - new Date().getTime() // 服务器时间与本地时间的差额
            item.timeEnd = new Date(item.invalidDate).getTime()
            item.timeEndLading = new Date(item.ladingInvalidDate).getTime()
            item.status = self.contractStatus.find(c => {
              return c.id === item.xingyunContractStatus
            }).name
            // console.log(item.status)
            // if (!(self.swiperIdx === 1 && item.status === '违约')) {
            //   list.push(item)
            // }
            list.push(item)
          })
          console.log(list, '测试+++')
          self.billTab[idx].data = list
          self.listData = list
          self.isLoad = false
        } else if (arr.length === 0 && self.currentPage === 1) {
          self.listData = []
          this.billTab[idx].data = []
          self.isload = false
        } else if (arr.length === 0 && self.currentPage > 1) {
          self.loadFinish = 2
          self.isload = false
        } else if (arr.length > 0 && self.currentPage > 1) {
          let list = []
          arr.map(item => {
            item.choosed = false
            item.choosed = false
            item.overdue = false
            item.timeDiff = new Date(item.currentDate).getTime() - new Date().getTime() // 服务器时间与本地时间的差额
            item.timeEnd = new Date(item.invalidDate).getTime()
            item.timeEndLading = new Date(item.ladingInvalidDate).getTime()
            item.status = self.contractStatus.find(c => {
              return c.id === item.xingyunContractStatus
            }).name
            // console.log(item.status)
            list.push(item)
          })
          console.log('初始化数据+++', list)
          this.billTab[idx].data = this.billTab[idx].data.concat(list)
          self.listData = self.listData.concat(list)
          self.isLoad = false
        } else {
          self.currentPage--
        }
        self.isTabDisabled = false
        if (self.billTab[idx].data.length < 10) self.loadFinish = 3
        if (done) done()
      }).finally(() => {
        self.isload = false
        self.hideLoading()
      })
      // let reqUrl = `orderList.shtml?user_id=${this.currentUser.user_id}&status=${this.tabName}&current_page=${this.currentPage}&page_size=${this.pageSize}&order_no=${this.billNo}&start_date=${this.startDate}&end_date=${this.endDate}`
      // const me = this
      // this.ironRequest(reqUrl, {}, 'get').then(resp => {
      //   const idx = me.swiperCount
      //   this.serverTime = resp.server_time
      //   if (resp && resp.returncode === '0') {
      //     let arr = resp.orders
      //     if (arr.length === 0 && me.currentPage === 0) {
      //       me.listData = []
      //       this.billTab[idx].data = []
      //       me.isload = false
      //     } else if (arr.length > 0 && me.currentPage === 0) {
      //       arr.map(itm => {
      //         itm.choosed = false
      //         me.listData.push(itm)
      //         this.billTab[idx].data.push(itm)
      //       })
      //       me.isload = false
      //     } else if (arr.length > 0 && me.currentPage > 0) {
      //       // arr.map(item => {
      //       //   item.choosed = false
      //       //   me.listData.push(item)
      //       //   this.billTab[idx].data.push(item)
      //       // })
      //       me.listData = me.listData.concat(arr)
      //       this.billTab[idx].data = this.billTab[idx].data.concat(arr)
      //       me.isload = false
      //     } else {
      //       me.isload = false
      //       me.currentPage--
      //       if (me.billTab[idx].data.length >= 10) me.loadFinish = 2
      //     }
      //   }
      //   me.isTabDisabled = false
      //   me.hideLoading()
      //   if (me.billTab[idx].data.length < 10) me.loadFinish = 3
      //   if (done) done()
      // })
    },
    // 上拉加载
    loadMore () {
      if (!this.isLoad) {
        const me = this
        this.throttle(function () {
          me.currentPage++
          me.loadData()
        }, 300)
      }
    },
    // jumpSearch () {
    //   this.logEventGet({ event: 'click_app_myorder_search' })
    //   this.jump({ path: '/bill/search' })
    // },
    // 点击跳转合同详情
    jumpDetail (item) {
      this.jump(`/pages/billDetail/main?contractId=${item.saleContractId}`)
    },
    // 取消合同
    billCancel (item) {
      console.log('点击取消+++++')
      // if (this.tabName === '0') this.logEventGet({ event: 'click_app_myorder_all_cancel' })
      // if (this.tabName === '1') this.logEventGet({ event: 'click_app_myorder_needpay_cancel' })
      this.logEventGet({ event: 'click_app_order_cancel', type: '01' })
      const me = this
      this.confirm({ content: '您确定要取消合同吗？' }).then((res) => {
        console.log(me.btnDisable, res)
        if (!me.btnDisable && res === 'confirm') {
          console.log('确认+++')
          me.btnDisable = true
          // me.$ironLoad.show()
          me.httpGet(me.apiList.zf.cancelContract, {contractId: item.saleContractId}).then(res => {
            console.log(res)
            // me.$ironLoad.hide()
            me.btnDisable = false
            me.showMsg('合同已取消', 'positive')
            this.listData = []
            this.allChoosed = false
            this.isTabDisabled = true
            me.billTab[me.swiperCount].data = []
            // me.pageHeight = this.tabName === '1' ? 150 : 100
            me.refresher()
            // me.cb(me.billObject, 'cancel')
          }).catch(e => {
            me.btnDisable = false
            me.showMsg(e.message)
          })
        }
      })
    },
    // 去付款
    payBill (item) {
      // if (this.tabName === '0') this.logEventGet({ event: 'click_app_myorder_all_pay' })
      // if (this.tabName === '1') this.logEventGet({ event: 'click_app_myorder_needpay_pay' })
      this.logEventGet({ event: 'click_app_order_to_pay', type: '01' })
      this.jump(`/pages/pay/main?pageType=offlinePay&orderNo=${item.saleContractId}`)
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
.bill-btn, .bill-red-btn
  padding 2px 8px
  text-align center
  font-size 13px
  color #0081ff
.bill-btn
  border 1px #0081ff solid
.bill-red-btn
  border 1px #e54d42 solid
  font-size 13px
  color #e54d42
.bill-content
  height 100%
  // margin-top 108px
  // padding-bottom 108px
</style>
