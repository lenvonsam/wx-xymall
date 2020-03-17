<template lang="pug">
div
  nav-bar(title="退货明细", isBack)
  .margin-sm.bg-white.radius
    .solid-bottom.padding-sm(v-for="(item, idx) in listData", :key="idx")
      .row.padding-bottom-xs.justify-between.text-black.text-bold
        span {{item.name}} {{item.standard}}
        .text-blue ¥ {{auditType === '定向' ? item.order_price : item.price}}
      .text-gray
        .row.padding-bottom-xs
          .col.row
            span {{item.material}}
          span ({{item.metering_way_str}}) 
        .padding-bottom-xs {{item.amount}}支/{{item.weight}}吨/{{item.money}}元
    .padding-sm.text-black(style="margin-bottom: 100rpx")
      .row.justify-between.padding-bottom-xs
        span 合计
        .text-gray {{totalCount}}支/{{totalWeight}}吨/{{totalGoodsPrice}}元
      .row.justify-between.padding-bottom-xs(v-if="totalLiftCharge")
        span 吊费
        .text-gray {{totalLiftCharge}}元
      .row.justify-between.padding-bottom-xs
        span 总计
        .text-gray {{totalPrice}}元  
      .row.justify-between.padding-bottom-xs(v-if="tempObject.params.return_reason")
        span 退货原因
        .text-gray {{tempObject.params.return_reason}}
      .row.justify-between.padding-bottom-xs(v-if="tempObject.params.return_remark")
        span 具体原因描述
        .text-gray {{tempObject.params.return_remark}}  
  .s-footer(style="height: 100rpx")  
    .cart-footer
      .col.cart-footer-col.text-right
        span 总重量：{{totalGoodsWeight}}吨  总金额：¥{{totalPrice}}
      .cart-settle-btn.ft-18(@click="returnGoods") 确认   
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
    this.getGoodsDetail()
  },
  methods: {
    getGoodsDetail () {
      if (this.subsNo) {
        this.returnGoodsDetail()
        return false
      }
      const tempObject = this.tempObject
      const resList = tempObject.list
      this.totalCount = 0
      resList.map(item => {
        item.name = item.goods_name
        item.standard = item.stander
        item.metering_way_str = item.metering_way === 1 ? '磅计' : '理计'
        item.amount = item.count
        item.weight = item.countWeight
        item.money = this.$toFixed(Number(item.countWeight * item.price), 2)
        this.totalCount += Number(item.count)
      })
      this.listData = resList
      this.totalGoodsWeight = tempObject.totalGoodsWeight
      this.totalGoodsPrice = tempObject.totalGoodsPrice
      this.totalPrice = tempObject.totalPrice
      this.totalWeight = tempObject.totalWeight
      this.totalLiftCharge = tempObject.totalLiftCharge
    },
    async returnGoods () {
      try {
        const returnGoods = this.apiList.xy.returnGoods
        const data = await this.ironRequest(returnGoods.url, this.tempObject.params, returnGoods.method)
        if (data.returncode === '0') {
          this.showMsg(data.errormsg)
          const me = this
          setTimeout(() => {
            me.back(2)
          }, 1000)
        }
      } catch (err) {
        console.log(err)
      }
    },
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