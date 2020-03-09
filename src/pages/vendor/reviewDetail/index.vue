<template lang="pug">
div
  nav-bar(title="待审核", isBack)
  .padding-sm
    .bg-white.card
      .row.justify-between.padding-bottom-xs
        .col.text-blue {{detailData.billNo}}
        .text-red {{detailData.status}}
      .row.justify-between.padding-bottom-xs
        .text-gray.col {{detailData.custName}}
        .text-black ¥ {{detailData.totalMoeny}}
      template(v-if="auditType === '退货'")
        .text-gray.padding-bottom-xs
          span {{detailData.invoiceStatus}}
          span.padding-left-xs 操作员：{{detailData.operName}}
      template(v-else)
        .row.justify-between.text-gray.padding-bottom-xs
          .col 共{{detailData.totalAmount}}支，{{detailData.totalWeight}}吨
          span 操作员：{{detailData.operName}}
      .solid-top.padding-top-xs.padding-bottom-xs
        template(v-if="auditType !== '退货'")
          span {{auditType==='定向' ? '' : '付款'}}截至时间：
          span.text-red.padding-left-xs {{detailData.endTime}}
        template(v-else)  
          span.text-black {{detailData.endTime}}
    template(v-if="auditType !== '延时'")     
      .ft-18.padding-top-sm.padding-bottom-sm 商品信息
      .bg-white.card(v-for="(item, idx) in detailData.list", :key="idx")
        .row.justify-between.padding-bottom-xs
          .text-black.col {{item.name}} {{item. standard}}
          .text-blue ¥ {{auditType === '定向' ? item.order_price : item.money}}
        .text-gray
          template(v-if="auditType === '定向'")  
            .row.justify-between.padding-bottom-xs
              .col
                span {{item.material}}
                span {{item.length}}
                span {{item.warehouse}}
                span.sub-mark.ml-5 {{item.supply}}
              span ({{item.metering_way}})
            .padding-bottom-xs {{item.amount}}支/{{item.weight}}吨
            .solid-top.padding-top-xs.padding-bottom-xs.text-black
              span 定向价：
              span.text-blue {{item.dx_price}}
              span.padding-left-xs 费用：{{item.cost_price}}
              span.padding-left-xs 价差：
              span.text-red {{item.diff}}
          template(v-else)    
            .row.justify-between.text-gray.padding-bottom-xs
              .col 
                span {{item.good_material}}
                span.padding-left-xs 退款支数：{{item.amount}}支
              span ({{item.metering_way_str}})
            .text-gray 
              span 退款重量：{{item.weight}}吨  
              span.padding-left-xs 退款金额：{{item.good_price}}元
  .footer.row.bg-white.text-center.text-white.padding-sm
    .col.foot-cancel(@click="confirm('cancel')") {{auditType === '退货' ? '驳回' : '拒绝'}}
    .col.foot-confirm.margin-left-sm(@click="confirm") {{auditType === '退货' ? '退货' : '通过'}}
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      auditType: '',
      detailData: '',
      disabled: false
    }
  },
  computed: {
    ...mapState({
      tempObject: state => state.tempObject
    })
  },
  onUnload () {
    this.disabled = false
  },
  onShow () {
    this.auditType = this.tempObject.auditType
    this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - 203
    this.showLoading()
    this.loadData()
  },
  methods: {
    confirm (flag) {
      if (this.disabled) return false
      this.disabled = true
      let params = {}
      switch (this.auditType) {
        case '退货':
          params = {
            return_id: this.detailData.id,
            status: 1
          }
          if (flag === 'cancel') {
            params.status = 2
            params.reject_cause = ''
            params.kp_flag = this.detailData.invoiceFlag
          }
          this.returnGoodsAudit(params)
          break
        case '定向':
          params = {
            deal_no: this.detailData.billNo,
            flag: flag === 'cancel' ? '0' : '1'
          }
          debugger
          this.dxAudit(params)
          break
        case '延时':
          if (flag === 'cancel') {
            this.back()
            return false
          }
          params = {
            id: this.detailData.billNo,
            status: '1'
          }
          this.orderDelayAudit(params)
          break
        default:
          console.log('default')
      }
    },
    async orderDelayAudit (params) {
      try {
        const orderDelayAudit = this.apiList.xy.orderDelayAudit
        const data = await this.ironRequest(orderDelayAudit.url, params, orderDelayAudit.method)
        if (data.returncode === '0') {
          this.showMsg('操作成功')
          this.back()
        }
        this.disabled = false
      } catch (err) {
        this.disabled = false
        this.showMsg(err || '网络错误')
      }
    },
    async dxAudit (params) {
      try {
        debugger
        const dxAudit = this.apiList.xy.dxAudit
        const data = this.ironRequest(dxAudit.url, params, dxAudit.method)
        if (data.returncode === '0') {
          this.showMsg('操作成功')
          this.back()
        }
        this.disabled = false
      } catch (err) {
        this.disabled = false
        this.showMsg(err || '网络错误')
      }
    },
    async returnGoodsAudit (params) {
      try {
        const returnGoodsAudit = this.apiList.xy.returnGoodsAudit
        const data = await this.ironRequest(returnGoodsAudit.url, params, returnGoodsAudit.method)
        if (data.returncode === '0') {
          this.showMsg('操作成功')
          this.back()
        }
        this.disabled = false
      } catch (err) {
        this.disabled = false
        this.showMsg(err || '网络错误')
      }
    },
    async loadData () {
      try {
        let url = ''
        switch (this.auditType) {
          case '定向':
            const sellerDxAudit = this.apiList.xy.sellerDxAudit
            url = `${sellerDxAudit.url}?user_id=${this.currentUser.user_id}&deal_no=${this.tempObject.tstc_no}`
            break
          case '退货':
            const sellerReturnGoodsAudit = this.apiList.xy.sellerReturnGoodsAudit
            url = `${sellerReturnGoodsAudit.url}?subs_no=${this.tempObject.tstc_no}&status=5`
            break
          case '延时':
            const sellerOrderDelayAudit = this.apiList.xy.sellerOrderDelayAudit
            url = `${sellerOrderDelayAudit.url}?tstc_no=${this.tempObject.tstc_no}`
            break
          default:
            console.log('-----')
        }
        const data = await this.ironRequest(url, '', 'get')
        if (data.returncode === '0') {
          switch (this.auditType) {
            case '定向':
              this.detailData = {
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
                billNo: data.deal_no,
                custName: data.cust_name,
                // totalAmount: data.amount,
                // totalWeight: data.weight,
                // totalMoeny: data.moeny,
                endTime: data.order_end_time,
                status: data.status,
                operName: data.opt_name,
                list: data.list
              }
          }
          this.hideLoading()
        }
      } catch (e) {
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
</style>