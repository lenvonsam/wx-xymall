<template lang="pug">
div
  nav-bar(title="账户余额", bgClass="bg-blue text-white", isBack)
  .bg-blue.padding.text-white
    div
      icon.cuIcon-vipcard
      span.margin-left 账户余额（元）
    .text-center.margin-top-xl.text-bold(style="font-size: 30px") {{currentUser.unitFundBalance}}
    .text-center.margin-top
      .balance-mark(@click="jump('/pages/account/balanceList/main')") 收支明细
  .bg-white
    .padding.row.border-bottom-line(@click="jump('/pages/account/charge/main')")
      .flex-30.flex.align-center
        img.balance-icon(src="/static/images/cz.png")
      .col 充值
      .flex-30.text-right.text-gray
        icon.adjust.cuIcon-right
    .padding.row(@click="jump('/pages/account/withdraw/main')")
      .flex-30.flex.align-center
        img.balance-icon(src="/static/images/tx.png")
      .col 提现
      .flex-30.text-right.text-gray
        icon.adjust.cuIcon-right

</template>

<script>
export default {
  data () {
    return {
      queryObj: {
        pageNum: 1,
        pageSize: 10,
        busiEventDateS: '',
        busiEventDateE: '',
        busiEventType: '',
        saleContractNo: ''
      }
    }
  },
  onShow () {
    // this.whiteStatusBar()
    this.loadData()
  },
  methods: {
    loadData () {
      this.httpPost(this.apiList.zf.fundDetail, this.queryObj)
        .then((res) => {
          this.tableValue.pagination.total = res.total
          this.tableValue.tableData = res.data
          this.totalNumber = res.data.length
          this.loading(false)
        }).finally(() => {
          this.loading(false)
        })
      this.httpPost(this.apiList.zf.fundDetailSummary, this.queryObj)
        .then((res) => {
          this.summary = {
            contractMoney: res.data.contractPaymentMoney || 0,
            contractNum: res.data.contractNum || 0,
            refundMoney: res.data.refundMoney || 0,
            fundInMoney: res.data.rechargeMoney || 0,
            fundOutMoney: res.data.withdrawableMoney || 0
          }
        })
      // this
      //   .httpGet(this.apiList.zf.getUnitMoney)
      //   .then((res) => {
      //     console.log(res)
      //     this.accountBalanceMoney = res.data
      //   })
      //   .catch((e) => {
      //     console.log(e)
      //     this.msgShow({ msg: e.message })
      //   })
    }
  }
}
</script>


<style lang="stylus" scoped>
.balance-mark
  display inline-block
  width 150px
  height 35px
  background rgba(255, 255, 255, 0.2)
  border-radius 5px
  font-size 16px
  padding-top 6px
.balance-icon
  width 16px
  height 15px
</style>
