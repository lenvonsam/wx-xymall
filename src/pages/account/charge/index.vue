<template lang="pug">
div
  nav-bar(title="余额充值", bgClass="bg-blue text-white", isBack)
  .bg-blue.padding.text-white
    div
      icon.cuIcon-vipcard
      span.margin-left 账户余额（元）
    .text-center.margin-top-xl.text-bold.margin-bottom(style="font-size: 30px") {{currentUser.account_balance}}
  .padding.ft-12(style="background: #FEF7E7")
    span.text-red 温馨提示：请按转账银行信息还款，款到自动进行余额充值
  .bg-white.padding
    .ft-16.text-bold 打款信息
    .row.margin-top
      .col.flex-80 开户行
      .col 农行
    .row.margin-top-sm
      .col.flex-80 银行账号
      .col 中国农业银行股份有限公司常州九龙支行
    .row.margin-top-sm
      .col.flex-80 开户名称
      .col 江苏智恒达型云网络科技有限公司
    .row.margin-top-sm
      .col.flex-80 银行账号
      .col 10613501040017200
</template>

<script>
export default {
  onShow () {
    this.whiteStatusBar()
  }
}
</script>

