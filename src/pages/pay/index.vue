<template lang="pug">
div
  nav-bar(title="型云收银台", :bgClass="'bg-blue text-white'", isBack)
  .pay-head.bg-blue
    .section-one
      div 账户余额（元）
      .balance(:class="{'pb-0': freezeMoney == '1'}")
        span {{currentBalance}}
      .ft-16.text-center.padding(v-if="freezeMoney == '1'&&pageType !== 'ladPay' && pageType !== 'balance'") (该余额已被使用)
    .section-footer(v-if="pageType != 'balance'")
      .add-pay(v-if="(currentBalance < payMountInfo && payTabsActive === '全款支付') || (currentBalance < frontPrice && payTabsActive === '定金支付')")
        span 余额不足，赶紧补余款吧！
        //- i.material-icons.ft-20(style="margin-top: -4px;") info_outline
      .pay-info(v-else)
        span 余额充足，快去支付吧！
        //- i.material-icons.ft-20(style="margin-top: -4px;") mood
  .padding.c-red.ft-bold.ft-12(v-if="pageType == 'balance' || (pageType == 'ladPay' && currentBalance < payMountInfo)", style="background: rgb(254, 252, 238);")
    span.c-orange 温馨提示：请按转账银行信息汇款，款到自动进行余额充值
  template(v-if="pageType != 'balance'")
    .pay-tabs.flex.text-center.ft-bold.bg-white.ft-16
      .col.border-right-line.ft-666(@click="payTabs('全款支付')")
        span(:class="payTabsActive === '全款支付' ? 'pay-tab-active' : ''") 全款支付
      .col(@click="payTabs('定金支付')")
        span(:class="payTabsActive === '定金支付' ? 'pay-tab-active' : ''") 定金支付
    .pay-tabs-card
      .tishi(v-show="payTabsActive === '定金支付'") 定金比例约{{percent}}，请出库后补足尾款
      
      .pay-tabs-content
        template(v-if="payTabsActive === '全款支付'")
          .title(v-if="currentBalance < payMountInfo && pageType != 'ladPay'")
            span.ft-18 需补货款
            span.pl-5.c-gray (货款：{{payMountInfo}}元)
          .title(v-else)
            span.ft-18 货款
        template(v-else)    
          .title(v-if="currentBalance < frontPrice && pageType != 'ladPay'")
            span.ft-18 需补定金
            span.pl-5.c-gray (定金：{{frontPrice}}，货款：{{payMountInfo}}元)
          .title(v-else)
            span.ft-18 定金
            span.pl-5.c-gray (货款：{{payMountInfo}}元)
        .price            
          span(v-if="(currentBalance < payMountInfo) && freezeMoney != '1' && pageType != 'ladPay' && payTabsActive === '全款支付'") ￥{{payMountBalance}}
          span(v-else-if="(currentBalance < frontPrice) && payTabsActive === '定金支付' && freezeMoney != '1' && pageType != 'ladPay'") ￥{{frontBalance}}
          span(v-else) ￥{{payTabsActive === '全款支付' ? payMountInfo : frontPrice}} 
      .pay-pw.flex
        span.ft-16.text-bold 支付密码
        .col.margin-left-sm
          input.full-width(placeholder="请输入支付密码(必填)", type="password", v-model="payPwd")
  .pay-body        
    .pay-area(v-if="pageType != 'balance' && pageType !== 'ladPay' && pageType !=='offlinePay' && (currentBalance > payMountInfo)")
      q-btn.no-shadow.full-width.r-3(color="primary",big, @click="billPay") 去支付
    .offline-pay-area(v-else)
      .head.c-gray 打款信息
      .body.ft-13
        .row
          .col.flex-80 开户行
          .col.c-gray 农行
        .row.flex.flex-center
          .col.flex-80 开户行名称
          .col.c-gray 中国农业银行股份有限公司常州九龙支行
        .row.flex.flex-center
          .col.flex-80 开户名称
          .col.c-gray 江苏智恒达型云网络科技有限公司
        .row
          .col.flex-80 银行账号
          .col.c-gray 10613501040017200
        .row(@click="sendSmsChoosed", v-if="pageType == 'offlinePay'")
          img.choose-icon(src="/static/images/blue_check.png", v-if="smsNotify")
          img.choose-icon(src="/static/images/btn_ck_n.png", v-else)
          span.padding-left-xs 发送供应商开户信息至手机
      .footer(v-if="pageType == 'offlinePay'")
        button.main-btn(@click="billPay") 
          span(v-if="currentBalance < payMountInfo") 已线下转账补款
          span(v-else) 点击付款
        .info.c-gray.padding-top-xs.text-center
          span(v-if="currentBalance < payMountInfo") 点击按钮，线下收到货款，此单自动完成
          span(v-else) 点击按钮，此单自动完成
    alert(:msg="alertTitle", :cb="alertCb", v-model="alertShow")     
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      alertFlag: 0,
      alertShow: false,
      alertTitle: '',
      chooseType: 'balance',
      currentBalance: 0,
      btnDisable: false,
      orderNos: [],
      pics: [],
      remark: '',
      pageType: '',
      pBalance: '',
      payPwd: '',
      freezeMoney: '0',
      smsNotify: false,
      payTabsActive: '全款支付',
      percent: 0,
      totalMoney: 0,
      frontPrice: 0,
      payMountInfo: 0,
      payMountBalance: 0,
      frontBalance: 0,
      paymentType: '01' // 支付方式：01全款支付,02定向支付,03白条支付
    }
  },
  computed: {
    ...mapState({
      pzPreUrl: state => state.pzPreUrl
    })
  },
  watch: {
    payMountInfo (newVal) {
      this.payMountBalance = this.$toFixed(Number(newVal - this.currentBalance), 2)
    },
    frontPrice (newVal) {
      this.frontBalance = this.$toFixed(Number(newVal - this.currentBalance), 2)
    }
  },
  onShow () {
    this.whiteStatusBar()
    this.httpPost(this.apiList.zf.queryUserCenterContractInfo, {}).then(res => {
      this.currentBalance = res.data.unitFundBalance
    })
  },
  beforeMount () {
    this.pageType = this.$root.$mp.query.pageType
    if (this.$root.$mp.query.orderNo && (this.pageType === 'offlinePay' || this.pageType === 'ladPay')) {
      // this.orderNos = this.$root.$mp.query.orderNo.split(',')
      this.saleContractId = this.$root.$mp.query.orderNo
    }
    this.showLoading()
    let paramsObj = {
      // contractIdList: this.orderNos
      contractIdList: [this.saleContractId]
    }
    this.httpPost(this.apiList.zf.contractOrderDetail, paramsObj).then(res => {
      this.payMountInfo = res.data.contractMoney
      if (Number(this.currentBalance) < this.payMountInfo) {
        this.chooseType = 'offpay'
      } else {
        this.chooseType = 'balance'
      }
      if (this.pageType === 'balance') this.chooseType = 'offpay'
    }).finally(() => {
      this.hideLoading()
    })
    // this.ironRequest('balanceList.shtml?type=0&only_all=1&user_id=' + this.currentUser.user_id, {}, 'get').then(res => {
    //   if (res.returncode === '0') {
    //     this.freezeMoney = res.freeze_money
    //     console.log(this.chooseType)
    //   }
    //   this.hideLoading()
    // })
    // console.log('this.$route.query.orderNo', this.$root.$mp.query.orderNo)
    // this.ironRequest('orderPayDetail.shtml?tstc_nos=' + this.$root.$mp.query.orderNo, {}, 'get').then(res => {
    //   const resData = res
    //   if (res.returncode === '0') {
    //     this.currentBalance = resData.desposit_can
    //     this.payMountInfo = resData.total_money
    //     this.percent = this.$toFixed(resData.percent * 100, 2) + '%'
    //     this.frontPrice = resData.front_price
    //     if (Number(this.currentBalance) < this.payMountInfo) {
    //       this.chooseType = 'offpay'
    //     } else {
    //       this.chooseType = 'balance'
    //     }
    //     if (this.pageType === 'balance') this.chooseType = 'offpay'
    //   }
    // }).catch(err => {
    //   this.showMsg(err || '网络异常')
    // })
  },
  onUnload () {
    this.payPwd = ''
    this.alertShow = false
    this.btnDisable = false
  },
  methods: {
    alertCb () {
      const me = this
      if (this.alertFlag === 1) {
        me.showLoading()
        setTimeout(() => {
          me.hideLoading()
          me.redirect('/pages/bill/main?tabName=6')
        }, 3000)
        me.btnDisable = false
      } else if (this.alertFlag === 2) {
        me.redirect('/pages/bill/main?tabName=0')
        me.btnDisable = false
      }
      this.alertShow = false
    },
    sendSmsChoosed () {
      this.smsNotify = !this.smsNotify
      this.$forceUpdate()
    },
    backInfo () {
      const me = this
      this.confirm({ content: '您的合同在120min内未支付将做违约处理，请尽快完成支付，确认要离开收银台？' }).then((res) => {
        if (res !== 'confirm') return false
        me.back()
      })
    },
    billPay () {
      const self = this
      if (this.pageType === 'offlinePay' || (this.pageType === 'ladPay' && (this.currentBalance > this.payMountInfo))) {
        if (this.payPwd.toString().trim().length === 0) {
          this.showMsg('请输入支付密码')
          return
        }
        if (!this.pwdReg.test(this.payPwd)) {
          this.showMsg('请输入6-12位密码，只能是数字、字母和下划线')
          this.canHttp = false
          return
        }
      }
      if (!this.btnDisable) {
        // let ordernos = this.orderNos.join(',')
        // let encyptPwd = me.base64Str(this.payPwd)
        const msgs = '磅计物资提货时，如需实提补款，平台将从余额扣取相应金额'
        console.log('1')
        this.confirm({ content: msgs }).then((res) => {
          if (res !== 'confirm') return false
          let paramsOnj = {
            contractIdList: [self.saleContractId],
            paymentType: self.paymentType,
            paymentPassword: self.payPwd
          }
          console.log(this.chooseType)
          self.httpPost(this.apiList.zf.contractOrderPayment, paramsOnj)
            .then(() => {
              self.showMsg('支付成功！')
              setTimeout(() => {
                this.back(2)
              }, 1000)
            }).catch((e) => {
              self.showMsg(e.message)
            })
          // if (this.chooseType === 'offpay') {
          //   // 线下转账/或预约支付
          //   this.btnDisable = true
          //   let body = {}
          //   if (this.pageType === 'offlinePay' || this.pageType === 'ladPay') {
          //     body = {
          //       order_nos: ordernos,
          //       bank_no: '10613501040017200',
          //       pay_type: 1,
          //       user_id: this.currentUser.user_id,
          //       pay_pass: encyptPwd,
          //       remark: '',
          //       credent_pics: ''
          //     }
          //     if (this.pageType === 'offlinePay') {
          //       // body.pay_type = 3
          //       body.is_appoint_pay = 1
          //       body.need_fund_in = this.$toFixed(Number(this.payMountInfo - this.currentBalance), 2)
          //     }
          //     if (this.payTabsActive === '定金支付') {
          //       body.pay_type = 2
          //     }
          //     let reqUrl = 'offlinePay.shtml'
          //     if (this.pageType === 'ladPay') {
          //       reqUrl = 'contractPay.shtml'
          //       body.contract_no = this.$route.query.contractNo
          //     }
          //     this.ironRequest(reqUrl, body, 'post').then(resp => {
          //       console.log('res', resp)
          //       if (resp.returncode === '0') {
          //         this.confirm({ content: '银行转账信息提交成功，请耐心等待审批' }).then((res) => {
          //           // if (res !== 'confirm') return false
          //           me.btnDisable = false
          //           me.back()
          //         })
          //       } else {
          //         me.btnDisable = false
          //         me.showMsg(resp === undefined ? '网络异常' : resp.errormsg)
          //       }
          //     }).catch(err => {
          //       this.btnDisable = false
          //       me.showMsg(err || '网络异常')
          //     })
          //   } else {
          //     // 余额充值
          //     body = {
          //       bank_no: '10613501040017200',
          //       user_id: this.currentUser.user_id,
          //       remark: this.remark,
          //       price: this.pBalance,
          //       credent_pics: ''
          //     }
          //     this.showLoading()
          //     this.ironRequest('recharge.shtml', body, 'post').then(resp => {
          //       if (resp.returncode === '0') {
          //         this.confirm({ content: '银行转账信息提交成功，请耐心等待审批' }).then((res) => {
          //           this.hideLoading()
          //           if (res === 'confirm') {
          //             me.back()
          //           }
          //           me.btnDisable = false
          //         })
          //       } else {
          //         me.btnDisable = false
          //         me.showMsg(resp === undefined ? '网络异常' : resp.errormsg)
          //       }
          //     }).catch(err => {
          //       this.btnDisable = false
          //       this.hideLoading()
          //       me.showMsg(err || '网络异常')
          //     })
          //   }
          // } else {
          //   // 余额支付(订单/合同余额充足的情况)
          //   me.btnDisable = true
          //   let body = {
          //     order_nos: ordernos,
          //     user_id: me.currentUser.user_id,
          //     pay_pass: encyptPwd,
          //     pay_type: 1,
          //     remark: ''
          //   }
          //   let reqUrl = 'offlinePay.shtml'
          //   if (me.pageType === 'ladPay') {
          //     reqUrl = 'contractPay.shtml'
          //     body.contract_no = me.$root.$mp.query.contractNo
          //   }
          //   if (this.payTabsActive === '定金支付') {
          //     body.pay_type = 2
          //   }
          //   if (this.smsNotify) body.sms_notify = 1
          //   this.showLoading()
          //   me.ironRequest(reqUrl, body, 'post', me).then(res => {
          //     me.hideLoading()
          //     if (res && res.returncode === '0') {
          //       if (me.pageType === 'offlinePay') {
          //         this.alertTitle = '支付成功！请联系司机去平台仓库提货!'
          //         this.alertFlag = 1
          //         this.alertShow = true

          //         // me.confirm({ content: '支付成功！请联系司机去平台仓库提货!' }).then((res) => {
          //         //   me.showLoading()
          //         //   if (res === 'confirm') {
          //         //     setTimeout(() => {
          //         //       me.hideLoading()
          //         //       me.redirect('/pages/bill/main?tabName=6')
          //         //     }, 3000)
          //         //   }
          //         //   me.btnDisable = false
          //         // })
          //       } else {
          //         me.alertTitle = '支付成功'
          //         me.alertFlag = 2
          //         me.alertShow = true
          //         // me.confirm('支付成功!').then((res) => {
          //         //   if (res === 'confirm') {
          //         //     me.redirect('/pages/bill/main?tabName=0')
          //         //   }
          //         //   me.btnDisable = false
          //         // })
          //       }
          //     } else {
          //       me.btnDisable = false
          //       me.showMsg(res === undefined ? '网络异常' : res.errormsg)
          //     }
          //   }).catch(err => {
          //     me.hideLoading()
          //     me.showMsg(err)
          //     me.btnDisable = false
          //   })
          // }
        })
      }
    },
    payTabs (flag) {
      this.payTabsActive = flag
    }
  }
}
</script>
<style lang="stylus" scoped>
.h-16
  height 16px
