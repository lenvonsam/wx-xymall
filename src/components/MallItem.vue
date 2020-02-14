<template lang="pug">
 .padding.pr-10.pl-10(:class="!mallFlag ? 'card-list' : 'solid-bottom'")
    template(v-if="mallFlag === 1")
      .row
        .col.text-bold.ft-15
          span {{item[mallTypeObject[itemType].name]}}
          span.ml-5 {{item[mallTypeObject[itemType].standard]}}
          //- .sub-mark.ml-5 {{item[mallTypeObject[itemType].supply]}}
          //- span.ml-5.ft-12(style="color:#666") ({{weightMark}})
        .col.text-right.ft-16.flex-100
          span.c-red.ft-13(v-if="item.price === '--'") 开售时间:{{item.show_time}}
          span.text-blue(v-else="item.show_price === true") ￥{{item[mallTypeObject[itemType].price]}}
    
          //- span.c-red.ft-13(v-if="item.price === '--'") 开售时间:{{item.show_time}}
          //- span.c-red(v-else-if="item.show_price === true") ￥{{item[mallTypeObject[itemType].price]}}
          //- .blue-buy.ft-12(v-else, @click="cb(item, 'showPrice', $event)") 查看价格
      .row.pt-5.flex-center.ft-13
        .col.c-gray
          span {{item[mallTypeObject[itemType].material]}}
          //- span.ml-8 {{item[mallTypeObject[itemType].standard]}}
          span.ml-8 {{item[mallTypeObject[itemType].length]}}米
          span.ml-8 {{item[mallTypeObject[itemType].wh_name]}}
          .sub-mark.ml-5 {{item[mallTypeObject[itemType].supply]}}
        .text-right
          span ({{weightMark}})
      //- .row.pt-5.flex-center.ft-13(v-if="item[mallTypeObject[itemType].tolerance]||item[mallTypeObject[itemType].weightRange]")
        .col.c-gray
          span(v-if="item[mallTypeObject[itemType].tolerance]") 公差范围: {{item[mallTypeObject[itemType].tolerance]}}
          span.ml-8(v-if="item[mallTypeObject[itemType].weightRange]") 重量范围: {{item[mallTypeObject[itemType].weightRange]}}
      //- .row.pt-0.flex-center.ft-13.c-gray(v-if="item.show_price === true")
      .row.pt-5.flex-center.ft-13.c-gray
        .col
          span(v-if="item[mallTypeObject[itemType].max_count] > 0") {{item[mallTypeObject[itemType].max_count]}}支/{{item[mallTypeObject[itemType].max_weight]}}吨
        .col.flex-100.text-right.ft-14
          .blue-buy(v-if="item.max_count == 0",style="background:#f44336!important", @click="cb(item, 'notice', $event)") 到货通知
          .blue-buy(@click="cb(item, 'cart', $event)", v-else) 购买
    template(v-else)
      .text-bold.ft-15
        span {{item[mallTypeObject[itemType].name]}}
        span {{item[mallTypeObject[itemType].supply]}}
      .text-bold
        span {{item[mallTypeObject[itemType].standard]}}
      .text-gray
        span {{item[mallTypeObject[itemType].material]}}
        span.ml-8 {{item[mallTypeObject[itemType].length]}}米
        span.ml-8 {{item[mallTypeObject[itemType].wh_name]}}
      .text-gray
        span(v-if="item[mallTypeObject[itemType].max_count] > 0") {{item[mallTypeObject[itemType].max_count]}}支/{{item[mallTypeObject[itemType].max_weight]}}吨
      .text-blue ￥{{item[mallTypeObject[itemType].price]}}
      .text-gray.flex
        .ft-12.col ({{weightMark}})
        .text-right.ft-14
          .blue-buy(v-if="item.max_count == 0",style="background:#f44336!important", @click="cb(item, 'notice', $event)") 到货通知
          .blue-buy(@click="cb(item, 'cart', $event)", v-else) 购买
</template>

<script>
export default {
  props: {
    mallFlag: {
      type: Number,
      default: 1
    },
    item: {
      type: Object,
      required: true
    },
    cb: {
      type: Function,
      required: true
    },
    itemType: {
      type: String,
      default: 'product'
    }
  },
  data () {
    return {
      mallTypeObject: {
        'product': {
          name: 'name',
          supply: 'supply',
          price: 'price',
          standard: 'standard',
          material: 'material',
          wh_name: 'wh_name',
          max_count: 'max_count',
          max_weight: 'max_weight',
          tolerance: 'tolerance_range',
          length: 'length',
          weightRange: 'weight_range'
        },
        'trove': {
          name: 'product_name',
          supply: 'supply',
          price: 'price',
          standard: 'product_standard',
          material: 'product_material',
          wh_name: 'wh_name',
          max_count: 'max_count',
          max_weight: 'max_weight',
          tolerance: 'tolerance_range',
          length: 'product_length',
          weightRange: 'weight_range'
        }
      },
      weightMark: ''
    }
  },
  beforeMount () {
    const priceArr = this.item.price
    this.weightMark = priceArr.length === 1 ? '理计' : '理计/磅计'
  }
}
</script>

<style lang="stylus", scoped>
.blue-buy
  display inline-block
  border-radius 20px
  letter-spacing 1px
  padding-top 6px
  padding-left 10px
  padding-right 10px
  text-align center
  // min-width 100px
  color #fff
  background #2485ff !important
  box-shadow none
  min-height 30px
  z-index 0
.sub-mark
  display inline-block
  padding 1px 3px
  background #3da7ff
  color #fff
  font-size 12px
  border-radius 4px
  box-shadow 1px 2px 5px rgba(61, 167, 255, 0.3)
  letter-spacing 1px
.notice-btn
  position absolute
  right 0px
  top -6px
  padding 0px 10px
  box-shadow 1px 3px 5px #ddd
.cart-icon
  width 45px
  height 45px
  position absolute
  top -20px
  right 0px
  background-size cover
  background-position center
  box-shadow 1px 3px 5px #ddd
  border-radius 50%
.ml-8
  margin-left 8px !important
.card-list
  width 46%
  line-height 26px
  background #fff
  margin-bottom 15px
  .blue-buy
    padding-top 3px
</style>
