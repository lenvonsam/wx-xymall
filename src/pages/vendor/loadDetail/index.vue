<template lang="pug">
  .s-layout(@click="clearPicker")
    nav-bar(title="制作提单", isBack)
    template(v-if="!isLoad")
      time-line(type="mallist")
    template(v-else)
      .s-content-wrap
        .s-content
          .head(:style="{height: '200rpx', top: (selectDialogTop - 200)+'rpx'}")
            .row.solid-bottom.flex.padding-sm.bg-white.align-center.justify-between(style="height: 100rpx")
              .flex
                img.margin-right-xs(src="/static/images/user.png", style="height:40rpx;width:40rpx;")
                span.ft-bold {{buyUnitName}}
              span(class="'text-blue") {{deliveryType}}
            .row.bg-white.padding-sm(style="height: 100rpx")
              span.tab-select.text-left 提货车牌
              .row.col.tab-select.text-gray.text-center
                .col.text-cut {{customerName}}
          div(style="margin-top: 200rpx")
            scroll-view.scroll-view(scroll-y, :style="{height: scrollHeight}")
              .cart-items.bg-white(v-for="(item, itemIdx) in loadData", :key="itemIdx")
                .ft-16.text-blue.margin-left-sm.padding-tb-sm.solid-bottom {{item.saleContractNo}}
                .cart-item(v-for="(cart, cartIdx) in item.ladingDetailVOList", :key="cartIdx")
                  .padding-sm.solid-bottom
                    .content.ft-13.ft-15.margin-bottom-sm
                        span {{cart.productBrandName}}
                        span.padding-left-xs {{cart.specification}}
                        span.sub-mark.ml-5 {{cart.prodAreaName}}
                    .content.ft-13.margin-bottom-sm.text-gray
                      span {{cart.productTextureName}}
                      span.ml-5 {{cart.length}}米
                      span.ml-5 {{cart.stockZoneName}}
                    .content.ft-13.margin-bottom-sm.text-gray
                      span 可提：{{cart.avbleAmount}}支/{{cart.quantityType == '01' ? cart.avbleManagerWeight : cart.avblePoundWeight}}吨
          .s-footer(@click="operate", v-if="operateText") {{operateText}}
</template>

