<template lang="pug">
  .bg-gray.pt-half-rem
    .bg-white
      .row.padding.flex-center.border-bottom-line
        .col.text-blue.ft-bold
          span(@click="jump('/pages/ladbillDetail/main?id=' + ladObject.no + '&status='+ladObject.status)") {{ladObject.no}}
          copy-btn(:copyUrl="ladObject.no")
        .col.flex-120.text-right.ft-13
          //- q-btn(color="red-5", small, outline, rounded, v-if="ladObject.status == '待出库'", @click="cb(ladObject, 'cancel')") 待出库可取消
          .text-blue(v-if="ladObject.status == '待收货'", @click="cb(ladObject, 'confirm')") 确认收货
          //- q-btn.ft-13(color="primary", small, outline, rounded, v-else-if="ladObject.status == '待付款' && ladObject.pay_price > 0", @click="cb(ladObject, 'pay')") 去支付
          .text-red(v-else-if="ladObject.status == '待付款' && ladObject.pay_price > 0", @click="cb(ladObject, 'pay')") 待付款
          .text-gray(v-else-if="ladObject.status == '待付款' && ladObject.pay_price == 0") 审核中
          .text-gray(v-else) {{ladObject.status}}
      div(@click="jump('/pages/ladbillDetail/main?id=' + ladObject.no + '&status='+ladObject.status)")
        .text-gray.solid-bottom.padding-sm.text-content(v-for="(itm, ladIdx) in ladObject.order_items", :key="ladIdx")
          .text-black.padding-bottom-xs
            .row.ft-15
              .col
                span.ft-14 {{itm.product_name}}
                span.padding-left-xs {{itm.product_standard}}
              .text-blue.text-bold ￥{{itm.product_price}}  
          .row.padding-bottom-xs
            .col
              span.ml-0 {{itm.product_material}}
              //- span.ml-5 {{itm.product_standard}}
              span.ml-5 {{itm.product_length}}米
              .sub-mark.ml-5.ft-12 {{itm.warehouse}}
              //- .lad-warehouse-mark.ml-5 {{itm.warehouse}}
            .col.flex-70.ft-14.text-right.c-black
              span ({{itm.metering}})
          .padding-bottom-xs(v-if="itm.tolerance_range || itm.weight_range")
            span.mr-5(v-if="itm.tolerance_range") 公差范围：{{itm.tolerance_range}}
            span(v-if="itm.weight_range") 重量范围：{{itm.weight_range}}
          .row.padding-bottom-xs
            .col
              span 预计/实提：
              span.ml-5 {{itm.weight_csg}}吨 / {{itm.weight_real}}吨
            span {{itm.product_count}}支
      .row.padding-sm
        span 共 {{ladObject.total_count}} 支
        .col.text-right
          span 预计/实提：
          span.ml-5 {{ladObject.weight_csg}}吨 / {{ladObject.weight_real}}吨
</template>

<script>
import copyBtn from '@/components/CopyBtn.vue'
export default {
  props: {
    ladObject: {
      type: Object,
      required: true
    },
    cb: {
      type: Function,
      required: true
    }
  },
  computed: {
    copyRow () {
      return this.ladObject
    }
  },
  mounted () {
    console.log('ladObject', this.copyRow)
  },
  components: {
    copyBtn
  }
}
</script>

<style lang="stylus", scoped>
.lad-warehouse-mark
  display inline-block
  padding 1px 5px
  background-color #3da7ff
  font-size 12px
  letter-spacing 1px
  color #fff
  text-align center
  border-radius 3px
  // box-shadow: 2px 3px 5px #ddd;
  box-shadow 1px 2px 5px rgba(61, 167, 255, 0.3)
</style>
