<template lang="pug">
div(@click="openStatus=false")
  nav-bar(title="合同跟踪", isBack)
  .head.bg-white(:style="{height: '210rpx'}")
    .serach.flex.align-center.padding-sm
      .col.search-input.text-gray
        .flex.align-center
          .cuIcon-search
          input.full-width.padding-left-sm(v-model="searchVal", type="text", placeholder="合同号/公司名称", confirm-type="search", @confirm="searchOrder")
          .close-icon(@click="searchVal = ''", v-if="searchVal")
            .cuIcon-roundclosefill.ft-18
      .search-btn.text-blue(@click="searchOrder") 搜索
      .filter-btn.row(@click="openFilter")
        span 筛选
        .cuIcon-filter
    .flex.align-stretch.justify-between
      .col.tab-content
        scroll-view.nav(scroll-x, scroll-with-animation, :scroll-into-view="scrollId")
          .flex.text-center
            .cu-item.flex-sub(:id="'idx_'+index", v-for="(item,index) in billTab", :class="item.status === tabName ? 'text-blue cur':''", :key="index", @click="selectTabs(item, index)")
              span {{item.title}}
      .tab-more.row.justify-center(@click.stop="openStatus = !openStatus", :class="{'text-blue': openStatus}")
        .cuIcon-fold.text-xl(v-if="openStatus")
        .cuIcon-unfold.text-xl(v-else)
    .relative(v-if="openStatus")
      .status-box.solid-top(:style="{height: scrollHeight + 'rpx'}")
        .bg-white.padding-sm.row.flex-wrap.text-center.justify-between
          .status-item(:class="item.status === tabName ? 'text-white bg-blue':''", v-for="(item,index) in billTab", :key="index", @click.stop="selectTabs(item, index)")
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
                          .ft-16.padding-right-sm {{item.saleContractNo}}
                          img.ding-icon.margin-right-xs(src="/static/images/ding.png", v-if="item.sourceType == '01' && item.orgId == 'C00011'")
                          img.dingjin-icon.margin-right-xs(src="/static/images/dj_icon.png", v-if="item.payMethod == '03'")
                          img.dingjin-icon(src="/static/images/baitiao_icon.png", v-if="item.payMethod == '02'")
                      .text-gray(v-if="item.status === '已完成' || item.status === '违约' || item.status === '已取消'") {{item.status}}
                      .text-red(v-else-if="item.status !== '待补款'") {{item.status}}
                    .text-gray
                      .flex.justify-between.padding-bottom-xs
                        span {{item.orgName}}
                        .ft-18.text-black ￥{{item.inTaxReceiveMoney}}
                      .flex.justify-between.padding-bottom-xs
                        span 共{{item.contractAmount}}支，{{item.weight}}吨
                        span 吊费：¥{{item.liftingFeeMoney}}
                  .solid-top.text-black.ft-15.padding-sm.row(v-if="")
                    .col
                      template(v-if="item.xingyunContractStatus == '01'")
                        span 倒计时：
                        span.padding-left-xs.text-red {{item.timeDown}}
                      template(v-if="item.xingyunContractStatus == '03'")
                        span 提货倒计时：
                        span.padding-left-xs.text-blue {{item.timeDown}}
                      template(v-else-if="item.overdue && item.status === 15 || item.status === 16")
                        span 提货已超时：
                        span.padding-left-xs.text-red {{item.timeDown}}
                    .flex
                      .bill-gray-btn.round(v-if="item.isCancel", @click.stop="billCancel(item)") 取消合同
                      .bill-btn.round.margin-left-sm(v-if="item.isEdit", @click.stop="jumpModifyDetail(item)") 申请修改
                      .bill-btn.round.margin-left-sm(v-if="item.isLading", @click.stop="makeLoad(item)") 制作提单
                      // .bill-btn.round.margin-left-sm(v-if="item.xingyunContractStatus == '02'", @click.stop="payBill(item)") 去补款
        .text-center.c-gray.pt-100(v-else)
          empty-image(url="bill_empty.png", className="img-empty")
          .empty-content 您暂时没有相关合同
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      scrollId: 'idx_0',
      swiperCount: 0,
      openStatus: false,
      billTab: [
        {
          title: '全部',
          status: '',
          data: [],
          isActive: true,
          statusList: [
            { label: '全部', value: '' },
            { label: '待支付', value: '14' },
            { label: '待补款', value: '17' },
            { label: '已付款', value: '15' },
            { label: '待审核', value: '12,20' },
            { label: '待确认', value: '16' },
            { label: '修改中', value: '18,19' },
            { label: '已完成', value: '99' },
            { label: '已取消', value: '-1' },
            { label: '已违约', value: '13' }
          ]
        }, {
          title: '待付款',
          status: '01',
          data: [],
          isActive: false,
          statusList: [
            { label: '待支付', value: '14' },
            { label: '待补款', value: '17' }
          ]
        }, {
          title: '已支付待确认',
          status: '04',
          data: [],
          isActive: false,
          statusList: [
            { label: '审核中', value: '12,20' }
          ]
        }, {
          title: '待提货',
          status: '03',
          data: [],
          isActive: false,
          statusList: [
            { label: '全部', value: '' },
            { label: '已付款', value: '15' },
            { label: '待确认', value: '16' }
          ]
        },
        {
          title: '修改中',
          status: '06',
          data: [],
          isActive: false,
          statusList: [
            { label: '修改中', value: '18,19' }
          ]
        },
        {
          title: '已完成',
          status: '07',
          data: [],
          isActive: false,
          statusList: [
            { label: '已完成', value: '99' }
          ]
        }
      ],
      tabName: '6',
      currentPage: 1,
      listData: [],
      triggered: false,
      isload: false,
      isTabDisabled: false,
      btnDisable: false,
      scrollHeight: '0px',
      timeInterval: '',
      serverTime: '',
      loadFinish: 0,
      pageSize: 10,
      status: '',
      filterArr: [],
      filterObj: {
        pageNum: 1,
        pageSize: 10,
        contractStateType: '',
        keyword: '',
        saleContractNo: '',
        unitName: '',
        startCreateDateRange: '',
        endCreateDateRange: '',
        businessDepartmentId: '',
        businessUserCode: '',
        isHasLadingNum: false
      },
      searchVal: '',
      statusList: [],
      initTabName: '6'
    }
  },
  computed: {
    ...mapState({
      tempObject: state => state.tempObject
    })
  },
  onShow () {
    this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - 210
    console.log('onshow+++', this.tempObject)
    if (this.tempObject.fromPage === 'billFilter') {
      const tempObject = this.tempObject
      delete tempObject.fromPage
      this.configVal({ key: 'tempObject', val: tempObject })
      // this.tabName = '6'
      // this.scrollId = 'idx_0'
      // this.swiperCount = 0

      // this.filterObj = {
      //   tstc_no: this.tempObject.no,
      //   employee_code: this.tempObject.employee.id || '',
      //   dept_code: this.tempObject.dept.id || '',
      //   cust_id: Number(this.tempObject.custom.xyCode) || '',
      //   status: this.tempObject.status || '',
      //   deal_time_e: this.tempObject.endDate,
      //   deal_time_s: this.tempObject.startDate
      // }
      // ++++++
      this.filterObj = {
        // tstc_no: this.tempObject.no,
        // employee_code: this.tempObject.employee.id || '',
        // dept_code: this.tempObject.dept.id || '',
        // cust_id: Number(this.tempObject.custom.xyCode) || '',
        // status: this.tempObject.status || '',
        // deal_time_e: this.tempObject.endDate,
        // deal_time_s: this.tempObject.startDate,
        pageNum: 1,
        pageSize: 10,
        contractStateType: '',
        keyword: '',
        saleContractNo: this.tempObject.no,
        unitName: this.tempObject.custom.unitName,
        startCreateDateRange: this.tempObject.startDate,
        endCreateDateRange: this.tempObject.endDate,
        businessDepartmentId: this.tempObject.dept.code,
        businessUserCode: this.tempObject.employee.code,
        isHasLadingNum: false
      }

      // ++++++
      this.currentPage = 1
      this.onRefresh()
    } else if (this.$root.$mp.query.tabName && (this.$root.$mp.query.tabName !== this.initTabName)) {
      this.tabName = this.$root.$mp.query.tabName
      this.initTabName = this.$root.$mp.query.tabName
      const idx = this.billTab.findIndex(item => item.status === this.tabName)
      this.swiperCount = idx
    } else {
      this.onRefresh()
    }
  },
  beforeMount () {
    this.onRefresh()
  },
  mounted () {
    this.$nextTick(() => {
      const me = this
      this.timeInterval = setInterval(() => {
        me.countTime()
        me.serverTime += 1000
      }, 1000)
      if (this.swiperCount > 2) {
        this.scrollId = 'idx_' + (this.swiperCount - 2)
      }
    })
  },
  onUnload () {
    this.billTab = [
      {
        title: '全部',
        status: '',
        data: [],
        isActive: true,
        statusList: [
          { label: '全部', value: '' },
          { label: '待支付', value: '14' },
          { label: '待补款', value: '17' },
          { label: '已付款', value: '15' },
          { label: '待审核', value: '12,20' },
          { label: '待确认', value: '16' },
          { label: '修改中', value: '18,19' },
          { label: '已完成', value: '-1' },
          { label: '已违约', value: '13' }
        ]
      }, {
        title: '待付款',
        status: '01',
        data: [],
        isActive: false,
        statusList: [
          { label: '待支付', value: '14' },
          { label: '待补款', value: '17' }
        ]
      }, {
        title: '已支付待确认',
        status: '04',
        data: [],
        isActive: false,
        statusList: [
          { label: '待审核', value: '12,20' }
        ]
      }, {
        title: '待提货',
        status: '03',
        data: [],
        isActive: false,
        statusList: [
          { label: '全部', value: '' },
          { label: '已付款', value: '15' },
          { label: '待确认', value: '16' }
        ]
      },
      { title: '修改中', status: '06', data: [], isActive: false, statusList: [{ label: '修改中', value: '18,19' }] },
      { title: '已完成', status: '07', data: [], isActive: false, statusList: [{ label: '已违约', value: '13' }] }
    ]
    this.openStatus = false
    this.scrollId = 'idx_0'
    this.initTabName = '6'
    this.tabName = '6'
    this.swiperCount = 0
    this.currentPage = 1
    this.searchVal = ''
    this.filterObj = {}
    this.configVal({ key: 'tempObject', val: {} })
    clearInterval(this.timeInterval)
  },
  onHide () {
    this.btnDisable = false
  },
  methods: {
    ...mapActions(['configVal']),
    openFilter () {
      const statusList = this.billTab[this.swiperCount].statusList
      const tempObject = this.tempObject
      tempObject.statusList = statusList
      this.configVal({ key: 'tempObject', val: tempObject })
      this.jump('/pages/vendor/billFilter/main')
    },
    onRefresh (done) {
      this.currentPage = 1
      this.isload = true
      this.refresher(done)
    },
    searchOrder () {
      this.listData = []
      this.isTabDisabled = true
      // this.swiperCount = 0
      // this.tabName = '6'
      // this.billTab[0].data = []
      this.isload = true
      this.refresher()
    },
    swiperChange (e) {
      const idx = e.mp.detail.current
      this.openStatus = false
      if (idx > 2) {
        this.scrollId = 'idx_' + (idx - 2)
      } else {
        this.scrollId = 'idx_0'
      }
      this.swiperCount = idx
      this.tabName = this.billTab[idx].status
      this.isTabDisabled = true
      this.onRefresh()
    },
    refresher (done) {
      this.loadFinish = 1
      const me = this
      console.log('hahaha+++', this.tabName)
      // let params = {
      //   pageNum: this.currentPage,
      //   pageSize: this.pageSize,
      //   contractStateType: this.tabName
      // }
      this.filterObj.pageNum = this.currentPage
      this.filterObj.pageSize = this.pageSize
      this.filterObj.contractStateType = this.tabName
      let params = this.filterObj
      if (this.searchVal) {
        params.keyword = this.searchVal
      }
      this.httpPost(this.apiList.zf.sellerGetSaleContractPage, params).then(res => {
      // this.httpPost(this.apiList.zf.querySellerContractPage, params).then(res => {
        console.log(res)
        const idx = me.swiperCount
        if (res.success) {
          let arr = res.data
          if (arr.length > 0) {
            this.serverTime = new Date(res.data[0].currentDate.replace(/-/g, '/')).getTime()
            arr.map(item => {
              item.status = this.getStatus(item.xingyunContractStatus)
            })
          }
          if (arr.length === 0 && me.currentPage === 1) {
            me.listData = []
            me.billTab[idx].data = []
            me.isload = false
          } else if (arr.length > 0 && me.currentPage === 1) {
            me.billTab[idx].data = arr
            me.isload = false
          } else if (arr.length > 0 && me.currentPage > 1) {
            me.billTab[idx].data.push(...arr)
            me.isload = false
          } else {
            me.isload = false
            me.currentPage--
            if (me.billTab[idx].data.length >= 10) me.loadFinish = 2
          }
        }
        me.isTabDisabled = false
        if (me.billTab[idx].data.length < 10) me.loadFinish = 3
        me.isload = false
        me.hideLoading()
        // me.$forceUpdate()
        if (done) done()
      }).catch(e => {
        me.hideLoading()
      })
      // this.ironRequest(sellerOrderList.url, params, sellerOrderList.method).then(resp => {
      //   const idx = me.swiperCount
      //   this.serverTime = resp.server_time
      //   if (resp.returncode === '0') {
      //     let arr = resp.list
      //     if (arr.length === 0 && me.currentPage === 1) {
      //       me.listData = []
      //       me.billTab[idx].data = []
      //       me.isload = false
      //     } else if (arr.length > 0 && me.currentPage === 1) {
      //       me.billTab[idx].data = arr
      //       me.isload = false
      //     } else if (arr.length > 0 && me.currentPage > 1) {
      //       me.billTab[idx].data.push(...arr)
      //       me.isload = false
      //     } else {
      //       me.isload = false
      //       me.currentPage--
      //       if (me.billTab[idx].data.length >= 10) me.loadFinish = 2
      //     }
      //   }
      //   me.isTabDisabled = false
      //   if (me.billTab[idx].data.length < 10) me.loadFinish = 3
      //   me.hideLoading()
      //   // me.$forceUpdate()
      //   if (done) done()
      // })
    },
    // refresher (done) {
    //   this.loadFinish = 1
    //   const me = this
    //   const sellerOrderList = this.apiList.xy.sellerOrderList
    //   let params = {
    //     current_page: this.currentPage,
    //     page_size: this.pageSize,
    //     tab_status: this.tabName,
    //     user_id: this.currentUser.user_id
    //   }
    //   Object.assign(params, this.filterObj)
    //   if (this.searchVal) {
    //     params.search = this.searchVal
    //   }
    //   this.ironRequest(sellerOrderList.url, params, sellerOrderList.method).then(resp => {
    //     const idx = me.swiperCount
    //     this.serverTime = resp.server_time
    //     if (resp.returncode === '0') {
    //       let arr = resp.list
    //       if (arr.length === 0 && me.currentPage === 1) {
    //         me.listData = []
    //         me.billTab[idx].data = []
    //         me.isload = false
    //       } else if (arr.length > 0 && me.currentPage === 1) {
    //         me.billTab[idx].data = arr
    //         me.isload = false
    //       } else if (arr.length > 0 && me.currentPage > 1) {
    //         me.billTab[idx].data.push(...arr)
    //         me.isload = false
    //       } else {
    //         me.isload = false
    //         me.currentPage--
    //         if (me.billTab[idx].data.length >= 10) me.loadFinish = 2
    //       }
    //     }
    //     me.isTabDisabled = false
    //     if (me.billTab[idx].data.length < 10) me.loadFinish = 3
    //     me.hideLoading()
    //     // me.$forceUpdate()
    //     if (done) done()
    //   })
    // },
    selectTabs (item, idx) {
      console.log('status', item.status)
      this.tabName = item.status
      this.swiperCount = idx
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
    // 倒计时
    // { id: '01', name: '待支付' },
    // { id: '02', name: '待补款' },
    // { id: '03', name: '已付款' },
    // { id: '04', name: '支付中' },
    // { id: '05', name: '待确认' },
    // { id: '06', name: '修改中' },
    // { id: '07', name: '已完成' },
    // { id: '08', name: '已违约' },
    // { id: '09', name: '已取消' }
    countTime () {
      const idx = this.swiperCount
      const arr = this.billTab[idx].data
      arr.map((item, index) => {
        if (item.status === '待支付' || item.status === '已付款' || item.status === '待确认') {
          const nowTime = this.serverTime
          // const endTimeFormat = item.status === '待制作提单' ? item.end_pack_time.replace(/-/g, '/') : item.end_pay_time.replace(/-/g, '/')
          // const nowTime = item.currentDate
          const endTimeFormat = item.invalidDate
          const endTime = new Date(endTimeFormat.replace(/-/g, '/')).getTime()
          const leftTime = Number(endTime - nowTime)
          let d = 0
          let h = 0
          let m = 0
          let s = 0
          if (leftTime >= 0) {
            // h = Math.floor(leftTime / 1000 / 60 / 60 % 24)
            if (item.status === '已付款') {
              item.overdue = false
              d = Math.floor(leftTime / (24 * 3600 * 1000))
              let leave1 = leftTime % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
              h = Math.floor(leave1 / (3600 * 1000))
              let leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
              m = Math.floor(leave2 / (60 * 1000))
              let leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
              s = Math.round(leave3 / 1000)
              // console.log(d + h + m + s)
              item.timeDown = `${d}天${h}小时${m}分`
            } else {
              h = Math.floor(leftTime / 1000 / 60 / 60)
              m = Math.floor(leftTime / 1000 / 60 % 60)
              s = Math.floor(leftTime / 1000 % 60)
              h = h < 10 ? '0' + h : h
              m = m < 10 ? '0' + m : m
              s = s < 10 ? '0' + s : s
              item.timeDown = `${h}:${m}:${s}`
            }
          } else {
            let overTime = Math.abs(leftTime)
            if (item.status === '已付款') {
              item.overdue = true
              d = Math.floor(overTime / (24 * 3600 * 1000))
              let leave1 = overTime % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
              h = Math.floor(leave1 / (3600 * 1000))
              let leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
              m = Math.floor(leave2 / (60 * 1000))
              let leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
              s = Math.round(leave3 / 1000)
              // console.log(d + h + m + s)
              item.timeDown = `${d}天${h}小时${m}分`
            } else {
              item.status = '已违约'
              h = Math.floor(overTime / 1000 / 60 / 60)
              m = Math.floor(overTime / 1000 / 60 % 60)
              s = Math.floor(overTime / 1000 % 60)
              h = h < 10 ? '0' + h : h
              m = m < 10 ? '0' + m : m
              s = s < 10 ? '0' + s : s
              item.timeDown = `${h}:${m}:${s}`
              // console.log('++++>>>>', this.tabName, item.status)
              if (this.tabName === '01' && item.status === '已违约') {
                // item = null
                this.billTab[this.swiperCount].data.splice(index, 1)
              }
            }
          }
        }
      })
      this.$forceUpdate()
    },
    // countTime () {
    //   const idx = this.swiperCount
    //   const arr = this.billTab[idx].data
    //   arr.map(item => {
    //     if (item.status === 14 || item.status === 15 || item.status === 16) {
    //       const nowTime = this.serverTime
    //       const endTimeFormat = item.status === 15 || item.status === 16 ? item.end_pack_time.replace(/-/g, '/') : item.end_pay_time.replace(/-/g, '/')
    //       const endTime = new Date(endTimeFormat).getTime()
    //       const leftTime = endTime - nowTime
    //       let d = 0
    //       let h = 0
    //       let m = 0
    //       let s = 0
    //       if (leftTime >= 0) {
    //         // h = Math.floor(leftTime / 1000 / 60 / 60 % 24)
    //         if (item.status === 15 || item.status === 16) {
    //           item.overdue = false
    //           d = Math.floor(leftTime / (24 * 3600 * 1000))
    //           let leave1 = leftTime % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
    //           h = Math.floor(leave1 / (3600 * 1000))
    //           let leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
    //           m = Math.floor(leave2 / (60 * 1000))
    //           let leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
    //           s = Math.round(leave3 / 1000)
    //           item.timeDown = `${d}天${h}小时${m}分`
    //         } else {
    //           h = Math.floor(leftTime / 1000 / 60 / 60)
    //           m = Math.floor(leftTime / 1000 / 60 % 60)
    //           s = Math.floor(leftTime / 1000 % 60)
    //         }
    //       } else {
    //         if (item.status === 15 || item.status === 16) {
    //           item.overdue = true
    //           let overTime = Math.abs(leftTime)
    //           d = Math.floor(overTime / (24 * 3600 * 1000))
    //           let leave1 = overTime % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
    //           h = Math.floor(leave1 / (3600 * 1000))
    //           let leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
    //           m = Math.floor(leave2 / (60 * 1000))
    //           let leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
    //           s = Math.round(leave3 / 1000)
    //           item.timeDown = `${d}天${h}小时${m}分`
    //         }
    //       }
    //       if (h + m + s === 0) {
    //         if (item.status === 14) {
    //           item.status = 13
    //         }
    //       } else {
    //         if (item.status === 14) {
    //           h = h < 10 ? '0' + h : h
    //           m = m < 10 ? '0' + m : m
    //           s = s < 10 ? '0' + s : s
    //           item.timeDown = `${h}:${m}:${s}`
    //         }
    //       }
    //     }
    //   })
    //   this.$forceUpdate()
    // },
    loadMore () {
      const me = this
      this.throttle(function () {
        me.currentPage++
        me.refresher()
      }, 300)
    },
    jumpDetail (item) {
      console.log(item.saleContractId)
      this.jump(`/pages/billDetail/main?contractId=${item.saleContractId}`)
    },
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
    jumpModifyDetail (item) {
      if (this.btnDisable) return false
      this.btnDisable = true
      this.jump(`/pages/modifyDetail/main?contractId=${item.saleContractId}&type=${this.tabName}`)
    },
    makeLoad (item) {
      if (this.btnDisable) return false
      this.btnDisable = true
      this.jump(`/pages/vendor/loadMake/main?saleContractId=${item.saleContractId}`)
    },
    payBill (item) {
      if (this.btnDisable) return false
      this.btnDisable = true
      // if (this.tabName === '0') this.logEventGet({ event: 'click_app_myorder_all_pay' })
      // if (this.tabName === '1') this.logEventGet({ event: 'click_app_myorder_needpay_pay' })
      this.jump(`/pages/pay/main?pageType=offlinePay&orderNo=${item.tstc_no}&price=${item.fact_price}`)
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
.tab-content
  overflow hidden
.tab-more
  width 50px
.status-box
  position absolute
  top 0
  left 0
  right 0
  background rgba(0, 0, 0, 0.5)
  z-index 999
  .status-item
    width 30%
    padding 10px
    border-radius 20px
    margin-bottom 10px
    border 1px solid #EEEEEE
</style>
