<template lang="pug">
div
  nav-bar(title="待审核", isBack)
  .padding-sm.ft-13
    div
      .bg-white.padding-all
        .row.justify-between.padding-bottom-xs
          .col 收款单位：{{financialAuditDetails.receiptUnitName ? financialAuditDetails.receiptUnitName : ''}}
          .text-blue.company-circle {{shortName || ''}}
        .row.justify-between.padding-bottom-xs
          div
            span.text-gray.col 申请单号：
            span {{financialAuditDetails.payApplyNo ? financialAuditDetails.payApplyNo : ''}}
          div.text-black.text-gray.padding-right 工作组：{{financialAuditDetails.workGroup ? financialAuditDetails.workGroup : ''}}
        .row.justify-between.text-gray.padding-bottom-xs
          div
            span 申请总金额：
            span.text-orange {{financialAuditDetails.applyMoney ? financialAuditDetails.applyMoney : ''}}
          div.padding-right 支付方式：
            span.text-black {{financialAuditDetails.paymentType ? financialAuditDetails.paymentType : ''}}
        .row.text-gray.justify-between.padding-bottom-xs
          div
            span 申请来源：
            span {{financialAuditDetails.sourceBillType ? financialAuditDetails.sourceBillType : ''}}
          div.padding-right
            span 制单人：
            span.text-black {{financialAuditDetails.orderMakerName ? financialAuditDetails.orderMakerName : ''}}
        .row.text-gray
          span 备注：{{financialAuditDetails.payApplyDesc ? financialAuditDetails.payApplyDesc : ''}}
    div
      .ft-16.padding-top-sm.padding-bottom-sm.padding-left-sm 付款申请信息
      .bg-white.card
        .row.text-gray.padding-bottom-xs.block
          div(v-for="(item, index) in payMentInformation" :key="index")
            .row.padding-bottom-xs.text-black
              .col {{item.feeItemName ? item.feeItemName : ''}}
            div.row.justify-between(v-for="(items,childrenIndex) in item.children" :key="items.sourceBillNo")
              div
                span 申请金额：
                span.text-orange {{items.itemApplyMoney ? items.itemApplyMoney : ''}}
              div
                span.text-gray 合同号：
                span.text-black {{items.sourceBillNo ? items.sourceBillNo : ''}}
          //- div.row.justify-between
          //-   div
          //-     span 申请金额:
          //-     span.text-orange ￥34879.76
          //-   div
          //-     span.text-gray 合同号
          //-     span C202301130001

    div(:style="{'margin-bottom': isIpx ? '188rpx' : '120rpx'}")
      .bg-white.border-radius
        .ft-16.padding-top-sm.padding-bottom-sm.padding-left-sm 审批流程
        .relative.padding-top-xl.padding-left-xl.padding-right-sm
          .flex.justify-between.border-left-line.padding-left-xl
            span.font-bold 发起申请
            span.padding-left-xs.text-gray.ft-13 {{detailData.firstTask.createTime}}
          .flex.justify-between.text-gray.ft-14.border-left-line.padding-left-xl.padding-bottom-xs.padding-top-sh
            span.font-bold 申请人：{{detailData.firstTask.userName}}
          img(src="/static/images/yes.png", style="height:50rpx;width:50rpx;position:absolute;top:25rpx;left:25rpx;")
        .relative.padding-top-xl.padding-left-xl.padding-right-sm
          .flex.justify-between.border-left-line.padding-left-xl
            span.font-bold 审批人
          .flex.justify-between.text-gray.ft-14.border-left-line.padding-left-xl.padding-bottom-xs.padding-top-sh
            span.font-bold 可审批人：{{detailData.lastTask.userName}}
            span.text-blue(style="white-space: nowrap;") 当前节点/待审批
          .circle.bg-blue 2
        .relative.padding-top-xl.padding-left-xl.padding-right-sm.padding-bottom-sm
          .flex.justify-between.padding-bottom-xs.border-left-line.padding-left-xl
            span.font-bold 结束
          .flex.justify-between.text-gray.ft-14.border-left-line.padding-left-xl.padding-top-sh
            span.font-bold 归档
          .circle.bg-gray(style="color:#ccc") 3
  .footer.row.bg-white.text-center.text-white.padding-sm(:style="{height: isIpx ? '188rpx' : '120rpx', 'padding-bottom': isIpx ? '68rpx' : '20rpx'}",
   v-if="btnShow && tempObject.fromPage !== 'reviewHistory'")
    .col.foot-cancel(@click="confirm('cancel')") 驳回
    .col.foot-confirm.margin-left-sm(@click="confirm('confirm')") 通过
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
import { mapActions, mapState } from 'vuex'
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
      // liftStatus: {
      //   '1': '收吊费',
      //   '2': '免吊费',
      //   '3': '开平免吊费'
      // },
      btnShow: false,
      tempObject: {},
      erpModalShow1: false,
      erpModalTitle: '提示',
      erpModalMsg: '此单存在销售定价变更，注意查看明细定价，是否继续审核通过？',
      erpModalShow2: false,
      erpModalVal: '',
      financialAuditDetails: {},
      detail: [],
      payMentInformation: [],
      shortName: ''
      // companyName: [
      //   {name: '江苏智恒达机械科技有限公司', abbreviation: '智恒达'},
      //   {name: '江苏岳洋通金属加工有限公司', abbreviation: '岳洋通'},
      //   {name: '江苏智恒达投资集团合肥有限公司', abbreviation: '智恒达合肥'},
      //   {name: '江苏智恒达投资集团有限公司', abbreviation: '智恒达集团'},
      //   {name: '江苏智恒达型云网络科技有限公司', abbreviation: '型云'},
      //   {name: '常州金新怡机械科技有限公司', abbreviation: '金新怡'},
      //   {name: '江苏型升供应链服务有限公司', abbreviation: '型升供应链'},
      //   {name: '常州智恒达投资合伙企业（有限合伙）', abbreviation: '智恒达合伙'}
      // ]
    }
  },

  computed: {
    ...mapState({
      isIpx: state => state.isIpx,
      modules: state => state.modules,
      screenHeight: state => state.screenHeight,
      companyName: state => state.companyName
    }),
    dataList () {
      return this.detailData.list
    }
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
    this.tempObject = this.$root.$mp.query
    console.log('tempObject+++', this.tempObject)
    this.loadData()
  },
  onHide () {
    this.erpModalShow1 = false
    this.erpModalShow2 = false
    this.erpModalVal = ''
  },
  methods: {

    ...mapActions([
      'menuGetUserMenu'
    ]),
    jumpBillDetail (item) {
      if (this.disabled) return false
      this.disabled = true
      this.jump(`/pages/billDetail/main?contractId=${this.detailData.saleContractId}`)
    },

    handlerDatas (arr) {
      // 筛选相同费用项目的单据
      let tempArr = []
      let endData = []
      for (let i = 0; i < arr.length; i++) {
        if (tempArr.indexOf(arr[i].feeItemName) === -1) {
          endData.push({
            feeItemName: arr[i].feeItemName,
            children: [arr[i]]
          })
          tempArr.push(arr[i].feeItemName)
        } else {
          for (let j = 0; j < endData.length; j++) {
            if (endData[j].feeItemName === arr[i].feeItemName) {
              endData[j].children.push(arr[i])
              break
            }
          }
        }
      }
      this.payMentInformation = endData
      // console.log(endData, 'endData') // 最终输出
    },

    // 弹窗回调
    modalHandler ({ type }) {
      if (type === 'confirm') {
        let params = {}
        if (this.modalInputTitle === '驳回原因') {
          params.status = 3
          if (!this.modalVal) {
            this.showMsg('请输入驳回原因')
            return false
          } else {
            params.reason = this.modalVal
            this.modalShow = false
          }
        } else {
          params.status = 2
          params.back_money = this.modalVal
        }
        params.taskId = this.detailData.taskId
        params.userId = this.currentUser.employeeId
        params.json = this.detailData.json
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
        params.taskId = this.detailData.taskId
        params.userId = this.currentUser.employeeId
        params.json = this.detailData.json
        params.status = 2
        params.reason = ''
        params.tenantId = '1'
        this.confirmAudit(params, this.apiList.zf.audit)
      } else if (flag === 'cancel') {
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

      this.btnShow = true
      let res = await this.httpGet(this.apiList.zf.getDetail + '?id=' + this.id + '&userId=' + this.currentUser.employeeId)
      console.log(res)
      console.log(JSON.parse(res.data.json))
      let data = res.data
      let jsonData = (JSON.parse(res.data.json))
      console.log('未整理参数===>', jsonData)

      this.detailData = {
        saleContractId: jsonData.saleContractId,
        // liftStatus: data.need_lift,
        sellLowReason: jsonData.sellLowReason,
        status: data.status,
        contractAmount: jsonData.contractAmount,
        contractManagerWeight: jsonData.contractManagerWeight,
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

      const formatMoney = (money, symbol = '', decimals = 2) => `${symbol} ${parseFloat(money.toFixed(decimals)).toLocaleString()}`
      const api = this.apiList.zf.payApply
      const params = {payApplyId: jsonData.payApplyId}
      let detail = await this.httpPost(api, params)
      // detail.data[0].feeItemCode = detail.data[0].feeItemCode.split('_')[0][0] + detail.data[0].feeItemCode.split('_')[1]
      detail.data[0].applyMoney = formatMoney(detail.data[0].applyMoney, '¥', 2)
      detail.data[0].applyMoney = detail.data[0].applyMoney.indexOf('.') === -1 ? detail.data[0].applyMoney + '.00' : detail.data[0].applyMoney
      detail.data.forEach((item, index) => {
        item.itemApplyMoney = formatMoney(item.itemApplyMoney, '¥', 2)
        item.itemApplyMoney = item.itemApplyMoney.indexOf('.') === -1 ? item.itemApplyMoney + '.00' : item.itemApplyMoney
      })

      this.companyName.forEach(item => {
        if (detail.data[0].companyCode === item.code) {
          this.shortName = item.shortName
        }
      })
      this.financialAuditDetails = detail.data[0]
      this.detail = detail.data

      const menuApi = this.apiList.zf.menuGetUserMenu
      const menu = this.apiList.zf.menuValue
      let paramsApi = [{name: '业务单据类型', pageNum: 0}, {name: '支付方式', pageNum: 0}, {name: '工作组', pageNum: 0}]
      paramsApi.forEach(item => {
        this.httpPost(menuApi, item).then(res => {
          const params = {
            dictionaryId: res.data[0].id,
            pageNum: 1,
            pageSize: 999,
            status: 1
          }
          res.data.forEach(resItem => {
            if (resItem.name === item.name) {
              params.dictionaryId = resItem.id
            }
          })
          this.httpPost(menu, params).then(menuRes => {
            menuRes.data.forEach(menuValueItem => {
              if (menuValueItem.dictionaryName === '工作组' && menuValueItem.value === this.financialAuditDetails.workGroup) {
                this.financialAuditDetails.workGroup = menuValueItem.name
              } else if (menuValueItem.dictionaryName === '支付方式' && menuValueItem.value === this.financialAuditDetails.paymentType) {
                this.financialAuditDetails.paymentType = menuValueItem.name
              } else if (menuValueItem.value === this.financialAuditDetails.sourceBillType) {
                this.financialAuditDetails.sourceBillType = menuValueItem.name
              }
            })
          })
        })
      })
      this.handlerDatas(this.detail)
    }
  }
}
</script>
<style lang="stylus" scoped>
.padding-right
  width: 289rpx;
.company-circle
  border: 1px solid #0081ff;
  border-radius: 20rpx;
  padding: 0 13rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
.text-orange
  color orange
.inline
  display inline-block
.block
  display block
.padding-all
  padding 20rpx
  border radius 10rpx
.padding-top-sh
  padding-top 15rpx
.padding-top-xl
  span
    pad

</style>
