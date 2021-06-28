<template lang="pug">
div
  nav-bar(title="ERP现货物资详情", isBack)
  .bg-white
    .padding-sm
      .row.justify-between.padding-bottom-sm
        .text-black.text-bold
          span {{tabData.productBrandName}}
          span.padding-left-xs {{tabData.specification}}
        .text-blue(v-if="tabData.quantityType == '01'") ￥{{tabData.priceManager}}
        .text-blue(v-if="tabData.quantityType == '02'") ￥{{tabData.pricePound}}
        .text-blue(v-if="tabData.quantityType == '00'") ￥{{tabData.priceManager/tabData.pricePound}}
      .text-gray
        .row.justify-between.padding-bottom-xs
          .col
            span {{tabData.productTextureName}}
            span.ml-8 {{tabData.length}}米
            span.ml-8 {{tabData.stockZoneName}}
            .sub-mark.ml-5 {{tabData.prodAreaName}}
          span(v-if="tabData.quantityType == '01'") (理计)
          span(v-if="tabData.quantityType == '02'") (磅计)
          span(v-if="tabData.quantityType == '00'") (理计/磅计)
        .padding-bottom-xs {{tabData.avbleAmount}}支/{{tabData.quantityType == '02' ? tabData.avblePoundWeight : tabData.avbleManagerWeight}}吨
    .padding-sm.solid-bottom.solid-top.text-black.ft-18 其他信息
    .padding-left-sm.padding-right-sm.padding-top.padding-bottom
      .solid
        .row.solid-bottom(v-for="(item, idx) in tabList", :key="idx")
          .col.solid-right.padding-sm {{item.label}}
          .col.padding-sm {{item.val}}