<script>
import CountStep from '@/components/CountStep.vue'
import { mapState, mapActions } from 'vuex'
import timeLine from '@/components/TimeLine.vue'
import modal from '@/components/Modal.vue'
import zInput from '@/components/ZInput.vue'
export default {
  data () {
    return {
      inputZero: true,
      height: 0,
      customerName: '',
      deliveryType: '',
      buyUnitName: '',
      modalShow: false,
      modalMsg: '',
      customSearchVal: '',
      tabActive: 0,
      totalPrice: 0,
      totalWeight: 0,
      totalLiftCharge: 0,
      totalCount: 0,
      pickway: 0,
      pwPhone: '',
      pwAddr: '',
      pwAddrDetail: '',
      allChoosed: false,
      loadData: {},
      carts: [],
      soldCarts: [],
      btnDisable: false,
      isLoad: false,
      isEdit: false,
      pickWayShow: false,
      liftList: [{
        label: '自提',
        val: '01'
      }, {
        label: '配送',
        val: '02'
      }],
      pickWayList: [],
      scrollHeight: 0,
      cstmCurrentPage: 1,
      selectDialogTop: 0,
      customList: [],
      customTotal: 0,
      customLoadFinish: 0,
      dxFilterArray: [],
      flag: 1,
      firstLoad: false,
      saleLadingId: '',
      auditDxCheckDisable: true,
      showWarningIcon: true,
      noticeClientModalShow: false,
      noticeClientModalTitle: '请及时通知客户付款、提货',
      operateText: ''
    }
  },
  components: {
    CountStep,
    timeLine,
    modal,
    zInput
  },
  computed: {
    ...mapState({
      custom: state => state.custom,
      tempObject: state => state.tempObject,
      bottomBarHeight: state => state.bottomBarHeight,
      isIpx: state => state.isIpx,
      screenHeight: state => state.screenHeight,
      customBar: state => state.customBar
    })
  },
  beforeMount () {
    this.height = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - this.getRpx(this.bottomBarHeight)
  },
  onHide () {
    this.carts = []
    this.btnDisable = false
    this.pickWayShow = false
    this.modalShow = false
    this.firstLoad = false
    this.saleLadingId = ''
    this.tabActive = 0
    this.totalPrice = 0
    this.totalWeight = 0
    this.totalLiftCharge = 0
    this.totalCount = 0
    this.noticeClientModalShow = false
  },
  onLoad (options) {
    console.log(options)
    this.saleLadingId = options.saleLadingId
    this.stateLog = options.stateLog
    if (this.stateLog === 'all') {
      this.operateText = '货齐'
    } else if (this.stateLog === 'drop') {
      this.operateText = '作废'
    } else if (this.stateLog === 'cancelAll') {
      this.operateText = '取消货齐'
    } else if (this.stateLog === 'detail') {
      this.operateText = ''
    }
  },
  onShow () {
    if (this.tempObject.type) {
      this.pickway = this.tempObject.type
      if (this.pickway === 1) {
        this.pwPhone = this.tempObject.phone
        this.pwAddr = this.tempObject.addr
        this.pwAddrDetail = this.tempObject.detail
      }
    }
    console.log('isIpx', this.isIpx)
    this.selectDialogTop = this.getRpx(this.customBar) + 200
    this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - this.getRpx(this.bottomBarHeight) - 300 + 'rpx'
    if (this.tempObject.isIpx) {
      this.selectDialogTop -= 68
      this.scrollHeight -= 68
    }
    this.loadCartData()
    // if (this.carts.length === 0 && !this.firstLoad) {
    //   this.firstLoad = true
    //   this.loadCartData()
    // }
  },
  onReady () {
    if (this.isLogin) {
      this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - this.getRpx(this.bottomBarHeight) - 300 + 'rpx'
      this.selectDialogTop = this.getRpx(this.customBar) + 200
      if (this.carts.length === 0 && !this.firstLoad) {
        this.firstLoad = true
        this.loadCartData()
      }
    }
  },
  methods: {
    ...mapActions([
      'configVal'
    ]),
    clearPicker () {
      this.pickWayShow = false
      this.tabActive = 0
    },
    inputFormat (cart, key) {
      const newVal = this.numberFormat(cart[key]).toString().match(/\d+\.\d{2}/)
      if (newVal) cart[key] = newVal ? newVal[0] : this.numberFormat(cart[key])
      if (!cart[key]) cart[key] = key === 'dx_prices' ? cart.price : 0
    },
    modalCb (flag) {
      if (flag === 'confirm' && this.dxFilterArray.length > 0) {
        if (this.flag === 1) {
          this.noticeClientModalShow = true
        } else {
          this.generateQuotation()
        }
        this.modalShow = false
      } else {
        this.modalShow = false
      }
    },
    noticeClientModalCb (flag) {
      if (flag === 'confirm') {
        this.dx()
      } else {
        this.noticeClientModalShow = false
      }
    },
    // 获取购物车数据
    async loadCartData () {
      this.isLoad = false
      const self = this
      await self.httpGet(this.apiList.zf.editSaleLading + '?saleLadingId=' + this.saleLadingId).then(res => {
        console.log(res)
        if (res.success) {
          this.customerName = res.data.carNo || '测试车牌'
          this.deliveryType = res.data.deliveryType === '01' ? '自提' : '配送'
          this.buyUnitName = res.data.buyUnitName
          this.loadData = [res.data]
          this.loadData.map(item => {
            item.itemAllchoosed = false
            item.ladingDetailVOList.map(itm => {
              itm.choosed = false
              itm.weight = this.calcWeight(
                itm.quantityType, // 购物车计量方式
                itm.amount,
                itm.meterWeight,
                itm.length,
                itm.tolerance,
                itm.floatingRatio
              )
              console.log([itm.quantityType, // 购物车计量方式
                itm.amount,
                itm.meterWeight,
                itm.length,
                itm.tolerance,
                itm.floatingRatio])
            })
            console.log(item)
          })
        }
      }).catch(e => {
        self.showMsg(e.message)
      }).finally(() => {
        this.isLoad = true
      })
    },
    operate () {
    // 卖家-提单管理-作废
    // dropSaleLading: 'sale/saleLading/dropSaleLading',
    // 卖家-提单管理-货齐
    // ladingGoodsAreAll: 'sale/saleLading/ladingGoodsAreAll',
    // 卖家-提单管理-取消货齐
    // ladingGoodsAreNotAll: 'sale/saleLading/ladingGoodsAreNotAll',
      let confirmUrl = ''
      if (this.stateLog === 'all') {
        confirmUrl = this.apiList.zf.ladingGoodsAreAll
      } else if (this.stateLog === 'drop') {
        confirmUrl = this.apiList.zf.dropSaleLading
      } else if (this.stateLog === 'cancelAll') {
        confirmUrl = this.apiList.zf.ladingGoodsAreNotAll
      }
      this.confirm({ content: `您确定要${this.operateText}吗？` }).then((res) => {
        if (res === 'confirm') {
          this.httpGet(confirmUrl + '?saleLadingId=' + this.saleLadingId).then(res => {
            console.log(res)
            if (res.success) {
              this.showMsg('操作成功！')
              setTimeout(() => {
                this.back()
              }, 2000)
            }
          }).catch(err => {
            this.showMsg(err.message)
          })
        }
      })
    }
  }
}
</script>

<style lang="stylus", scoped>
.cart-empty-btn
  background #0081ff
  padding 14px 100px
  color #fff
  display inline-block
  font-weight bold
  font-size 16px
  border-radius 25px
  letter-spacing 1px
.cart-items
  margin-top 15px
  .cart-item
    background #fff
    margin-top 10px
    .sub-mark
      display inline-block
      padding 1px 5px
      background #3da7ff
      color #fff
      font-size 12px
      border-radius 4px
      box-shadow 1px 2px 5px rgba(61, 167, 255, 0.3)
      letter-spacing 1px
    .count-step
      height 30px
      width 120px
      .min
        color #888
    .discount-line
      position absolute
      height 1px
      right -2px
      left -2px
      border-bottom 0.5px solid $mainGray
      top 8px
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
  .cart-settle-btna
    display flex
    width 150rpx
    background #F95353
    letter-spacing 2px
    align-items center
    color #fff
    justify-content center
  .cart-settle-btnb
    display flex
    width 200rpx
    background #0081ff
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
  background #ff5b5b
  color #fff
  z-index 9
  height 96rpx
  width 100%
  line-height 96rpx
  text-align center
.tab-select-dialog
  position fixed
  left 0
  right 0
  z-index 99
  background rgba(0, 0, 0, 0.5)
  bottom 0
.quotation
  padding 5px 10px
  border-radius 100px
.tab-select
  width 50%
  position relative
  &:after
    content ''
    position absolute
    top 50%
    margin-top -10px
    right 0
    display block
    width 1px
    height 20px
    background rgba(0, 0, 0, 0.1)
  &:last-child
    &:after
      display none
.price
  input
    color #333
    font-size 30rpx
    font-weight bold
.head
  position fixed
  top 0
  left 0
  right 0
  z-index 3
.padding-lr-22
  padding 0 22px
</style>


