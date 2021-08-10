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
        .padding-top-sm
          .padding-sm.bg-white.margin-bottom-sm(@click="jumpModifyDetail(item)", v-for="(item, itemIdx) in listData", :key="itemIdx")
            .flex.align-center
              .ft-16.padding-right-sm {{item.saleContractNo}}
              img.ding-icon(src="/static/images/ding.png", v-if="item.payMethod == '02'")
            .flex.justify-between.text-gray.align-center.margin-top-sm
              .col.text-content
                p {{item.orgName}}
                p 共{{item.contractAmount}}支，{{item.estimatedTonnage}}吨
                p 吊费：¥{{item.liftingFeeMoney}}
              .card-right
                .ft-16.padding-bottom-xs.text-bold.text-black ￥{{item.inTaxReceiveMoney}}
                  // .text-red.text-right(v-if="item.status === 18") 修改中
                  .bill-btn.round(style="width: 200rpx", v-if="tabName == '1'") 申请修改
                  .bill-btn.round(style="width: 200rpx", v-else-if="tabName == '2' && item.auditStatus !== '20'") 去确认
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
      currentPage: 1,
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
      loadFinish: 0,
      queryAObj: {
        pageSize: 10,
        pageNum: 1
      },
      queryBObj: {
        pageSize: 10,
        pageNum: 1,
        contractStateType: '03',
        xingyunContractStatus: ''
      },
      postUrl: '',
      idx: ''
    }
  },
  computed: {
    ...mapState({
      tempObject: state => state.tempObject,
      contractStatus: state => state.contractStatus
    })
  },
  onUnload () {
    this.swiperCount = 0
    this.tabName = '1'
    this.currentPage = 1
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
    this.currentPage = 1
    this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - 160
    if (this.$root.$mp.query.tabName) this.tabName = this.$root.$mpd.query.tabName
    this.loadData()
  },
  methods: {
    onRefresh (done) {
      this.currentPage = 1
      this.loadData(done)
    },
    // 切换tab
    selectTabs (item) {
      this.tabName = item.status
      this.currentPage = 1
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
    // 获取合同列表
    loadData (done) {
      this.loadFinish = 1
      const self = this
      let queryObj = {}
      if (this.tabName === '1') {
        self.queryAObj.pageNum = this.currentPage
        queryObj = self.queryAObj
        this.postUrl = this.apiList.zf.queryAppletContractPage
        this.idx = 0
      } else {
        self.queryBObj.pageNum = this.currentPage
        queryObj = self.queryBObj
        this.postUrl = this.apiList.zf.contractList
        this.idx = 1
      }
      self.httpPost(this.postUrl, queryObj).then(res => {
        self.billTab[self.idx].data = []
        console.log('aaaaa')
        // this.serverTime = new Date(res.data[0].currentDate.replace(/-/g, '/')).getTime()
        // console.log(this.serverTime)
        let arr = res.data
        console.log('++++++', arr)
        if (arr.length > 0 && self.currentPage === 1) {
          const list = []
          arr.map(item => {
            item.choosed = false
            item.status = self.contractStatus.find(c => {
              return c.id === item.xingyunContractStatus
            }).name
            list.push(item)
          })
          console.log(list)
          self.billTab[self.idx].data = list
          self.listData = list
          self.isLoad = false
          console.log('哈哈哈哈哈+++', this.listData)
        } else if (arr.length === 0 && self.currentPage === 1) {
          self.listData = []
          this.billTab[self.idx].data = []
          self.isload = false
        }
        self.isTabDisabled = false
        if (self.billTab[self.idx].data.length < 10) {
          self.loadFinish = 3
        }
        if (done) done()
      })
    },
    // loadData (done) {
    //   this.loadFinish = 1
    //   if (this.currentPage === 0) {
    //     this.isload = true
    //   } else {
    //     this.isload = false
    //   }
    //   const body = {
    //     user_id: this.currentUser.user_id,
    //     status_flag: this.tabName,
    //     current_page: this.currentPage,
    //     page_size: this.pageSize
    //   }
    //   console.log(body)
    //   const me = this
    //   this.ironRequest('contract_edit_app.shtml', body, 'post').then(resp => {
    //     if (resp && resp.returncode === '0') {
    //       let arr = resp.notices
    //       if (arr.length === 0 && me.currentPage === 0) {
    //         me.listData = []
    //         me.isload = false
    //       } else if (arr.length > 0 && me.currentPage === 0) {
    //         arr.map(itm => {
    //           itm.choosed = false
    //         })
    //         me.listData = arr
    //         me.isload = false
    //       } else if (arr.length > 0 && me.currentPage > 0) {
    //         arr.map(item => {
    //           item.choosed = false
    //           me.listData.push(item)
    //         })
    //       } else {
    //         if (me.listData.length >= 10) me.loadFinish = 2
    //         me.currentPage--
    //       }
    //     } else {
    //       me.msgShow(resp === undefined ? '网络异常' : resp.errormsg)
    //       me.isload = false
    //     }
    //     this.isTabDisabled = false
    //     if (this.listData.length < 10) this.loadFinish = 3
    //   })
    //   if (done) done()
    // },
    // 上拉加载
    loadMore () {
      const me = this
      this.throttle(function () {
        me.currentPage++
        this.isTabDisabled = true
        me.loadData()
      }, 300)
    },
    // 跳转修改合同
    jumpModifyDetail (item) {
      if (this.tabName === '1') this.logEventGet({ event: 'click_app_editorder_apply', type: '01' })
      this.jump(`/pages/modifyDetail/main?contractId=${item.saleContractId}&type=${this.tabName}`)
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