</template>
<script>
export default {
  data () {
    return {
      tabList: [
        { label: '公差', val: '', prop: ['tolerance'] },
        { label: '米重', val: '', prop: ['meterWeight'] },
        { label: '支/件', val: '', prop: ['pieces'] },
        { label: '可卖件', val: '', prop: ['marketablePiece'] },
        { label: '可买支', val: '', prop: ['marketableBranch'] },
        { label: '可卖数量', val: '', prop: ['avbleAmount'] },
        // { label: '新开单件', val: '', prop: ['goodsNewContractstr1'] },
        // { label: '新开单支', val: '', prop: ['goodsNewContractstr2'] },
        // { label: '新开单数量', val: '', prop: ['goodsNewNum'] },
        { label: '实物件', val: '', prop: ['matterPiece'] },
        { label: '实物支', val: '', prop: ['matterBranch'] },
        { label: '实物数量', val: '', prop: ['stockAmount'] },
        { label: '支单件', val: '', prop: ['inTaxPrice'] },
        { label: '理计可让价', val: '', prop: ['priceDiscountManager'] },
        { label: '磅计可让价', val: '', prop: ['priceDiscountPound'] },
        { label: '可卖理量/磅重', val: '', prop: ['avbleManagerWeight', 'avblePoundWeight'] },
        { label: '实物理重/磅重', val: '', prop: ['stockManagerWeight', 'stockPoundWeight'] },
        // { label: '未验收数量/理重/磅重', val: '', prop: ['goodsFnumStr', 'goodsFweightStr', 'goodsFassistweightStr'] },
        { label: '总锁定数量', val: '', prop: ['lockAmount'] },
        { label: '总锁定/理重/磅重', val: '', prop: ['lockManagerWeight', 'lockPoundWeight'] },
        // { label: '订货数量', val: '', prop: ['goodsOrdnumStr'] },
        // { label: '订货重量', val: '', prop: ['goodsOrdweightStr'] },
        { label: '提单件', val: '', prop: ['billOfLadingPiece'] },
        { label: '提单支', val: '', prop: ['billOfLadingBranch'] },
        { label: '提单数量', val: '', prop: ['ladingAmount'] },
        { label: '提单理重/磅重', val: '', prop: ['ladingManagerWeight', 'ladingPoundWeight'] },
        { label: '加工件', val: '', prop: ['processPiece'] },
        { label: '加工支', val: '', prop: ['processBranch'] },
        { label: '加工数量', val: '', prop: ['processAmount'] },
        { label: '加工理重/磅重', val: '', prop: ['processManagerWeight', 'processPoundWeight'] },
        { label: '人工锁定数量', val: '', prop: ['manualAmount'] },
        { label: '人工锁定数量/理重', val: '', prop: ['manualManagerWeight', 'manualPoundWeight'] },
        { label: '货权机构', val: '', prop: ['orgShortName'] }
      ],
      tabData: {}
    }
  },
  onUnload () {
    this.tabData = {}
    this.tabList = [
      { label: '公差', val: '', prop: ['tolerance'] },
      { label: '米重', val: '', prop: ['meterWeight'] },
      { label: '支/件', val: '', prop: ['pieces'] },
      { label: '可卖件', val: '', prop: ['marketablePiece'] },
      { label: '可买支', val: '', prop: ['marketableBranch'] },
      { label: '可卖数量', val: '', prop: ['avbleAmount'] },
      // { label: '新开单件', val: '', prop: ['goodsNewContractstr1'] },
      // { label: '新开单支', val: '', prop: ['goodsNewContractstr2'] },
      // { label: '新开单数量', val: '', prop: ['goodsNewNum'] },
      { label: '实物件', val: '', prop: ['matterPiece'] },
      { label: '实物支', val: '', prop: ['matterBranch'] },
      { label: '实物数量', val: '', prop: ['stockAmount'] },
      { label: '支单件', val: '', prop: ['inTaxPrice'] },
      { label: '理计可让价', val: '', prop: ['priceDiscountManager'] },
      { label: '磅计可让价', val: '', prop: ['priceDiscountPound'] },
      { label: '可卖理量/磅重', val: '', prop: ['avbleManagerWeight', 'avblePoundWeight'] },
      { label: '实物理重/磅重', val: '', prop: ['stockManagerWeight', 'stockPoundWeight'] },
      // { label: '未验收数量/理重/磅重', val: '', prop: ['goodsFnumStr', 'goodsFweightStr', 'goodsFassistweightStr'] },
      { label: '总锁定数量', val: '', prop: ['lockAmount'] },
      { label: '总锁定/理重/磅重', val: '', prop: ['lockManagerWeight', 'lockPoundWeight'] },
      // { label: '订货数量', val: '', prop: ['goodsOrdnumStr'] },
      // { label: '订货重量', val: '', prop: ['goodsOrdweightStr'] },
      { label: '提单件', val: '', prop: ['billOfLadingPiece'] },
      { label: '提单支', val: '', prop: ['billOfLadingBranch'] },
      { label: '提单数量', val: '', prop: ['ladingAmount'] },
      { label: '提单理重/磅重', val: '', prop: ['ladingManagerWeight', 'ladingPoundWeight'] },
      { label: '加工件', val: '', prop: ['processPiece'] },
      { label: '加工支', val: '', prop: ['processBranch'] },
      { label: '加工数量', val: '', prop: ['processAmount'] },
      { label: '加工理重/磅重', val: '', prop: ['processManagerWeight', 'processPoundWeight'] },
      { label: '人工锁定数量', val: '', prop: ['manualAmount'] },
      { label: '人工锁定数量/理重', val: '', prop: ['manualManagerWeight', 'manualPoundWeight'] },
      { label: '货权机构', val: '', prop: ['orgShortName'] }
    ]
  },
  onLoad (options) {
    console.log(options)
    const resData = JSON.parse(options.item)
    console.log(resData)
    this.tabData = resData
    this.tabList.map(item => {
      const valList = []
      item.prop.map(key => {
        console.log(key)
        valList.push(resData[key])
      })
      item.val = valList.toString().replace(/,/g, '/')
    })
  },
  // mounted () {
  //   this.$nextTick(() => {
  //     this.showLoading()
  //     this.loadData()
  //   })
  // },
  methods: {
    async loadData () {
      try {
        const sumGoodsDetail = this.apiList.xy.sumGoodsDetail
        const url = `${sumGoodsDetail.url}?sumgoods_batch=${this.$root.$mp.query.sumgoodsBatch}`
        const data = await this.ironRequest(url, '', sumGoodsDetail.method)
        this.tabData = data.data.list[0]
        const resData = data.data.list[0]
        this.tabList.map(item => {
          const valList = []
          item.prop.map(key => {
            valList.push(resData[key])
          })
          item.val = valList.toString().replace(/,/g, '/')
        })
        this.hideLoading()
      } catch (err) {
        this.hideLoading()
        this.showMsg(err)
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.mall-content
  // margin-top 150px
.cardSty
  padding 0 8px
  display flex
  flex-wrap wrap
  justify-content space-between
// .blue-buy
// border 1px solid #0081ff
// border-radius 15px
// width 70px
// padding 5px 0
// text-align center
// color #0081ff
.mall-row
  position absolute
  right 0px
  top -8px
  &.notice
    top -14px
.blue-buy
  display inline-block
  border-radius 20px
  letter-spacing 1px
  padding-left 10px
  padding-top 2px
  padding-right 10px
  text-align center
  // min-width 100px
  font-size 12px
  color #fff
  background #2485ff !important
  box-shadow none
  height 22px
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
.ml-8
  margin-left 8px !important
.card-list
  width 49%
  line-height 20px
  background #fff
  margin-bottom 8px
.supply
  background #F6F6F6
  padding 0 8px
  text-align center
  font-size 12px
  border-radius 10px
  color #262626
</style>