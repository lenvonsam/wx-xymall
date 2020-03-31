<template lang="pug">
div
  nav-bar(title="待审核", isBack)
  .padding-sm(style="margin-bottom: 120rpx")
    template(v-if="auditType === '延时'")
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
          .text-red {{auditType === '退货' ? '待退款' : detailData.status}}
        .row.justify-between.padding-bottom-xs
          .text-gray.col {{detailData.custName}}
          .text-black ¥ {{detailData.totalMoeny}}
        template(v-if="auditType === '退货'")
          .text-gray.padding-bottom-xs.row.justify-between
            .col 发票状态：{{detailData.invoiceStatus}}
            span 操作员：{{detailData.operName}}
        template(v-else)
          .row.justify-between.text-gray.padding-bottom-xs
            .col 共{{detailData.totalAmount}}支，{{detailData.totalWeight}}吨
            span 操作员：{{detailData.operName}}
        .solid-top.padding-top-xs.padding-bottom-xs.row.justify-between
          template(v-if="auditType !== '退货'")
            .col
              span {{auditType==='定向' ? '' : '付款'}}截止时间：
              span.text-red.padding-left-xs {{detailData.endTime}}
            span(v-if="auditType==='定向'") {{liftStatus[detailData.liftStatus]}}
          template(v-else)  
            span.text-black {{detailData.endTime}}
      //- template(v-if="auditType !== '延时'")
      .ft-18.padding-top-sm.padding-bottom-sm 商品信息
      .bg-white.card(v-for="(item, idx) in dataList", :key="idx")
        .row.justify-between.padding-bottom-xs
          .text-black.col {{item.name}} {{item.standard}}
          .text-blue ¥ {{auditType === '定向' ? item.order_price : item.price}}
        .text-gray
          template(v-if="auditType === '定向'")  
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
          template(v-else)
            .row.justify-between.text-gray.padding-bottom-xs
              .col 
                span.padding-right-xs {{item.material}}
                span 退款支数：{{item.amount}}支
              span ({{item.metering_way_str}})
            .text-gray 
              span 退款重量：{{item.weight}}吨  
              span.padding-left-xs 退款金额：{{item.money}}元
  .footer.row.bg-white.text-center.text-white.padding-sm(style="height: 120rpx", v-if="btnShow && tempObject.fromPage !== 'reviewHistory'")
    .col.foot-cancel(@click="confirm('cancel')") {{auditType === '退货' ? '驳回' : '拒绝'}}
    .col.foot-confirm.margin-left-sm(@click="confirm") {{auditType === '退货' ? '退货' : '通过'}}
  modal-input(v-model="modalShow", :title="modalInputTitle", confirmText="确定", type="customize", :cb="modalHandler")
    .padding-sm
      .bg-gray.input-box
        input(:placeholder="'请填写'+modalInputTitle", v-model="modalVal", :disabled="modalInputTitle === '退款金额'")
      .text-red.text-left.padding-top-sm(v-if="modalInputTitle === '驳回原因'") 注：一旦驳回，此单将被删除，必须重新申请，请与销售沟通，并告知客户！  
</template>
<script>
import { mapState } from 'vuex'
import modalInput from '@/components/ModalInput.vue'
export default {
  components: {
    modalInput
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
      btnShow: false
    }
  },
  computed: {
    ...mapState({
      tempObject: state => state.tempObject,
      modules: state => state.modules
    }),
    dataList () {
      return this.detailData.list.filter(item => {
        return item.good_name !== '吊费'
      })
    },
    auditType () {
      return this.tempObject.auditType
    }
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
      switch (this.auditType) {
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
          params = {
            deal_no: this.detailData.billNo,
            flag: flag === 'cancel' ? '0' : '1'
          }
          this.confirmAudit(params, this.apiList.xy.dxAudit)
          break
        case '延时':
          if (flag === 'cancel') {
            params.status = '2'
          } else {
            params.status = '1'
          }
          // const ids = []
          // this.detailData.list.map(item => {
          //   ids.push(item.discussid)
          // })
          params.id = this.tempObject.return_id
          this.confirmAudit(params, this.apiList.xy.orderDelayAudit)
          break
        // default:
        //   console.log('default')
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
        switch (this.auditType) {
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
          default:
            console.log('default')
            break
        }
        const data = await this.ironRequest(url, '', 'get')
        console.log('data', data)
        if (data.returncode === '0') {
          switch (this.auditType) {
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
                list: data.list
              }
              break
            case '延时':
              this.detailData = {
                list: data.data.resultlist
              }
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
</style>