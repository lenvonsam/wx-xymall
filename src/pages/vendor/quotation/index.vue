<template lang="pug">
  .s-layout
    nav-bar(title="报价清单", isBack)
    .padding-left-sm.padding-right-sm.ft-12(style="background: #FEF7E7; line-height: 70rpx; height: 70rpx")
      span.text-orange 报价单2小时内有效，超时自动失效
    template(v-if="!isLoad")
      time-line(type="mallist")
    template(v-else)
      .s-empty-content(v-if="(carts.length + soldCarts.length) == 0")
        div(style="padding-top: 20%")
          .text-center
            empty-image(url="cart_empty.png", className="img-empty")
          .text-center.empty-content 购物车空空如也
          .text-center.margin-top-sm
            .cart-empty-btn(@click="tab('/pages/mall/main')") ^_^去商城逛逛吧
      .s-content-wrap(v-else)
        .s-content
          scroll-view.scroll-view(scroll-y, :style="{height: scrollHeight}")
            .cart-items(v-for="(cart, cartIdx) in carts", :key="cartIdx")
              .cart-item.padding-sm
                .flex.flex-center.align-center.ft-15.text-bold
                  .col.flex-25(@click="cart.choosed = !cart.choosed", v-if="pageType !== 'share'", style="padding-top: 5px;")
                    img.choose-icon(src="/static/images/blue_check.png", v-if="cart.choosed")
                    img.choose-icon(src="/static/images/btn_ck_n.png", v-else)
                  .col(@click="cart.choosed = !cart.choosed")
                    span {{cart.product_name}}
                    span.padding-left-xs {{cart.product_standard}}
                  div(:class="pageType === 'share' ? 'text-blue' : 'text-black'") ￥{{cart.price}}
                .content.ft-13
                  .text-gray
                    div
                      span {{cart.product_material}}
                      span.ml-5 {{cart.product_length}}米
                      span.ml-5 {{cart.wh_name}}
                      span.sub-mark.ml-5 {{cart.product_supply}}
                    .pt-5.row.justify-between
                      .col
                        span {{cart.amount_left}}支 / {{cart.weight_left}}吨
                        span.padding-left-xs 吊费:
                        span.ml-10 {{cart.price === '--' ? '--' : cart.lift_charge > 0 ? '￥' + cart.lift_charge + '/吨' : cart.lift_charge == 0 ? '无' : '线下结算'}}
                      span （理计）
                    .pt-5(v-if="cart.tolerance_range || cart.weight_range")
                      span(v-if="cart.tolerance_range") 公差范围:
                      span.ml-10.mr-10(v-if="cart.tolerance_range") {{cart.tolerance_range}}
                      span.ml-10(v-if="cart.weight_range") 重量范围:
                      span.ml-10(v-if="cart.weight_range") {{cart.weight_range}}
                    .pt-5(v-if="pageType==='share'")
                      span 数量：
                      span.ml-10 10支
                      span.ml-10 重量：
                      span.ml-10 5.12
                      span 吨
                  .row.justify-between.pt-5(v-if="pageType !== 'share'")
                    .text-black.ft-16 当前报价：
                      span.text-blue ￥{{cart.dx_prices}}
                    .col.flex.align-end.justify-end
                      count-step(v-model="cart.count", @click.native="rowCartCount(cart)", @blur="rowCartCount(cart)", :max="cart.amount_left")
                      .padding-left-xs {{cart.countWeight}}吨

    .s-footer(v-if="carts.length > 0", style="height: 100rpx")
      .cart-footer.justify-between
        .col.cart-footer-col
          .row.justify-between
            .row.flex-center(@click="choosedAll", v-if="pageType !== 'share'", style="padding-left: 10px;")
              .flex.flex-center
                img.choose-icon(src="/static/images/blue_check.png", v-if="allChoosed")
                img.choose-icon(src="/static/images/btn_ck_n.png", v-else)
              .padding-xs 全选
            .text-right.flex.justify-end.col
              span 合计：
              b.text-red ￥{{totalPrice}}
          .text-right.ft-12(style="color:#999;") 共{{totalCount}}件 ，{{totalWeight}}吨，吊费: {{totalLiftCharge}}元
        .cart-settle-btn.ft-18(v-if="pageType === 'share'") 生成合同
        //- button.cart-settle-btn.ft-18(open-type="share", @click="modalShow = true" v-else) 分享
        button.cart-settle-btn.ft-18(@click="modalShow = true" v-else) 分享
    modal(title="是否进行锁货", :btns="btns", :value="modalShow", @cb="modalHandler")
      div
        .text-gray 2小时未生成合同，物资自动释放
        .padding-top-sm.row.justify-center
          .margin-right-sm.margin-left-sm(v-for="(r, rIdx) in radios", :key="rIdx")
            z-radio(@checkHander="lockCheck(r)", :label="r.label", :checked="lockGoods === r.val")
