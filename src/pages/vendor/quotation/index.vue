<template lang="pug">
  .s-layout
    nav-bar(title="报价清单", :isBack="!pageType")
    .padding-left-sm.padding-right-sm.ft-12(style="background: #FEF7E7; line-height: 70rpx; height: 70rpx")
      .text-orange
        template(v-if="status === '已完成' || status === '已失效'")
          .row.justify-between
            .col 报价单
              span.padding-left-xs.text-bold {{status}}
            .go-mall.bg-blue.text-white(@click="jumpMall") 去商城逛逛
        template(v-else)
          span 报价单2小时内有效，超时自动失效
          span.padding-left-xs(v-if="pageType === 'share'") {{timeDown}}
    .bg-white.padding-sm.text-bold {{custName}}
    template(v-if="!isLoad")
      time-line(type="mallist")
    template(v-else)
      .s-empty-content(v-if="carts.length == 0")
        div(style="padding-top: 20%")
          .text-center
            empty-image(url="cart_empty.png", className="img-empty")
          .text-center.empty-content 购物车空空如也
          .text-center.margin-top-sm
            .cart-empty-btn(@click="tab('/pages/mall/main')") ^_^去商城逛逛吧
      .s-content-wrap(v-else)
        .s-content(ref="testRef")
          scroll-view.scroll-view(scroll-y, :style="{height: scrollHeight}")
            .cart-items(v-for="(cart, cartIdx) in carts", :key="cartIdx")
              .cart-item.padding-sm
                .flex.flex-center.align-center.ft-15.text-bold
                  .col.flex-25(@click="cart.choosed = !cart.choosed", v-if="pageType !== 'share'", style="padding-top: 5px;")
                    img.choose-icon(src="/static/images/blue_check.png", v-if="cart.choosed")
                    img.choose-icon(src="/static/images/btn_ck_n.png", v-else)
                  .col(@click="cart.choosed = !cart.choosed")
                    span {{cart.name}}
                    span.padding-left-xs {{cart.standard}}
                  div(:class="pageType === 'share' ? 'text-blue' : 'text-black'") ￥{{cart.price}}
                .content.ft-13
                  .text-gray
                    .row.justify-between
                      .col
                        span {{cart.material}}
                        span.ml-5 {{cart.length}}米
                        span.ml-5 {{cart.warehouse}}
                        span.sub-mark.ml-5 {{cart.supply}}
                      span （{{cart.meteringWay}}）
                    .pt-5.row.justify-between
                      .col
                        template(v-if="pageType !== 'share'")
                          span {{cart.amount_left}}支 / {{cart.weight_left}}吨
                          span.padding-left-xs 吊费:
                        template(v-else)
                          span 吊费:
                        span.ml-10 {{cart.price === '--' ? '--' : cart.lift > 0 ? '￥' + cart.lift + '/吨' : cart.lift == 0 ? '无' : '线下结算'}}
                      //- span （{{cart.meteringWay}}）
                    .pt-5(v-if="cart.tolerance_range || cart.weight_range")
                      span(v-if="cart.tolerance_range") 公差范围:
                      span.ml-10.mr-10(v-if="cart.tolerance_range") {{cart.tolerance_range}}
                      span.ml-10(v-if="cart.weight_range") 重量范围:
                      span.ml-10(v-if="cart.weight_range") {{cart.weight_range}}
                    .pt-5(v-if="pageType==='share'")
                      span 数量：
                      span.ml-10 {{cart.amount}}支
                      span.padding-left-xs 重量：
                      span.ml-10 {{cart.weight}}
                      span 吨
                  .row.justify-between.pt-5(v-if="pageType !== 'share'")
                    .text-black.ft-16 当前报价：
                      span.text-blue ￥{{cart.dx_prices}}
                    .col.flex.align-end.justify-end
                      count-step(v-model="cart.count", @click.native="rowCartCount(cart)", @blur="rowCartCount(cart)", :max="cart.amount_left")
                      .padding-left-xs {{cart.countWeight}}吨

    .s-footer(v-if="carts.length > 0", :style="{height: isIpx ? '168rpx' : '100rpx'}")
      .cart-footer.justify-between
        .col.cart-footer-col
          .row.justify-between
            .row.flex-center(@click="choosedAll", v-if="pageType !== 'share'", style="padding-left: 10px;")
              .flex.flex-center
                img.choose-icon(src="/static/images/blue_check.png", v-if="allChoosed")
                img.choose-icon(src="/static/images/btn_ck_n.png", v-else)
              .padding-xs 全选
            .text-right.flex.justify-end.col
              span 合计：
              b.text-red ￥{{totalPrice}}
          .text-right.ft-12(style="color:#999;") 共{{totalCount}}支 ，{{totalWeight}}吨
            span ，吊费: {{totalLiftCharge}}元
        .cart-settle-btn.ft-18(:class="status === '已完成' || status === '已失效' ? 'bg-gray' : 'bg-red'", v-if="pageType === 'share'", @click="auditDxCheck") 生成合同
        button.cart-settle-btn.bg-red.ft-18(@click="shareClick" v-else) 分享
    modal(:title="modalTitle", :btns="btns", :value="modalShow", @cb="modalHandler", :width="modalWidth")
      div
        .text-gray 2小时未生成合同，物资自动释放
        .padding-top-sm.row.justify-center
          .margin-right-sm.margin-left-sm(v-for="(r, rIdx) in radios", :key="rIdx")
              z-radio(@checkHander="lockCheck(r)", :label="r.label", :checked="lockGoods === r.val")
    modal(v-model="modalDefaultShow", :btns="modalBtns === 'mall' ? mallBtns : btns", @cb="modalDefaultHandler")
      template(v-if="errList.length > 0")
        .padding-sm.text-left(v-for="(item, errIdx) in errList", :key="errIdx") {{item}}
      template(v-else)
        .padding-sm {{modalDefaultMsg}}
    modal(v-model="noticeClientModalShow", @cb="noticeClientModalCb" :showWarningIcon = "showWarningIcon", :title="noticeClientModalTitle")
      .padding-lr-22(style="text-align: left;")
        div 1、合同提交后请
          sapn(style="color: red;font-size: 16px") 2小时
            sapn(style="color: #000;font-size: 14px") 内完成付款，超时合同将会自动取消！
        div 2、付款成功后请
          sapn(style="color: red;font-size: 16px") 5天内
            sapn(style="color: #000;font-size: 14px") 完成提货，超期未提需缴纳相应的仓储费用
    modal-bottom(:btns="previewBtns", :value="previewShow", @cb="modalHandler")
      .bg-gray
        scroll-view.scroll-view(scroll-y, :style="{'max-height': '800rpx', 'min-height': '400rpx'}")
          .cart-items.text-left(v-for="(cart, cartIdx) in checkGoods", :key="cartIdx", style="margin-bottom: 20rpx; padding-top: 0rpx;")
            .cart-item.padding-sm
              .flex.flex-center.align-center.ft-15.text-bold
                .col
                  span {{cart.name}}
                  span.padding-left-xs {{cart.standard}}
                .text-blue ￥{{cart.dx_prices}}
              .content.ft-13
                .text-gray
                  div
                    span {{cart.material}}
                    span.ml-5 {{cart.length}}米
                    span.ml-5 {{cart.warehouse}}
                    span.sub-mark.ml-5 {{cart.supply}}
                  .pt-5.row.justify-between
                    .col
                      span 吊费:
                      span.ml-10 {{cart.price === '--' ? '--' : cart.lift > 0 ? '￥' + cart.lift + '/吨' : cart.lift == 0 ? '无' : '线下结算'}}
                    span （{{cart.meteringWay}}）
                  .pt-5(v-if="cart.tolerance_range || cart.weight_range")
                    span(v-if="cart.tolerance_range") 公差范围:
                    span.ml-10.mr-10(v-if="cart.tolerance_range") {{cart.tolerance_range}}
                    span.ml-10(v-if="cart.weight_range") 重量范围:
                    span.ml-10(v-if="cart.weight_range") {{cart.weight_range}}
                  .pt-5
                    span 数量：
                    span.ml-10 {{cart.count}}支
                    span.padding-left-xs 重量：
                    span.ml-10 {{cart.countWeight}}
                    span 吨
