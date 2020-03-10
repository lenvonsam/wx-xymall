<template lang="pug">
div
  nav-bar(title="收支明细", isBack, bgClass="bg-blue text-white")
  .bg-blue.text-white.padding(style="height: 120px")
    div 账户余额
    .margin-top.text-bold.margin-bottom(style="font-size:30px") {{currentUser.account_balance}}
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
    .float-bar(:style="{height: screenHeight - customBar - 120 - 51 + 'px'}", v-if="floatBarShow")
      .bg-white.padding-tb-sm
        .check-btn(v-for="(itm,idx) in tabList", :key="idx", @click="selectKey(itm)", :class="{'active': selectActive == itm.val}") {{itm.label}}
  div(style="padding-top: 15px")
    template(v-if="isLoad")
      template(v-if="listData.length > 0")
        //- scroll-view(scroll-y, @scrolltolower="loadMore", :style="{height: screenHeight - customBar - 185 +'px'}")
        iron-scroll(@scrolltolower="loadMore", :height="screenHeight - customBar - 185", :refresh="true", @onRefresh="onRefresh", :loadFinish="loadFinish")
          .bg-white.padding.border-bottom-line.row(v-for="(item,idx) in listData", :key="idx")
            .col
              div {{item.content}}
              .text-gray.ft-12.margin-top {{item.time}}
            .col.text-right
              .ft-16(:class="{'text-red': item.action == 1, 'text-green': item.action == 0}")            
                span(v-if="item.action == 0") +
                span(v-else) -
                span {{item.price}}
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
        { label: '合同付款', val: 'htfk' },
        { label: '退款', val: 'tk' },
        { label: '充值', val: 'cz' },
        { label: '提现', val: 'tx' }
      ],
      selectActive: '',
      activeName: '',
      listData: [],
      monthList: [],
      tabList: [],
      currentPage: 0,
      typeLabel: '全部',
      monthLabel: '时间',
      typeStatus: '',
      loading: false,
      month: 0,
      floatBarShow: false,
      loadFinish: 0
    }
  },
  computed: {
    ...mapState({
      customBar: state => state.customBar
    })
  },
  onShow () {
    this.whiteStatusBar()
    this.getMonth()
    this.typeLabel = '全部'
    this.monthLabel = '时间'
    this.currentPage = 0
    this.typeStatus = ''
    this.month = 0
    this.activeName = ''
    this.loading = false
    this.isload = false
    this.floatBarShow = false
    this.loadData()
    const height = this.screenHeight - this.customBar - 185
    console.log('fullheight:>>', this.screenHeight, 'height:>>', height)
  },
  methods: {
    loadMore () {
      const me = this
      this.throttle(function () {
        me.currentPage++
        me.loadData()
      }, 300)
    },
    selectKey (item) {
      // if (this.isTabDisabled) return false
      this.selectActive = item.val
      switch (this.activeName) {
        case 'type':
          this.typeStatus = item.val
          this.typeLabel = item.label
          break
        case 'time':
          this.month = item.val
          this.monthLabel = item.label === '全部' ? '时间' : item.label
          break
      }
      this.currentPage = 0
      this.listData = []
      this.activeName = ''
      this.floatBarShow = false
      this.isLoad = false
      this.loadData()
    },
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
    onRefresh (done) {
      this.currentPage = 0
      this.loadData(done)
    },
    async loadData (done) {
      try {
        // this.isTabDisabled = true
        this.showLoading()
        this.loadFinish = 1
        if (this.currentPage === 0) {
          this.isload = false
        }
        if (this.currentPage > 0) this.loading = true
        const me = this
        // this.$ironLoad.show()
        const data = await this.ironRequest(this.apiList.xy.creditRecordList.url, {
          current_page: this.currentPage,
          page_size: this.pageSize,
          type_status: this.typeStatus,
          number: this.month
        }, this.apiList.xy.creditRecordList.method)
        const arr = data.resultlist
        this.isLoad = true
        const list = []
        if (arr.length > 0) {
          arr.map(res => {
            const obj = {
              content: res.type_status,
              time: res.create_time,
              action: res.type_status === '退款' || (res.type_status === '充值' && res.bill_type !== '保证金充值' && res.bill_type !== '远期金额充值') ? 0 : 1,
              price: res.money,
              nowAvlbFund: res.now_avlb_fund === -1 ? '--' : res.now_avlb_fund
            }
            list.push(obj)
          })
        }
        console.log('list', list)
        if (arr.length === 0 && me.currentPage === 0) {
          me.listData = []
        } else if (arr.length > 0 && me.currentPage === 0) {
          me.listData = list
        } else if (arr.length > 0 && me.currentPage > 0) {
          me.listData.push(...list)
        } else {
          me.currentPage--
          if (me.listData.length >= 10) me.loadFinish = 2
        }
        this.loading = false
        if (done) done()
        if (me.listData.length < 10) me.loadFinish = 0
        this.hideLoading()
        // this.isTabDisabled = false
      } catch (e) {
        this.loading = false
        if (done) done()
        this.hideLoading()
        this.showMsg(e)
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
