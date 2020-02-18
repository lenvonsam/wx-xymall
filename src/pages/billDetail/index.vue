<template lang="pug">
div
  nav-bar(:title="navBarTitle", isBack)
  .pb-half-rem
    .padding-sm.ft-12(style="background: #FEF7E7;", v-if="billDetail.status_desc === '待补款'")
      span.text-orange 请按照补款金额，打款至供应商账户完成补款
    .bg-white.flex.padding-sm
      .col
        span {{billDetail.tstc_no}}
        copy-btn
      .col.text-right(v-if="billDetail.status_desc === '待补款'")
        span.text-blue 待补款:
        span.padding-left-sm.text-red.text-bold ￥{{billDetail.paid_price_desc}}  
      .col.flex-100.text-blue.text-right(v-else, :class="{'text-red': billDetail.status_desc == '违约'}") {{billDetail.status_desc}}        
    .bg-white.margin-top-sm.text-content
      .padding-sm.text-black.text-bold.solid-bottom.ft-15 商品信息
      .ft-13.padding-sm.solid-bottom.relative(v-for="(item, idx) in billDetail.order_items")
        .flex
          .col
            span.ft-15 {{item.name}}
            span.ml-5 {{item.standard}}
          .col.text-right.flex-100 ￥{{item.price}}元/吨
        .flex.padding-bottom-xs.padding-top-xs.text-gray
          .col
            span {{item.material}}
            span.padding-left-sm {{item.length}}米
            span.padding-left-sm.padding-right-sm {{item.wh_name}}
            span.sub-mark {{item.supply}}
          .text-right （{{item.measure_way == '磅计' ? '磅计' : '理计'}}）
        .text-gray {{item.amount}} 支 / {{item.weight}}吨
        .text-gray(v-if="item.tolerance_range || item.weight_range")
          span.padding-right-sm(v-if="item.tolerance_range") 公差范围 {{item.tolerance_range}}
          span(v-if="item.weight_range") 重量范围 {{item.weight_range}}
        .bill-item-line(v-if="idx < (billDetail.order_items.length - 1)") 
    template(v-if="billDetail.status_desc !== '待付款'")     
      .bg-white.mt-half-rem
        .text-black.padding-sm.text-bold.solid-bottom 合同基本信息
        .ft-13.text-gray.padding-sm
          .flex.padding-bottom-xs
            .col 成交时间
            .col.text-black.text-right {{billDetail.create_time}}
          .flex
            .col 付款截止时间
            .col.text-black.text-right {{billDetail.end_pay_time}}
      .bg-white.solid-top.padding-sm.flex
        .col 共{{billDetail.amount}}支，{{billDetail.weight}}吨
        .col.text-right 
          .ft-12 含吊费: {{billDetail.lift_money}}
          .padding-top-xs
            span 合同金额：
            span.text-red ￥{{billDetail.total_money}}
      .bg-white.mt-half-rem(v-if="billDetail.status_desc !== '待补款' && billDetail.status_desc !== '违约'")
        .padding-sm.text-black.text-bold.solid-bottom 实发信息
        .text-gray.padding-sm
          .flex.padding-bottom-xs
            .col 实发总数量/总重量
            .col.text-right.text-black {{billDetail.out_all_amount}}支，{{billDetail.out_all_weight}}吨
          .flex.padding-bottom-xs
            .col 实发货款
            .col.text-right.text-black {{billDetail.out_all_goodsprice}}元
          .flex.padding-bottom-xs
            .col 实发吊费
            .col.text-right.text-black {{billDetail.out_all_lift}}元
          .flex
            .col 实发总金额
            .col.text-right.text-black {{billDetail.out_all_price}}元    
      //- .padding.c-orange.ft-12(style="background:#fefcee") 温馨提示：合同生成 120 分钟之后不可取消，逾期支付视为违约！ 请在合同支付后 5 天内提货，如出现多次延时提货，平台将酌情收取仓储费用！      
      .pt-half-rem(v-if="billDetail.status_desc !== '待补款' && billDetail.status_desc !== '违约'")
        .bg-white
          .padding-sm.text-black.text-bold.solid-bottom 支付详情
          .ft-13.padding-sm.text-gray
            .flex.padding-bottom-xs
              .col 支付方式
              .col.text-right.text-black {{billDetail.pay_type_desc}}
                span(v-if="billDetail.status_desc === '待审核'") (预计定金: {{billDetail.pre_front_price}})
            .flex.padding-bottom-xs
              .col 已支付
              .col.text-right.text-black
                span.ft-12.pr-5(v-if="billDetail.pay_type_desc === '定金支付'") (定金支付：{{billDetail.front_price}}元)
                span {{billDetail.payment_price}} 元
            .flex.padding-bottom-xs(v-if="billDetail.pay_type_desc === '定金支付'")
              .col 定金抵扣
              .col.text-right.text-black {{billDetail.used_front_price}} 元       
            .flex
              .col 未支付
              .col.text-right.text-black {{billDetail.no_paid_price}} 元
    template(v-else)          
      .bg-white.solid-top.padding-sm.flex
        .col 共{{billDetail.amount}}支，{{billDetail.weight}}吨
        .col.text-right 合同金额：
          span.text-red ￥{{billDetail.total_money}}
          .ft-12.text-gray 含吊费: {{billDetail.lift_money}}
    .bg-white.mt-half-rem(v-if="billDetail.status_desc === '待补款'")
      .padding-sm.text-black.text-bold.solid-bottom 补款详情
      .ft-13.padding-sm.text-gray
        .padding-bottom-xs.flex.justify-between
          span 实发数量：
          span.text-black {{billDetail.out_all_amount}}支
        .padding-bottom-xs.flex.justify-between           
          div 实发重量: 
          .text-black {{billDetail.out_all_weight}}吨
        .padding-bottom-xs.flex.align-center.justify-between
          div 需补款：
          .text-right
            span.text-red {{billDetail.paid_price_desc}} 元
            .text-gray.ft-12 (如使用余额后需转：{{billDetail.paid_price_desc - billDetail.desposit_can > 0 ? Number(billDetail.paid_price_desc - billDetail.desposit_can).toFixed(2) : 0}}元)
        .padding-bottom-xs.flex.justify-between
          div 账户余额：
          .text-black {{billDetail.desposit_can}}元
        .padding-bottom-xs.flex.justify-between
          div 已支付：
          .text-black {{billDetail.payment_price}}元
        .text-right.padding-bottom-sm.text-gray.ft-12(v-if="billDetail.pay_type_desc === '定金支付'") (定金支付：{{billDetail.front_price}}元， 定金抵扣：{{billDetail.used_front_price}}元)
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
import { mapState } from 'vuex'
import copyBtn from '@/components/CopyBtn.vue'

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
      currentUser: state => state.user.currentUser
    })
  },
  beforeMount () {
    this.ironRequest('orderDetail.shtml?tstc_no=' + this.$root.$mp.query.id, {}, 'get', this).then(resp => {
      if (resp && resp.returncode === '0') {
        this.billDetail = resp
        // this.billDetail.status_desc = '待付款'
        if (this.billDetail.status_desc === '待补款') {
          this.navBarTitle = '待补款详情'
        }
      }
    }).catch(err => {
      console.log(err.message)
      this.showMsg()
    })
  },
  methods: {
    payBill () {
      this.statisticRequest({ event: 'click_app_myorder_detail_pay' }, this)
      this.jump('/mall/pay?orderNo=' + this.billDetail.tstc_no + '&pageType=offlinePay&price=' + this.billDetail.total_money + '&frontPrice=' + this.billDetail.front_price + '&percent=' + this.billDetail.percent)
    },
    cancelBill () {
      this.statisticRequest({ event: 'click_app_myorder_detail_cancel' }, this)
      const me = this
      if (!this.btnDisable) {
        this.confirm({content: '您确定要取消合同吗？'}).then(() => {
          me.btnDisable = true
          me.ironRequest('cancelOrder.shtml', { user_id: me.currentUser.user_id, discussid: me.billDetail.discussid }, 'post', me).then(resp => {
            if (resp && resp.returncode === '0') {
              me.confirm({content: '合同取消成功'}).then(() => {
                me.btnDisable = false
                setTimeout(() => {
                  me.back()
                }, 3000)
              })
            } else {
              me.showMsg(resp === undefined ? '网络异常' : resp.errormsg)
              me.btnDisable = false
            }
          })
        }, err => {
          console.log(err)
          me.showMsg()
          me.btnDisable = false
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.bill-item-line {
  border: 0.5px solid #ddd;
  height: 0.5px;
  position: absolute;
  bottom: 0px;
  right: 0px;
  left: 0.5rem;
}
.confirm-mark {
  width: 50px;
  height: 50px;
  background-size: cover;
  background-position: center;
}
</style>