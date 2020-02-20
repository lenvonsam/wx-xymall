<template lang="pug">
div
  nav-bar(title="我的提单", isBack)
  .head.bg-white(:style="{top: customBar + 'px'}")
    .serach.flex.align-center.padding-sm
      .col.search-input.text-gray
        .flex.align-center
          .cuIcon-search
          input.full-width.padding-left-sm(v-model="search", type="text", placeholder="品名/提单号/车牌号")
      .search-btn.text-blue.padding-left-sm(@click="searchOrder") 搜索
    scroll-view.nav(scroll-x)
      .flex.text-center
        .cu-item.flex-sub(v-for="(item,index) in billTab", :class="item.status === tabName?'text-blue cur':''", :key="index", @click="selectTabs(item, index)")
          span {{item.title}}
  swiper.bill-content(@change="swiperChange", :current="swiperCount", :style="{height: screenHeight - 186 + 'px'}")
    swiper-item(v-for="(tabItem, idx) in billTab.length", :key="idx")
      //- scroll-view(scroll-y, :refresher-triggered="triggered", :refresher-enabled="true", @refresherrefresh="refresher", @scrolltolower="loadMore", :style="{height: screenHeight - 186 +'px'}")
      template(v-if="isload")
        time-line(type="mallist")
      template(v-else)
        template(v-if="billTab[idx].data.length > 0")
          scroll-view(scroll-y, @scrolltolower="loadMore", :style="{height: screenHeight - 186 +'px'}")
            lab-bill-item(v-for="(item,itemIdx) in billTab[idx].data", :key="itemIdx", :ladObject="item", :cb="labObjectCb")
            .text-center.c-gray.padding(v-if="finished && billTab[idx].data.length > 8") 加载完成
        .text-center.text-gray.pt-100(v-else)
          empty-image(url="bill_empty.png", className="img-empty")
          .empty-content 您暂时没有相关提单
</template>
<script>
import labBillItem from '@/components/LadBillItem.vue'
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
      tabName: '-2',
      currentPage: 0,
      finished: true,
      isload: false,
      tdNo: '',
      carNo: '',
      startDate: '',
      endDate: '',
      listData: [],
      btnDisable: false,
      search: ''
    }
  },
  components: {
    labBillItem
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser,
      pageSize: state => state.pageSize,
      tempObject: state => state.tempObject,
      screenHeight: state => state.screenHeight,
      isLogin: state => state.user.isLogin
    })
  },
  beforeMount () {
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
      this.listData = []
      this.loadData()
    },
    searchOrder () {
      const idx = this.swiperCount
      this.billTab[idx].data = []
      this.currentPage = 0
      this.finished = true
      this.listData = []
      this.loadData()
      // this.swiperCount = 0
    },
    labObjectCb (obj, type) {
      const me = this
      if (type === 'cancel') {
        // 提单待出库取消
        this.confirm({ content: '您确定要取消提单吗？' }).then(() => {
          me.ironRequest('cancelTdOrder.shtml', { user_id: me.currentUser.user_id, td_no: obj.no }, 'post', me).then(resp => {
            if (resp && resp.returncode === '0') {
              me.showMsg('取消成功')
              me.currentPage = 0
              me.listData = []
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
          this.ironRequest('confirmReceipt.shtml', { user_id: this.currentUser.user_id, order_id: obj.id }, 'post', this).then(resp => {
            if (resp && resp.returncode === '0') {
              me.showMsg('确认成功')
              me.btnDisable = false
              me.currentPage = 0
              me.listData = []
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
        if (this.tabName === '-2') this.statisticRequest({ event: 'click_app_mylad_all_pay' }, this)
        if (this.tabName === '4') this.statisticRequest({ event: 'click_app_mylad_needpay_pay' }, this)
        // 提单支付
        this.jump(`/pages/pay/main?pageType=ladPay&orderNo=${obj.no}&price=${obj.pay_price}&contractNo=${obj.contract_no}`)
      }
    },
    loadMore () {
      this.currentPage++
      this.loadData()
    },
    loadData () {
      const me = this
      if (this.currentPage === 0) {
        this.isload = true
      } else {
        this.isload = false
      }
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
      this.ironRequest('orderLadList.shtml', body, 'post', this).then(resp => {
        if (resp && resp.returncode === '0') {
          const idx = me.swiperCount
          let arr = resp.order_lads
          this.isload = false
          if (arr.length === 0 && this.currentPage === 0) {
            me.listData = []
            me.billTab[idx].data = []
            me.finished = true
          } else if (arr.length > 0 && this.currentPage === 0) {
            me.listData = arr
            me.billTab[idx].data = arr
            if (arr.length > 8) me.finished = false
          } else if (arr.length > 0 && this.currentPage > 0) {
            arr.map(itm => {
              me.listData.push(itm)
              me.billTab[idx].data.push(itm)
            })
            me.finished = false
          } else {
            me.finished = true
            me.currentPage--
          }
        } else {
          this.showMsg(resp === undefined ? '网络异常' : resp.errormsg)
          this.currentPage--
          this.finished = true
          this.isload = true
        }
      }).catch(err => {
        me.showMsg(err || '网络异常')
        this.isload = true
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