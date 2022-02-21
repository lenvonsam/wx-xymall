<template lang="pug">
div
  nav-bar(title="买家确认页", isBack)
  .pb-half-rem
    .bg-white.flex.padding-sm
      .col
        span {{billDetail.saleContractNo}}
        copy-btn(:copyUrl="billDetail.saleContractNo")
      .col.text-right(v-if="billDetail.status_desc === '待补款'")
        span.text-blue 待补款:
        span.padding-left-sm.text-red.text-bold ￥{{billDetail.paid_price_desc}}
      .col.flex-100.text-blue.text-right(v-else, :class="{'text-red': billDetail.status_desc == '违约'}") {{billDetail.status_desc}}
    .bg-white.margin-top-sm.text-content
      .padding-sm.text-black.text-bold.solid-bottom.ft-15 商品信息
      .ft-13.padding-sm.solid-bottom.relative(v-for="(item, idx) in billDetail.contractDetailList", :key="idx")
        .flex
          .col
            span.ft-15 {{item.productBrandName}}
            span.ml-5 {{item.specification}}
          .col.text-right.flex-100 ￥{{item.inTaxPrice}}元/吨
        .flex.padding-bottom-xs.padding-top-xs.text-gray
          .col
            span {{item.productTextureName}}
            span.padding-left-sm {{item.length}}米
            span.padding-left-sm.padding-right-sm {{item.stockZoneName}}
            span.sub-mark {{item.prodAreaName}}
          .text-right （{{item.quantityType == '02' ? '磅计' : '理计'}}）
        // .text-gray {{item.amount}} 支 / {{item.quantityType == '02' ? item.poundWeight : item.managerWeight}}吨
        .text-gray {{item.amount}} 支 / {{item.secondWeight}}吨
        .text-gray(v-if="item.toleranceRange || item.weightRange")
          span.padding-right-sm(v-if="item.toleranceRange") 公差范围 {{item.toleranceRange}}
          span(v-if="item.weightRange") 重量范围 {{item.weightRange}}
    .bg-white.margin-top-sm.text-content
      .padding-sm.text-black.text-bold.solid-bottom.ft-15 旧单信息
      .padding-sm
        .flex 货款：
          span.text-gray {{oldOrder.paymentForGoods}}元
        .flex 吊费：
          span.text-gray {{oldOrder.hangingFee}}元
        .flex 合同合计：
          span.text-gray {{oldOrder.totalContract}}元
        .flex 实际金额：
          span.text-gray {{oldOrder.actualAmount}}元
        .flex 已结算：
          span.text-gray {{oldOrder.settled}}元
    .bg-white.margin-top-sm.text-content
      .padding-sm.text-black.text-bold.solid-bottom.ft-15 新单信息
      .padding-sm
        .flex 货款：
          span.text-gray {{newOrder.paymentForGoods}}元
        .flex 吊费：
          span.text-gray {{newOrder.hangingFee}}元
        .flex 合同合计：
          span.text-gray {{newOrder.totalContract}}元
        .flex 预计需补尾款：
          span.text-gray {{newOrder.balancePayment}}元
    .footer.row.bg-white.text-center.text-white.padding-sm(:style="{'padding-bottom': isIpx ? '68rpx' : '20rpx'}")
     .bg-red.col.padding-sm.round(@click="updateBill('02')") 驳回
     .bg-blue.col.margin-left-sm.padding-sm.round(@click="updateBill('01')") 确认修改提单
    alert(:msg="alertText", v-model="alertShow")