</template>

<script>
import CountStep from '@/components/CountStep.vue'
import { mapState, mapActions } from 'vuex'
import timeLine from '@/components/TimeLine.vue'
import modal from '@/components/Modal.vue'
import modalBottom from '@/components/ModalBottom.vue'

export default {
  data () {
    return {
      errList: [],
      modalDefaultShow: false,
      modalDefaultMsg: '',
      previewShow: false,
      modalWidth: '70%',
      modalTitle: '是否进行锁货',
      radios: [
        { label: '锁货', val: 1 },
        { label: '不锁', val: 0 }
      ],
      lockGoods: 0,
      modalShow: false,
      totalPrice: 0,
      totalWeight: 0,
      totalLiftCharge: 0,
      totalCount: 0,
      allChoosed: true,
      carts: [],
      btnDisable: false,
      isLoad: false,
      scrollHeight: 0,
      custmName: '',
      timeInterval: '',
      serverTime: '',
      endTime: '',
      timeDown: '',
      pageType: '',
      qutId: '',
      btns: [
        { label: '取消', flag: 'cancel', className: 'bg-gray' },
        { label: '确定', flag: 'confirm', className: 'main-btn' }
      ],
      mallBtns: [
        { label: '去商城', flag: 'mall', className: 'main-btn' }
      ],
      previewBtns: [
        { label: '取消', flag: 'cancel', className: 'bg-gray' },
        { label: '分享', flag: 'share', className: 'main-btn', type: 'share' }
      ],
      modalBtns: '',
      checkGoods: [],
      status: '',
      isAudit: false,
      enforce: 0,
      custName: '',
      noticeClientModalShow: false,
      showWarningIcon: true,
      noticeClientModalTitle: '是否继续提交？'
    }
  },
  components: {
    CountStep,
    timeLine,
    modal,
    modalBottom
  },
  computed: {
    ...mapState({
      isIpx: state => state.isIpx,
      tempObject: state => state.tempObject,
      bottomBarHeight: state => state.bottomBarHeight
    })
  },
  watch: {
    carts: {
      handler (newVal, oldVal) {
        if (this.pageType === 'share') return false
        let filterArray = newVal.filter(item => {
          item.countWeight = Number(this.$toFixed(Number(item.count * item.weight), 3))
          return item.choosed === true
        })
        // this.totalCount = filterArray.length
        this.allChoosed = filterArray.length === newVal.length
        // this.totalPrice = 0
        let totalPrice = 0
        this.totalWeight = 0
        this.totalLiftCharge = 0
        let totalCount = 0
        if (filterArray.length > 0) {
          filterArray.map(itm => {
            totalCount += itm.count
            if (this.tempObject.need_lift === 1 && Number(itm.lift_charge) > 0) {
              const countLiftWeight = itm.countWeight * Number(itm.lift_charge)
              // totalPrice += dxPrice * itm.countWeight + countLiftWeight
              this.totalLiftCharge += countLiftWeight
            }
            totalPrice += Number(this.$toFixed(Number(itm.dx_prices) * Number(itm.countWeight), 2))
            this.totalWeight += itm.countWeight
          })
          this.totalLiftCharge = this.$toFixed(Number(this.totalLiftCharge), 2)
          this.totalPrice = this.$toFixed(Number(totalPrice) + Number(this.totalLiftCharge), 2)
          this.totalWeight = this.$toFixed(Number(this.totalWeight), 3)
        }
        this.totalCount = totalCount
      },
      deep: true
    }
  },
  onShareAppMessage (res) {
    console.log('qutId', this.qutId)
    this.modalShow = false
    this.previewShow = false
    return {
      title: `您收到一份报价清单，共${this.totalCount}支, ${this.totalWeight}吨，点击查看详情`,
      path: '/pages/vendor/quotation/main?pageType=share&&qutId=' + this.qutId
    }
  },
  onHide () {
    this.enforce = 0
    this.carts = []
    this.status = ''
    this.pageType = ''
    this.btnDisable = false
    this.modalDefaultMsg = ''
    this.modalDefaultShow = false
    this.errList = []
    this.noticeClientModalShow = false
  },
  onShow () {
    if (this.$root.$mp.query.qutId) {
      this.pageType = 'share'
      this.qutId = this.$root.$mp.query.qutId
      this.quotationDetail()
    } else {
      this.loadData()
    }
    console.log('tempObject', this.tempObject)
    const ipxHeight = this.isIpx ? 238 : 170
    this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - ipxHeight - 80 + 'rpx'
  },
  onUnload () {
    this.enforce = 0
    this.pageType = ''
    this.qutId = ''
    this.btnDisable = false
    this.modalDefaultMsg = ''
    this.modalDefaultShow = false
    this.modalBtns = ''
    this.errList = []
    clearInterval(this.timeInterval)
  },
  mounted () {
    this.$nextTick(() => {
      const me = this
      if (this.status !== '已完成' && this.status !== '已失效') {
        this.timeInterval = setInterval(() => {
          me.countTime()
          me.serverTime += 1000
          console.log(me.timeDown)
        }, 1000)
      }
    })
  },
  methods: {
    ...mapActions([
      'configVal'
    ]),
    jumpMall () {
      if (this.btnDisable) return false
      this.tab('/pages/mall/main')
      this.btnDisable = false
    },
    shareClick () {
      if (this.btnDisable) return false
      this.btnDisable = true
      if (this.qutId) {
        this.showMsg('当前报价单已生成')
        this.btnDisable = false
        return false
      }
      this.logEvent({ event: 'click_app_quotation_share', type: '01' })
      const filterArray = this.carts.filter(item => {
        return item.choosed === true
      })
      if (filterArray.length === 0) {
        this.showMsg('请选择分享物资')
        this.btnDisable = false
        return false
      }
      this.btnDisable = false
      this.checkGoods = filterArray
      this.modalTitle = '是否进行锁货'
      this.modalWidth = '70%'
      this.previewShow = false
      this.modalShow = true
    },
    modalDefaultHandler (flag) {
      if (flag === 'mall') {
        this.tab('/pages/mall/main')
        return false
      }
      this.errList = []
      if (flag === 'cancel') {
        this.enforce = 0
        this.modalDefaultShow = false
      } else {
        if (this.modalDefaultMsg === '您当前登录账号和报价单位抬头不一致，请重新登录') {
          this.jump('/pages/account/login/main?back=1')
          this.hideLoading()
          this.modalDefaultShow = false
          return false
        }
        this.goToSettle()
      }
    },
    modalHandler (flag) {
      console.log(this.$refs.testShare)
      if (flag === 'cancel') {
        this.previewShow = false
        this.modalShow = false
      } else if (flag !== 'share') {
        let orderIds = []
        let dxPrices = []
        let costPrices = []
        let jlTypes = []
        let amounts = []
        let weights = []
        let orderPrices = []
        // let totalPrice = 0
        // let totalWeight = 0
        // let totalLiftCharge = 0
        this.checkGoods.map(itm => {
          orderIds.push(itm.order_id)
          dxPrices.push(itm.dx_prices)
          costPrices.push(itm.cost_prices)
          jlTypes.push(itm.measure_way_id)
          amounts.push(itm.count)
          weights.push(itm.countWeight)
          orderPrices.push(itm.price)
          // totalPrice += Number(itm.dx_prices) * Number(itm.countWeight)
          // totalWeight += Number(itm.countWeight)
          // if (Number(itm.lift_charge) > 0 && this.tempObject.need_lift === 1) {
          //   totalLiftCharge += Number(itm.countWeight) * Number(itm.lift_charge)
          // }
        })
        const params = {
          user_id: this.tempObject.user_id,
          buyer_name: this.tempObject.buyer_name,
          need_lift: this.tempObject.need_lift,
          order_ids: orderIds.toString(),
          amount_s: amounts.toString(),
          weight_s: weights.toString(),
          order_prices: orderPrices.toString(),
          dx_prices: dxPrices.toString(),
          cost_prices: costPrices.toString(),
          jl_types: jlTypes.toString(),
          total_money: this.totalPrice,
          total_amount: this.totalCount,
          total_weight: this.totalWeight,
          lift_money: this.totalLiftCharge,
          lock_goods: this.lockGoods
        }
        this.ironRequest(this.apiList.xy.quotation.url, params, this.apiList.xy.quotation.method).then(res => {
          if (res.returncode === '0') {
            this.modalTitle = '报价预览'
            this.modalWidth = '98%'
            this.qutId = res.qut_id
            this.modalShow = false
            this.previewShow = true
          }
          this.showMsg(res.errormsg)
        })
      }
    },
    lockCheck (r) {
      this.lockGoods = r.val
    },
    countTime () {
      const nowTime = this.serverTime
      const endTimeFormat = this.endTime.replace(/-/g, '/')
      const endTime = new Date(endTimeFormat).getTime()
      const leftTime = endTime - nowTime
      let h = 0
      let m = 0
      let s = 0
      if (leftTime >= 0) {
        h = Math.floor(leftTime / 1000 / 60 / 60 % 24)
        m = Math.floor(leftTime / 1000 / 60 % 60)
        s = Math.floor(leftTime / 1000 % 60)
        h = h < 10 ? '0' + h : h
        m = m < 10 ? '0' + m : m
        s = s < 10 ? '0' + s : s
        this.timeDown = `${h}:${m}:${s}`
      }
      this.$forceUpdate()
    },
    choosedAll () {
      this.allChoosed = !this.allChoosed
      if (this.allChoosed) {
        this.carts.map(itm => {
          itm.choosed = true
        })
      } else {
        this.carts.map(itm => {
          itm.choosed = false
        })
      }
    },
    rowCartCount (obj) {
      console.log(obj.count)
      this.ironRequest('cartUpdate.shtml', { cart_id: obj.cart_id, user_id: this.currentUser.user_id, measure_way: obj.measure_way_id, count: obj.count }, 'post').then(res => {
      })
    },
    loadData () {
      this.status = ''
      const arr = this.tempObject.list
      this.custName = this.tempObject.buyer_name
      arr.map(itm => {
        itm.choosed = true
        const checkedRadio = itm.radios.filter(item => {
          return item.m_way === itm.measure_way_id
        })
        itm.name = itm.product_name
        itm.standard = itm.product_standard
        itm.price = checkedRadio[0].originPrice
        itm.material = itm.product_material
        itm.length = itm.product_length
        itm.warehouse = itm.wh_name
        itm.amount = itm.amount_left
        itm.supply = itm.product_supply
        // itm.weight = itm.weight_left
        itm.lift = this.tempObject.need_lift === 1 ? 25 : 0
        itm.meteringWay = checkedRadio[0].label
      })
      this.carts = arr
      this.isLoad = true
    },
    async quotationDetail () {
      try {
        this.isLoad = false
        const quotationDetail = this.apiList.xy.quotationDetail
        const url = `${this.apiList.xy.quotationDetail.url}?qut_id=${this.qutId}`
        const data = await this.ironRequest(url, '', quotationDetail.method)
        console.log('quotationDetail', data)
        this.serverTime = data.server_time
        this.endTime = data.end_time
        this.status = data.status
        this.custName = data.cust_name
        if (data.returncode === '0') {
          const resData = data.list
          resData.map(item => {
            item.price = item.dx_price
            item.lift = 25
            item.meteringWay = item.metering_way
          })
          this.isLoad = true
          this.carts = resData
          this.totalPrice = data.money
          this.totalWeight = data.weight
          this.totalLiftCharge = data.lift
          this.totalCount = data.amount
          this.needLift = data.need_lift
        }
      } catch (e) {
        console.log(e)
      }
    },
    async auditDxCheck () {
      try {
        if (this.status === '已完成' || this.status === '已失效') return false
        if (this.btnDisable) return false
        this.btnDisable = true
        if (!this.isLogin) {
          const me = this
          this.confirm({ title: '友情提示', content: '您未登录,请先登录' }).then(res => {
            if (res === 'confirm') {
              me.jump('/pages/account/login/main')
            } else {
              me.tab('/pages/index/main')
            }
          })
          return false
        }
        let orderIds = []
        let dxPrices = []
        let costPrices = []
        let jlTypes = []
        this.carts.map(itm => {
          orderIds.push(itm.order_id)
          dxPrices.push(itm.dx_price)
          costPrices.push(itm.cost_price)
          jlTypes.push(itm.metering_way_id)
        })
        const params = {
          user_id: this.currentUser.user_id,
          order_ids: orderIds.toString(),
          dx_prices: dxPrices.toString(),
          cost_prices: costPrices.toString(),
          jl_types: jlTypes.toString(),
          need_lift: this.needLift,
          data_source: 0
        }
        const data = await this.ironRequest(this.apiList.xy.auditDxCheck.url, params, this.apiList.xy.auditDxCheck.method)
        this.isAudit = data.errormsg !== '是否生成合同？ '
        this.modalDefaultShow = false
        // this.modalDefaultMsg = data.errormsg
        // this.modalDefaultShow = true
        this.noticeClientModalShow = true
        this.btnDisable = false
      } catch (error) {
        this.btnDisable = false
        this.showMsg(error)
      }
    },
    goToSettle () {
      try {
        if (this.btnDisable) return false
        this.btnDisable = true
        if (this.currentUser.type === 'seller') {
          this.showMsg('卖家账号不能生成合同')
          this.btnDisable = false
          return false
        }
        this.modalDefaultShow = false
        const me = this
        // this.confirm({ content: '是否确认提交' }).then((res) => {
        //   if (res === 'confirm') {
        const params = {
          user_id: this.currentUser.user_id,
          qut_id: this.qutId,
          enforce: this.enforce
        }
        this.showLoading()
        me.ironRequest(this.apiList.xy.quotationDx.url, params, this.apiList.xy.quotationDx.method).then(resp => {
          this.hideLoading()
          if (this.isAudit) {
            me.tab(`/pages/mall/main`)
          } else {
            me.jump(`/pages/pay/main?orderNo=${resp.order_no}&price=${resp.deal_price}&pageType=offlinePay`)
          }
        }).catch(err => {
          me.btnDisable = false
          me.hideLoading()
          me.modalDefaultShow = true
          const errList = err.split('|')
          if (errList.length > 0) {
            this.errList = errList.filter((item) => {
              return item !== ''
            })
          }
          me.modalDefaultMsg = err
          if (err === '该报价单中所有物资的可卖数量都不足！') {
            this.modalBtns = 'mall'
          } else {
            this.modalBtns = ''
            me.enforce = 1
          }
          // me.$forceUpdate()
        })
        //   } else {
        //     this.btnDisable = false
        //   }
        // })
      } catch (err) {
        this.showMsg(err || '网络异常')
        // this.modalDefaultShow = true
        // this.modalDefaultMsg = e
        this.enforce = 1
      }
    },
    noticeClientModalCb (flag) {
      if (flag === 'confirm') {
        this.modalDefaultHandler('confirm')
        this.noticeClientModalShow = false
      } else {
        this.noticeClientModalShow = false
      }
    }
  }
}
</script>

