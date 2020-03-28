<template lang="pug">
div
  nav-bar(title="银企直联", isBack)
  .bg-white.padding-left-sm.solid-top
    .row.item.solid-bottom.text-gray.justify-between(v-for="(item, idx) in bankWater", :key="idx")
      .text-black.padding-right-sm {{item.label}}
      .col.text-right {{item.content}}    
  .padding(v-if="flag")
    .mt-50.main-btn(hover-class="hover-gray", @click="bankWaterHandler") {{flag === 'review' ? '审核通过' : '恢复'}}
    
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      bankWater: [
        { label: '流水单号', content: '', prop: 'bank_money_no' },
        { label: '汇款抬头', content: '', prop: 'bank_cust_name' },
        { label: '汇款银行', content: '', prop: 'bank_name' },
        { label: '汇款账号', content: '', prop: 'bank_no' },
        { label: '入金账户', content: '', prop: 'match_customer_name' },
        { label: '汇款金额', content: '元', prop: 'bank_money' },
        { label: '汇款时间', content: '', prop: 'bank_date' }
      ],
      bankWaterId: '',
      tabName: '',
      detailData: '',
      flag: '',
      disabled: false
    }
  },
  computed: {
    ...mapState({
      tempObject: state => state.tempObject
    })
  },
  onUnload () {
    this.bankWater = [
      { label: '流水单号', content: '', prop: 'bank_money_no' },
      { label: '汇款抬头', content: '', prop: 'bank_cust_name' },
      { label: '汇款银行', content: '', prop: 'bank_name' },
      { label: '汇款账号', content: '', prop: 'bank_no' },
      { label: '入金账户', content: '', prop: 'match_customer_name' },
      { label: '汇款金额', content: '元', prop: 'bank_money' },
      { label: '汇款时间', content: '', prop: 'bank_date' }
    ]
    this.flag = ''
  },
  onShow () {
    this.bankWaterId = this.$root.$mp.query.id
    this.flag = this.$root.$mp.query.flag
    this.bankWaterDetail()
  },
  methods: {
    async bankWaterDetail () {
      try {
        let bankWaterDetail = this.apiList.xy.bankWaterDetail
        const data = await this.ironRequest(`${bankWaterDetail.url}?id=${this.bankWaterId}`, '', bankWaterDetail.method)
        const resData = data.data
        this.detailData = resData
        // if (this.detailData.match_status ===) {}

        switch (this.flag) {
          case 'review':
            break
          case 'restore':
            const restoreObj = [
              { label: '删除时间', content: '', prop: 'audit_date' },
              { label: '删除人', content: '', prop: 'oper_name' }
            ]
            this.bankWater.push(...restoreObj)
            break
          default:
            // 详情
            const obj = [
              { label: '审核时间', content: '', prop: 'audit_date' },
              { label: '审核人', content: '', prop: 'oper_name' }
            ]
            this.bankWater.push(...obj)
        }
        if (data.returncode === '0') {
          this.bankWater.map(item => {
            item.content = resData[item.prop] ? resData[item.prop] + item.content : ''
          })
        }
      } catch (err) {
        console.log(err)
        this.showMsg(err || '网络错误')
      }
    },
    async bankWaterHandler () {
      try {
        if (this.disabled) return false
        this.disabled = true
        let bankWaterUrl = this.apiList.xy.bankWaterRestore
        const params = {
          id: this.detailData.id,
          user_id: this.currentUser.user_id
        }
        if (this.flag === 'review') {
          params.cust_no = this.detailData.bank_no
          bankWaterUrl = this.apiList.xy.bankWaterAudit
        }
        const data = await this.ironRequest(bankWaterUrl.url, params, bankWaterUrl.method)
        this.showMsg(data.errormsg)
        if (data.returncode === '0') {
          const me = this
          setTimeout(() => {
            me.disabled = false
            me.back()
          }, 1000)
        }
      } catch (err) {
        this.disabled = false
        console.log(err)
        this.showMsg(err || '网络错误')
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.item
  padding 10px 10px 10px 0
.left-label
  color #000
</style>