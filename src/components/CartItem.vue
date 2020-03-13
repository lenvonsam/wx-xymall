<template lang="pug">
.cart-items
  .cart-item.padding-sm
    .flex.flex-center.align-center.ft-15.text-bold
      .col.flex-25(@click="cart.choosed = !cart.choosed", style="padding-top: 5px;")
        img.choose-icon(src="/static/images/blue_check.png", v-if="cart.choosed")
        img.choose-icon(src="/static/images/btn_ck_n.png", v-else)
      .col(@click="cart.choosed = !cart.choosed")
        span {{cart.product_name}}
        span.padding-left-xs {{cart.product_standard}}
      .text-blue ￥{{cart.price}}/吨
    .content.ft-13
      .flex.flex-center.justify-between
        div
          div
            span {{cart.product_material}}
            span.ml-5 {{cart.product_length}}米
            span.ml-5 {{cart.wh_name}}
            span.sub-mark.ml-5 {{cart.product_supply}}
          .pt-5
            span {{cart.amount_left}}支 / {{cart.weight_left}}吨
            span.padding-left-xs 吊费:
            span.ml-10 {{cart.price === '--' ? '--' : cart.lift_charge > 0 ? '￥' + cart.lift_charge + '/吨' : cart.lift_charge == 0 ? '无' : '线下结算'}}
          .pt-5(v-if="cart.tolerance_range || cart.weight_range")
            span(v-if="cart.tolerance_range") 公差范围:
            span.ml-10.mr-10(v-if="cart.tolerance_range") {{cart.tolerance_range}}
          .pt-5
            span(v-if="cart.weight_range") 重量范围:
            span.ml-10(v-if="cart.weight_range") {{cart.weight_range}} 
        .text-right
          .text-gray(v-if="currentUser.type === 'seller'") (可让10元)
          .flex.flex-direction.justify-between(:class="{'pt-5': currentUser.type === 'seller'}")
            z-radio(@checkHander="weightChoose(r.m_way, cart)", v-for="(r, rIdx) in cart.radios", :key="rIdx", :label="r.label", :checked="cart.measure_way_id === r.m_way")
      .margin-top-xs.padding-sm.solid-top.solid-bottom.padding-top-sm.padding-bottom-sm.row.text-gray(v-if="currentUser.type === 'seller'")
        .text-black 定向价格：
        .col.ml-5.padding-xs.solid.line-gray
          input(type="number", v-model="cart.dx_prices")
        .padding-left-xs 元
        .padding-left-xs.text-black 费用：
        .col.ml-5.padding-xs.solid.line-gray
          input(type="number", v-model="cart.cost_prices")
        .padding-left-xs 元
      .row.justify-end.align-end(:class="{'padding-sm': currentUser.type === 'seller', 'padding-xs': currentUser.type === 'buyer'}")
        .col
        .col(style="flex: 0 0 60px;")
          count-step(v-model="cart.count", @click.native="rowCartCount(cart)", @blur="rowCartCount(cart)", :max="cart.amount_left")
        .padding-left-xs {{cart.countWeight}}吨
</template>

<script>
import CountStep from '@/components/CountStep.vue'
export default {
  props: {
    cart: {
      type: Object,
      default: false
    }
  },
  components: {
    CountStep
  },
  methods: {
    rowCartCount (obj) {
      this.ironRequest(this.apiList.xy.cartUpdate.url, { cart_id: obj.cart_id, user_id: this.currentUser.user_id, measure_way: obj.measure_way_id, count: obj.count }, this.apiList.xy.cartUpdate.method)
    },
    weightChoose (val, rowItem) {
      rowItem.measure_way_id = val
      if (val === 2) {
        rowItem.weight = rowItem.radios[0].weight
        rowItem.price = rowItem.radios[0].price
        rowItem.originPrice = rowItem.radios[0].originPrice
      } else {
        rowItem.weight = rowItem.radios[1].weight
        rowItem.price = rowItem.radios[1].price
        rowItem.originPrice = rowItem.radios[1].price
      }
      this.ironRequest(this.apiList.xy.cartUpdate.url, { cart_id: rowItem.cart_id, user_id: this.currentUser.user_id, measure_way: val, count: rowItem.count }, this.apiList.xy.cartUpdate.method)
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="stylus" scoped>
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
</style>