<style lang="stylus", scoped>
.cart-empty-btn
  background #0081ff
  padding 14px 100px
  color #fff
  display inline-block
  font-weight bold
  font-size 16px
  border-radius 25px
  letter-spacing 1px
.cart-items
  padding-top 10px
  .cart-item
    background #fff
    // margin-top 10px
    .sub-mark
      display inline-block
      padding 1px 5px
      background #3da7ff
      color #fff
      font-size 12px
      border-radius 4px
      box-shadow 1px 2px 5px rgba(61, 167, 255, 0.3)
      letter-spacing 1px
    .count-step
      height 30px
      width 120px
      .min
        color #888
    .discount-line
      position absolute
      height 1px
      right -2px
      left -2px
      border-bottom 0.5px solid $mainGray
      top 8px
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
    letter-spacing 2px
    align-items center
    color #fff
    justify-content center
    &.bg-red
      background #F95353
    &.bg-gray
      background #aaa
.count-step .num input
  color #333 !important
.choose-icon
  width 20px
  height 20px
.s-content-wrap
  // position fixed
  // left 0
  // right 0
  // .scroll-view
  // overflow auto
.s-footer
  position fixed
  bottom 0
  left 0
  right 0
  background #fff
  z-index 9
radio.radio[checked]::after
  content ''
  background-color #fff
  display block
  position absolute
  width 0px
  height 0px
  z-index 3
  top 0
  left 0
  right 0
  bottom 0
  margin auto
  border-radius 100%
  border 6px solid #fff !important
.address-dialog
  position fixed
  left 0
  right 0
  z-index 99
  background rgba(0, 0, 0, 0.5)
  bottom 0
button
  border-radius 0px
.go-mall
  width 90px
  height 25px
  line-height 25px
  text-align center
  border-radius 20px
.padding-lr-22
  padding 0 22px
</style>
