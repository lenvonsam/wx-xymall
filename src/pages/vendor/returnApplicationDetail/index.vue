<template lang="pug">
div
  nav-bar(title="退货明细", isBack)
  .margin-sm.bg-white.radius
    .solid-bottom.padding-sm(v-for="(item, idx) in listData", :key="idx")
      .row.padding-bottom-xs.justify-between.text-black.text-bold
        span {{item.name}} {{item.standard}}
        .text-blue ¥ {{auditType === '定向' ? item.order_price : item.price}}
      .row.padding-bottom-xs
        .col.row
          span {{item.material}}
        span ({{item.metering_way_str}}) 
      .padding-bottom-xs {{item.amount}}支/{{item.weight}}吨/{{item.money}}元
    .padding-sm.text-black(style="margin-bottom: 100rpx")
      //- .row.justify-between.padding-bottom-xs
        span 合计
        .text-gray {{detailData.amount}}支/{{detailData.weight}}吨/{{detailData.all_price_}}元
      .row.justify-between
        span 吊费
        .text-gray 80.88元
  .s-footer(style="height: 100rpx")  
    .cart-footer
      .col.cart-footer-col.text-right
        span 总重量：88.8吨  总金额：¥6100
      .cart-settle-btn.ft-18 确认   
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      liftPlaceholder: '',
      allChoosed: false,
      isGoodsShow: true,
      isliftShow: false,
      totalGoodsWeight: 0,
      totalGoodsPrice: 0,
      totalPrice: 0,
      totalWeight: 0,
      totalLiftCharge: 0,
      totalCount: 0,
      isTabDisabled: false,
      tabName: '0,2',
      currentPage: 0,
      listData: [],
      isload: false,
      scrollHeight: 0,
      subsNo: '',
      status: '',
      detailData: {}
    }
  },
  computed: {
    ...mapState({
      tempObject: state => state.tempObject
    })
  },
  onUnload () {
    this.currentPage = 0
    this.listData = []
    this.scrollHeight = 0
  },
  onShow () {
    this.subsNo = this.$root.$mp.query.subsNo
    this.status = this.$root.$mp.query.status
    this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - 205
    if (this.$root.$mp.query.tabName) this.tabName = this.$root.$mp.query.tabName
    this.returnGoodsDetail()
  },
  methods: {
    async returnGoodsDetail () {
      try {
        const sellerReturnGoodsAudit = this.apiList.xy.sellerReturnGoodsAudit
        const url = `${sellerReturnGoodsAudit.url}?subs_no=HT20030300010&status=4`
        const data = await this.ironRequest(url, '', sellerReturnGoodsAudit.method)
        if (data.returncode === '0') {
          this.listData = data.list
          this.detailData = data.data
        }
      } catch (err) {
        console.log(err)
        this.showMsg(err)
      }
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
.search-input
  background #F6F6F6
  padding 5px 10px
  border-radius 35px
.search-btn
  padding 10px
.s-footer
  position fixed
  bottom 0
  left 0
  right 0
  background #fff
  z-index 9
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
</style>