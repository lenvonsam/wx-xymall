<template lang="pug">
div
  nav-bar(title="退货申请", isBack)
  .bg-white
    .ft-16.padding-sm 退货选择
    .solid-top.row.padding-sm
      .col.row(@click="returnGoodsCheck('isGoodsShow')")
        img.choose-icon(src="/static/images/blue_check.png", v-if="isGoodsShow")
        img.choose-icon(src="/static/images/btn_ck_n.png", v-else)
        span.padding-left-sm 退货款
      .col.row(@click="returnGoodsCheck('isliftShow')")
        img.choose-icon(src="/static/images/blue_check.png", v-if="isliftShow")
        img.choose-icon(src="/static/images/btn_ck_n.png", v-else)
        span.padding-left-sm 退吊费
  .margin-sm.bg-white.radius.padding-sm(v-if="isGoodsShow && listData.length > 0")
    .goods-list
      .row.padding-bottom-sm.solid-bottom
        span.text-blue.padding-left-xs {{listData[0].tstc_no}}
      .padding-top-sm.solid-bottom(v-for="(item, idx) in listData", :key="idx")
        .row.padding-bottom-xs(@click="item.choosed = !item.choosed")
          img.choose-icon(src="/static/images/blue_check.png", v-if="item.choosed")
          img.choose-icon(src="/static/images/btn_ck_n.png", v-else)
          .padding-left-xs {{item.goods_name}} {{item.stander}}
          .sub-mark.ml-5 {{item.address}}
        .text-gray
          .padding-bottom-xs.row
            .col
              span {{item.material}}
              span.padding-left-xs {{item.lengths}}米 
              span.padding-left-xs {{item.warehouse_name}}
            span ({{meteringWay[item.metering_way]}})
          .padding-bottom-xs
            span 可提：{{item.amount_real}}支/{{item.weight_real}}吨
          .padding-bottom-xs(v-if="item.gcfw || item.zlfw")
            span.padding-right-xs(v-if="item.gcfw") 公差范围：{{item.gcfw}}
            span(v-if="item.zlfw") 重量范围：{{item.zlfw}}
        .row.padding-sm.justify-end.align-end
          .col(style="flex: 0 0 60px;")
            count-step(v-model="item.count", @click.native="rowCartCount(item)", @blur="rowCartCount(item)", :max="item.amount_real")
          .padding-left-xs
            template(v-if="item.metering_way === 1")
              .row(style="width: 200rpx")
                .input-weight.col.text-center
                  input.col(type="digit", v-model="item.countWeight", @focus="countWeightFocus = true", @blur="listChange(listData)")
                .padding-left-xs 吨
            template(v-else)
              span {{item.countWeight}}吨
      .row.justify-between.padding-top-sm
        span 总重量/总金额
        span {{totalGoodsWeight}}吨/{{totalGoodsPrice}}元
  .margin-sm.bg-white.radius.padding-sm(v-if="isliftShow")
    .solid-bottom.text-black.ft-16.padding-bottom-sm 吊费信息
    .row.padding-top-sm
      span.text-red *
      span 吊费金额
      .col.text-right.margin-right-xs.padding-left-sm.row
        input.col(type="text", :placeholder="liftPlaceholder", v-model="totalLiftCharge", @blur="liftInput")
        span 元
  .margin-sm.bg-white.radius(style="margin-bottom: 120rpx")
    .solid-bottom.text-black.ft-16.padding-sm 上传退货协议
    .row.justify-between.solid-bottom.padding-sm
      .col 退款总金额
      .text-gray {{totalPrice}}元
        //- input.col(type="Number", v-model="totalPrice")
        //- span 元
    .row.justify-between.solid-bottom.padding-sm
      span 发票状态
      span.text-gray {{invoiceStatusStr}}
    .row.justify-between.solid-bottom.padding-sm
      span.text-red *
      span 退货原因
      .col.text-right.margin-right-xs.padding-left-sm
        picker.col(@change="returnReasonCb", :range="returnReasonList", range-key="name")
          .text-right.text-gray {{returnReason || '请选择退货原因'}}
    .flex.justify-between.solid-bottom.padding-sm
      div(style="width: 200rpx") 具体原因描述
      textarea.text-gray.col.bg-gray.padding-xs(style="height: 250rpx", v-model="returnRemark")
  .s-footer
    .cart-footer.justify-between
      .col.cart-footer-col
        .row.justify-between
          .row.flex-center(@click="choosedAll", style="padding-left: 10px;")
            .flex.flex-center
              img.choose-icon(src="/static/images/blue_check.png", v-if="allChoosed")
              img.choose-icon(src="/static/images/btn_ck_n.png", v-else)
            .padding-xs 全选
          .text-right.flex.justify-end
            span 合计：
            b.text-red ￥ {{totalPrice}}
        .text-right.ft-12 共{{totalCount}}件 ，{{totalWeight}}吨
          span(v-if="isliftShow") ，吊费: {{totalLiftCharge}}元
      .cart-settle-btn.ft-18.bg-blue(@click="returnGoods")
        span 申请
