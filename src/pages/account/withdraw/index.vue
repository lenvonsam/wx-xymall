<template lang="pug">
div
  nav-bar(title="提现申请", isBack)
  .bg-white
    .row.padding
      .flex-100
        span.text-red *
        span.ml-5 结算银行
      .col.text-right.text-gray {{record.withdrawUnitBankName}}
    .row.padding.padding-top-sm
      .col.flex-100
        span.text-red *
        span.ml-5 银行账户名
      .col.text-right.text-gray {{record.withdrawUnitBankAccountName}}
    .row.padding.padding-top-sm
      .col.flex-100
        span.text-red *
        span.ml-5 银行账户
      .col.text-right.text-gray {{record.withdrawUnitBankAccount}}
  .bg-white.margin-top-xl
    .padding.row.border-bottom-line
      .flex-25
        img.choose-icon(src="/static/images/yh.png", style="height: 24rpx")
      .col {{record.withdrawUnitBankCodeName}}（{{bankCardEnd}}）
      .flex-60.ft-12.text-right.text-blue(@click="jumpWithdraw") 提现进度
    .row.padding.pt-15.pb-15.flex-center
      .col.flex-25
        .ft-25 ￥
      .col.pl-10.pr-10
        input.full-width.ft-16(:placeholder="'可转出到卡' + record.canWithdrawAmt + '元'", v-model="chargeVal", type="digit")
      .col.flex-50.text-blue.ft-12(@click="withdrawAll") 全部提出
  .padding.margin-top-lg
   .main-btn(hover-class="hover-gray", @click="confirmWithdraw") 确认提现
  modal-input(v-model="modalShow", placeholder="请输入支付密码", title="支付密码", type="password", :cb="inputChange", confirmText="提现")
  alert(msg="提现申请成功，请耐心等待审批", :cb="alertCb", v-model="alertShow")
</template>

<script>
import modalInput from '@/components/ModalInput.vue'
export default {
  data () {
    return {
      chargeVal: '',
      modalShow: false,
      canClick: true,
      alertShow: false,
      compObj: {},
      record: {
        withdrawUnitBankName: '',
        withdrawUnitBankAccount: '',
        withdrawUnitBankAccountName: '',
        canWithdrawAmt: '',
        withdrawApplyMoney: '',
        payPwd: '',
        validCode: '',
        remark: '',
        withdrawUnitId: '',
        withdrawUnitName: '',
        withdrawUnitBankCode: '',
        withdrawUnitBankCodeName: '',
        withdrawUnitBankNo: '',
        companyCode: '',
        companyName: ''
      }
    }
  },
  components: {
    modalInput
  },
  onShow () {
    this.chargeVal = ''
    this.canClick = true
  },
  onLoad () {
    // this.remoteCompanyInfo()
    this.withdrawalApplicationPreQuery()
  },
  computed: {
    bankCardEnd () {
      let withdrawUnitBankAccount = this.record.withdrawUnitBankAccount + ''
      return withdrawUnitBankAccount.substring(withdrawUnitBankAccount.length - 4)
    }
  },
  methods: {
    // 获取公司信息
    // async remoteCompanyInfo () {
    //   try {
    //     let res = await this.httpPost(this.apiList.zf.selectCompanyInfo)
    //     this.compObj = res.data
    //     this.bankCardEnd = this.compObj.bankAccount.substring(this.compObj.bankAccount.length - 4)
    //   } catch (e) {
    //     this.showMsg(e)
    //   }
    // },
    // 弹出框回调
    alertCb () {
      this.back()
    },
    // 提现数据准备
    async withdrawalApplicationPreQuery () {
      try {
        const { data } = await this.httpGet(this.apiList.zf.prepareWithdrawApply)
        console.log('tag', data)
        this.record.withdrawUnitBankName = data.withdrawUnitBankName
        this.record.withdrawUnitBankAccount = data.withdrawUnitBankAccount
        this.record.withdrawUnitBankAccountName = data.withdrawUnitBankAccountName
        this.record.canWithdrawAmt = data.canWithdrawAmt
        this.record.withdrawUnitId = data.withdrawUnitId
        this.record.withdrawUnitName = data.withdrawUnitName
        this.record.withdrawUnitBankCode = data.withdrawUnitBankCode
        this.record.withdrawUnitBankCodeName = data.withdrawUnitBankCodeName
        this.record.withdrawUnitBankNo = data.withdrawUnitBankNo
        this.record.companyCode = data.companyCode
        this.record.companyName = data.companyName
      } catch (e) {
        this.msg(e.message)
      }
    },
    // 支付模态框回调（取消/提现）
    async inputChange ({ type, val }) {
      try {
        if (type === 'confirm' && this.canClick) {
          this.showLoading()
          this.canClick = false
          // let encryptPwd = this.base64Str(val)
          var params = {
            withdrawUnitBankName: this.record.withdrawUnitBankName,
            withdrawUnitBankAccount: this.record.withdrawUnitBankAccount,
            withdrawUnitBankAccountName: this.record.withdrawUnitBankAccountName,
            canWithdrawAmt: this.currentUser.unitFundBalance,
            companyCode: this.record.companyCode,
            companyName: this.record.companyName,
            withdrawApplyMoney: this.chargeVal,
            // payPassword: encryptPwd,
            payPassword: val,
            // verifyCode: this.record.validCode,
            remark: this.record.remark,
            withdrawUnitId: this.record.withdrawUnitId,
            withdrawUnitName: this.record.withdrawUnitName,
            withdrawUnitBankCode: this.record.withdrawUnitBankCode,
            withdrawUnitBankCodeName: this.record.withdrawUnitBankCodeName,
            withdrawUnitBankNo: this.record.withdrawUnitBankNo,
            randomKey: this.randomKey,
            appId: '03'
          }
          this.httpPost(this.apiList.zf.addWithdraw, params).then(resp => {
            console.log(resp)
            this.canClick = true
            this.hideLoading()
            this.chargeVal = ''
            this.alertShow = true
          }).catch(e => {
            this.canClick = true
            this.hideLoading()
            console.log(e)
            this.showMsg(e.message)
          })
        }
      } catch (e) {
        this.canClick = true
        this.hideLoading()
        this.showMsg(e.message)
      }
    },
    // 点击全部提出
    withdrawAll () {
      this.chargeVal = this.record.canWithdrawAmt
    },
    // 跳转提现进度
    jumpWithdraw () {
      this.statisticRequest({ event: 'click_app_balance_withdraw' })
      this.jump('/pages/cardList/main?type=searchWithdraw&title=提现进度')
    },
    // 点击确认提现
    confirmWithdraw () {
      if (this.chargeVal.trim().length === 0) {
        this.showMsg('请输入提现金额')
        return
      }
      if (Number(this.chargeVal) <= 0) {
        this.showMsg('提现金额大于0元')
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
      //              if (resp.data.returncode === '0') {
      //              me.alertDialog('提现申请成功，请耐心等待审批').then(() => {
      //              me.btnDisable = false
      //              me.back()
      //           })
      //         } else {
      //               me.btnDisable = false
      //               me.msgShow(resp.data === undefined ? '网络异常' : resp.data.errormsg)
      //             }
      //           })
      //         }
      //       }
      //     }
      //   ]
      // })
    }
  }
}
</script>

