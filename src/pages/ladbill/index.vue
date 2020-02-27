<template lang="pug">
div
  nav-bar(title="我的提单", isBack)
  .head.bg-white(:style="{top: customBar + 'px', height: '170rpx'}")
    .serach.flex.align-center.padding-sm(style="height: 80rpx")
      .col.search-input.text-gray
        .flex.align-center
          .cuIcon-search
          input.full-width.padding-left-sm(v-model="search", type="text", placeholder="品名/提单号/车牌号")
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
                    span(@click="jump('/pages/ladbillDetail/main?id=' + item.no + '&status='+item.status)") {{item.no}}
                    copy-btn(:copyUrl="item.no")
                  .col.flex-120.text-right.ft-13
                    //- q-btn(color="red-5", small, outline, rounded, v-if="ladObject.status == '待出库'", @click="cb(ladObject, 'cancel')") 待出库可取消
                    .text-blue(v-if="item.status == '待收货'", @click="labObjectCb(item, 'confirm')") 确认收货
                    //- q-btn.ft-13(color="primary", small, outline, rounded, v-else-if="ladObject.status == '待付款' && ladObject.pay_price > 0", @click="cb(ladObject, 'pay')") 去支付
                    .text-red(v-else-if="item.status == '待付款' && item.pay_price > 0", @click="labObjectCb(item, 'pay')") 待付款
                    .text-gray(v-else-if="item.status == '待付款' && item.pay_price == 0") 审核中
                    .text-gray(v-else) {{item.status}}
                div(@click="jump('/pages/ladbillDetail/main?id=' + item.no + '&status='+item.status)")
                  .text-gray.solid-bottom.padding-sm.text-content(v-for="(itm, ladIdx) in item.order_items", :key="ladIdx")
                    .text-black.padding-bottom-xs
                      .row.ft-15
                        .col
                          span.ft-14 {{itm.product_name}}
                          span.padding-left-xs {{itm.product_standard}}
                        .text-blue.text-bold ￥{{itm.product_price}}  
                    .row.padding-bottom-xs
                      .col
                        span.ml-0 {{itm.product_material}}
                        //- span.ml-5 {{itm.product_standard}}
                        span.ml-5 {{itm.product_length}}米
                        .sub-mark.ml-5.ft-12 {{itm.warehouse}}
                        //- .lad-warehouse-mark.ml-5 {{itm.warehouse}}
                      .col.flex-70.ft-14.text-right.c-black
                        span ({{itm.metering}})
                    .padding-bottom-xs(v-if="itm.tolerance_range || itm.weight_range")
                      span.mr-5(v-if="itm.tolerance_range") 公差范围：{{itm.tolerance_range}}
                      span(v-if="itm.weight_range") 重量范围：{{itm.weight_range}}
                    .row.padding-bottom-xs
                      .col
                        span 预计/实提：
                        span.ml-5 {{itm.weight_csg}}吨 / {{itm.weight_real}}吨
                      span {{itm.product_count}}支
                .row.padding-sm
                  span 共 {{item.total_count}} 支
                  .col.text-right
                    span 预计/实提：
                    span.ml-5 {{item.weight_csg}}吨 / {{item.weight_real}}吨
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
        { title: '已完成', status: '3', data: [], isActive: false }
      ],
      loading: false,
      tabName: '-2',
      pageSize: 10,
      currentPage: 0,
      finished: true,
      isload: false,
      tdNo: '',
      carNo: '',
      startDate: '',
      endDate: '',
      // listData: [],
      btnDisable: false,
      search: '',
      swiperHeight: '0rpx'
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
    this.loading = false
    this.search = ''
    this.billTab = [
      { title: '全部', status: '-2', data: [], isActive: true },
      { title: '待提货', status: '0', data: [], isActive: false },
      { title: '已完成', status: '3', data: [], isActive: false }
    ]
  },
  methods: {
    selectTabs (item, idx) {
      this.tabName = item.status
      this.swiperCount = idx
    },
    swiperChange (e) {
      const idx = e.mp.detail.current
      this.swiperCount = idx
      this.tabName = this.billTab[idx].status
      this.billTab[idx].data = []
      this.currentPage = 0
      this.finished = true
      // this.listData = []
      this.loadData()
    },
    searchOrder () {
      const idx = this.swiperCount
      this.billTab[idx].data = []
      this.currentPage = 0
      this.finished = true
      // this.listData = []
      this.loadData()
      // this.swiperCount = 0
    },
    labObjectCb (obj, type) {
      const me = this
      if (type === 'cancel') {
        // 提单待出库取消
        this.confirm({ content: '您确定要取消提单吗？' }).then((res) => {
          if (res !== 'confirm') return false
          me.ironRequest('cancelTdOrder.shtml', { user_id: me.currentUser.user_id, td_no: obj.no }, 'post', me).then(resp => {
            if (resp && resp.returncode === '0') {
              me.showMsg('取消成功')
              me.currentPage = 0
              // me.listData = []
              me.billTab[me.swiperCount].data = []
              me.loadData()
            } else {
              me.showMsg(resp === undefined ? '网络异常' : resp.errormsg)
            }
          }).catch(err => {
            me.showMsg(err || '网络异常')
          })
        })
      }
      if (type === 'confirm') {
        // 确认货物
        if (!this.btnDisable) {
          this.btnDisable = true
          this.ironRequest('confirmReceipt.shtml', { user_id: this.currentUser.user_id, order_id: obj.id }, 'post').then(resp => {
            if (resp && resp.returncode === '0') {
              me.showMsg('确认成功')
              me.btnDisable = false
              me.currentPage = 0
              // me.listData = []
              me.billTab[me.swiperCount].data = []
              me.loadData()
            } else {
              this.showMsg(resp === undefined ? '网络异常' : resp.errormsg)
              this.btnDisable = false
            }
          }).catch(err => {
            me.showMsg(err || '网络异常')
            this.btnDisable = false
          })
        }
      }
      if (type === 'pay') {
        if (this.tabName === '-2') this.statisticRequest({ event: 'click_app_mylad_all_pay' })
        if (this.tabName === '4') this.statisticRequest({ event: 'click_app_mylad_needpay_pay' })
        // 提单支付
        this.jump(`/pages/pay/main?pageType=ladPay&orderNo=${obj.no}&price=${obj.pay_price}&contractNo=${obj.contract_no}`)
      }
    },
    loadMore () {
      if (!this.finished) {
        const me = this
        this.throttle(function () {
          me.currentPage++
          me.loadData()
        }, 300)
      }
    },
    loadData () {
      const me = this
      if (this.currentPage === 0) {
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
      if (this.search.trim().length > 0) {
        body.search = this.search
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

      this.ironRequest('orderLadList.shtml', body, 'post').then(resp => {
        if (resp && resp.returncode === '0') {
          const idx = me.swiperCount
          let arr = resp.order_lads
          me.isload = false
          if (arr.length === 0 && this.currentPage === 0) {
            // me.listData = []
            me.billTab[idx].data = []
            me.finished = true
          } else if (arr.length > 0 && this.currentPage === 0) {
            // me.listData = arr
            me.billTab[idx].data = arr
            if (arr.length > 8) me.finished = false
          } else if (arr.length > 0 && this.currentPage > 0) {
            arr.map(itm => {
              me.billTab[idx].data.push(itm)
            })
            // me.listData = me.billTab[idx].data
            me.finished = false
          } else {
            me.finished = true
            // me.isload = true
            me.currentPage--
          }
        } else {
          this.showMsg(resp === undefined ? '网络异常' : resp.errormsg)
          this.currentPage--
          this.finished = true
          this.isload = true
        }
        this.hideLoading()
        this.loading = false
      }).catch(err => {
        me.showMsg(err || '网络异常')
        this.loading = false
        this.isload = true
        this.hideLoading()
      })
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