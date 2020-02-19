<template lang="pug">
div
  nav-bar(:title="pageTitle", isBack)
  .bg-white
    .solid-bottom.item
      .invoice-left 合同编号
      .col.text-right.text-gray
        .padding-bottom-xs(v-for="no in nosArray") {{no}}
    .solid-bottom.item(v-for="itm in listArray")
      .invoice-left {{itm.name}}
      .text-gray {{tempObject[itm.key]}}
    //- .row.solid-bottom.flex-center(v-if="queryId == 0")
    //-   .col.flex-100.ft-15 提单数量
    //-   .col.c-gray.text-right
    //-     div {{nosArrayTotal}}
    //- .row.solid-bottom.flex-center(v-else)
    //-   .col.flex-100.ft-15 合同编号
    //-   .col.text-gray.text-right
    //-     div(v-for="no in nosArray") {{no}}
    //- .row.solid-bottom(v-for="ltm in listArray", v-if="rowShow(ltm)")
      .col.flex-100 {{ltm.name}}
      .col.c-gray.text-right {{tempObject[ltm.key]}}
  .pt-half-rem
    .bg-white
      .solid-bottom.item(@click="togglePickWay")
        .invoice-left
          span.text-red *
          span 发票领取方式
        template(v-if="queryId == '0'")
          picker.col.text-right.text-gray(@change="pickCb", :value="pickIdx", :range="pickItems")
            .text-right.text-gray {{pickVal}}
          .text-right.text-gray.cuIcon-right
        .col.text-right.text-gray(v-else) {{pickVal}}
      div(v-if="pickVal == '快递邮寄'")
        .solid-bottom.item
          .invoice-left
            span.text-red *
            span.ml-5.ft-15 收件人
          .col.text-right
            input.text-gray.text-right(:placeholder="queryId != '0'?'':'请输入收件人'", v-model="receiver", :disabled="queryId != '0'")
        .solid-bottom.item
          .invoice-left
            span.text-red *
            span.ml-5.ft-15 手机号
          .col.text-right
            input.text-gray.text-right(:placeholder="queryId != '0'?'':'请输入手机号'", v-model="receiverMobile", :disabled="queryId != '0'")
        .solid-bottom.item
          .invoice-left
            span.text-red *
            span.ml-5.ft-15 发票地址
          .col.text-right
            input.text-gray.text-right(:placeholder="queryId != '0'?'':'请输入地址'", v-model="receiverAddr", :disabled="queryId != '0'")
  .pt-half-rem(v-if="pickVal == '快递邮寄' && (queryId == '2' || queryId == '2' || queryId == '3')")
    .bg-white
      .row.padding.flex-center.border-bottom-line
        .col.flex-100
          span.ml-5.ft-15 快递方式
        .col.text-right
          .c-gray.text-right {{expressName}}
      .row.padding.flex-center.border-bottom-line
        .col.flex-100
          span.ml-5.ft-15 快递单号
        .col.text-right
          .c-gray.text-right {{expressNo}}
  .padding-sm.margin-top(@click="invoiceApply")
    .main-btn(v-if="queryId == '0'") 提交        
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      pickIdx: 0,
      pageTitle: '申请发票',
      nosArray: [],
      nosArrayTotal: '',
      pickOpen: false,
      pickVal: '线下领取',
      expressName: '',
      expressNo: '',
      pickItems: ['快递邮寄', '线下领取'],
      listArray: [{
        name: '发票抬头',
        key: 'title'
      }, {
        name: '发票类型',
        key: 'type'
      }, {
        name: '货款金额',
        key: 'goods_price'
      }, {
        name: '吊费',
        key: 'lift_price'
      }, {
        name: '总金额',
        key: 'price'
      }],
      receiver: '',
      receiverMobile: '',
      receiverAddr: '',
      clickDisabled: false,
      queryId: ''
    }
  },
  beforeMount () {
    this.queryId = this.$root.$mp.query.id
    if (this.queryId === '0') {
      this.pageTitle = '申请发票'
    } else {
      this.pageTitle = this.$root.$mp.query.name
    }

    this.nosArray = this.tempObject.contract_no.split(',')
    this.nosArrayTotal = this.nosArray.length
    if (this.tempObject.status && this.tempObject.status !== '申请') {
      if (this.tempObject.invoice_type) {
        this.pickVal = this.tempObject.invoice_type === '快递发票' ? '快递邮寄' : '线下领取'
      }
      if (this.tempObject.receive_addr) {
        this.receiverAddr = this.tempObject.receive_addr
      }
      if (this.tempObject.receive_phone) {
        this.receiverMobile = this.tempObject.receive_phone
      }
      if (this.tempObject.receive_name) {
        this.receiver = this.tempObject.receive_name
      }
      if (this.tempObject.express_name) {
        this.expressName = this.tempObject.express_name
      }
      if (this.tempObject.express_no) {
        this.expressNo = this.tempObject.express_no
      }
    }
  },
  computed: {
    ...mapState({
      tempObject: state => state.tempObject,
      currentUser: state => state.user.currentUser
    })
  },
  methods: {
    ...mapActions([
      'configVal'
    ]),
    rowShow (item) {
      const result = (item.name === '货款金额' || item.name === '吊费') && this.nosArray.length > 1
      return !result
    },
    invoiceBack () {
      this.configVal({ key: 'tempObject', val: { tabName: this.queryId } })
      this.back()
    },
    togglePickWay () {
      if (this.queryId === '0') {
        this.pickOpen = !this.pickOpen
      }
    },
    invoiceApply () {
      if (this.pickVal === '快递邮寄') {
        if (this.receiver.trim().length === 0 || this.receiverAddr.trim().length === 0 || this.receiverMobile.trim().length === 0) {
          this.showMsg('必填字段不能为空')
          return false
        }
        if (!this.mobileReg(this.receiverMobile)) {
          this.showMsg('请输入正确的手机号')
          return false
        }
      }
      let body = {
        user_id: this.currentUser.user_id,
        id: this.tempObject.id,
        type: this.tempObject.type === '明细' ? 0 : 1,
        invoice_type: this.pickVal === '快递邮寄' ? 0 : 1
      }
      if (this.pickVal === '快递邮寄') {
        body.receive_name = this.receiver
        body.receive_phone = this.receiverMobile
        body.receive_addr = this.receiverAddr
      }
      if (!this.clickDisabled) {
        this.clickDisabled = true
        const me = this
        this.ironRequest('applyInvoice.shtml', body, 'post', this).then(resp => {
          if (resp && resp.returncode === '0') {
            const msg = me.pageTitle === '申请发票' ? '申请发票成功' : '发票确认成功'
            me.showMsg(msg, '', 1000)
            me.clickDisabled = false
            me.configVal({ key: 'tempObject', val: { tabName: me.queryId } })
            setTimeout(() => {
              me.back()
            }, 1000)
          } else {
            me.clickDisabled = false
            me.showMsg(resp === undefined ? '网路异常' : resp.errormsg)
          }
        })
      }
    },
    pickCb (e) {
      this.pickVal = this.pickItems[e.mp.detail.value]
    }
  }
}
</script>
<style lang="stylus" scoped>
.padding
  padding-top 15px
  padding-bottom 15px
.border-bottom-line
  border-bottom 1px solid #eee
.item
  padding 15px
  display flex
  justify-content space-between
  align-items center
</style>