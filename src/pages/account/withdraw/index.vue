<template lang="pug">
div
  nav-bar(title="提现申请", isBack)
  .bg-white
    .row.padding
      .flex-100
        span.text-red *
        span.ml-5 结算银行
      .col.text-right.text-gray {{currentUser.settle_bank}}
    .row.padding.padding-top-sm
      .col.flex-100
        span.text-red *
        span.ml-5 银行账户名
      .col.text-right.text-gray {{currentUser.bank_name}}
    .row.padding.padding-top-sm
      .col.flex-100
        span.text-red *
        span.ml-5 银行账户
      .col.text-right.text-gray {{currentUser.bank_account}}
  .bg-white.margin-top-xl
    .padding.row.border-bottom-line
      .flex-25
        img.choose-icon(src="/static/images/yh.png", style="height: 24rpx")
      .col {{currentUser.settle_bank}}（{{bankCardEnd}}）
      .flex-60.ft-12.text-right.text-blue(@click="jumpWithdraw") 提现进度
    .row.padding.pt-15.pb-15.flex-center
      .col.flex-25
        .ft-25 ￥
      .col.pl-10.pr-10
        input.full-width.ft-16(:placeholder="'可转出到卡'+currentUser.account_balance+'元'", v-model="chargeVal", type="number")
      .col.flex-50.text-blue.ft-12(@click="withdrawAll") 全部提出
  .padding.margin-top-lg
   .main-btn(hover-class="hover-gray", @click="confirmWithdraw") 确认提现
  modal-input(v-model="modalShow", placeholder="请输入支付密码", title="支付密码", type="password", :cb="inputChange", confirmText="提现")
  alert(title="提现申请成功，请耐心等待审批", :cb="alertCb", v-model="alertShow")
</template>

<script>
import { mapState } from 'vuex'
import modalInput from '@/components/ModalInput.vue'
export default {
  data () {
    return {
      bankCardEnd: '',
      chargeVal: '',
      modalShow: false,
      canClick: true,
      alertShow: false
    }
  },
  components: {
    modalInput
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser
    })
  },
  onShow () {
    this.bankCardEnd = this.currentUser.bank_account.substring(this.currentUser.bank_account.length - 4)
    this.chargeVal = ''
    this.canClick = true
  },
  methods: {
    alertCb () {
      this.back()
    },
    async inputChange ({ type, val }) {
      try {
        if (type === 'confirm' && this.canClick) {
          this.canClick = false
          let encryptPwd = this.base64Str(val)
          await this.ironRequest(this.apiList.xy.withdraw.url, { user_id: this.currentUser.user_id, price: this.chargeVal, password: encryptPwd }, 'post', this)
          this.canClick = true
          this.chargeVal = ''
          this.alertShow = true
        }
      } catch (e) {
        this.canClick = true
        this.showMsg(e)
      }
    },
    withdrawAll () {
      this.chargeVal = this.currentUser.account_balance
    },
    confirmWithdraw () {
      if (this.chargeVal.trim().length === 0) {
        this.showMsg('请输入提现金额')
        return
      }
      if (Number(this.chargeVal) <= 0) {
        this.showMsg('提现金额不能小于等于0')
        return
      }
      if (Number(this.chargeVal) > Number(this.currentUser.account_balance)) {
        this.showMsg('提现金额不能超过账户余额')
        return
      }
      this.modalShow = true
      // const me = this
      // Dialog.create({
      //   title: '请输入支付密码',
      //   form: {
      //     pass: {
      //       label: '支付密码',
      //       type: 'password',
      //       model: ''
      //     }
      //   },
      //   buttons: [
      //     '取消',
      //     {
      //       label: '提现',
      //       handler (data) {
      //         if (data.pass.trim().length === 0) {
      //           me.msgShow('密码不能为空')
      //         } else {
      //           me.btnDisable = true
      //           let encryptPwd = me.base64Str(data.pass)
      //           me.ironRequest('withdraw.shtml', { user_id: me.currentUser.user_id, price: me.chargeVal, password: encryptPwd }, 'post', me).then(resp => {
      //             if (resp.data.returncode === '0') {
      //               me.alertDialog('提现申请成功，请耐心等待审批').then(() => {
      //                 me.btnDisable = false
      //                 me.back()
      //               })
      //             } else {
      //               me.btnDisable = false
      //               me.msgShow(resp.data === undefined ? '网络异常' : resp.data.errormsg)
      //             }
      //           })
      //         }
      //       }
      //     }
      //   ]
      // })
    },
    jumpWithdraw () {
      this.statisticRequest({ event: 'click_app_balance_withdraw' }, this)
      this.jump('/pages/cardList/main?type=queryWithdrawList&title=提现进度')
    }
  }
}
</script>