.mt-3
  margin-top 3px
.pay-head
  color #fff
  .section-one
    padding 10px 20px
    .balance
      font-size 38px
      font-weight bold
      padding 10px 0
      text-align center
      overflow hidden
  .section-footer
    text-align center
    padding-bottom 10px
    .add-pay
      padding 10px
      background rgb(254, 252, 238)
      width 220px
      border-radius 3px
      margin 0 auto
      color #f95353
    .pay-info
      padding 10px
      width 220px
      border-radius 3px
      margin 0 auto
      background rgba(157, 200, 255, 0.5)
.pay-body
  padding 10px 0px
  .input-area
    background #fff
    padding 20px 16px
    font-size 15px
    input
      border none
      outline none
  .pay-area
    padding 20% 0rem 10px 0rem
  .offline-pay-area
    .head
      padding 10px 10px
      padding-top 0px
    .body
      background #fff
      padding 16px
      .row + .row
        margin-top 16px
    .footer
      padding-top 10px
      padding-left 10px
      padding-right 10px
      .info
        // text-align: center;
        // padding-top: 1rem;
.bg-pic
  background-position center
  background-size cover
  width 60px
  height 60px
.pre-pic
  position relative
  margin-right 10px
  display inline-block
  box-shadow 2px 3px 5px #ddd
  img
    width 60px
    height 60px
    object-fit cover
    object-position center
  .del
    position absolute
    background-size cover
    background-position center
    height 15px
    width 15px
    top 0px
    right 0px
    z-index 20
.pay-tabs
  padding 15px
  span
    padding 14px
.pay-tab-active
  border-bottom 1px #3da7ff solid
  color #3da7ff
.pay-tabs-card
  .tishi
    margin-top 10px
    padding 10px
    color #f95353
    background rgb(254, 252, 238)
  .pay-tabs-content
    margin-top 10px
    padding 10px 20px
    background #fff
    .price
      font-size 25px
      margin-top 6px
  .pay-pw
    padding 15px 10px
    align-items center
    margin-top 10px
    background #fff
</style>