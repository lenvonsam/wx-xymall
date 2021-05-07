<template lang="pug">
  div
    nav-bar(title="待审核", isBack)
    .grid.col-2.mt-10
      .features-card.bg-white(v-for="(ficon, fIdx) in menuIcons", :key="fIdx", @click="jumpModules(ficon)")
        .relative.flex.align-center.contract-img(v-if="ficon.icon")
          img(:src="ficon.icon", mode="widthFix")
          .dot(v-if="ficon.count > 0")
          .text-name
            .ft-13.text-bold {{ficon.name}}
            .num.padding-top-xs.ft-10
              span.text-bold.text-red.margin-right-xs(v-if="ficon.count > 0") {{ficon.count}}
              span.text-bold.text-gray.margin-right-xs(v-else) {{ficon.count}}
              span 条待审批
 </template>
<script>
// import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      menuIcons: [
        {
          icon: '/static/images/pend_menu_1.png',
          name: '采购计划',
          dotKey: 'eidt_count',
          event: 'click_app_me_to_edit_seller',
          path: '/pages/vendor/contractTrack/main?tabName=10',
          count: 4,
          configId: 55
        },
        {
          icon: '/static/images/pend_menu_2.png',
          name: '发货集港',
          dotKey: 'eidt_count',
          event: 'click_app_me_to_edit_seller',
          path: '/pages/vendor/contractTrack/main?tabName=10',
          count: 8,
          configId: 55
        },
        {
          icon: '/static/images/pend_menu_3.png',
          name: '付款申请',
          dotKey: 'eidt_count',
          event: 'click_app_me_to_edit_seller',
          path: '/pages/vendor/contractTrack/main?tabName=10',
          count: 0,
          configId: 55
        },
        {
          icon: '/static/images/pend_menu_4.png',
          name: '资源定价',
          dotKey: 'eidt_count',
          event: 'click_app_me_to_edit_seller',
          path: '/pages/vendor/contractTrack/main?tabName=10',
          count: 4,
          configId: 55
        },
        {
          icon: '/static/images/pend_menu_5.png',
          name: '合同延迟',
          dotKey: 'eidt_count',
          event: 'click_app_me_to_edit_seller',
          path: '/pages/vendor/contractTrack/main?tabName=10',
          count: 2,
          configId: 55
        },
        {
          icon: '/static/images/pend_menu_6.png',
          name: '合同抬头变更',
          dotKey: 'eidt_count',
          event: 'click_app_me_to_edit_seller',
          path: '/pages/vendor/contractTrack/main?tabName=10',
          count: 4,
          configId: 55
        },
        {
          icon: '/static/images/pend_menu_7.png',
          name: '合同货齐',
          dotKey: 'eidt_count',
          event: 'click_app_me_to_edit_seller',
          path: '/pages/vendor/contractTrack/main?tabName=10',
          count: 5,
          configId: 55
        },
        {
          icon: '/static/images/pend_menu_8.png',
          name: '预售审核',
          dotKey: 'eidt_count',
          event: 'click_app_me_to_edit_seller',
          path: '/pages/vendor/contractTrack/main?tabName=10',
          count: 4,
          configId: 55
        }
      ]
    }
  },
  created () {
    this.getData()
  },
  methods: {
    jumpModules (ficon) {
      console.log(ficon)
      this.jump('/pages/vendor/pendingReview/main?configId=' + ficon.configId)
    },
    getData () {
      let params = {
        'startCreateTime': '',
        'endCreateTime': '',
        'tenantId': '1',
        'userId': this.currentUser.id,
        'status': [0, 1]
      }
      this.httpPost(this.apiList.zf.queryWorkflowProcessMenu, params).then(res => {
        console.log(res)
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
.features-card
  &:nth-of-type(5)
    margin-top 20rpx
  &:nth-of-type(6)
    margin-top 20rpx
  .contract-img
    padding 20rpx
    &:first-of-type
      border-right 1rpx solid #f1f1f1
      border-bottom 1rpx solid #f1f1f1
    img
      height 80rpx
      width 80rpx
      margin-right 12rpx
    .dot
      height 16rpx
      width 16rpx
      background-color #f5574e
      border-radius 50%
      position absolute
      top 20rpx
      left 78rpx
    .text-name
      .num
        color #999999
</style>
