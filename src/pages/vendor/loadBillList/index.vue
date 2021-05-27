<template lang="pug">
div
  nav-bar(title="提单管理", isBack)
  .bg-white(:style="{height: '205rpx'}")
    .flex.text-center.nav.bg-white.relative(style="height: 90rpx")
        .tab-line
        .cu-item.flex-sub(v-for="(item,index) in billTab", :class="item.status === tabName?'text-blue cur':''", :key="index", @click="selectTabs(item, index)")
          span {{item.title}}
    .serach.flex.align-center.padding-sm
      .col.search-input.text-gray
        .flex.align-center
          .cuIcon-search
          input.full-width.padding-left-sm(v-model="searchVal", type="text", placeholder="合同号/公司名称", confirm-type="search")
          .close-icon(@click="searchVal = ''", v-if="searchVal")
            .cuIcon-roundclosefill.ft-18
      .search-btn.text-blue(@click="onRefresh") 搜索
      .filter-btn.row(@click="openFilter")
        span 筛选
        .cuIcon-filter
  template(v-if="isload")
    time-line(type="mallist")
  template(v-else)
    template(v-if="listData.length > 0")
      iron-scroll(:swiperIdx="swiperIdx", @scrolltolower="loadMore", heightUnit="rpx", :height="scrollHeight", :refresh="true", @onRefresh="onRefresh", :loadFinish="loadFinish")
        .bill-list(v-for="(item, itemIdx) in listData", :key="itemIdx")
          .bg-white.box
            .padding-sm
              .flex.justify-between.padding-bottom-sm
                .col
                  .flex.align-center.justify-between
                    .col.flex.align-center(@click="item.choosed = !item.choosed", style="padding-top: 5px;")
                      img.choose-icon(src="/static/images/blue_check.png", v-if="item.choosed")
                      img.choose-icon(src="/static/images/btn_ck_n.png", v-else)
                      .ft-16.padding-right-sm.padding-left-sm {{item.saleContractNo}}
                      img.ding-icon.margin-right-xs(src="/static/images/ding.png", v-if="item.sourceType == '01' && item.orgId == 'C00011'")
                      img.dingjin-icon.margin-right-xs(src="/static/images/dj_icon.png", v-if="item.payMethod == '03'")
                      img.dingjin-icon(src="/static/images/baitiao_icon.png", v-if="item.payMethod == '02'")
                    span {{item.orgNameAcronym}}
                .text-gray(v-if="item.status === '已完成' || item.status === '违约' || item.status === '已取消'") {{item.status}}
                .text-red(v-else-if="item.status !== '待补款'") {{item.status}}
              .text-gray
                .flex.justify-between.padding-bottom-xs
                  span {{item.orgName}}
                  .ft-18.text-black ￥{{item.inTaxReceiveMoney}}
                .flex.justify-between.padding-bottom-xs
                  span 共{{item.contractAmount}}支，{{item.weight}}吨
                  // span 吊费：¥{{item.liftingFeeMoney}}
            .solid-top.text-black.ft-15.padding-sm.flex.justify-between
              span {{item.createDate}}
              .bill-btn.round.margin-left-sm( @click.stop="payBill(item)") 制作提单
    .text-center.c-gray.pt-100(v-else)
      empty-image(url="bill_empty.png", className="img-empty")
      .empty-content 您暂时没有相关提单
  .s-footer(v-if="listData.length > 0", style="height: 100rpx")
    .cart-footer.justify-between
      .col.cart-footer-col
        .row.justify-between
          .row.flex-center(@click="choosedAll", style="padding-left: 10px;")
            .flex.flex-center
              img.choose-icon(src="/static/images/blue_check.png", v-if="allChoosed")
              img.choose-icon(src="/static/images/btn_ck_n.png", v-else)
            .padding-xs 全选
          .text-right.flex.justify-end
            span 合计：
            b.text-red ￥{{totalPrice}}
        .text-right.ft-12(style="color:#999;") 已选{{totalCount}}支 ，{{totalWeight}}吨
      .cart-settle-btn.ft-16(@click="goToSettle") 制作提单
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      billTab: [
        { title: '提单制作', status: '1,2', data: [], isActive: true },
        { title: '提单管理', status: '3,4', data: [], isActive: false }
      ],
      isTabDisabled: false,
      tabName: '1,2',
      currentPage: 1,
      listData: [],
      isload: false,
      scrollHeight: 0,
      loadFinish: 0,
      timeInterval: '',
      serverTime: '',
      searchVal: '',
      pageSize: 10,
      totalPrice: 0,
      totalWeight: 0,
      totalLiftCharge: 0,
      totalCount: 0,
      allChoosed: false
    }
  },
  computed: {
    ...mapState({
      tempObject: state => state.tempObject,
      bottomBarHeight: state => state.bottomBarHeight,
      screenHeight: state => state.screenHeight,
      customBar: state => state.customBar
    })
  },
  watch: {
    listData: {
      handler (newVal, oldVal) {
        // 监听已选物资的变化
        let filterArray = newVal.filter(item => {
          item.countWeight = item.weight
          return item.choosed === true
        })
        // this.totalCount = filterArray.length
        // this.allChoosed = this.totalCount === newVal.length
        this.allChoosed = filterArray.length === newVal.length
        this.totalPrice = 0
        this.totalWeight = 0
        this.totalLiftCharge = 0
        let totalCount = 0
        if (filterArray.length > 0) {
          filterArray.map(itm => {
            totalCount += itm.contractAmount
            this.totalPrice += itm.inTaxReceiveMoney
            this.totalWeight += itm.weight
          })
          this.totalPrice = this.$toFixed(Number(this.totalPrice), 2)
          this.totalWeight = this.$toFixed(Number(this.totalWeight), 3)
        }
        this.totalCount = totalCount
      },
      deep: true
    }
  },
  onShareAppMessage (e) {
    return {
      title: '报价清单',
      path: '/pages/vendor/quotation/main?pageType=share&&qutId=' + e.target.dataset.item.id
    }
  },
  onUnload () {
    this.tabName = '1,2'
    this.currentPage = 1
    this.listData = []
    this.finished = true
    this.isload = false
    this.scrollHeight = 0
    this.loadFinish = 0
    clearInterval(this.timeInterval)
  },
  onShow () {
    this.listData = []
    this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - this.getRpx(this.bottomBarHeight) - 210
    // this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - 205
    // if (this.$root.$mp.query.tabName) this.tabName = this.$root.$mp.query.tabName
    this.onRefresh()
  },
  // mounted () {
  //   this.$nextTick(() => {
  //     const me = this
  //     this.timeInterval = setInterval(() => {
  //       me.countTime()
  //       me.serverTime += 1000
  //     }, 1000)
  //   })
  // },
  methods: {
    searchOrder () {
      const reg = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi
      if (reg.test(this.searchVal)) {
        this.showMsg('请输入单号')
        return false
      }
      this.listData = []
      this.isTabDisabled = true
      this.isload = true
      this.refresher()
    },
    payBill (item) {
      console.log(item)
      this.jump(`/pages/vendor/loadMake/main?saleContractId=` + item.saleContractId)
    },
    openFilter () {
      // const statusList = [{ label: '全部', value: '' }]
      // Object.keys(this.auditType).forEach(key => {
      //   const obj = { label: this.auditType[key], value: key }
      //   statusList.push(obj)
      // })
      // const tempObject = this.tempObject
      // tempObject.fromPage = 'pendingReview'
      // tempObject.statusList = statusList
      // this.configVal({ key: 'tempObject', val: tempObject })
      this.jump('/pages/vendor/loadFilter/main')
    },
    goToSettle () {
      this.jump(`/pages/vendor/loadMake/main`)
    },
    async copyQuotation (item) {
      try {
        const copyQuotation = this.apiList.xy.copyQuotation
        const params = {
          qut_id: item.id,
          user_id: this.currentUser.user_id
        }
        const data = await this.ironRequest(copyQuotation.url, params, copyQuotation.method)
        if (data.returncode === '0') {
          this.showMsg(data.errormsg)
        }
      } catch (err) {
        this.showMsg(err || '网络错误')
      }
    },
    onRefresh (done) {
      this.currentPage = 1
      this.loadData(done)
    },
    countTime () {
      if (this.tabName === '1,2') {
        const arr = this.listData
        arr.map(item => {
          const nowTime = this.serverTime
          const endTimeFormat = item.end_time.replace(/-/g, '/')
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
          // if (h + m + s === 0) {
          //   this.onRefresh()
          // } else {
          //   h = h < 10 ? '0' + h : h
          //   m = m < 10 ? '0' + m : m
          //   s = s < 10 ? '0' + s : s
          //   item.timeDown = `${h}:${m}:${s}`
          // }
          h = h < 10 ? '0' + h : h
          m = m < 10 ? '0' + m : m
          s = s < 10 ? '0' + s : s
          item.timeDown = `${h}:${m}:${s}`
        })
        this.$forceUpdate()
      }
    },
    selectTabs (item) {
      this.tabName = item.status
      this.listData = []
      this.isTabDisabled = true
      this.onRefresh()
    },
    choosedAll () {
      this.allChoosed = !this.allChoosed
      if (this.allChoosed) {
        this.listData.map(itm => {
          itm.choosed = true
        })
      } else {
        this.listData.map(itm => {
          itm.choosed = false
        })
      }
    },
    loadData (done) {
      this.loadFinish = 1
      if (this.currentPage === 1) {
        this.isload = true
      } else {
        this.isload = false
      }
      const me = this
      let params = {}
      console.log('fromPage+++', this.tempObject.fromPage)
      if (this.tempObject.fromPage === 'loadFilter') {
        params = {
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
          isHasLadingNum: true
        }
      } else {
        params = {
          pageNum: 1,
          pageSize: 10,
          contractStateType: '',
          keyword: '',
          saleContractNo: this.searchVal,
          unitName: '',
          startCreateDateRange: '',
          endCreateDateRange: '',
          businessDepartmentId: '',
          businessUserCode: '',
          isHasLadingNum: true
        }
      }
      this.httpPost(this.apiList.zf.sellerGetSaleContractPage, params).then(res => {
        console.log(res)
        if (res.success) {
          let arr = res.data
          if (arr.length > 0) {
            arr.forEach(item => {
              item.choosed = false
              if (item.orgName === '江苏智恒达机械科技有限公司') {
                item.orgNameAcronym = '智恒达'
              } else if (item.orgName === '江苏智恒达型云网络科技有限公司') {
                item.orgNameAcronym = '型云'
              } else if (item.orgName === '江苏岳洋通金属加工有限公司') {
                item.orgNameAcronym = '岳阳通'
              } else {
                item.orgNameAcronym = ''
              }
            })
          }
          console.log(arr)
          if (arr.length === 0 && me.currentPage === 1) {
            me.listData = []
            me.isload = false
          } else if (arr.length > 0 && me.currentPage === 1) {
            me.listData = arr
            me.isload = false
          } else if (arr.length > 0 && me.currentPage > 1) {
            arr.map(item => {
              me.listData.push(item)
            })
          } else {
            if (me.listData.length >= 10) me.loadFinish = 2
            me.currentPage--
          }
        }
        this.isTabDisabled = false
        if (this.listData.length < 10) this.loadFinish = 3
      })
      if (done) done()
    },
    // loadData (done) {
    //   this.loadFinish = 1
    //   if (this.currentPage === 0) {
    //     this.isload = true
    //   } else {
    //     this.isload = false
    //   }
    //   const quotationList = this.apiList.xy.quotationList
    //   // const url = quotationList.url + '?status=' + this.tabName + '&search=' + this.searchVal + '&user_id=' + this.currentUser.user_id + '&current_page=' + this.currentPage + '&page_size=' + this.pageSize
    //   const me = this
    //   const params = {
    //     status: this.tabName,
    //     search: this.searchVal,
    //     user_id: this.currentUser.user_id,
    //     current_page: this.currentPage,
    //     page_size: this.pageSize
    //   }
    //   this.ironRequest(quotationList.url, params, quotationList.method).then(resp => {
    //     this.serverTime = resp.server_time
    //     if (resp && resp.returncode === '0') {
    //       let arr = resp.list
    //       if (arr.length === 0 && me.currentPage === 0) {
    //         me.listData = []
    //         me.isload = false
    //       } else if (arr.length > 0 && me.currentPage === 0) {
    //         me.listData = arr
    //         me.isload = false
    //       } else if (arr.length > 0 && me.currentPage > 0) {
    //         arr.map(item => {
    //           me.listData.push(item)
    //         })
    //       } else {
    //         if (me.listData.length >= 10) me.loadFinish = 2
    //         me.currentPage--
    //       }
    //     }
    //     this.isTabDisabled = false
    //     if (this.listData.length < 10) this.loadFinish = 3
    //   })
    //   if (done) done()
    // },
    loadMore () {
      const me = this
      this.throttle(function () {
        me.currentPage++
        this.isTabDisabled = true
        me.loadData()
      }, 300)
    }
  }
}
</script>
<style lang="stylus" scoped>
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
    z-index 99
.search-input
  background #F6F6F6
  padding 5px 10px
  border-radius 35px
.search-btn
  padding 10px
button.share-btn
  line-height inherit
  background-color #fff
button.share-btn::after
  display none

.cart-footer
  flex 5
  min-height 50px
  background #fff
  display flex
  // color $mainBlack
  .cart-footer-col
    flex-direction column
    align-items center
    align-self center
    padding-right 8px
    flex-basis 28%
  .cart-settle-btn
    display flex
    width 200rpx
    background #F95353
    letter-spacing 2px
    align-items center
    color #fff
    justify-content center
.count-step .num input
  color #333 !important
.choose-icon
  width 20px
  height 20px
.s-content-wrap
  // position fixed
  // left 0
  // right 0
  // .scroll-view
  // overflow auto
  background-color #F1F1F1
.s-footer
  position fixed
  bottom 0
  left 0
  right 0
  background #fff
  z-index 9
radio.radio[checked]::after
  content ''
  background-color #fff
  display block
  position absolute
  width 0px
  height 0px
  z-index 3
  top 0
  left 0
  right 0
  bottom 0
  margin auto
  border-radius 100%
  border 6px solid #fff !important
</style>
