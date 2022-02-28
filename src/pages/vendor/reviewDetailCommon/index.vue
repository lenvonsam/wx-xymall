<template lang="pug">
div
  nav-bar(title="待审核", isBack)
  .padding-sm
    div
      .bg-white.card(v-if="detailData.minicontrols.length")
        div.margin-bottom-xs(v-for="item in detailData.minicontrols" :key="item.title")
          span {{item.title}}：
          span.padding-left-xs {{jsonData[item.fieldValue]}}
      // div(:style="{'margin-bottom': isIpx ? '188rpx' : '120rpx'}")
      .bg-white.border-radius
        .ft-18.padding-sm 审批流程
        .ft-12.text-ellipsis-2.padding-left-sm.padding-right-sm.padding-bottom-xs 审批原因：{{detailData.applyMessage}}
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
      erpModalVal: '',
      jsonData: {}
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
        console.log('err>>>', err)
        this.hideLoading()
        this.disabled = false
        this.showMsg(err.message || '网络错误')
      }
    },
    async loadData () {
      console.log('+++>>>>', this.tempObject)
      // this.showLoading()
      this.btnShow = true
      let res = await this.httpGet(this.apiList.zf.getDetail + '?id=' + this.id + '&userId=' + this.currentUser.employeeId)
      console.log(res)
      let configData = JSON.parse(res.data.config)
      console.log('configData===>', configData)
      let data = res.data
      let jsonData = (JSON.parse(res.data.json))
      console.log('未整理参数===>', jsonData)
      this.jsonData = jsonData
      this.detailData = {
        minicontrols: configData.minicontrols ? configData.minicontrols : [],
        applyMessage: jsonData.applyMessage,
        invoiceStatus: '待复审',
        auditStatus: jsonData.auditStatus,
        json: data.json,
        taskId: data.taskList[data.taskList.length - 1].taskId,
        operName: data.taskList[data.taskList.length - 1].userName,
        firstTask: data.taskList[0],
        lastTask: data.taskList[data.taskList.length - 1]
      }
      console.log('议价参数整理====>', this.detailData)
      // name standard  material  amount  weight money
      let listData = jsonData.saleContractDetailDTOS || jsonData.preDemandDetailDTOS
      this.detailData.list = listData.map(item => {
        return {
          name: item.productBrandName,
          standard: item.specification,
          material: item.productTextureName,
          supply: item.prodAreaName,
          length: item.length,
          wh_name: item.stockZoneName,
          max_count: item.avbleAmount,
          max_weight: item.quantityType === '01' ? item.managerWeight : item.poundWeight,
          price: item.quantityType === '01' ? item.priceManager : item.pricePound,
          quantityType: item.quantityType === '01' ? '理计' : '磅计',
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
