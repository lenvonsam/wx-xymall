<template lang="pug">
  div
    nav-bar(title="合同回收站", isBack)
    .text-right.padding-sm.bg-white.mb-10
      span(@click="openEdit()") {{isEdit ? '完成' : '编辑'}}
    template(v-if="isload")
      time-line(type="mallist")  
    template(v-else) 
      template(v-if="carts.length > 0")   
        .scroll-view.bg-white(scroll-y, :style="{top:customBar + 40 + 'px'}")
          .bill-items.solid-bottom.padding-bottom-sm(v-for="(bill, billIdx) in carts", :key="billIdx")
            .bill-item.padding-left-sm.padding-right-sm.padding-top-sm
              .flex.flex-center.align-center(@click="selectBill(bill)")
                .col.flex-25(style="padding-top: 5px;")
                  img.choose-icon(src="/static/images/blue_check.png", v-if="bill.choosed")
                  img.choose-icon(src="/static/images/btn_ck_n.png", v-else)
                .col
                  span {{bill.name}}
                  span.padding-left-xs {{bill.standard}}
                .text-blue ￥{{bill.price}}/吨
              .content.ft-13.flex.justify-between.text-gray.text-content
                .col
                  span {{bill.material}}
                  span.padding-left-xs {{bill.length}}米
                  span.padding-left-xs {{bill.wh_name}}
                  span.sub-mark.ml-5 {{bill.supply}}
                  .padding-top-xs
                    span {{bill.amount}} 支 / {{bill.totalWeight}} 吨
                    span.padding-left-xs 吊费:
                    span.padding-left-xs {{bill.price === '--' ? '--' : bill.lift_charge > 0 ? '￥' + bill.lift_charge + '/吨' : bill.lift_charge == 0 ? '无' : '线下结算'}}
                  .padding-top-xs(v-if="bill.tolerance_range")
                    span 公差范围:
                    span.padding-left-xs {{bill.tolerance_range}}
                  .padding-top-xs(v-if="bill.weight_range")
                    span 重量范围:
                    span.padding-left-xs {{bill.weight_range}}
                .flex.justify-between.flex-direction.align-end
                  .col
                    z-radio(@checkHander="weightChoose(r.m_way, bill)", v-for="(r, rIdx) in bill.radios", :key="rIdx", :label="r.label", :checked="bill.measure_way_id === r.m_way")
                  .flex.padding-xs.justify-end.align-end
                    .col(style="flex: 0 0 50px;")
                      count-step(v-model="bill.count", @input="rowCartCount(bill)", @blur="rowCartCount(bill)", :max="bill.amount_left")
                      //- count-step(v-model="bill.count", @input="rowCartCount(bill)", @blur="rowCartCount(bill)", :max="bill.amount_left")
                    .padding-left-xs(v-if="bill.sold_out == 0") {{bill.newTotalWeight}}吨
      .text-center.c-gray.pt-100(v-else)
        empty-image(url="bill_empty.png", className="img-empty")
        .empty-content 您暂时没有相关合同
      .s-footer(v-if="carts.length > 0")
        .cart-footer.align-center.justify-between
          .row.flex-center(@click="choosedAll()", style="padding-left: 10px;")
            .flex.flex-center
              img.choose-icon(src="/static/images/blue_check.png", v-if="allChoosed")
              img.choose-icon(src="/static/images/btn_ck_n.png", v-else)
            .padding-xs 全选
          .col.cart-footer-col(v-show="!isEdit")
            .text-right.flex.justify-end
              span 合计：
              b.text-red ￥{{totalObject.totalPrice}}
            .text-right.ft-12(style="color:#999;") 
              span 共{{totalObject.num}}件 ，{{totalObject.totalWeight}}吨，吊费：{{totalObject.liftPrice}}元
          .cart-settle-btn.bg-red.ft-18(@click="generateOrder", v-if="!isEdit") 生成合同
          .main-btn.margin-right-sm.bg-red.ft-20(@click="delCartRow()", v-else) 删除      