</template>
<script>
import copyBtn from '@/components/CopyBtn.vue'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      contractId: '',
      billDetail: {},
      btnDisable: false,
      oldOrder: {
        paymentForGoods: 0,
        hangingFee: 0,
        totalContract: 0,
        actualAmount: 0,
        settled: 0,
        inTaxExecuteMoney: 0
      },
      newOrder: {
        paymentForGoods: 0,
        hangingFee: 0,
        totalContract: 0,
        balancePayment: 0
      },
      alertShow: false,
      isHasRoll: false,
      alertText: '此合同含有卷类物资，不能进行修改，如需修改请联系业务员!'
    }
  },
  components: {
    copyBtn
  },
  computed: {
    ...mapState({
      contractStatus: state => state.contractStatus
    })
  },
  beforeMount () {
    this.contractId = this.$root.$mp.query.contractId || ''
    this.httpPost(this.apiList.zf.saleContractDetail, {contractId: this.$root.$mp.query.contractId}).then(res => {
      console.log(res.data)
      this.billDetail = res.data
      this.billDetail.status_desc = this.contractStatus.find(c => {
        return c.id === res.data.xingyunContractStatus
      }).name
      res.data.contractDetailList.map((ic, idx) => {
        // 商品列表
        ic.goodsInfo = {}
        ic.goodsInfo.productBrandName = ic.productBrandName.includes('协议类') ? ic.productBrandName.substring(3, ic.productBrandName.length) : ic.productBrandName
        ic.goodsInfo.productTextureName = ic.productTextureName
        ic.goodsInfo.specification = ic.specification
        ic.goodsInfo.length = ic.length
        ic.goodsInfo.prodAreaName = ic.prodAreaName
        ic.goodsInfo.toleranceRange = ic.toleranceRange
        ic.goodsInfo.weightRange = ic.weightRange

        ic.weight = {}
        ic.weight.quantityType = ic.quantityType
        ic.weight.avbleManagerWeight = ic.managerWeight
        ic.weight.avblePoundWeight = ic.poundWeight

        ic.fhWeight = {}
        ic.fhWeight.quantityType = ic.quantityType
        ic.fhWeight.outManagerWeight = ic.outManagerWeight
        ic.fhWeight.outPoundWeight = ic.outPoundWeight

        ic.secondNumber = ic.pendingAmount
        ic.ratioAvailableAmount = ic.ratioAvailableAmount + ic.amount
        if (ic.productBrandName.includes('卷')) {
          this.alertShow = true
          this.isHasRoll = true
        }
      })

      // 旧单信息
      // 货款
      this.oldOrder.paymentForGoods = (res.data.ladingGoodsMoney + res.data.unspentLadingGoodsAmount).toFixed(2)
      // 吊费
      this.oldOrder.hangingFee = (res.data.unspentLadingLiftingAmount + res.data.ladingLiftingFeeMoney).toFixed(2)
      // 合同共计
      this.oldOrder.totalContract = (res.data.unspentLadingAmount + res.data.inTaxLadingMoney).toFixed(2)
      // 实际金额
      this.oldOrder.actualAmount = res.data.inTaxPayMoney.toFixed(2)
      // 已结算（实发合同金额）
      this.oldOrder.settled = res.data.inTaxLadingMoney.toFixed(2)
      // 已执行金额(含税)
      // this.oldOrder.inTaxExecuteMoney = res.data.inTaxExecuteMoney.toFixed(2)

      // 新单信息
      this.newOrder.balancePayment = res.data.inTaxReceiveMoney
      let tableData = [res.data]
      tableData.forEach(x => {
        let a = 0
        let b = 0
        let c = 0
        let d = 0
        let e = 0
        console.log(x)
        x.contractDetailList.map(ic => {
          console.log(ic)
          ic.amount = ic.secondNumber
          console.log(ic.amount)
          if (ic.floatType === '03') {
            ic.secondWeight = ic.maxWeight
          } else {
            ic.secondWeight = this.calcWeight(
              ic.quantityType,
              ic.secondNumber,
              ic.meterWeight,
              ic.length,
              ic.tolerance,
              ic.floatingRatio
            )
            console.log('ic.secondWeight', ic.secondWeight)
            if (ic.weight.quantityType === '01') {
              ic.managerWeight = ic.secondWeight
            } else {
              ic.poundWeight = ic.secondWeight
            }
          }
          e = Number(ic.secondWeight * ic.inTaxPrice)
          ic.secondPrice = e.toFixed(2)
          // 新单信息
          // 货款 = 单价 * 重量
          a += ic.secondWeight * ic.inTaxPrice
          // 吊费 =  吊费单价 * 重量
          b += ic.secondWeight * ic.liftingFee
          // 合同共计吊费 + 货款
          c = a + b
          // 预计需补尾款 合同共计 - 已付金额
          d = c - Number(x.inTaxPayMoney)
        })
        // 货款
        this.newOrder.paymentForGoods = a.toFixed(2)
        // 吊费
        this.newOrder.hangingFee = b.toFixed(2)
        // 合同共计
        this.newOrder.totalContract = c.toFixed(2)
        // 预计需补尾款
        this.newOrder.balancePayment = d.toFixed(2)
      })
    })
  },
  methods: {
    updateBill (affirmStatus) {
      if (this.isHasRoll) {
        this.alertShow = true
        return
      }
      this.confirm({content: '请确认修改合同'}).then(res => {
        if (res === 'confirm') {
          this.showLoading()
          let paramsObj = {
            saleContractId: this.contractId,
            affirmStatus: affirmStatus, // 01确认 02驳回
            soureOperation: 'xingyun' // ERP xingyun
          }
          this.httpPost(this.apiList.zf.saleContractUpateAffirm, paramsObj)
            .then(res => {
              if (res.success) {
                this.hideLoading()
                this.showMsg('修改合同确认成功')
                setTimeout(() => {
                  this.jump('/pages/ladbillConfirm/main')
                }, 1500)
              }
            })
            .catch(e => {
              this.hideLoading()
              this.showMsg(e.message)
            })
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.bill-item-line
  border 0.5px solid #ddd
  height 0.5px
  position absolute
  bottom 0px
  right 0px
  left 0.5rem
.confirm-mark
  width 50px
  height 50px
  background-size cover
  background-position center
.delete-style
  text-decoration line-through
</style>



