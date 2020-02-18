<template lang="pug">
div
  nav-bar(title="收支明细", isBack, bgClass="bg-blue text-white")
  .bg-blue.text-white.padding(style="height: 120px")
    div 账户余额
    .margin-top.text-bold.margin-bottom(style="font-size:30px") {{currentUser.account_balance}}
  .bg-white.relative.padding.padding-tb-sm(style="height: 50px")
    .row.text-gray
      .flex-80
        span {{typeLabel}}
        icon.cuIcon-triangledownfill
      .flex-80
        span {{monthLabel}}
        icon.cuIcon-triangleupfill
      .col.text-right 展示近6个月明细
  .padding-top
    template(v-if="isLoad")
      scroll-view(scroll-y, @scrolltolower="loadMore", :style="{height: screenHeight - customBar - 170 +'px'}")
        div 123333
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
      month: 0
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser,
      screenHeight: state => state.screenHeight,
      customBar: state => state.customBar
    })
  },
  beforeMount () {
    this.getMonth()
  },
  onShow () {
    this.currentPage = 0
    this.loadData()
    const height = this.screenHeight - this.customBar - 170 - 15
    console.log('fullheight:>>', this.screenHeight, 'height:>>', height)
  },
  methods: {
    loadMore () {
      console.log('load more data')
    },
    selectKey (item) {
      if (this.isTabDisabled) return false
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
      this.queryParams.current_page = this.currentPage
      this.listData = []
      this.finished = false
      this.activeName = ''
      this.pageHeight = 219
      // this.isLoad = true
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
      if (this.activeName !== '') {
        this.pageHeight = 331
      } else {
        this.pageHeight = 219
      }
    },
    async loadData () {
      try {
        this.isTabDisabled = true
        console.log('this.currentPage', this.currentPage)
        if (this.currentPage === 0) {
          this.isload = false
        }
        const me = this
        // this.$ironLoad.show()
        const data = await this.ironRequest(this.apiList.xy.creditRecordList.url, {
          current_page: this.currentPage,
          page_size: this.pageSize,
          type_status: this.typeStatus,
          number: this.month
        }, this.apiList.xy.creditRecordList.method, this)
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
        if (arr.length === 0 && me.currentPage === 0) {
          me.listData = []
        } else if (arr.length > 0 && me.currentPage === 0) {
          me.listData = list
        } else if (arr.length > 0 && me.currentPage > 0) {
          me.listData.push(...list)
        } else {
          me.currentPage--
        }
        this.isTabDisabled = false
      } catch (e) {
        this.showMsg(e)
      }
    }
  }
}
</script>
