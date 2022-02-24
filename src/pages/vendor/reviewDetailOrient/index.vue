<template lang="pug">
div
  nav-bar(title="待审核", isBack)
  .padding-sm
    div
      template(v-if="tempObject.auditType === '延时'")
        .bg-white.card
          .row.justify-between.padding-bottom-xs
            .col.text-blue(@click="jumpBillDetail") {{detailData.saleContractNo}}
            .text-red {{statusList[detailData.auditStatus] || '待审核'}}
          .row.justify-between.padding-bottom-xs
            .text-gray.col {{detailData.custName}}
            .text-black ¥ {{detailData.totalMoeny}}
          .row.justify-between.text-gray.padding-bottom-xs
            .col 共{{detailData.amount}}支，{{detailData.weight}}吨
            span 操作员：{{detailData.operName}}
          .text-gray.padding-bottom-xs(v-if="detailData.delay_text")
            span 延时理由：{{detailData.delay_text}}
          .solid-top.padding-top-xs.padding-bottom-xs
            span 付款截止时间：
            span.text-red.padding-left-xs {{detailData.delayTime}}
      template(v-else)
        .bg-white.card
          div(v-if="tempObject.auditType !== 'ERP定价'")
            .row.justify-between.padding-bottom-xs
              .col.text-blue {{detailData.billNo}}
              .text-red {{tempObject.auditType === '退货' ? '待退款' : detailData.status}}
            .row.justify-between.padding-bottom-xs
              .text-gray.col {{detailData.custName}}
              .text-black ¥ {{detailData.totalMoeny}}
          div(v-else)
            .row.justify-between.padding-bottom-xs
              .col.text-black {{detailData.productBrandName}}
              .text-red {{statusList[status] || '待审核'}}
          template(v-if="tempObject.auditType === '退货'")
            .text-gray.padding-bottom-xs
              // .row.justify-between
              .col 操作员：{{detailData.operName}}
              .col 发票状态：{{detailData.invoiceStatus}}
          template(v-else-if="tempObject.auditType === 'ERP定价'")
            .text-gray.padding-bottom-xs.row.justify-between
              .col {{detailData.endTime}}
              span 操作员：{{detailData.operName}}
          template(v-else)
            .row.justify-between.text-gray.padding-bottom-xs
              // .col 共{{detailData.amount}}支，{{detailData.weight}}吨
              span 操作员：{{detailData.operName}}
          .solid-top.padding-top-xs.padding-bottom-xs.row.justify-between(v-if="tempObject.auditType !== 'ERP定价'")
            template(v-if="tempObject.auditType !== '退货'")
              .col
                span {{tempObject.auditType==='定向' ? '' : '付款'}}截止时间：
                span.text-red.padding-left-xs {{detailData.endTime}}
              span(v-if="tempObject.auditType==='定向'") {{liftStatus[detailData.liftStatus]}}
            template(v-else)
              .col.text-black {{detailData.endTime}}
              span(v-if="detailData.totalLiftCharge") 吊费：{{detailData.totalLiftCharge}}元
        //- template(v-if="auditType !== '延时'")
        .ft-18.padding-top-sm.padding-bottom-sm 商品信息
        div( v-if="tempObject.auditType === 'ERP议价'")
          .bg-white.card(v-for="(item, index) in dataList", :key="index")
            .row.justify-between.padding-bottom-xs
              .text-black.col {{item.name}} {{item.standard}}
              .text-blue ¥ {{item.price}}
            .text-gray
              .row.justify-between.padding-bottom-xs
                .col
                  span.padding-right-xs {{item.material}}
                  span.padding-right-xs {{item.length}}
                  span.padding-right-xs {{item.wh_name}}
                  span.sub-mark.ml-5 {{item.supply}}
                span ({{item.quantityType}})
              .padding-bottom-xs {{item.max_count}}支/{{item.max_weight}}吨
              .padding-bottom-xs
                span.padding-right-xs(v-if="item.toleranceRange") 公差范围 {{item.toleranceRange}}
                span(v-if="item.weightRange") 重量范围 {{item.weightRange}}
              .solid-top.padding-top-xs.padding-bottom-xs.text-black(v-if="item.saleMakepriceCale != 0")
                span 销售定价：
                span.text-blue ￥{{item.saleMakeprice}}
                span.padding-left-xs.delete-style.text-grey ￥{{item.oldSaleMakeprice}}
                span.padding-left-xs 定价差：
                span.text-red ￥{{item.saleMakepriceCale}}
        div( v-else-if="tempObject.auditType === 'ERP定价'")
          .bg-white.card(v-for="(item, index) in dataList", :key="index")
            .row.justify-between.padding-bottom-xs
              .text-black.col {{item.name}} {{item.standard}}
              .col.text-right.text-grey ¥{{item.inTaxPrice}}/¥{{item.inTaxMoney}}
            .text-gray
              .row.justify-between.padding-bottom-xs
                .col(style="position: relative;")
                  span.padding-right-xs {{item.material}}
                  span.padding-right-xs {{item.length}}米
                  span.padding-right-xs {{item.wh_name}}
                  span.sub-mark.ml-5 {{item.supply}}
                  span.text-grey.right-0 （材料价/费用）
              .padding-bottom-xs
                span.padding-right-xs(v-if="item.toleranceRange") 公差范围 {{item.toleranceRange}}
                span(v-if="item.weightRange") 重量范围 {{item.weightRange}}
              .solid-top.padding-top-xs.padding-bottom-xs.text-black(v-if="item.saleMakepriceCale != 0")
                span 定价：
                span.text-blue.text-bold ￥{{item.ajuPricesetMakeprice}}/￥{{item.pricesetMakeprice}}
                span.padding-left-xs.delete-style.text-grey ￥{{item.ajuPricesetOldmakeprice}}/￥{{item.pricesetOldmakeprice}}
                span.text-grey.font-24.right-0 （理计/磅计）
        div(v-else)
          .bg-white.card(v-for="(item, idx) in dataList", :key="idx")
            .row.justify-between.padding-bottom-xs
              .text-black.col {{item.name}} {{item.standard}} {{item.material}}
              .text-blue ¥ {{tempObject.auditType === '定向' ? item.oldSalePrice : item.price}}
            .text-gray
              template(v-if="tempObject.auditType === '定向'")
                .row.justify-between.padding-bottom-xs
                  .col
                    span.padding-right-xs {{item.length}}
                    span.padding-right-xs {{item.wh_name}}
                    span.sub-mark.ml-5 {{item.supply}}
                  span ({{item.quantityTypeValue}})
                .padding-bottom-xs {{item.max_count}}支/{{item.max_weight}}吨
                .padding-bottom-xs
                  span.padding-right-xs(v-if="item.toleranceRange") 公差范围 {{item.toleranceRange}}
                  span(v-if="item.weightRange") 重量范围 {{item.weightRange}}
                .solid-top.padding-top-xs.padding-bottom-xs.text-black
                  span 定向价：
                  span.text-blue ￥{{item.inTaxPrice}}
                  span.padding-left-xs 费用：￥{{item.inTaxMoney}}
                  span.padding-left-xs 价差：
                  span.text-red ￥{{item.diff}}
                span.text-black(v-if="detailData.is_talk_price == 1 && item.xs_price != item.order_price") 销售定价：
                span.text-orange(v-if="detailData.is_talk_price == 1 && item.xs_price != item.order_price") ￥{{item.xs_price}}
                //- span.text-black(v-if="item.xs_price == item.order_price") ￥{{item.xs_price}}
                span.padding-left-xs.text-grey.delete-style(v-if="detailData.is_talk_price == 1 && item.xs_price != item.order_price") 原定价：￥{{item.order_price}}
              template(v-else)
                .row.justify-between.text-gray.padding-bottom-xs
                  .col
                    span 退款支数：{{item.amount}}支
                    span.padding-left-xs 退款重量：{{item.weight}}吨
                  // span ({{item.metering_way_str}})
                .text-gray
                  span 退款金额：{{item.money}}元

    div(:style="{'margin-bottom': isIpx ? '188rpx' : '120rpx'}")
      .ft-18.padding-top-sm.padding-bottom-sm 审批流程
      .bg-white.border-radius
        .relative.padding-top-xl.padding-left-xl.padding-right-sm
          .flex.justify-between.padding-bottom-xs.border-left-line.padding-left-xl
            span.ft-16.font-bold 发起申请
            span.padding-left-xs.text-gray.ft-13 {{detailData.firstTask.createTime}}
          .flex.justify-between.text-gray.ft-14.border-left-line.padding-left-xl
            span.ft-14.font-bold 申请人:{{detailData.firstTask.userName}}
          img(src="/static/images/yes.png", style="height:50rpx;width:50rpx;position:absolute;top:25rpx;left:25rpx;")
        .relative.padding-top-xl.padding-left-xl.padding-right-sm
          .flex.justify-between.padding-bottom-xs.border-left-line.padding-left-xl
            span.ft-16.font-bold 审批人
          .flex.justify-between.text-gray.ft-14.border-left-line.padding-left-xl
            span.ft-14.font-bold 可审批人:{{detailData.lastTask.userName}}
            span.ft-14.text-blue(style="white-space: nowrap;") 当前节点/待审批
          .circle.bg-blue 2
        .relative.padding-top-xl.padding-left-xl.padding-right-sm.padding-bottom-sm
          .flex.justify-between.padding-bottom-xs.border-left-line.padding-left-xl
            span.ft-16.font-bold 结束
          .flex.justify-between.text-gray.ft-14.border-left-line.padding-left-xl
            span.ft-14.font-bold 归档
          .circle.bg-gray(style="color:#ccc") 3

  .footer.row.bg-white.text-center.text-white.padding-sm(:style="{height: isIpx ? '188rpx' : '120rpx', 'padding-bottom': isIpx ? '68rpx' : '20rpx'}",
   v-if="btnShow && tempObject.fromPage !== 'reviewHistory'")
    .col.foot-cancel(@click="confirm('cancel')", v-if="tempObject.auditType === 'ERP定价'") 取消
    .col.foot-cancel(@click="confirm('cancel')", v-if="tempObject.auditType === '延时' || tempObject.auditType === '定向' || tempObject.auditType === '议价'") 拒绝
    .col.foot-cancel(@click="confirm('cancel')", v-if="tempObject.auditType === '退货' || tempObject.auditType === '退款'") 驳回
    .col.foot-confirm.margin-left-sm(@click="confirm('confirm')") {{(tempObject.auditType === '退货' || tempObject.auditType === '退款') ? '退货' : '通过'}}
  modal-input(v-model="modalShow", :title="modalInputTitle", confirmText="确定", type="customize", :cb="modalHandler")
    .padding-sm
      .bg-gray.input-box
        input(:placeholder="'请填写'+modalInputTitle", v-model="modalVal", :disabled="modalInputTitle === '退款金额'")
      .text-red.text-left.padding-top-sm(v-if="modalInputTitle === '驳回原因'") 注：一旦驳回，此单将被删除，必须重新申请，请与销售沟通，并告知客户！
  modal(v-model="erpModalShow1", @cb="erpModalCb", :title="erpModalTitle")
    .padding-sm {{erpModalMsg}}
  modal-input(v-model="erpModalShow2", :title="erpModalTitle", confirmText="确定", type="customize", :cb="erpModalCbInput")
    .padding-sm {{erpModalMsg}}
      .bg-gray.input-box
        input(placeholder="请输入审核通过原因", v-model="erpModalVal")
