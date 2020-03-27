<template lang="pug">
div
  nav-bar(title="报价单管理", isBack)
  .bg-white.row.padding-sm.justify-between
    .text-black.col.text-bold {{resData.cust_name}}
    .text-gray {{resData.status}}
  .margin-top-sm.solid-bottom.bg-white.padding-sm(v-for="(item, rIdx) in resData.list", :key="rIdx")
    .goods-item.text-gray
      .row.justify-between.padding-bottom-xs.text-bold
        .text-black.col
          span {{item.name}} 
          span.padding-left-xs {{item.standard}}
        .text-blue ￥{{item.dx_price}}
      .padding-bottom-xs.row.justify-between
        .col
          span {{item.material}}
          span.ml-5 {{item.length}}米
          span.ml-5 {{item.warehouse}}
          span.sub-mark.ml-5 {{item.supply}}
        span ({{item.metering_way}})  
      .padding-bottom-xs
        span {{item.amount_left}}支
        span.padding-left-xs.padding-right-xs /
        span {{item.amount_weight}}吨
        span.ml-5(v-if="resData.need_lift") 吊费：25 元/吨
      .padding-bottom-xs(v-if="item.tolerance_range || item.weight_range")
        span.padding-right-xs(v-if="item.tolerance_range") 公差范围：{{item.tolerance_range}}
        span(v-if="item.weight_range") 重量范围：{{item.weight_range}}
      .padding-bottom-xs
        span 数量：{{item.amount}}支
        span.ml-5 重量：{{item.weight}}吨
  .padding-sm.text-right.bg-white
    .ft-15.text-bold
      span.text-black 合计：
      span.text-red ￥{{resData.money}}
    .padding-top-xs
      span 共{{resData.amount}}支
      span.padding-left-xs {{resData.weight}}吨，
      span 吊费：{{resData.lift}}元
  .footer.row.bg-white.text-center.text-white.padding-sm
    template(v-if="resData.status == '已锁货' || resData.status == '未锁货'")
      .col.foot-btn.bg-red(@click="quotationHandler('cancel')") 强制失效
      .col.foot-cancel.margin-left-sm(@click="quotationHandler('release')", v-if="resData.status === '已锁货'") 取消锁货
      .col.foot-cancel.margin-left-sm(@click="quotationHandler('lock')", v-if="resData.status === '未锁货'") 锁货
      .col.foot-confirm.margin-left-sm(@click="quotationHandler('dx')") 直接定向
    template(v-else)
      .col.foot-confirm.margin-left-sm(@click="quotationHandler('copy')") 复制到购物车
  modal(:value="modalShow", @cb="modalCb", :btns="modalBtns")
    .padding-sm.text-left {{modalMsg}}  
</template>
<script>
import { mapState } from 'vuex'
import modal from '@/components/Modal.vue'
export default {
  data () {
    return {
      scrollHeight: 0,
      resData: {},
      qutId: '',
      btnDisabled: false,
      modalShow: false,
      modalMsg: '',
      modalBtns: [{ label: '确定', flag: 'confirm', className: 'main-btn' }]
    }
  },
  components: {
    modal
  },
  computed: {
    ...mapState({
      tempObject: state => state.tempObject
    })
  },
  onUnload () {
    this.qutId = ''
    this.btnDisabled = false
    this.modalShow = false
  },
  onShow () {
    this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - 205
    this.qutId = this.$root.$mp.query.id
    this.quotationDetail()
  },
  methods: {
    modalCb () {
      this.modalShow = false
    },
    async quotationDetail () {
      try {
        const quotationDetail = this.apiList.xy.quotationDetail
        const url = `${quotationDetail.url}?user_id=${this.currentUser.user_id}&qut_id=${this.qutId}`
        const data = await this.ironRequest(url, '', quotationDetail.method)
        if (data.returncode === '0') {
          this.resData = data
          this.resFixed()
        }
      } catch (e) {
        console.log(e)
      }
    },
    resFixed () {
      this.resData.money = this.$toFixed(this.resData.money, 2)
      this.resData.lift = this.$toFixed(this.resData.lift, 2)
    },
    async quotationHandler (flag) {
      try {
        if (this.btnDisabled) return false
        this.btnDisabled = true
        this.showLoading()
        let quotation = ''
        switch (flag) {
          case 'cancel':
            quotation = this.apiList.xy.quotationCancel
            break
          case 'release':
            quotation = this.apiList.xy.quotationRelease
            break
          case 'dx':
            quotation = this.apiList.xy.quotationDx
            break
          case 'lock':
            quotation = this.apiList.xy.quotationLock
            break
          case 'copy':
            quotation = this.apiList.xy.copyQuotation
            break
          default:
            console.log('-----')
        }
        const params = {
          user_id: this.currentUser.user_id,
          qut_id: this.qutId
        }
        const data = await this.ironRequest(quotation.url, params, quotation.method)
        this.hideLoading()
        if (data.returncode === '0') {
          this.showMsg(data.errormsg)
          const me = this
          setTimeout(() => {
            me.back()
          }, 1000)
        } else {
          this.btnDisabled = false
        }
      } catch (e) {
        this.modalMsg = e
        this.modalShow = true
        this.btnDisabled = false
        this.hideLoading()
        // this.showMsg(e)
        console.log(e)
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.bill-list
  margin-bottom 10px
  margin-top 10px
  padding-left 10px
  padding-right 10px
  .box
    border-radius 5px
    overflow hidden
    .solid-top
      border-top 0.5px solid #eee
.bill-btn, .bill-red-btn, .bill-gray-btn
  padding 2px 8px
  text-align center
  font-size 13px
  color #0081ff
.bill-btn
  border 1px #0081ff solid
.bill-red-btn
  border 1px #e54d42 solid
  color #e54d42
.bill-gray-btn
  border 1px #DCDCDC solid
  color #888888
.bill-content
  height 100%
.filter-btn
  padding 10px 0 10px 10px
.search-btn
  padding 10px
.nav
  .tab-line
    display block
    content ''
    height 25px
    width 2px
    position absolute
    left 50%
    margin-left -1px
    top 10px
    background #e6e6e6
.nav .cu-item.cur
  border-bottom none
  position relative
  &:after
    display block
    content ''
    width 26px
    height 2px
    background #0081ff
    position absolute
    bottom 0
    left 50%
    z-index 99
    margin-left -13px
.search-input
  background #F6F6F6
  padding 5px 10px
  border-radius 35px
.search-btn
  padding 10px
.footer
  position fixed
  bottom 0
  left 0
  right 0
</style>