<template lang="pug">
div
  nav-bar(title="待审核", isBack)
  .padding-sm(:style="{'margin-bottom': isIpx ? '188rpx' : '120rpx'}")
    template(v-if="tempObject.auditType === '延时'")
      .bg-white.card(v-for="(item, idx) in detailData.list", :key="idx")
        .row.justify-between.padding-bottom-xs
          .col.text-blue(@click="jumpBillDetail(item)") {{item.deal_no}}
          .text-red {{statusList[item.status] || '待审核'}}
        .row.justify-between.padding-bottom-xs
          .text-gray.col {{item.cust_name}}
          .text-black ¥ {{item.price}}
        .row.justify-between.text-gray.padding-bottom-xs
          .col 共{{item.amount}}支，{{item.weight}}吨
          span 操作员：{{item.opt_name}}
        .text-gray.padding-bottom-xs(v-if="item.delay_text")
          span 延时理由：{{item.delay_text}}
        .solid-top.padding-top-xs.padding-bottom-xs
          span 付款截止时间：
          span.text-red.padding-left-xs {{item.order_end_time}}
    template(v-else)
      .bg-white.card
        .row.justify-between.padding-bottom-xs
          .col.text-blue {{detailData.billNo}}
          .text-red {{tempObject.auditType === '退货' ? '待退款' : detailData.status}}
        .row.justify-between.padding-bottom-xs
          .text-gray.col {{detailData.custName}}
          .text-black ¥ {{detailData.totalMoeny}}
        template(v-if="tempObject.auditType === '退货'")
          .text-gray.padding-bottom-xs.row.justify-between
            .col 发票状态：{{detailData.invoiceStatus}}
            span 操作员：{{detailData.operName}}
        template(v-else)
          .row.justify-between.text-gray.padding-bottom-xs
            .col 共{{detailData.totalAmount}}支，{{detailData.totalWeight}}吨
            span 操作员：{{detailData.operName}}
        .solid-top.padding-top-xs.padding-bottom-xs.row.justify-between
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
      div( v-if="tempObject.auditType === 'erp议价'")
        .bg-white.card(v-for="(item, index) in dataList", :key="index")
          .row.justify-between.padding-bottom-xs
            .text-black.col {{item.scontractDetailPartsname}} {{item.scontractDetailSpec}}
            .text-blue ¥ {{item.sbillDetailInprice}}
          .text-gray
            .row.justify-between.padding-bottom-xs
              .col
                span.padding-right-xs {{item.scontractDetailMaterial}}
                span.padding-right-xs {{item.goodsProperty1}}
                span.padding-right-xs {{item.warehouseName}}
                span.sub-mark.ml-5 {{item.scontractDetailProareaname}}
              span ({{item.goodsMetering}})
            .padding-bottom-xs {{item.goodsNum}}支/{{item.goodsWeight}}吨
            .padding-bottom-xs
              span.padding-right-xs(v-if="item.goodsProperty5") 公差范围 {{item.goodsProperty5}}
              span(v-if="item.goodsProperty4") 重量范围 {{item.goodsProperty4}}
            .solid-top.padding-top-xs.padding-bottom-xs.text-black
              span 销售定价：
              span.text-blue ￥{{item.saleMakeprice}}
              span.padding-left-xs.delete-style.text-grey ￥{{item.sbillDetailInprice}}
              span.padding-left-xs 定价差：
              span.text-red ￥{{item.saleMakepriceCale}}
      div(v-else)
        .bg-white.card(v-for="(item, idx) in dataList", :key="idx")
          .row.justify-between.padding-bottom-xs
            .text-black.col {{item.name}} {{item.standard}}
            .text-blue ¥ {{tempObject.auditType === '定向' ? item.order_price : item.price}}
          .text-gray
            template(v-if="tempObject.auditType === '定向'")  
              .row.justify-between.padding-bottom-xs
                .col
                  span.padding-right-xs {{item.material}}
                  span.padding-right-xs {{item.length}}
                  span.padding-right-xs {{item.warehouse}}
                  span.sub-mark.ml-5 {{item.supply}}
                span ({{item.metering_way}})
              .padding-bottom-xs {{item.amount}}支/{{item.weight}}吨
              .padding-bottom-xs
                span.padding-right-xs(v-if="item.tolerance_range") 公差范围 {{item.tolerance_range}}
                span(v-if="item.weight_range") 重量范围 {{item.weight_range}}
              .solid-top.padding-top-xs.padding-bottom-xs.text-black
                span 定向价：
                span.text-blue ￥{{item.dx_price}}
                span.padding-left-xs 费用：￥{{item.cost_price}}
                span.padding-left-xs 价差：
                span.text-red ￥{{item.diff}}
              span.text-black 销售定价：
              span.text-orange ￥{{item.xs_price}}
              span.padding-left-xs.text-grey.delete-style 原定价：￥{{item.order_price}}
            template(v-else)
              .row.justify-between.text-gray.padding-bottom-xs
                .col 
                  span.padding-right-xs {{item.material}}
                  span 退款支数：{{item.amount}}支
                span ({{item.metering_way_str}})
              .text-gray 
                span 退款重量：{{item.weight}}吨  
                span.padding-left-xs 退款金额：{{item.money}}元
  .footer.row.bg-white.text-center.text-white.padding-sm(:style="{height: isIpx ? '188rpx' : '120rpx', 'padding-bottom': isIpx ? '68rpx' : '20rpx'}",
   v-if="btnShow && tempObject.fromPage !== 'reviewHistory'")
    .col.foot-cancel(@click="confirm('cancel')") {{tempObject.auditType === '退货' ? '驳回' : '拒绝'}}
    .col.foot-confirm.margin-left-sm(@click="confirm('confirm')") {{tempObject.auditType === '退货' ? '退货' : '通过'}}
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
      modalVal: '',
      modalInputTitle: '退款金额',
      modalShow: false,
      detailData: {
        list: []
      },
      disabled: false,
      statusList: {
        '5': '定向初审',
        '3': '定向复审'
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
      modules: state => state.modules
    }),
    dataList () {
      return this.detailData.list.filter(item => {
        return item.good_name !== '吊费'
      })
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
  onShow () {
    this.disabled = false
    this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - 203
    // this.auditType = this.$root.$mp.query.auditType
    this.tempObject = this.$root.$mp.query
    if (this.tempObject.auditType) {
      this.showLoading()
      this.loadData()
    }
  },
  methods: {
    jumpBillDetail (item) {
      if (this.disabled) return false
      this.disabled = true
      this.jump(`/pages/billDetail/main?id=${item.deal_no}`)
    },
    modalHandler ({ type }) {
      this.modalShow = false
      if (type === 'confirm') {
        const params = {
          return_id: this.tempObject.return_id,
          status: 1
        }
        if (this.modalInputTitle === '驳回原因') {
          if (!this.modalVal) {
            this.showMsg('请输入驳回原因')
            return false
          }
          params.reject_cause = this.modalVal
          params.status = 2
          params.kp_flag = this.detailData.invoiceFlag
        } else {
          params.back_money = this.modalVal
        }
        this.confirmAudit(params, this.apiList.xy.returnGoodsAudit)
      }
    },
    confirm (flag) {
      if (this.disabled) return false
      this.disabled = true
      let params = {}
      debugger
      console.log(this.tempObject)
      if (flag === 'confirm') {
        switch (this.tempObject.auditType) {
          case '退货':
            this.disabled = false
            this.modalShow = true
            if (flag === 'cancel') {
              this.modalInputTitle = '驳回原因'
              this.modalVal = ''
            } else {
              this.modalInputTitle = '退款金额'
              this.modalVal = this.detailData.totalMoeny
            }
            break
          case '定向':
            if (this.tempObject.statusStr === '定向初审') {
              this.erpModalShow1 = true
            } else if (this.tempObject.statusStr === '定向复审') {
              this.erpModalShow2 = true
            }
            break
          case '延时':
            if (flag === 'cancel') {
              params.status = '2'
            } else {
              params.status = '1'
            }
            params.id = this.tempObject.return_id
            this.confirmAudit(params, this.apiList.xy.orderDelayAudit)
            break
          case 'erp议价':
            if (this.tempObject.statusStr === 'erp议价初审') {
              this.erpModalShow1 = true
            } else if (this.tempObject.statusStr === 'erp议价复审') {
              this.erpModalShow2 = true
            }
            break
        // default:
        //   console.log('default')
        }
      } else if (flag === 'cancel') {
        if (this.tempObject.statusStr === 'erp议价复审') { // erp议价复审驳回
          let params = {
            id: this.detailData.billNo,
            stage: 2, // 1初审 2复审
            flag: '0',
            cust_name: this.detailData.custName,
            employee_name: this.detailData.employeeName,
            dept_name: this.detailData.deptName
          }
          console.log('入参====>', params)
          this.confirmAudit(params, this.apiList.xy.sellerBargainAudit)
        } else if (this.tempObject.statusStr === '定向复审') { // 定向订单待复审驳回
          let params = {
            user_id: this.currentUser.user_id,
            deal_no: this.detailData.billNo,
            flag: '0'
          }
          console.log('入参====>', params)
          this.confirmAudit(params, this.apiList.xy.dxAudit)
        } else {
          this.back()
        }
      }
    },
    erpModalCb (flag) { // 初审弹框
      if (flag === 'confirm') {
        if (this.tempObject.statusStr === 'erp议价初审') { // erp议价初审确定
          let params = {
            id: this.detailData.billNo,
            stage: 1, // 1初审 2复审
            flag: flag === 'cancel' ? '0' : '1',
            cust_name: this.detailData.custName,
            employee_name: this.detailData.employeeName,
            dept_name: this.detailData.deptName
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
      } else {
        this.erpModalShow1 = false
      }
    },
    erpModalCbInput (flag) { // 复审输入弹框
      if (flag.type === 'confirm') {
        if (!this.erpModalVal) {
          this.showMsg('请输入审核通过原因！')
          return false
        }
        if (this.tempObject.statusStr === 'erp议价复审') { // erp议价复审确定
          let params = {
            id: this.detailData.billNo,
            stage: 2, // 1初审 2复审
            flag: flag === 'cancel' ? '0' : '1',
            reson: this.erpModalVal,
            cust_name: this.detailData.custName,
            employee_name: this.detailData.employeeName,
            dept_name: this.detailData.deptName
          }
          console.log('入参====>', params)
          this.confirmAudit(params, this.apiList.xy.sellerBargainAudit)
        } else if (this.tempObject.statusStr === '定向复审') { // 定向订单待复审确定
          let params = {
            user_id: this.currentUser.user_id,
            deal_no: this.detailData.billNo,
            flag: flag === 'cancel' ? '0' : '1',
            pw_reson: this.erpModalVal
          }
          console.log('入参====>', params)
          this.confirmAudit(params, this.apiList.xy.dxAudit)
        }
        this.erpModalShow2 = false
      } else {
        this.erpModalShow2 = false
      }
    },
    async confirmAudit (params, api) {
      try {
        this.showLoading()
        const data = await this.ironRequest(api.url, params, api.method)
        this.hideLoading()
        if (data.returncode === '0') {
          this.showMsg('操作成功')
          const me = this
          setTimeout(() => {
            me.back()
            this.disabled = false
          }, 1000)
        } else {
          this.disabled = false
        }
      } catch (err) {
        this.hideLoading()
        this.disabled = false
        this.showMsg(err || '网络错误')
      }
    },
    async loadData () {
      try {
        let url = ''
        const modules = this.modules
        switch (this.tempObject.auditType) {
          case '定向':
            const sellerDxAudit = this.apiList.xy.sellerDxAudit
            url = `${sellerDxAudit.url}?user_id=${this.currentUser.user_id}&deal_no=${this.tempObject.tstc_no}`
            break
          case '退货':
            this.btnShow = modules.return_audit
            const sellerReturnGoodsAudit = this.apiList.xy.returnGoodsDetail
            url = `${sellerReturnGoodsAudit.url}?subs_no=${this.tempObject.tstc_no}&return_id=${this.tempObject.return_id}`
            if (this.tempObject.fromPage !== 'reviewHistory') {
              url += `&status=5`
            }
            break
          case '延时':
            this.btnShow = modules.delay_audit
            const sellerOrderDelayAudit = this.apiList.xy.sellerOrderDelayAudit
            url = `${sellerOrderDelayAudit.url}?tstc_no=${this.tempObject.tstc_no}`
            break
          case 'erp议价':
            debugger
            this.btnShow = modules.delay_audit
            url = `${this.apiList.xy.sellerBargainAudit.url}?user_id=${this.currentUser.user_id}&id=${this.tempObject.tstc_no}`
            break
          default:
            console.log('default')
            break
        }
        const data = await this.ironRequest(url, '', 'get')
        console.log('data', data)
        if (data.returncode === '0') {
          switch (this.tempObject.auditType) {
            case '定向':
              this.detailData = {
                liftStatus: data.need_lift,
                billNo: data.deal_no,
                custName: data.cust_name,
                totalAmount: data.amount,
                totalWeight: data.weight,
                totalMoeny: data.moeny,
                endTime: data.end_time,
                status: data.status,
                operName: data.oper_name,
                list: data.list
              }
              this.btnShow = (data.status === '待初审' && modules.audit) || (data.status === '待复审' && modules.re_audit)
              break
            case '退货':
              const datas = data.data
              this.detailData = {
                billNo: datas.lad_no,
                custName: datas.name,
                totalAmount: datas.amount,
                totalWeight: datas.weight,
                totalMoeny: datas.all_price_,
                endTime: datas.applyer_date,
                status: datas.status_desc,
                invoiceStatus: datas.kp_desc,
                invoiceFlag: datas.kp_flag,
                operName: datas.applyer_name,
                id: datas.id,
                totalLiftCharge: datas.lift_money,
                list: data.list
              }
              break
            case '延时':
              this.detailData = {
                list: data.data.resultlist
              }
              break
            case 'erp议价':
              console.log(data.data.sbillBargainingDto)
              this.detailData = {
                liftStatus: 1,
                billNo: data.data.sbillBargainingDto.sbillBillcode,
                custName: data.data.sbillBargainingDto.datasCustomername,
                totalAmount: data.data.sbillBargainingDto.goodsNum,
                totalWeight: data.data.sbillBargainingDto.goodsWeigh,
                totalMoeny: data.data.sbillBargainingDto.totalMoney,
                endTime: data.data.sbillBargainingDto.dataSystemdate,
                status: data.data.sbillBargainingDto.bargainingAuditStatus,
                operName: data.data.sbillBargainingDto.operatorName,
                list: data.data.list,
                deptName: data.data.sbillBargainingDto.deptName,
                employeeName: data.data.sbillBargainingDto.employeeName

              }
              this.btnShow = (data.data.sbillBargainingDto.bargainingAuditStatus === '待初审' && modules.audit) || (data.data.sbillBargainingDto.bargainingAuditStatus === '待复审' && modules.re_audit)
              break
            default:
              console.log('default')
              break
          }
        }
        this.hideLoading()
      } catch (e) {
        this.hideLoading()
        console.log(e)
      }
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
.input-box
  border-radius 5px
  width 100%
  height 40px
  input
    height 40px
    width 100%
.delete-style
  text-decoration line-through
</style>