<template lang="pug">
div
  nav-bar(:title="pageTitle", isBack)
  .bg-white
    .solid-bottom.item
      .invoice-left 合同编号
      .col.text-right.text-gray
        .padding-bottom-xs(v-for="(no, noIdx) in nosArray", :key="noIdx") {{no}}
    .solid-bottom.item(v-for="(itm, itmIdx) in listArray", :key="itmIdx")
      .invoice-left {{itm.name}}
      .text-gray {{showObj[itm.key]}}
    //- .row.solid-bottom.flex-center(v-if="tabName == 0")
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
        template(v-if="tabName == '0'")
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
            input.text-gray.text-right(:placeholder="tabName != '0'?'':'请输入收件人'", v-model="receiver", :disabled="tabName != '0'")
        .solid-bottom.item
          .invoice-left
            span.text-red *
            span.ml-5.ft-15 手机号
          .col.text-right
            input.text-gray.text-right(:placeholder="tabName != '0'?'':'请输入手机号'", v-model="receiverMobile", :disabled="tabName != '0'")
        .solid-bottom.item
          .invoice-left
            span.text-red *
            span.ml-5.ft-15 发票地址
          .col.text-right
            input.text-gray.text-right(:placeholder="tabName != '0'?'':'请输入地址'", v-model="receiverAddr", :disabled="tabName != '0'")
  .pt-half-rem(v-if="pickVal == '快递邮寄' && (tabName == '2' || tabName == '3')")
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
      .row.padding.flex-center.border-bottom-line
        .col.flex-100
          span.ml-5.ft-15 发票代码
        .col.text-right
          .c-gray.text-right {{invoiceNo || '暂无'}}
  .padding-sm.margin-top(@click="invoiceApply")
    .main-btn(v-if="tabName == '0'") 提交
    .main-btn(v-if="tabName == '2'") 确认
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
      invoiceNo: '',
      pickItems: ['快递邮寄', '线下领取'],
      listArray: [{
        name: '发票抬头',
        key: 'settlementUnitName'
      }, {
        name: '发票类型',
        key: 'settlementUnitName'
      }, {
        name: '货款金额',
        key: 'paymentMoney'
      }, {
        name: '吊费',
        key: 'hangingFeeMoney'
      }, {
        name: '总金额',
        key: 'totalMoney'
      }],
      receiver: '',
      receiverMobile: '',
      receiverAddr: '',
      clickDisabled: false,
      tabName: '',
      showObj: {}
    }
  },
  onUnload () {
    this.pickIdx = 0
    this.nosArray = []
    this.nosArrayTotal = ''
    this.pickOpen = false
    this.expressName = ''
    this.expressNo = ''
    this.invoiceNo = ''
    this.receiver = ''
    this.receiverMobile = ''
    this.receiverAddr = ''
    this.clickDisabled = false
    this.tabName = ''
  },
  beforeMount () {
    this.tabName = this.$root.$mp.query.tabName
    this.ids = this.$root.$mp.query.ids
    console.log('测试++++++')
    console.log(this.tabName)
    console.log(this.ids)
    if (this.tabName === '0' || this.tabName === '1') {
      this.pageTitle = this.$root.$mp.query.name || '申请发票'
      this.loadData()
    } else {
      this.pageTitle = this.$root.$mp.query.name
    }
    this.nosArray = this.ids.split(',')
    // this.nosArray = this.tempObject.contract_no.split(',')
    // this.nosArrayTotal = this.nosArray.length
    // if (this.tempObject.status && this.tempObject.status !== '申请') {
    //   if (this.tempObject.invoice_type) {
    //     this.pickVal = this.tempObject.invoice_type === '快递发票' ? '快递邮寄' : '线下领取'
    //   }
    //   if (this.tempObject.receive_addr) {
    //     this.receiverAddr = this.tempObject.receive_addr
    //   }
    //   if (this.tempObject.receive_phone) {
    //     this.receiverMobile = this.tempObject.receive_phone
    //   }
    //   if (this.tempObject.receive_name) {
    //     this.receiver = this.tempObject.receive_name
    //   }
    //   if (this.tempObject.express_name) {
    //     this.expressName = this.tempObject.express_name
    //   }
    //   if (this.tempObject.express_no) {
    //     this.expressNo = this.tempObject.express_no
    //   }
    //   if (this.tempObject.invoice_no) {
    //     this.invoiceNo = this.tempObject.invoice_no
    //   }
    // }
  },
  computed: {
    ...mapState({
      tempObject: state => state.tempObject
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
      this.configVal({ key: 'tempObject', val: { tabName: this.tabName } })
      this.back()
    },
    // 切换发票领取方式
    togglePickWay () {
      if (this.tabName === '0') {
        this.pickOpen = !this.pickOpen
      }
    },
    // 申请发票/确认发票
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
      let postList = this.nosArray.map(item => {
        return {
          arSettlementListId: item,
          postFlag: this.pickVal === '快递邮寄' ? 1 : 0,
          receiptSignId: this.receiver,
          receiptSignName: this.receiver,
          receiptSignPhone: this.receiverMobile,
          receiptSignAdress: this.receiverAddr
        }
      })
      // let body = {
      //   user_id: this.currentUser.user_id,
      //   id: this.tempObject.id,
      //   type: this.tempObject.type === '明细' ? 0 : 1,
      //   invoice_type: this.pickVal === '快递邮寄' ? 1 : 0
      // }
      // if (this.pickVal === '快递邮寄') {
      //   body.receive_name = this.receiver
      //   body.receive_phone = this.receiverMobile
      //   body.receive_addr = this.receiverAddr
      // }
      if (!this.clickDisabled) {
        this.clickDisabled = true
        const self = this
        let url = ''
        if (this.tabName === '0') {
          url = self.apiList.zf.invoiceAdd
        } else {
          url = self.apiList.zf.confirmReceipt
        }
        self.httpPost(url, postList).then(res => {
          const msg = self.pageTitle === '申请发票' ? '申请发票成功' : '发票确认成功'
          self.showMsg(msg, '', 1000)
          setTimeout(() => {
            self.back()
          }, 1000)
        }).catch(e => {
          self.clickDisabled = false
          self.showMsg(e.message ? e.message : '网路异常')
        })
        // this.ironRequest('applyInvoice.shtml', body, 'post').then(resp => {
        //   if (resp && resp.returncode === '0') {
        //     const msg = self.pageTitle === '申请发票' ? '申请发票成功' : '发票确认成功'
        //     self.showMsg(msg, '', 1000)
        //     self.configVal({ key: 'tempObject', val: { tabName: self.tabName } })
        //     setTimeout(() => {
        //       self.back()
        //     }, 1000)
        //   } else {
        //     self.clickDisabled = false
        //     self.showMsg(resp === undefined ? '网路异常' : resp.errormsg)
        //   }
        // })
      }
    },
    pickCb (e) {
      this.pickVal = this.pickItems[e.mp.detail.value]
    },
    // 获取发票信息
    loadData () {
      const self = this
      if (this.tabName === '0') {
        self.httpPost(self.apiList.zf.invoiceUnApplyDetail, self.ids.split(',')).then(res => {
          self.showObj = res.data
        })
      } else {
        self.httpGet(self.apiList.zf.customerAppliedDetail + '?sourceBusiBillNo=' + self.ids).then(res => {
          self.showObj = res.data
        })
      }
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
