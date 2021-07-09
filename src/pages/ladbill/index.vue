<template lang="pug">
div
  nav-bar(title="我的提单", isBack)
  .head.bg-white(:style="{top: customBar + 'px', height: '170rpx'}")
    .serach.flex.align-center.padding-sm(style="height: 80rpx")
      .col.search-input.text-gray
        .flex.align-center
          .cuIcon-search
          input.full-width.padding-left-sm(v-model="search", type="text", placeholder="品名/提单号/车牌号", confirm-type="search", @confirm="searchOrder")
          .close-icon(@click="clearSearch", v-if="search")
            .cuIcon-roundclosefill.ft-18
      .search-btn.text-blue.padding-left-sm(@click="searchOrder") 搜索
    scroll-view.nav(scroll-x, style="height: 90rpx")
      .flex.text-center
        .cu-item.flex-sub(v-for="(item,billIdx) in billTab", :class="item.status === tabName?'text-blue cur':''", :key="billIdx", @click="selectTabs(item, billIdx)")
          span {{item.title}}
  swiper.bill-content(@change="swiperChange", :current="swiperCount", :style="{height: swiperHeight}")
    swiper-item(v-for="(tabItem, idx) in billTab.length", :key="idx")
      //- scroll-view(scroll-y, :refresher-triggered="triggered", :refresher-enabled="true", @refresherrefresh="refresher", @scrolltolower="loadMore", :style="{height: screenHeight - 186 +'px'}")
      template(v-if="isload")
        time-line(type="mallist")
      template(v-else)
        template(v-if="billTab[idx].data.length > 0")
          scroll-view(scroll-y, @scrolltolower="loadMore", :style="{height: swiperHeight}")
            //- lab-bill-item(v-for="(item,itemIdx) in billTab[idx].data", :key="itemIdx", :ladObject="item", :cb="labObjectCb")
            .bg-gray.pt-half-rem(v-for="(item,itemIdx) in billTab[idx].data", :key="itemIdx")
              .bg-white
                .row.padding.flex-center.border-bottom-line
                  .col.text-blue.ft-bold
                    span(@click="jump('/pages/ladbillDetail/main?id=' + item.saleLadingId)") {{item.saleLadingNo}}
                    copy-btn(:copyUrl="item.saleLadingNo")
                  .col.flex-120.text-right.ft-13
                    //- q-btn(color="red-5", small, outline, rounded, v-if="ladObject.status == '待出库'", @click="cb(ladObject, 'cancel')") 待出库可取消
                    //- q-btn.ft-13(color="primary", small, outline, rounded, v-else-if="ladObject.status == '待付款' && ladObject.pay_price > 0", @click="cb(ladObject, 'pay')") 去支付
                    // .text-blue(v-if="item.status == '待收货'", @click="labObjectCb(item, 'confirm')") 确认收货
                    // .text-red(v-else-if="item.status == '待付款' && item.pay_price > 0", @click="labObjectCb(item, 'pay')") 待付款
                    // .text-gray(v-else-if="item.status == '待付款' && item.pay_price == 0") 审核中
                    .text-gray {{item.ladingStatus}}
                div(@click="jump('/pages/ladbillDetail/main?id=' + item.saleLadingId)")
                  .text-gray.solid-bottom.padding-sm.text-content(v-for="(itm, ladIdx) in item.ladingDetailVOList", :key="ladIdx")
                    .text-black.padding-bottom-xs
                      .row.ft-15
                        .col
                          span.ft-14 {{itm.productBrandName}}
                          span.padding-left-xs {{itm.specification}}
                        .text-blue.text-bold ￥{{itm.inTaxPrice}}
                    .row.padding-bottom-xs
                      .col
                        span.ml-0 {{itm.productTextureName}}
                        //- span.ml-5 {{itm.product_standard}}
                        span.ml-5 {{itm.length}}米
                        .sub-mark.ml-5.ft-12 {{itm.stockZoneName}}
                        //- .lad-warehouse-mark.ml-5 {{itm.warehouse}}
                      .col.flex-70.ft-14.text-right.c-black
                        span ({{itm.quantityType === '02' ? '磅计' : '理计'}})
                    .padding-bottom-xs(v-if="itm.toleranceRange || itm.weightRange")
                      span.mr-5(v-if="itm.toleranceRange") 公差范围：{{itm.toleranceRange}}
                      span(v-if="itm.weightRange") 重量范围：{{itm.weightRange}}
                    .row.padding-bottom-xs
                      .col
                        span 预计/实提：
                        span.ml-5 {{itm.quantityType === '02' ? itm.ladingPoundWeight : itm.ladingManagerWeight}}吨 / {{itm.quantityType === '02' ? itm.outPoundWeight : itm.outManagerWeight}}吨
                      span {{itm.ladingAmount}}支
                .row.padding-sm
                  span 共 {{item.outAmount}} 支
                  .col.text-right
                    span 预计/实提：
                    span.ml-5 {{item.quantityType === '02' ? item.ladingPoundWeight : item.ladingManagerWeight}}吨 / {{item.quantityType === '02' ? item.outPoundWeight : item.outManagerWeight}}吨
            .padding.text-gray.ft-13.text-center(v-if="loading") 努力加载中...
            .text-center.text-gray.padding(v-else-if="finished && billTab[idx].data.length > 10") 加载完成
        .text-center.text-gray.pt-100(v-else)
          empty-image(url="bill_empty.png", className="img-empty")
          .empty-content 您暂时没有相关提单
