<template lang="pug">
div
  nav-bar(title="收支明细", isBack, bgClass="bg-blue text-white")
  .bg-blue.text-white.padding(style="height: 120px")
    div 账户余额
    .margin-top.text-bold.margin-bottom(style="font-size:30px") {{accountBalance}}
  .bg-white.relative.padding.padding-tb-sm(style="height: 50px")
    .row.text-gray
      .flex-80(@click="checkTab('type')")
        span {{typeLabel}}
        icon.cuIcon-triangleupfill.text-blue(v-if="activeName === 'type'")
        icon.cuIcon-triangledownfill(v-else)
      .flex-80(@click="checkTab('time')")
        span {{monthLabel}}
        icon.cuIcon-triangleupfill.text-blue(v-if="activeName === 'time'")
        icon.cuIcon-triangledownfill(v-else)
      .col.text-right 展示近6个月明细
    .float-bar(:style="{height: screenHeight - customBar - 120 - 51 + 'px'}", v-if="floatBarShow", @click="checkTab(activeName)")
      .bg-white.padding-tb-sm(@click.stop="")
        .check-btn(v-for="(itm,idx) in tabList", :key="idx", @click.stop="selectKey(itm)", :class="{'active': selectActive == itm.val}") {{itm.label}}
  div(style="padding-top: 15px")
    template(v-if="isLoad")
      template(v-if="listData.length > 0")
        //- scroll-view(scroll-y, @scrolltolower="loadMore", :style="{height: screenHeight - customBar - 185 +'px'}")
        iron-scroll(@scrolltolower="loadMore", :height="screenHeight - customBar - 185", :refresh="true", @onRefresh="onRefresh", :loadFinish="loadFinish")
          .bg-white.padding.border-bottom-line.row(v-for="(item,idx) in listData", :key="idx")
            .col
              div {{item.content}}
              .text-gray.ft-12.margin-top {{item.ctime}}
            .col.text-right
              .ft-16(v-if="item.flowMoney", :class="{'text-red': item.flowType == 2, 'text-green': item.flowType == 1}")
                span(v-if="item.flowType == 1") {{'+' + item.flowMoney}}
                span(v-else) {{item.flowMoney}}
              .text-gray.margin-top(v-if="item.nowAvlbFund") {{item.nowAvlbFund}}
          //- .padding.text-gray.ft-13.text-center(v-if="loading") 努力加载中...
      .text-center.padding-top-xl(v-else)
        empty-image(url="bill_empty.png", className="img-empty")
    time-line(type="mallist", v-else)
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      isLoad: false,
      typeStatusList: [
        { label: '全部', val: '' },
        { label: '合同付款', val: 'EXSHT0002' },
        { label: '退款', val: 'EXSHT0009' },
        { label: '充值', val: 'ECWSK0001' },
        { label: '提现', val: 'ECWSK0016' }
      ],
      selectActive: '',
      activeName: '',
      listData: [],
      monthList: [],
      tabList: [],
      currentPage: 1,
      typeLabel: '全部',
      monthLabel: '时间',
      typeStatus: '',
      loading: false,
      month: 0,
      floatBarShow: false,
      loadFinish: 0,
      sellerId: '',
      accountBalance: '',
      propqueryObj: {
        pageNum: 1,
        pageSize: 10,
        busiEventDateS: '',
        busiEventDateE: '',
        busiEventType: '',
        saleContractNo: ''
      }
    }
  },
  computed: {
    ...mapState({
      customBar: state => state.customBar
    })
  },
  onUnload () {
    this.listData = []
    this.activeName = ''
    this.sellerId = ''
    this.accountBalance = ''
    this.month = 0
    this.loadFinish = 0
  },
  onShow () {
    if (this.$root.$mp.query.sellerId) this.sellerId = this.$root.$mp.query.sellerId
    this.whiteStatusBar()
    // this.getMonth()
    this.getLastSixMon()
    this.typeLabel = '全部'
    this.monthLabel = '时间'
    this.currentPage = 1
    this.typeStatus = ''
    this.month = 0
    this.activeName = ''
    this.loading = false
    this.isload = false
    this.floatBarShow = false
    const height = this.screenHeight - this.customBar - 185
    console.log('fullheight:>>', this.screenHeight, 'height:>>', height)
    this.getAccountBalance()
    this.loadData()
  },
  methods: {
    // 获取最近六个月
    getLastSixMon () {
      var data = new Date()
      // 获取年
      var year = data.getFullYear()
      // 获取月
      var mon = data.getMonth() + 1
      var arry = [{ label: '全部', val: 0 }]
      for (var i = 0; i < 7; i++) {
        if (mon <= 0) {
          year = year - 1
          mon = mon + 12
        }
        if (mon < 10) {
          mon = '0' + mon
        }
        arry.push({
          label: year + '-' + mon,
          val: year + '-' + mon,
          year: year,
          mon: mon
        })
        mon = mon - 1
      }
      this.monthList = arry
    },
    // 获取某月的第一天和最后一天的日期
    getFirstAndLastDay (year, month) {
      var newYear = year // 取当前的年份
      var newMonth = month++ // 取下一个月的第一天，方便计算（最后一天不固定）
      if (month > 12) {
        newMonth -= 12 // 月份减
        newYear++ // 年份增
      }
      var newDate = new Date(newYear, newMonth, 1) // 取当年当月中的第一天
      if (month < 10) {
        month = '0' + (month - 1)
      } else {
        month = month - 1
      }
      var firstMounthDay = `${year}-${month}-01`
      var lastDay = (new Date(newDate.getTime() - 1000 * 60 * 60 * 24)).getDate()
      if (lastDay < 10) {
        lastDay = '0' + lastDay
      }
      var lastMounthDay = `${year}-${month}-${lastDay}`
      return {
        firstMounthDay,
        lastMounthDay
      }
    },
    // 获取月份
    getMonth () {
      let nowMonth = new Date().getMonth() + 1
      let monthList = [{ label: '全部', val: 0 }, { label: '本月', val: 1 }]
      const month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      let nowMonthList = []
      const idx = month.indexOf(nowMonth)
      if ((6 - nowMonth) < 0) {
        nowMonthList = month.slice(idx - 6, idx).reverse()
      } else {
        const montha = month.slice(0, idx).reverse()
        const monthb = month.slice(idx - 6).reverse()
        nowMonthList.push(...montha, ...monthb)
      }

      for (let i = 0; i < 6; i++) {
        monthList.push({ label: nowMonthList[i] + '月', val: i + 2 })
      }
      this.monthList = monthList
    },
    // 切换单据类型或时间tab
    checkTab (flag) {
      if (flag === 'type') {
        this.tabList = this.typeStatusList
        this.selectActive = this.typeStatus
      } else {
        this.tabList = this.monthList
        this.selectActive = this.month
      }
      this.activeName = flag === this.activeName ? '' : flag
      if (this.activeName === '') {
        this.floatBarShow = false
      } else {
        this.floatBarShow = true
      }
    },
    // 选择具体的单据类型或月份
    selectKey (item) {
      // if (this.isTabDisabled) return false
      this.selectActive = item.val
      switch (this.activeName) {
        case 'type':
          this.propqueryObj.busiEventType = item.val
          this.typeLabel = item.label
          break
        case 'time':
          let firstAndLastDay = this.getFirstAndLastDay(item.year, item.mon)
          this.propqueryObj.busiEventDateS = firstAndLastDay.firstMounthDay
          this.propqueryObj.busiEventDateE = firstAndLastDay.lastMounthDay
          this.monthLabel = item.label === '全部' ? '时间' : item.label
          break
      }
      this.currentPage = 1
      this.listData = []
      this.activeName = ''
      this.floatBarShow = false
      this.isLoad = false
      this.loadData()
    },
    // 下拉刷新
    onRefresh (done) {
      this.currentPage = 1
      this.loadData(done)
    },
    // 上拉加载
    loadMore () {
      const me = this
      this.throttle(function () {
        me.currentPage++
        me.loadData()
      }, 300)
    },
    // 获取账户余额
    getAccountBalance () {
      this.httpGet(this.apiList.zf.getUnitMoney)
        .then((res) => {
          console.log(res)
          this.accountBalance = res.data
        })
        .catch((e) => {
          console.log(e)
          this.msgShow({ msg: e.message })
        })
    },
    // 加载数据
    async loadData (done) {
      console.log('测试+++++++++')
      try {
        this.showLoading()
        this.loadFinish = 1
        if (this.currentPage === 1) {
          this.isload = false
        }
        if (this.currentPage > 1) this.loading = true
        const me = this
        // let creditRecordList = this.apiList.xy.creditRecordList
        // let params = `current_page=${this.currentPage}&page_size=${this.pageSize}&type_status=${this.typeStatus}&number=${this.month}&user_id=${this.currentUser.user_id}`
        // if (this.sellerId) {
        //   creditRecordList = this.apiList.xy.sellerCreditRecordList
        //   params += `&cust_no=${this.sellerId}`
        // }
        // const url = `${creditRecordList.url}?${params}`
        // const data = await this.ironRequest(url, '', creditRecordList.method)
        this.propqueryObj.pageNum = this.currentPage
        let result = await this.httpPost(this.apiList.zf.searchInAndOutDetail, this.propqueryObj)
        console.log('res', result)
        // this.accountBalance = data.balance
        const arr = result.data
        this.isLoad = true
        const list = []
        if (arr.length > 0) {
          arr.map(res => {
            const obj = {
              content: res.paymentType,
              ctime: res.createDate,
              // action: res.type_status === '退款' || (res.type_status === '充值' && res.bill_type !== '保证金充值' && res.bill_type !== '远期金额充值') ? 0 : 1,
              flowMoney: res.flowMoney,
              nowAvlbFund: res.balanceMoney === -1 ? '--' : res.balanceMoney,
              flowType: res.flowType
            }
            list.push(obj)
          })
        }
        console.log('list', list)
        if (arr.length === 0 && me.currentPage === 1) {
          me.listData = []
        } else if (arr.length > 0 && me.currentPage === 1) {
          me.listData = list
        } else if (arr.length > 0 && me.currentPage > 1) {
          me.listData.push(...list)
        } else {
          me.currentPage--
          if (me.listData.length >= 10) me.loadFinish = 2
        }
        this.loading = false
        if (done) done()
        if (me.listData.length < 10) me.loadFinish = 3
        this.hideLoading()
        // this.isTabDisabled = false
      } catch (e) {
        this.loading = false
        if (done) done()
        this.hideLoading()
        this.showMsg(e.message)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.float-bar
  position absolute
  top 51px
  left 0
  right 0
  z-index 10
  background rgba(0, 0, 0, 0.3)
.check-btn
  background #ffffff
  text-align center
  margin 0 10px 10px
  border-radius 15px
  border 1px solid #eee
  color #888
  width 100px
  height 35px
  padding-top 8px
  display inline-block
  &.active
    border 1px solid #2485FF
    color #2485FF
</style>
