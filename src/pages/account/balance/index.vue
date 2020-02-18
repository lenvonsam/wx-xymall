<template lang="pug">
div
  nav-bar(title="账户余额", bgClass="bg-blue text-white", isBack)
  .bg-blue.padding.text-white
    div
      icon.cuIcon-vipcard
      span.margin-left 账户余额（元）
    .text-center.margin-top-xl.text-bold(style="font-size: 30px") {{currentUser.account_balance}}
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
import { mapState } from 'vuex'
export default {
  data () {
    return {}
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser
    })
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