</template>
<script>
// import labBillItem from '@/components/LadBillItem.vue'
import copyBtn from '@/components/CopyBtn.vue'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      swiperCount: 0,
      billTab: [
        { title: '全部', status: '-2', data: [], isActive: true },
        { title: '待提货', status: '0', data: [], isActive: false },
        { title: '已完成', status: '3', data: [], isActive: false },
        { title: '已取消', status: '4', data: [], isActive: false }
      ],
      loading: false,
      tabName: '-2',
      pageSize: 10,
      currentPage: 1,
      finished: true,
      isload: false,
      tdNo: '',
      carNo: '',
      startDate: '',
      endDate: '',
      // listData: [],
      btnDisable: false,
      search: '',
      swiperHeight: '0rpx',
      queryObj: {
        pageNum: 1,
        pageSize: 10,
        ladingDate: '',
        ladingEndDate: '',
        driverIdcard: '',
        billLadingStatus: '',
        saleLadingNo: '',
        carNo: '',
        saleContractNo: '',
        keywords: ''
      }
    }
  },
  components: {
    copyBtn
  },
  computed: {
    ...mapState({
      tempObject: state => state.tempObject
    })
  },
  onShow () {
    this.swiperHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - 170 + 'rpx'
    this.loading = false
    this.swiperCount = 0
    // console.log('tag', this.$root.$mp.query.tabName)
    if (this.$root.$mp.query.tabName) this.tabName = this.$root.$mp.query.tabName
    const idx = this.billTab.findIndex(item => item.status === this.tabName)
    this.swiperCount = idx
    if (this.tempObject.tdNo) this.tdNo = this.tempObject.tdNo
    if (this.tempObject.carNo) this.carNo = this.tempObject.carNo
    if (this.tempObject.startDate) this.startDate = this.tempObject.startDate
    if (this.tempObject.endDate) this.endDate = this.tempObject.endDate
    if (!this.swiperCount) {
      this.loadData()
    }
  },
  onUnload () {
    this.swiperCount = 0
    this.tabName = '-2'
    this.loading = false
    this.search = ''
    this.billTab = [
      { title: '全部', status: '-2', data: [], isActive: true },
      { title: '待提货', status: '0', data: [], isActive: false },
      { title: '已完成', status: '3', data: [], isActive: false },
      { title: '已取消', status: '4', data: [], isActive: false }
    ]
  },
  methods: {
    clearSearch () {
      this.search = ''
      this.queryObj.keywords = ''
    },
    selectTabs (item, idx) {
      this.tabName = item.status
      this.swiperCount = idx
    },
    swiperChange (e) {
      const idx = e.mp.detail.current
      this.swiperCount = idx
      this.tabName = this.billTab[idx].status
      if (this.tabName === '-2') {
        this.queryObj.billLadingStatus = ''
      } else if (this.tabName === '0') {
        this.queryObj.billLadingStatus = '01'
      } else if (this.tabName === '3') {
        this.queryObj.billLadingStatus = '02'
      } else {
        this.queryObj.billLadingStatus = '03'
      }
      this.billTab[idx].data = []
      this.currentPage = 1
      this.finished = true
      // this.listData = []
      this.loadData()
    },
    searchOrder () {
      const idx = this.swiperCount
      this.billTab[idx].data = []
      this.currentPage = 1
      this.finished = true
      this.logEventGet({ event: 'click_app_td_search' })
      // this.listData = []
      this.loadData()
      // this.swiperCount = 0
    },
    labObjectCb (obj, type) {
      const self = this
      if (type === 'cancel') {
        // 提单待出库取消
        this.confirm({ content: '您确定要取消提单吗？' }).then((res) => {
          if (res !== 'confirm') return false
          self.ironRequest('cancelTdOrder.shtml', { user_id: self.currentUser.user_id, td_no: obj.no }, 'post', self).then(resp => {
            if (resp && resp.returncode === '0') {
              self.showMsg('取消成功')
              self.currentPage = 1
              // self.listData = []
              self.billTab[self.swiperCount].data = []
              self.loadData()
            } else {
              self.showMsg(resp === undefined ? '网络异常' : resp.errormsg)
            }
          }).catch(err => {
            self.showMsg(err || '网络异常')
          })
        })
      }
      if (type === 'confirm') {
        // 确认货物
        if (!this.btnDisable) {
          this.btnDisable = true
          this.ironRequest('confirmReceipt.shtml', { user_id: this.currentUser.user_id, order_id: obj.id }, 'post').then(resp => {
            if (resp && resp.returncode === '0') {
              self.showMsg('确认成功')
              self.btnDisable = false
              self.currentPage = 1
              // self.listData = []
              self.billTab[self.swiperCount].data = []
              self.loadData()
            } else {
              this.showMsg(resp === undefined ? '网络异常' : resp.errormsg)
              this.btnDisable = false
            }
          }).catch(err => {
            self.showMsg(err || '网络异常')
            this.btnDisable = false
          })
        }
      }
      if (type === 'pay') {
        if (this.tabName === '-2') this.logEventGet({ event: 'click_app_mylad_all_pay' })
        if (this.tabName === '4') this.logEventGet({ event: 'click_app_mylad_needpay_pay' })
        // 提单支付
        this.jump(`/pages/pay/main?pageType=ladPay&orderNo=${obj.no}&price=${obj.pay_price}&contractNo=${obj.contract_no}`)
      }
    },
    loadMore () {
      if (!this.finished) {
        const self = this
        this.throttle(function () {
          self.currentPage++
          self.loadData()
        }, 300)
      }
    },
    // 加载数据
    loadData () {
      const self = this
      if (this.currentPage === 1) {
        this.isload = true
      } else {
        // this.isload = false
        this.loading = true
      }
      this.showLoading()
      let body = {
        user_id: this.currentUser.user_id,
        current_page: this.currentPage,
        page_size: this.pageSize
      }
      if (this.tabName !== '-2') {
        body.status = this.tabName
      }

      console.log('>>>>>>>>+++++++')
      console.log('queryObj', this.queryObj)

      if (this.search.trim().length > 0) {
        // body.search = this.search
        self.queryObj.keywords = this.search
      }

      // if (this.tdNo.trim().length > 0) {
      //   body.td_no = this.tdNo
      // }
      // if (this.carNo.trim().length > 0) {
      //   body.car_no = this.carNo
      // }
      // if (this.startDate.trim().length > 0) {
      //   body.start_date = this.startDate
      // }
      // if (this.endDate.trim().length > 0) {
      //   body.end_date = this.endDate
      // }
      self.queryObj.pageNum = this.currentPage
      self.queryObj.pageSize = this.pageSize
      self.httpPost(self.apiList.zf.billLading, self.queryObj).then(res => {
        const idx = self.swiperCount
        let arr = res.data.saleLadingList
        if (arr.length === 0 && this.currentPage === 1) {
          // self.listData = []
          self.billTab[idx].data = []
          self.finished = true
        } else if (arr.length > 0 && this.currentPage === 1) {
          // self.listData = arr
          self.billTab[idx].data = arr
          if (arr.length > 8) self.finished = false
        } else if (arr.length > 0 && this.currentPage > 1) {
          arr.map(itm => {
            self.billTab[idx].data.push(itm)
          })
          // self.listData = self.billTab[idx].data
          self.finished = false
        } else {
          self.finished = true
          // self.isload = true
          self.currentPage--
        }
      }).finally(() => {
        this.loading = false
        this.isload = false
        this.hideLoading()
      })
      // this.ironRequest('orderLadList.shtml', body, 'post').then(resp => {
      //   if (resp && resp.returncode === '0') {
      //     const idx = self.swiperCount
      //     let arr = resp.order_lads
      //     self.isload = false
      //     if (arr.length === 0 && this.currentPage === 0) {
      //       // self.listData = []
      //       self.billTab[idx].data = []
      //       self.finished = true
      //     } else if (arr.length > 0 && this.currentPage === 0) {
      //       // self.listData = arr
      //       self.billTab[idx].data = arr
      //       if (arr.length > 8) self.finished = false
      //     } else if (arr.length > 0 && this.currentPage > 0) {
      //       arr.map(itm => {
      //         self.billTab[idx].data.push(itm)
      //       })
      //       // self.listData = self.billTab[idx].data
      //       self.finished = false
      //     } else {
      //       self.finished = true
      //       // self.isload = true
      //       self.currentPage--
      //     }
      //   } else {
      //     this.showMsg(resp === undefined ? '网络异常' : resp.errormsg)
      //     this.currentPage--
      //     this.finished = true
      //     this.isload = true
      //   }
      //   this.hideLoading()
      //   this.loading = false
      // }).catch(err => {
      //   this.hideLoading()
      //   self.showMsg(err || '网络异常')
      //   this.loading = false
      //   this.isload = true
      // })
    }
  }
}
</script>
<style lang="stylus" scoped>
.search-input
  background #F6F6F6
  padding 5px 10px
  border-radius 35px
</style>