</template>
<script>
import { mapState, mapActions } from 'vuex'
import CountStep from '@/components/CountStep.vue'
export default {
  data () {
    return {
      countWeightFocus: false,
      maxLift: '',
      returnReason: '',
      liftPlaceholder: '',
      allChoosed: false,
      isGoodsShow: true,
      isliftShow: false,
      totalGoodsWeight: 0,
      totalGoodsPrice: 0,
      totalPrice: 0,
      totalWeight: 0,
      totalLiftCharge: 0,
      totalCount: 0,
      isTabDisabled: false,
      // tabName: '0,2',
      currentPage: 0,
      listData: [],
      isload: false,
      scrollHeight: 0,
      subsNo: '',
      htNo: '',
      status: '',
      invoiceStatus: '',
      invoiceStatusStr: '',
      returnRemark: '',
      returnReasonList: [],
      meteringWay: {
        '1': '磅计',
        '2': '理计',
        '3': '16理计',
        '4': '10理计'
      }
    }
  },
  components: {
    CountStep
  },
  computed: {
    ...mapState({
      tempObject: state => state.tempObject
    })
  },
  watch: {
    listData: {
      handler (newVal, oldVal) {
        if (this.countWeightFocus) return false
        this.listChange(newVal)
      },
      deep: true
    }
  },
  onUnload () {
    this.currentPage = 0
    this.listData = []
    this.finished = true
    this.isload = false
    this.scrollHeight = 0
    this.statusStr = ''
    this.subsNo = ''
    this.htNo = ''
    this.status = ''
    this.returnReason = ''
    this.returnRemark = ''
    this.totalGoodsWeight = 0
    this.totalGoodsPrice = 0
    this.totalPrice = 0
    this.totalWeight = 0
    this.totalLiftCharge = 0
    this.totalCount = 0
  },
  onHide () {
    this.btnDisabled = false
  },
  // onShow () {
  //   this.subsNo = this.$root.$mp.query.subsNo
  //   this.status = this.$root.$mp.query.status
  //   this.htNo = this.subsNo.replace('TD', 'HT')
  //   this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - 205
  //   if (this.$root.$mp.query.tabName) this.tabName = this.$root.$mp.query.tabName
  //   this.returnGoodsDetail()
  //   // this.returnGoodsReason()
  // },
  beforeMount () {
    this.subsNo = this.$root.$mp.query.subsNo
    this.status = this.$root.$mp.query.status
    this.htNo = this.subsNo.replace('TD', 'HT')
    this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - 205
    // if (this.$root.$mp.query.tabName) this.tabName = this.$root.$mp.query.tabName
    this.returnGoodsDetail()
    this.returnGoodsReason()
  },
  methods: {
    ...mapActions([
      'configVal'
    ]),
    returnGoodsCheck (key) {
      this[key] = !this[key]
      this.listChange(this.listData)
    },
    listChange (listData) {
      this.countWeightFocus = false
      let filterArray = listData.filter(item => {
        if (item.metering_way !== 1) {
          item.countWeight = this.numberFormat(this.$toFixed(Number(item.count * item.singleWeight), 3))
        }
        if (Number(item.countWeight) > Number(item.weight_real)) item.countWeight = item.weight_real
        if (!Number(item.countWeight)) item.countWeight = 0.001
        return item.choosed === true
      })
      this.totalCount = filterArray.length
      this.allChoosed = this.totalCount === listData.length
      this.totalGoodsWeight = 0
      this.totalGoodsPrice = 0
      this.totalPrice = 0
      this.totalWeight = 0
      // countWeight
      if (filterArray.length > 0) {
        filterArray.map(itm => {
          // const countWeight = itm.count * itm.singleWeight
          this.totalGoodsWeight += Number(itm.countWeight)
          this.totalGoodsPrice += itm.price * Number(itm.countWeight)
        })
      }
      this.totalGoodsPrice = this.$toFixed(Number(this.totalGoodsPrice), 2)
      this.totalGoodsWeight = this.$toFixed(Number(this.totalGoodsWeight), 3)
      this.totalPrice = this.isliftShow ? this.$toFixed(Number(this.totalGoodsPrice) + Number(this.totalLiftCharge), 2) : this.totalGoodsPrice
      this.totalWeight = this.totalGoodsWeight
    },
    liftInput (e) {
      const val = Number(e.mp.detail.value)
      if (val > this.maxLift) {
        this.totalLiftCharge = this.maxLift
      } else if (val < 0) {
        this.totalLiftCharge = 0
      } else {
        this.totalLiftCharge = this.$toFixed(val, 2)
      }
      this.listChange(this.listData)
    },
    returnReasonCb (e) {
      this.returnReason = this.returnReasonList[e.mp.detail.value].name
    },
    async returnGoodsReason () {
      try {
        const returnGoodsReason = this.apiList.xy.returnGoodsReason
        const data = await this.ironRequest(returnGoodsReason.url, '', returnGoodsReason.method)
        console.log('data', data)
        this.returnReasonList = data.list
      } catch (err) {
        this.showMsg(err || '网络错误')
      }
    },
    returnGoods () {
      try {
        if (this.btnDisabled) return false
        this.btnDisabled = true
        const list = this.listData
        // let amountTotal = 0
        const seqIds = []
        const amounts = []
        const weights = []
        const prices = []
        const filterArray = list.filter(item => {
          // amountTotal += item.count
          item.metering_way_str = this.meteringWay[item.metering_way]
          const price = this.$toFixed(Number(item.price) * Number(item.countWeight), 2)
          weights.push(item.countWeight)
          amounts.push(item.count)
          seqIds.push(item.seq_d)
          prices.push(price)
          return item.choosed === true
        })
        // if (filterArray.length === 0 && (!this.isliftShow || !this.totalLiftCharge)) {
        if (filterArray.length === 0) {
          this.showMsg('请正确填写退货物资数量')
          this.btnDisabled = false
          return false
        }
        if (!this.returnReason) {
          this.showMsg('请选择退货原因')
          this.btnDisabled = false
          return false
        }
        const params = {
          user_id: this.currentUser.user_id,
          return_id: this.$root.$mp.query.id,
          seq_d_more: seqIds.toString(),
          amount_more: amounts.toString(),
          weight_more: weights.toString(),
          price_more: prices.toString(),
          status: this.status,
          tostatus: 4,
          payment_real: this.totalPrice,
          subs_no: this.htNo,
          return_reason: this.returnReason,
          lift_money: this.isliftShow ? this.totalLiftCharge : 0,
          invoice_status: this.invoiceStatus,
          return_remark: this.returnRemark
        }
        const detailRow = {
          params: params,
          list: filterArray,
          totalGoodsWeight: this.totalGoodsWeight,
          totalGoodsPrice: this.totalGoodsPrice,
          totalPrice: this.totalPrice,
          totalWeight: this.totalWeight,
          totalLiftCharge: this.isliftShow ? this.totalLiftCharge : 0,
          totalCount: this.totalCount
        }
        this.configVal({ key: 'tempObject', val: detailRow })
        this.jump(`/pages/vendor/returnApplicationDetail/main`)
      } catch (err) {
        console.log(err)
      }
    },
    choosedAll () {
      this.allChoosed = !this.allChoosed
      if (this.allChoosed) {
        this.listData.map(itm => {
          itm.choosed = true
        })
      } else {
        this.listData.map(itm => {
          itm.choosed = false
        })
      }
    },
    rowCartCount (obj) {
      console.log(obj.count)
      this.ironRequest('cartUpdate.shtml', { cart_id: obj.cart_id, user_id: this.currentUser.user_id, measure_way: obj.metering_way, count: obj.count }, 'post').then(res => {
      })
    },
    async returnGoodsDetail () {
      try {
        this.showLoading()
        const returnGoodsDetail = this.apiList.xy.returnGoodsApplyDetail
        const url = `${returnGoodsDetail.url}?subs_no=${this.htNo}&status=${this.status}`
        const data = await this.ironRequest(url, '', returnGoodsDetail.method)
        const resData = data.data
        const list = resData.resultlist
        this.totalLiftCharge = resData.lift_money
        this.invoiceStatus = resData.invoice_status
        this.invoiceStatusStr = resData.invoice_status_desc
        const meteringWay = {
          '1': 'att8',
          '2': 'att8',
          '3': 'att9',
          '4': 'att10'
        }
        list.map(item => {
          item.choosed = false
          item.countWeight = item.weight_real
          item.count = item.amount_real
          item.singleWeight = Number(item[meteringWay[item.metering_way]]) * Number(item.lengths)
        })
        this.maxLift = resData.lift_money
        this.liftPlaceholder = `最大可退吊费金额${this.maxLift}`
        this.listData = list
        this.hideLoading()
      } catch (err) {
        console.log(err)
        this.hideLoading()
        this.showMsg(err)
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
    margin-left -13px
    z-index 99
.search-input
  background #F6F6F6
  padding 5px 10px
  border-radius 35px
.search-btn
  padding 10px
.s-footer
  position fixed
  bottom 0
  left 0
  right 0
  background #fff
  z-index 9
.cart-footer
  flex 5
  min-height 50px
  background #fff
  display flex
  // color $mainBlack
  .cart-footer-col
    flex-direction column
    align-items center
    align-self center
    padding-right 8px
    flex-basis 28%
  .cart-settle-btn
    display flex
    width 200rpx
    // background #F95353
    letter-spacing 2px
    align-items center
    color #fff
    justify-content center
.count-step .num input
  color #333 !important
.input-weight
  border 1px #ddd solid
  border-radius 3px
</style>