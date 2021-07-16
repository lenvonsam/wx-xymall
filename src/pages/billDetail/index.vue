<template lang="pug">
div
  nav-bar(:title="navBarTitle", isBack)
  .pb-half-rem
    .padding-sm.ft-12(style="background: #FEF7E7;", v-if="billDetail.status_desc === '待补款'")
      span.text-orange 请按照补款金额，打款至供应商账户完成补款
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
        .text-gray {{item.amount}} 支 / {{item.quantityType == '02' ? item.poundWeight : item.managerWeight}}吨
        .text-gray(v-if="item.toleranceRange || item.weightRange")
          span.padding-right-sm(v-if="item.toleranceRange") 公差范围 {{item.toleranceRange}}
          span(v-if="item.weightRange") 重量范围 {{item.weightRange}}
        //- .bill-item-line(v-if="idx < (billDetail.order_items.length - 1)")
        //- .solid-top.padding-top-xs.padding-bottom-xs.text-black(v-if="currentUser.type == 'seller' && item.xs_price != item.order_price && item.xs_price != 0")
        //-   span.text-black 销售定价：
        //-   span.text-orange ￥{{item.xs_price}}
        //-   span(v-if="item.order_price").padding-left-xs.text-grey.delete-style 原定价：￥{{item.order_price}}
    template(v-if="billDetail.status_desc !== '待付款'")
      .bg-white.mt-half-rem
        .text-black.padding-sm.text-bold.solid-bottom 合同基本信息
        .ft-13.text-gray.padding-sm
          .flex.padding-bottom-xs
            .col 成交时间
            .col.text-black.text-right {{billDetail.createDate}}
          .flex
            .col 付款截止时间
            .col.text-black.text-right {{billDetail.invalidDate}}
      .bg-white.solid-top.padding-sm.flex
        .col 共{{billDetail.contractAmount}}支，{{billDetail.quantityType == '02' ? billDetail.contractPoundWeight : billDetail.contractManagerWeight}}吨
        .col.text-right
          .ft-12 吊费: ¥{{billDetail.liftingFeeMoney}}
          .padding-top-xs
            span 合同金额：
            span.text-red ￥{{billDetail.inTaxReceiveMoney}}
      .bg-white.mt-half-rem(v-if="billDetail.status_desc !== '待补款' && billDetail.status_desc !== '违约'")
        .padding-sm.text-black.text-bold.solid-bottom 实发信息
        .text-gray.padding-sm
          .flex.padding-bottom-xs
            .col 实发总数量/总重量
            .col.text-right.text-black {{billDetail.outAmount}}支，{{billDetail.actualTonnage}}吨
          .flex.padding-bottom-xs
            .col 实发货款
            .col.text-right.text-black {{billDetail.totalPayment}}元
          .flex.padding-bottom-xs
            .col 实发吊费
            .col.text-right.text-black {{billDetail.totalLiftCharge}}元
          .flex
            .col 实发总金额
            .col.text-right.text-black {{billDetail.totalContractAmount}}元
      //- .padding.c-orange.ft-12(style="background:#fefcee") 温馨提示：合同生成 120 分钟之后不可取消，逾期支付视为违约！ 请在合同支付后 5 天内提货，如出现多次延时提货，平台将酌情收取仓储费用！
      .pt-half-rem(v-if="billDetail.status_desc !== '待补款' && billDetail.status_desc !== '违约'")
        .bg-white
          .padding-sm.text-black.text-bold.solid-bottom 支付详情
          .ft-13.padding-sm.text-gray
            .flex.padding-bottom-xs
              .col 支付方式
              .col.text-right.text-black(v-if="billDetail.payMethod=='01'") 全款支付
              .col.text-right.text-black(v-else-if="billDetail.payMethod=='03'") 定金支付
              .col.text-right.text-black(v-else-if="billDetail.payMethod=='02'") 白条支付
              .col.text-right.text-black(v-else) --
              // .col.text-right.text-black(v-if="billDetail.payMethod") {{billDetail.payMethod === '01' ? '全款' : billDetail.payMethod === '02' ? '定金' : '白条'}}
                span(v-if="billDetail.status_desc === '待审核' && billDetail.payMethod === '02'") (预计定金: {{billDetail.advancePaymentMoney}})
            .flex.padding-bottom-xs
              .col 已支付
              .col.text-right.text-black
                span.ft-12.pr-5(v-if="billDetail.payMethod === '03'") (定金支付：{{billDetail.advancePaymentMoney}}元)
                span {{billDetail.inTaxPayMoney}} 元
            .flex.padding-bottom-xs(v-if="billDetail.payMethod === '03'")
              .col 定金抵扣
              .col.text-right.text-black {{billDetail.depositMoney}} 元
            .flex
              .col 未支付
              .col.text-right.text-black {{billDetail.unpaidAmount}} 元
    template(v-else)
      .bg-white.solid-top.padding-sm.flex
        .col 共{{billDetail.amount}}支，{{billDetail.weight}}吨
        .col.text-right 合同金额：
          span.text-red ￥{{billDetail.inTaxReceiveMoney}}
          .ft-12.text-gray 含吊费: {{billDetail.lift_money}}
    .bg-white.mt-half-rem(v-if="billDetail.status_desc === '待补款'")
      .padding-sm.text-black.text-bold.solid-bottom 补款详情
      .ft-13.padding-sm.text-gray
        .padding-bottom-xs.flex.justify-between
          span 实发数量：
          span.text-black {{billDetail.outAmount}}支
        .padding-bottom-xs.flex.justify-between
          div 实发重量:
          .text-black {{billDetail.actualTonnage}}吨
        .padding-bottom-xs.flex.align-center.justify-between
          div 需补款：
          .text-right
            span.text-red {{billDetail.paid_price_desc}} 元
            .text-gray.ft-12 (如使用余额后需转：{{billDetail.needTransfer}}元)
        .padding-bottom-xs.flex.justify-between
          div 账户余额：
          .text-black {{billDetail.desposit_can}}元
        .padding-bottom-xs.flex.justify-between
          div 已支付：
          .text-black {{billDetail.inTaxPayMoney}}元
        .text-right.padding-bottom-sm.text-gray.ft-12(v-if="billDetail.pay_type_desc === '定金支付'") (定金支付：{{billDetail.advancePaymentMoney}}元， 定金抵扣：{{billDetail.depositMoney}}元)
    .bg-white.mt-half-rem
      .padding-sm.text-black.text-bold.solid-bottom 供应商开户信息
      .ft-13.text-gray.padding-sm
        .flex.padding-bottom-xs
          .col 开户行
          .col.text-black.text-right 农行
        .flex.padding-bottom-xs
          div 开户行名称
          .col.text-black.text-right 中国农业银行股份有限公司常州九龙支行
        .flex.padding-bottom-xs
          div 开户名称
          .col.text-black.text-right 江苏智恒达型云网络科技有限公司
        .flex
          div 银行账号
          .col.text-black.text-right 10613501040017200
    //- .pt-half-rem.flex(v-if="billDetail.status_desc == '待付款'")
      .col.padding-sm.pr-10
        q-btn.full-width.no-shadow(color="red-5", @click="cancelBill") 取消合同
      .col.padding-sm.pl-10
        .main-btn(@click="payBill") 去支付
        //- q-btn.full-width.no-shadow(color="primary", @click="payBill") 去支付