</template>
<script>
import { mapState } from 'vuex'
import modalInput from '@/components/ModalInput.vue'
import modal from '@/components/Modal.vue'
export default {
  components: {
    modalInput,
    modal
  },
  data () {
    return {
      id: '',
      modalVal: '',
      modalInputTitle: '退款金额',
      modalShow: false,
      detailData: {
        list: []
      },
      disabled: false,
      statusList: {
        10: '待提交',
        20: '待审核',
        30: '审批通过',
        40: '审批驳回',
        50: '取消审核'
      },
      liftStatus: {
        '1': '收吊费',
        '2': '免吊费',
        '3': '开平免吊费'
      },
      btnShow: false,
      tempObject: {},
      erpModalShow1: false,
      erpModalTitle: '提示',
      erpModalMsg: '此单存在销售定价变更，注意查看明细定价，是否继续审核通过？',
      erpModalShow2: false,
      erpModalVal: ''
    }
  },
  computed: {
    ...mapState({
      isIpx: state => state.isIpx,
      modules: state => state.modules,
      screenHeight: state => state.screenHeight
    }),
    dataList () {
      return this.detailData.list
      // return this.detailData.list.filter(item => {
      //   return item.good_name !== '吊费'
      // })
    }
    // auditType () {
    //   return this.tempObject.auditType
    // }
  },
  onUnload () {
    this.disabled = false
    this.detailData = {
      list: []
    }
    this.modalVal = ''
  },
  onLoad (options) {
    this.id = options.id
  },
  onShow () {
    this.disabled = false
    this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - 203
    // this.auditType = this.$root.$mp.query.auditType
    this.tempObject = this.$root.$mp.query
    console.log('tempObject+++', this.tempObject)
    // if (this.tempObject.auditType) {
    //   this.showLoading()
    //   this.loadData()
    // }
    this.loadData()
  },
  onHide () {
    this.erpModalShow1 = false
    this.erpModalShow2 = false
    this.erpModalVal = ''
  },
  methods: {
    jumpBillDetail (item) {
      if (this.disabled) return false
      this.disabled = true
      this.jump(`/pages/billDetail/main?id=${item.deal_no}`)
    },
    // 弹窗回调
    modalHandler ({ type }) {
      console.log(type, this.modalInputTitle)
      if (type === 'confirm') {
        let params = {}
        if (this.modalInputTitle === '驳回原因') {
          if (!this.modalVal) {
            this.showMsg('请输入驳回原因')
            return false
          } else {
            params.reason = this.modalVal
            this.modalShow = false
          }
        } else {
          params.back_money = this.modalVal
        }
        // const params = {
        //   return_id: this.tempObject.return_id,
        //   status: 1
        // }
        params.taskId = this.detailData.taskId
        params.userId = this.currentUser.employeeId
        params.json = this.detailData.json
        params.status = 2
        params.tenantId = '1'
        this.confirmAudit(params, this.apiList.zf.audit)
      } else {
        this.modalShow = false
      }
    },
    confirm (flag) {
      if (this.disabled) {
        return false
      }
      this.disabled = true
      let params = {}
      if (flag === 'confirm') {
        this.disabled = false
        this.disabled = false
        params.taskId = this.detailData.taskId
        params.userId = this.currentUser.employeeId
        params.json = this.detailData.json
        params.status = 2
        params.reason = ''
        params.tenantId = '1'
        this.confirmAudit(params, this.apiList.zf.audit)
      } else if (flag === 'cancel') {
        // params.taskId = this.detailData.taskId
        // params.userId = this.currentUser.employeeId
        // params.json = this.detailData.json
        // params.status = 3
        // params.reason = ''
        // params.tenantId = '1'
        // this.confirmAudit(params, this.apiList.zf.audit)
        this.disabled = false
        this.modalShow = true
        this.modalInputTitle = '驳回原因'
        this.modalVal = ''
      }
    },
    erpModalCb (flag) { // 初审弹框
      this.erpModalShow1 = false
      if (flag === 'confirm') {
        if (this.tempObject.statusStr === '待初审') { // erp议价初审确定
          let params = {
            id: this.detailData.billNo,
            stage: 1, // 1初审 2复审
            flag: flag === 'cancel' ? '0' : '1',
            cust_name: this.detailData.custName,
            employee_name: this.detailData.employeeName,
            dept_name: this.detailData.deptName,
            nickname: this.currentUser.nickname
          }
          console.log('入参====>', params)
          this.confirmAudit(params, this.apiList.xy.sellerBargainAudit)
        } else if (this.tempObject.statusStr === '定向初审') { // 定向订单待初审确定
          let params = {
            user_id: this.currentUser.user_id,
            deal_no: this.detailData.billNo,
            flag: flag === 'cancel' ? '0' : '1'
          }
          console.log('入参====>', params)
          this.confirmAudit(params, this.apiList.xy.dxAudit)
        }
        this.erpModalShow1 = false
      }
    },
    erpModalCbInput (flag) { // 复审输入弹框
      if (flag.type === 'confirm') {
        if (!this.erpModalVal) {
          this.showMsg('请输入审核通过原因！')
        } else {
          if (this.tempObject.statusStr === '待复审') { // erp议价复审确定
            let params = {
              id: this.detailData.billNo,
              stage: 2, // 1初审 2复审
              flag: flag === 'cancel' ? '0' : '1',
              reason: this.erpModalVal,
              cust_name: this.detailData.custName,
              employee_name: this.detailData.employeeName,
              dept_name: this.detailData.deptName,
              nickname: this.currentUser.nickname
            }
            console.log('入参====>', params)
            this.confirmAudit(params, this.apiList.xy.sellerBargainAudit)
          } else if (this.tempObject.statusStr === '定向复审') { // 定向订单待复审确定
            let params = {
              user_id: this.currentUser.user_id,
              deal_no: this.detailData.billNo,
              flag: flag === 'cancel' ? '0' : '1',
              pw_reason: this.erpModalVal
            }
            console.log('入参====>', params)
            this.confirmAudit(params, this.apiList.xy.dxAudit)
          }
          this.erpModalShow2 = false
        }
      }
    },
    async confirmAudit (params, api) {
      try {
        this.showLoading()
        // const data = await this.ironRequest(api.url, params, api.method)
        const data = await this.httpPost(api, params)
        this.hideLoading()
        if (data.success) {
          this.showMsg('操作成功')
          const me = this
          setTimeout(() => {
            me.back()
            this.disabled = false
          }, 1000)
          this.erpModalVal = ''
        } else {
          this.disabled = false
          this.erpModalVal = ''
        }
      } catch (err) {
        this.hideLoading()
        this.disabled = false
        this.showMsg(err || '网络错误')
      }
    },
    async loadData () {
      console.log('+++>>>>', this.tempObject)
      // this.showLoading()
      this.btnShow = true
      let res = await this.httpGet(this.apiList.zf.getDetail + '?id=' + this.id + '&userId=' + this.currentUser.employeeId)
      console.log(res)
      console.log(JSON.parse(res.data.json))
      let data = res.data
      let jsonData = (JSON.parse(res.data.json))
      console.log('未整理参数===>', jsonData)
      this.detailData = {
        // liftStatus: data.need_lift,
        status: data.status,
        billNo: jsonData.saleContractNo || jsonData.preSaleDemandNo,
        custName: jsonData.settlementUnitName,
        // totalAmount: data.amount,
        // totalWeight: data.weight,
        totalMoeny: jsonData.inTaxReceiveMoney,
        endTime: jsonData.contractDelayDate,
        invoiceStatus: '待复审',
        auditStatus: jsonData.auditStatus,
        json: data.json,
        taskId: data.taskList[data.taskList.length - 1].taskId,
        operName: data.taskList[data.taskList.length - 1].userName,
        firstTask: data.taskList[0],
        lastTask: data.taskList[data.taskList.length - 1]
        // list: jsonData.returnDetailDTOS
        // is_talk_price: data.is_talk_price
      }
      console.log('定向参数整理====>', this.detailData)
      // name standard  material  amount  weight money
      this.detailData.list = jsonData.saleContractDetailDTOS.map(item => {
        return {
          name: item.productBrandName,
          standard: item.specification,
          material: item.productTextureName,
          supply: item.prodAreaName,
          length: item.length,
          wh_name: item.stockZoneName,
          oldSalePrice: item.oldSalePrice,
          quantityTypeValue: item.quantityTypeValue,
          inTaxPrice: item.inTaxPrice,
          inTaxMoney: item.inTaxMoney,
          max_count: item.avbleAmount,
          max_weight: item.quantityType === '01' ? item.managerWeight : item.poundWeight,
          price: item.quantityType === '01' ? item.priceManager : item.pricePound,
          quantityType: item.quantityType === '01' ? '理计' : '磅计',
          ajuPricesetMakeprice: item.priceManager,
          pricesetMakeprice: item.pricePound,
          ajuPricesetOldmakeprice: item.oldPriceManager,
          pricesetOldmakeprice: item.oldPriceManager,
          weightRange: item.weightRange,
          toleranceRange: item.toleranceRange
        }
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
.card
  padding 10px
  border-radius 5px
  margin-bottom 10px
.footer
  position fixed
  bottom 0
  left 0
  right 0
.circle
  height 50rpx
  width 50rpx
  color #fff
  text-align center
  line-height 50rpx
  position absolute
  top 25rpx
  left 25rpx
  border-radius 50%
  font-size 34rpx
.input-box
  border-radius 5px
  width 100%
  height 40px
  input
    height 40px
    width 100%
.delete-style
  text-decoration line-through
.font-24
  font-size 24rpx
.right-0
  position absolute
  right 0
.text-right
  text-align right
</style>