</template>

<script>
import CountStep from '@/components/CountStep.vue'
import { mapState, mapActions } from 'vuex'
import timeLine from '@/components/TimeLine.vue'
import modal from '@/components/Modal.vue'
export default {
  data () {
    return {
      radios: [
        {label: '锁货', val: 1},
        {label: '不锁', val: 0}
      ],
      lockGoods: 1,
      modalShow: false,
      totalPrice: 0,
      totalWeight: 0,
      totalLiftCharge: 0,
      totalCount: 0,
      pickway: 0,
      pwPhone: '',
      pwAddr: '',
      pwAddrDetail: '',
      allChoosed: true,
      carts: [],
      soldCarts: [],
      btnDisable: false,
      isLoad: false,
      scrollHeight: 0,
      custmName: '',
      timeInterval: '',
      serverTime: '',
      endTime: '',
      timeDown: '',
      pageType: '',
      qutId: '',
      btns: [
        {label: '取消', flag: 'cancel', className: 'bg-gray'},
        {label: '确定', flag: 'confirm', className: 'main-btn', type: 'share'}
      ]
    }
  },
  components: {
    CountStep,
    timeLine,
    modal
  },
  computed: {
    ...mapState({
      tempObject: state => state.tempObject,
      bottomBarHeight: state => state.bottomBarHeight
    })
  },
  watch: {
    carts: {
      handler (newVal, oldVal) {
        let filterArray = newVal.filter(item => {
          item.countWeight = this.$toFixed(Number(item.count * item.weight), 3)
          return item.choosed === true
        })
        this.totalCount = filterArray.length
        this.allChoosed = this.totalCount === newVal.length
        this.totalPrice = 0
        this.totalWeight = 0
        this.totalLiftCharge = 0
        if (filterArray.length > 0) {
          filterArray.map(itm => {
            if (itm.price.indexOf('--') < 0) {
              if (Number(itm.lift_charge) > 0) {
                const countWeight = Number(this.$toFixed(itm.count * itm.weight, 3))
                const countLiftWeight = countWeight * itm.lift_charge
                this.totalPrice += itm.price * countWeight + countLiftWeight
                this.totalLiftCharge += countLiftWeight
              } else {
                this.totalPrice += itm.price * Number(this.$toFixed(itm.count * itm.weight, 3))
              }
              this.totalWeight += Number(this.$toFixed(itm.weight * itm.count, 3))
            }
          })
          this.totalLiftCharge = this.$toFixed(Number(this.totalLiftCharge), 2)
          this.totalPrice = this.$toFixed(Number(this.totalPrice), 2)
          this.totalWeight = this.$toFixed(Number(this.totalWeight), 3)
        }
      },
      deep: true
    }
  },
  onShareAppMessage (res) {
    console.log('onShareAppMessage', res)
    this.modalShow = false
    let orderIds = []
    let dxPrices = []
    let costPrices = []
    let jlTypes = []
    let amounts = []
    let weights = []
    let orderPrices = []
    this.carts.map(itm => {
      orderIds.push(itm.order_id)
      dxPrices.push(itm.dx_prices)
      costPrices.push(itm.cost_prices)
      jlTypes.push(itm.measure_way_id)
      amounts.push(itm.count)
      weights.push(itm.countWeight)
      orderPrices.push(itm.price)
    })
    const params = {
      user_id: this.tempObject.user_id,
      buyer_name: this.tempObject.buyer_name,
      need_lift: this.tempObject.need_lift,
      order_ids: orderIds.toString(),
      amount_s: amounts.toString(),
      weight_s: weights.toString(),
      order_prices: orderPrices.toString(),
      dx_prices: dxPrices.toString(),
      cost_prices: costPrices.toString(),
      jl_types: jlTypes.toString(),
      total_money: this.tempObject.totalPrice,
      total_amount: this.tempObject.totalCount,
      total_weight: this.tempObject.totalWeight,
      lift_money: this.tempObject.totalLiftCharge,
      lock_goods: this.lockGoods
    }
    this.ironRequest(this.apiList.xy.quotation.url, params, this.apiList.xy.quotation.method).then(res => {
      if (res.returncode === '0') {
        return {
          title: '报价清单',
          path: '/quotation/main?pageType=share&&qutId=' + res.qut_id
        }
      }
    })
  },
  onHide () {
    this.carts = []
    // this.pageType = ''
  },
  onShow () {
    if (!this.isLogin) {
      const me = this
      this.confirm({ title: '友情提示', content: '您未登录,请先登录' }).then(res => {
        if (res === 'confirm') {
          me.jump('/pages/account/login/main')
        } else {
          me.tab('/pages/index/main')
        }
      })
      return
    }
    if (this.$root.$mp.query.qutId) {
      this.pageType = 'share'
      this.qutId = this.$root.$mp.query.qutId
    } else {
      this.loadData()
    }
    console.log('tempObject', this.tempObject)
    this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - 170 + 'rpx'
  },
  methods: {
    ...mapActions([
      'configVal'
    ]),
    modalHandler (flag) {
      if (flag === 'cancel') {
        this.modalShow = false
      }
    },
    lockCheck (r) {
      this.lockGoods = r.val
    },
    countTime () {
      const nowTime = this.serverTime
      const endTimeFormat = this.endTime.replace(/-/g, '/')
      const endTime = new Date(endTimeFormat).getTime()
      const leftTime = endTime - nowTime
      let h = 0
      let m = 0
      let s = 0
      if (leftTime >= 0) {
        h = Math.floor(leftTime / 1000 / 60 / 60 % 24)
        m = Math.floor(leftTime / 1000 / 60 % 60)
        s = Math.floor(leftTime / 1000 % 60)
      } else {
        h = h < 10 ? '0' + h : h
        m = m < 10 ? '0' + m : m
        s = s < 10 ? '0' + s : s
        this.timeDown = `${h}:${m}:${s}`
      }
      this.$forceUpdate()
    },
    // async quotation () {
    //   const params = {}
    //   const data = await this.ironRequest(this.apiList.xy.quotation.url, params, this.apiList.xy.quotation.method)
    //   console.log(data)
    // },

    // refresher (done) {
    //   const me = this
    //   setTimeout(() => {
    //     me.carts = []
    //     me.allChoosed = false
    //     me.loadCartData(done)
    //   }, 300)
    // },
    choosedAll () {
      this.allChoosed = !this.allChoosed
      if (this.allChoosed) {
        this.carts.map(itm => {
          itm.choosed = true
        })
      } else {
        this.carts.map(itm => {
          itm.choosed = false
        })
      }
    },
    jumpToPickway () {
      this.configVal({ key: 'tempObject', val: { type: this.pickway, phone: this.pwPhone, addr: this.pwAddr, detail: this.pwAddrDetail } })
      this.jump({ path: '/pickway?type=' + this.pickway })
    },
    rowCartCount (obj) {
      console.log(obj.count)
      this.ironRequest('cartUpdate.shtml', { cart_id: obj.cart_id, user_id: this.currentUser.user_id, measure_way: obj.measure_way_id, count: obj.count }, 'post').then(res => {
      })
    },
    loadData () {
      const arr = this.tempObject.list
      arr.map(itm => {
        itm.choosed = true
        let allWeight = itm.one_weight
        let wtArr = allWeight.split('/')
        let prArr = itm.product_price.split('/')
        let oldPrArr = itm.origin_price.split('/')
        if (wtArr.length === 2) {
          let weight1 = wtArr[0].substring(0, wtArr[0].indexOf('('))
          let weight2 = wtArr[1].substring(0, wtArr[1].indexOf('('))
          if (prArr[1] === '--') {
            itm.radios = [{
              label: '理计',
              m_way: 2,
              weight: weight1,
              originPrice: oldPrArr[0]
            }]
          } else {
            itm.radios = [{
              label: '理计',
              m_way: 2,
              weight: weight1,
              price: prArr[0],
              originPrice: oldPrArr[0]
            }, {
              label: '磅计',
              m_way: 1,
              weight: weight2,
              price: prArr[1],
              originPrice: oldPrArr[1]
            }]
          }
          itm.weight = weight1
          itm.price = prArr[0]
          itm.originPrice = oldPrArr[0]
          if (itm.measure_way_id === 1) {
            itm.weight = weight2
            itm.price = prArr[1]
            itm.originPrice = oldPrArr[1]
          }
          if (itm.measure_way_id === 0) {
            itm.measure_way_id = 2
          }
        } else {
          let lbl = '理计'
          if (itm.measure_way_id === 1) {
            lbl = '磅计'
          }
          let wt = itm.one_weight.substring(0, itm.one_weight.indexOf('('))
          itm.radios = [{
            label: lbl,
            m_way: itm.measure_way_id,
            weight: wt
          }]
          itm.weight = wt
          itm.price = itm.product_price
          itm.originPrice = itm.origin_price
        }
      })
      this.carts = arr
      this.isLoad = true
    },
    async quotationDetail () {
      try {
        const quotationDetail = this.apiList.xy.quotationDetail
        const params = {}
        const data = await this.ironRequest(quotationDetail.url, params, quotationDetail.method)
        console.log(data)
        if (data.returncode === '0') {
          this.carts = data.list
          this.totalPrice = data.money
          this.totalWeight = data.weight
          this.totalLiftCharge = data.lift
          this.totalCount = data.amount
        }
      } catch (e) {
        console.log(e)
      }
      // /seller/quotationDetail.shtml
    },
    loadCartData () {
      this.isLoad = false
      const me = this
      this.ironRequest('cartList.shtml?user_id=' + me.currentUser.user_id, {}, 'get').then(resp => {
        this.isLoad = true
        if (resp.returncode === '0') {
          this.serverTime = resp.server_time
          this.endTime = resp.end_time
          let arr = resp.carts
          this.soldCarts = resp.sold_out_carts
          if (this.pageType !== 'share') {
            arr.map(itm => {
              itm.choosed = false
              let allWeight = itm.one_weight
              let wtArr = allWeight.split('/')
              let prArr = itm.product_price.split('/')
              let oldPrArr = itm.origin_price.split('/')
              if (wtArr.length === 2) {
                let weight1 = wtArr[0].substring(0, wtArr[0].indexOf('('))
                let weight2 = wtArr[1].substring(0, wtArr[1].indexOf('('))
                if (prArr[1] === '--') {
                  itm.radios = [{
                    label: '理计',
                    m_way: 2,
                    weight: weight1,
                    originPrice: oldPrArr[0]
                  }]
                } else {
                  itm.radios = [{
                    label: '理计',
                    m_way: 2,
                    weight: weight1,
                    price: prArr[0],
                    originPrice: oldPrArr[0]
                  }, {
                    label: '磅计',
                    m_way: 1,
                    weight: weight2,
                    price: prArr[1],
                    originPrice: oldPrArr[1]
                  }]
                }
                itm.weight = weight1
                itm.price = prArr[0]
                itm.originPrice = oldPrArr[0]
                if (itm.measure_way_id === 1) {
                  itm.weight = weight2
                  itm.price = prArr[1]
                  itm.originPrice = oldPrArr[1]
                }
                if (itm.measure_way_id === 0) {
                  itm.measure_way_id = 2
                }
              } else {
                let lbl = '理计'
                if (itm.measure_way_id === 1) {
                  lbl = '磅计'
                }
                let wt = itm.one_weight.substring(0, itm.one_weight.indexOf('('))
                itm.radios = [{
                  label: lbl,
                  m_way: itm.measure_way_id,
                  weight: wt
                }]
                itm.weight = wt
                itm.price = itm.product_price
                itm.originPrice = itm.origin_price
              }
              this.carts.push(itm)
            })
          } else {
            this.carts = arr
            this.totalLiftCharge = this.$toFixed(Number(resp.lift), 2)
            this.totalPrice = this.$toFixed(Number(this.money), 2)
            this.totalWeight = this.$toFixed(Number(this.weight), 3)
            this.totalCount = resp.amount
          }
          const me = this
          this.timeInterval = setInterval(() => {
            me.countTime()
            me.serverTime += 1000
          }, 1000)
        }
      }).catch(err => {
        this.isLoad = true
        me.showMsg(err || '网络异常')
        // if (done) done()
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
.address-dialog
  position fixed
  left 0
  right 0
  z-index 99
  background rgba(0, 0, 0, 0.5)
  bottom 0
button
  border-radius 0px
</style>
