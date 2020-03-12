<template lang="pug">
div
  nav-bar(title="退货申请", isBack)
  .bg-white
    .ft-16.padding-sm 退货选择
    .solid-top.row.padding-sm
      .col.row(@click="isGoodsShow = !isGoodsShow")
        img.choose-icon(src="/static/images/blue_check.png", v-if="isGoodsShow")
        img.choose-icon(src="/static/images/btn_ck_n.png", v-else)
        span.padding-left-sm 退货款
      .col.row(@click="isliftShow = !isliftShow")
        img.choose-icon(src="/static/images/blue_check.png", v-if="isliftShow")
        img.choose-icon(src="/static/images/btn_ck_n.png", v-else)
        span.padding-left-sm 退吊费
  .margin-sm.bg-white.radius.padding-sm(v-if="isGoodsShow")
    .goods-list
      .row.padding-bottom-sm.solid-bottom
        //- img.choose-icon(src="/static/images/btn_ck_n.png")
        span.text-blue.padding-left-xs {{listData[0].tstc_no}}
      .padding-top-sm.solid-bottom(v-for="(item, idx) in listData", :key="idx")
        .row.padding-bottom-xs(@click="item.choosed = !item.choosed")
          img.choose-icon(src="/static/images/blue_check.png", v-if="item.choosed")
          img.choose-icon(src="/static/images/btn_ck_n.png", v-else)
          .padding-left-xs {{item.goods_name}} {{item.stander}}
          .sub-mark.ml-5 {{item.address}}
        .text-gray
          .padding-bottom-xs
            span {{item.material}}
            span.padding-left-xs {{item.lengths}}米 
            span.padding-left-xs {{item.warehouse_name}}  
          .padding-bottom-xs
            span 可提：{{item.deal_amount}}支/{{item.deal_weight}}吨
          .padding-bottom-xs
            span 公差范围：2-9
            span.padding-left-xs 重量范围：10-20
        .row.padding-sm.justify-end.align-end
          .col(style="flex: 0 0 60px;")
            count-step(v-model="item.count", @click.native="rowCartCount(item)", @blur="rowCartCount(item)", :max="item.amount_real")
          .padding-left-xs {{item.countWeight}}吨
      .row.justify-between.padding-top-sm
        span 总重量/总金额
        span {{totalGoodsWeight}}吨/{{totalGoodsPrice}}元
  .margin-sm.bg-white.radius.padding-sm(v-if="isliftShow")
    .solid-bottom.text-black.ft-16.padding-bottom-sm 吊费信息
    .row.padding-top-sm
      span.text-red *
      span 吊费金额
      .col.text-right.margin-right-xs.padding-left-sm
        input(type="text", :placeholder="liftPlaceholder")
  .margin-sm.bg-white.radius(style="margin-bottom: 120rpx")
    .solid-bottom.text-black.ft-16.padding-sm 上传退货协议
    .row.justify-between.solid-bottom.padding-sm
      span 退款总金额
      span.text-gray 2550.3元
    .row.justify-between.solid-bottom.padding-sm
      span 发票状态
      span.text-gray 待申请
    .row.justify-between.solid-bottom.padding-sm
      span.text-red *
      span 退货原因
      .col.text-right.margin-right-xs.padding-left-sm
        input(type="text", placeholder="不想要了")
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
        .text-right.ft-12 共{{totalCount}}件 ，{{totalWeight}}吨，吊费: {{totalLiftCharge}}元
      .cart-settle-btn.ft-18.bg-blue
        span 申请    
</template>
<script>
import { mapState } from 'vuex'
import CountStep from '@/components/CountStep.vue'
export default {
  data () {
    return {
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
      billTab: [
        { title: '待申请', status: '0,2', data: [], isActive: true },
        { title: '申请历史', status: '-1', data: [], isActive: false }
      ],
      isTabDisabled: false,
      tabName: '0,2',
      currentPage: 0,
      listData: [],
      isload: false,
      scrollHeight: 0,
      subsNo: '',
      status: ''
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
        let filterArray = newVal.filter(item => {
          item.countWeight = this.$toFixed(Number(item.count * item.weight), 3)
          return item.choosed === true
        })
        this.totalCount = filterArray.length
        this.allChoosed = this.totalCount === newVal.length
        this.totalGoodsWeight = 0
        this.totalGoodsPrice = 0
        this.totalPrice = 0
        this.totalWeight = 0
        this.totalLiftCharge = 0
        if (filterArray.length > 0) {
          filterArray.map(itm => {
            if (itm.price.indexOf('--') < 0) {
              if (Number(itm.lift_charge) > 0) {
                const countWeight = Number(this.$toFixed(itm.count * itm.weight, 3))
                const countLiftWeight = countWeight * itm.lift_charge
                this.totalPrice += itm.price * countWeight + countLiftWeight
                this.totalLiftCharge += countLiftWeight
              } else {
                this.totalPrice += itm.price * Number(this.$toFixed(itm.count * itm.weight, 3))
              }
              this.totalWeight += Number(this.$toFixed(itm.weight * itm.count, 3))
            }
          })
          this.totalLiftCharge = this.$toFixed(Number(this.totalLiftCharge), 2)
          this.totalPrice = this.$toFixed(Number(this.totalPrice), 2)
          this.totalWeight = this.$toFixed(Number(this.totalWeight), 3)
        }
      },
      deep: true
    }
  },
  onUnload () {
    this.tabName = '1'
    this.currentPage = 0
    this.listData = []
    this.finished = true
    this.isload = false
    this.scrollHeight = 0
  },
  onShow () {
    this.subsNo = this.$root.$mp.query.subsNo
    this.status = this.$root.$mp.query.status
    this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - 205
    if (this.$root.$mp.query.tabName) this.tabName = this.$root.$mp.query.tabName
    this.returnGoodsDetail()
  },
  methods: {
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
      this.ironRequest('cartUpdate.shtml', { cart_id: obj.cart_id, user_id: this.currentUser.user_id, measure_way: obj.measure_way_id, count: obj.count }, 'post').then(res => {
      })
    },
    async returnGoodsDetail () {
      try {
        const returnGoodsDetail = this.apiList.xy.returnGoodsDetail
        const url = `${returnGoodsDetail.url}?subs_no=HT20030300003&status=${this.status}`
        const data = await this.ironRequest(url, '', returnGoodsDetail.method)
        const resData = data.data.resultlist
        resData.map(item => {
          item.choosed = false
          item.countWeight = item.deal_weight
          item.count = item.deal_amount
        })
        this.liftPlaceholder = `最大可退吊费金额${data.data.lift_money}元`
        this.listData = resData
      } catch (err) {
        console.log(err)
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
.bill-btn, .bill-red-btn,.bill-gray-btn
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
</style>