</template>
<script>
import copyBtn from '@/components/CopyBtn.vue'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      billDetail: {},
      btnDisable: false,
      navBarTitle: '合同详情'
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
    this.httpPost(this.apiList.zf.saleContractDetail, {contractId: this.$root.$mp.query.contractId}).then(res => {
      console.log(res.data)
      this.billDetail = res.data
      this.billDetail.status_desc = this.contractStatus.find(c => {
        return c.id === res.data.xingyunContractStatus
      }).name
      if (this.billDetail.status_desc === '待补款') {
        this.navBarTitle = '待补款详情'
      }
    })
    // this.ironRequest('orderDetail.shtml?tstc_no=' + this.$root.$mp.query.id, {}, 'get').then(resp => {
    //   if (resp && resp.returncode === '0') {
    //     // resp.lift_money = resp.lift_money.toFixed(2)
    //     // resp.total_money = resp.total_money.toFixed(2)
    //     resp.out_all_lift = this.$toFixed(resp.out_all_lift, 2)
    //     resp.lift_money = this.$toFixed(resp.lift_money, 2)
    //     resp.total_money = this.$toFixed(resp.total_money, 2)
    //     if (resp.status_desc === '待补款') {
    //       resp.needTransfer = resp.paid_price_desc - resp.desposit_can > 0 ? this.$toFixed(Number(resp.paid_price_desc - resp.desposit_can), 2) : 0
    //     }
    //     this.billDetail = resp
    //     // this.billDetail.status_desc = '待付款'
    //     if (this.billDetail.status_desc === '待补款') {
    //       this.navBarTitle = '待补款详情'
    //     }
    //   }
    // }).catch(err => {
    //   this.showMsg(err || '网络异常')
    // })
  },
  methods: {
    payBill () {
      this.logEventGet({ event: 'click_app_myorder_detail_pay' })
      this.jump('/mall/pay?orderNo=' + this.billDetail.tstc_no + '&pageType=offlinePay&price=' + this.billDetail.total_money + '&frontPrice=' + this.billDetail.advancePaymentMoney + '&percent=' + this.billDetail.percent)
    },
    cancelBill () {
      this.logEventGet({ event: 'click_app_myorder_detail_cancel' })
      const me = this
      if (!this.btnDisable) {
        this.confirm({ content: '您确定要取消合同吗？' }).then((res) => {
          if (res === 'confirm') {
            me.btnDisable = true
            me.ironRequest('cancelOrder.shtml', { user_id: me.currentUser.user_id, discussid: me.billDetail.discussid }, 'post', me).then(resp => {
              if (resp && resp.returncode === '0') {
                me.confirm({ content: '合同取消成功' }).then((res) => {
                  if (res === 'confirm') {
                    me.btnDisable = false
                    setTimeout(() => {
                      me.back()
                    }, 3000)
                  }
                })
              } else {
                me.showMsg(resp === undefined ? '网络异常' : resp.errormsg)
                me.btnDisable = false
              }
            })
          }
        }, err => {
          console.log(err)
          me.showMsg(err)
          me.btnDisable = false
        })
      }
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