</template>
<script>
import countStep from '@/components/CountStep.vue'
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      carts: [],
      pickWay: 0,
      btnDisable: false,
      pwPhone: '',
      pwAddrDetail: '',
      pwAddr: '',
      allChoosed: false,
      isEdit: false,
      isload: true
    }
  },
  components: {
    countStep
  },
  computed: {
    ...mapState({
      tempObject: state => state.tempObject
    }),
    totalObject () {
      let price = 0
      let liftPrice = 0
      let totalPrice = 0
      let totalWeight = 0
      // let chooseList = []
      let num = 0
      this.carts.map(itm => {
        // itm.newTotalWeight = Number((itm.count * itm.weight).toFixed(3))
        itm.newTotalWeight = Number(this.$toFixed(Number(itm.count) * Number(itm.weight), 3))
        if (itm.choosed) {
          num++
          if (itm.price.indexOf('--') < 0) {
            price += itm.price * itm.newTotalWeight
            totalWeight += Number(this.$toFixed(itm.weight * itm.count, 3))
            let chargeLiftPrice = 0
            itm.lift_charge < 0 ? chargeLiftPrice = 0 : chargeLiftPrice = itm.lift_charge
            liftPrice += chargeLiftPrice * itm.newTotalWeight
          }
          if (itm.sold_out === 1) itm.amount_left = 0
        }
      })
      totalPrice = price + liftPrice
      return {
        num: num,
        price: this.$toFixed(Number(price), 2),
        totalWeight: this.$toFixed(Number(totalWeight), 3),
        liftPrice: this.$toFixed(Number(liftPrice), 2),
        totalPrice: this.$toFixed(Number(totalPrice), 2)
      }
    }
  },
  onUnload () {
    this.carts = []
    this.allChoosed = false
    this.pickWay = 0
    this.btnDisable = false
    this.pwPhone = ''
    this.pwAddrDetail = ''
    this.pwAddr = ''
    this.allChoosed = false
    this.isEdit = false
    this.isload = true
  },
  beforeMount () {
    if (this.tempObject.type) {
      this.pickWay = this.tempObject.type
      if (this.pickWay === 1) {
        this.pwPhone = this.tempObject.phone
        this.pwAddr = this.tempObject.addr
        this.pwAddrDetail = this.tempObject.detail
      }
    }
    this.carts = []
    this.ironRequest('recycleDetail.shtml?order_no=' + this.$root.$mp.query.no, {}, 'get').then(resp => {
      if (resp && resp.returncode === '0') {
        // tempObject
        let arr = resp.order_items
        arr.map(itm => {
          itm.count = itm.amount
          itm.choosed = false
          let allWeight = itm.one_weight
          let wtArr = allWeight.split('/')
          let prArr = (itm.price + '').split('/')
          if (wtArr.length === 2) {
            let weight1 = wtArr[0].substring(0, wtArr[0].indexOf('('))
            let weight2 = wtArr[1].substring(0, wtArr[1].indexOf('('))
            if (prArr[1] === '--' || prArr.length === 1) {
              itm.radios = [{
                label: '理计',
                m_way: 2,
                weight: weight1
              }]
            } else {
              itm.radios = [{
                label: '理计',
                m_way: 2,
                weight: weight1,
                price: prArr[0]
              }, {
                label: '磅计',
                m_way: 1,
                weight: weight2,
                price: prArr[1]
              }]
            }
            itm.weight = weight1
            itm.price = prArr[0]
            if (itm.measure_way_id === 1) {
              itm.weight = weight2
              itm.price = prArr[1]
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
            itm.price = itm.price
            itm.totalWeight = this.$toFixed(itm.count * Number(itm.weight), 3)
          }
          itm.newTotalWeight = this.$toFixed(itm.count * Number(itm.weight), 3)
          this.carts.push(itm)
          this.isload = false
        })
      } else {
        this.showMsg(resp === undefined ? '网络异常' : resp.errormsg)
      }
    }).catch(err => {
      this.showMsg(err || '网络异常')
    })
  },
  methods: {
    ...mapActions([
      'configVal'
    ]),
    openEdit () {
      this.isEdit = !this.isEdit
      // if (!this.isEdit) {
      //   this.allChoosed = true
      //   this.modifyList.map(itm => {
      //     itm.choosed = true
      //   })
      // }
    },
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
      this.$forceUpdate()
    },
    promptClose () { },
    selectBill (bill) {
      bill.choosed = !bill.choosed
      const findList = this.carts.find(item => !item.choosed)
      this.allChoosed = !findList
      this.$forceUpdate()
    },
    rowCartCount (item) {
      item.newTotalWeight = this.$toFixed(Number(item.count) * Number(item.weight), 3)
    },
    generateOrder () {
      const me = this
      const choosedList = this.carts.filter(item => item.choosed)
      if (choosedList.length === 0) {
        this.showMsg('没有物资可以生成合同')
        return
      }
      let arr = choosedList.filter(itm => itm.sold_out === 1)
      let arrSec = choosedList.filter(itm => itm.price.indexOf('--') >= 0)
      if (arr.length > 0) {
        this.showMsg('商品货源不足,请去商城继续选购')
      } else if (arrSec.length > 0) {
        this.showMsg('商品9点之后开售')
      } else {
        if (!this.btnDisable) {
          let heFeiArray = choosedList.filter(itm => itm.wh_name.indexOf('合肥') >= 0)
          let dongGangArray = choosedList.filter(itm => itm.wh_name.indexOf('常州东港') >= 0)
          let msgs = []
          if (heFeiArray.length > 0 && dongGangArray.length > 0) {
            msgs = '所选物资包含合肥仓库常州东港库物资最快次日可提'
          } else if (heFeiArray.length > 0) {
            msgs = '所选物资包含合肥仓库'
          } else if (dongGangArray.length > 0) {
            msgs = '常州东港库物资最快次日可提'
          }
          this.confirm({ content: msgs + '一经结算将无法更改商品数量' }).then((res) => {
            if (res === 'confirm') {
              me.btnDisable = true
              let amounts = me.carts.map(itm => itm.count).join(',')
              let prices = me.carts.map(itm => itm.price).join(',')
              let ids = me.carts.map(itm => itm.id).join(',')
              let measureWays = me.carts.map(itm => itm.measure_way_id).join(',')
              let pickway = me.pickWay === 0 ? 1 : 51
              let body = {
                user_id: me.currentUser.user_id,
                amount_s: amounts,
                o_priceStr: prices,
                jl_types: measureWays,
                csg_way: pickway,
                orderIdStr: ids
              }
              if (pickway === 51) {
                body.mobile = me.pwPhone
                body.end_addr = me.pwAddr + ' ' + me.pwAddrDetail
              }
              me.ironRequest('generateOrder.shtml', body, 'post').then(resp => {
                if (resp && resp.returncode === '0') {
                  me.btnDisable = false
                  if (resp.order_size > 1) {
                    me.confirm({ content: `您批量生成${resp.order_size}个合同，请到待付款依次支付` }).then((res) => {
                      if (res === 'confirm') {
                        me.redirect('/pages/bill/main?tabName=1')
                      }
                    })
                  } else {
                    // 跳转到支付确认页面
                    me.redirect(`/pages/pay/main?orderNo=${resp.order_no}&price=${me.totalObject.totalPrice}&pageType=offlinePay`)
                  }
                }
              }).catch(err => {
                me.btnDisable = false
                me.showMsg(err)
              })
            }
          })
        }
      }
    },
    weightChoose (val, rowItem) {
      rowItem.measure_way_id = val
      if (val === 2 || val === 3) {
        rowItem.weight = rowItem.radios[0].weight
        rowItem.price = rowItem.radios[0].price
      } else {
        rowItem.weight = rowItem.radios[1].weight
        rowItem.price = rowItem.radios[1].price
      }
    },
    delCartRow () {
      const me = this
      const list = []
      this.carts.map(item => {
        if (!item.choosed) {
          list.push(item)
        }
      })
      if (list.length === this.carts.length) {
        this.showMsg('请选择需要删除的物资')
        return false
      }
      this.confirm({ content: '您确定要删除吗？' }).then((res) => {
        if (res === 'confirm') {
          me.carts = list
        }
      })
    },
    jumpToPickway () {
      this.configVal({ key: 'tempObject', val: { type: this.pickWay, phone: this.pwPhone, addr: this.pwAddr, detail: this.pwAddrDetail } })
      this.jump({ path: '/pickway?type=' + this.pickWay })
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
.bill-items
  .bill-item
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
.cart-empty-btn
  background $mainColor
  padding 0.5rem 2rem
  color #fff
  display inline-block
  font-weight bold
  font-size 16px
  border-radius 25px
  letter-spacing 1px
.count-step .num input
  color #333 !important
.choose-icon
  width 20px
  height 20px
// .s-content {
// // height: 30rem;
// height: calc(100vh - 11rem);
// overflow: auto;
// }
.cart-items
  .cart-item
    background #fff
    margin-top 0.5rem
    .sub-mark
      display inline-block
      padding 1px 5px
      background #3da7ff
      color #fff
      font-size 12px
      border-radius 4px
      box-shadow 1px 2px 5px rgba(61, 167, 255, 0.3)
      letter-spacing 1px
    .content
      color $mainGray
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
.s-footer
  position fixed
  bottom 0
  left 0
  right 0
  background #fff
  z-index 99
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
    // display flex
    width 100px
    height 50px
    line-height 50px
    text-align center
    color #fff
    // justify-content center
.bill-foot
  position fixed
  left 0
  right 0
  bottom 0
.count-step .num input
  color #333 !important
.bottom-option
  position fixed
  padding 10px
  bottom 0
  left 0
  right 0
  line-height 25px
  height 50px
.bottom-panel
  position fixed
  background #fff
  padding 10px
  width 100%
  bottom 0
  left 0
  right 0
  line-height 25px
  height 120px
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
.count-step
  width 100px
button
  font-size 16px
.main-btn
  background #e54d42
  font-size 16px
  height 30px
  width 100px
.scroll-view
  margin-bottom 80px
</style>