<template lang="pug">
  .s-layout(@click="clearPicker")
    template(v-if="!isLoad")
      time-line(type="mallist")
    template(v-else)
      .s-empty-content(v-if="(carts.length + soldCarts.length) == 0")
        div(style="padding-top: 20%")
          .text-center
            empty-image(url="cart_empty.png", className="img-empty")
          .text-center.empty-content 购物车空空如也
          .text-center.margin-top-sm
            .cart-empty-btn(@click="tab('/pages/mall/main')") ^_^去商城逛逛吧
      .s-content-wrap(v-else)
        .s-content
          .solid-bottom.flex.padding-sm.bg-white.align-center.justify-between(style="height: 100rpx")
            .quotation.text-blue.line-blue.solid(@click="auditDxCheck(2)") 生成报价单
            .text-center
              .padding-xs(v-show="isEdit", @click="openEdit") 完成
              .flex(v-show="!isEdit")
                .padding-xs.mr-5(@click="openEdit") 编辑
                .padding-xs(@click="clearCarts") 清空
          .row.text-gray.text-center.bg-white(style="height: 100rpx")
            .row.col.tab-select(@click.stop="openPickWay(1)", :class="{'text-blue': pickWayShow && tabActive === 1}")
              .col.text-cut {{customerName || '客户选择'}}
              i(:class="pickWayShow && tabActive === 1 ? 'cuIcon-fold' : 'cuIcon-unfold'")
            .row.col.tab-select(@click.stop="openPickWay(2)", :class="{'text-blue': pickWayShow && tabActive === 2}")
              .col.text-cut {{liftSelect}}
              i(:class="pickWayShow && tabActive === 2 ? 'cuIcon-fold' : 'cuIcon-unfold'")
          scroll-view.scroll-view(scroll-y, :style="{height: scrollHeight}")
            .cart-items(v-for="(cart, cartIdx) in carts", :key="cartIdx")
              .cart-item
                .padding-sm
                  .flex.flex-center.align-center.ft-15.text-bold
                    .col.flex-25(@click="cart.choosed = !cart.choosed", style="padding-top: 5px;")
                      img.choose-icon(src="/static/images/blue_check.png", v-if="cart.choosed")
                      img.choose-icon(src="/static/images/btn_ck_n.png", v-else)
                    .col(@click="cart.choosed = !cart.choosed")
                      span {{cart.product_name}}
                      span.padding-left-xs {{cart.product_standard}}
                    .text-blue ￥{{cart.price}}
                  .content.ft-13
                    .flex.flex-center.justify-between
                      div
                        div
                          span {{cart.product_material}}
                          span.ml-5 {{cart.product_length}}米
                          span.ml-5 {{cart.wh_name}}
                          span.sub-mark.ml-5 {{cart.product_supply}}
                        .pt-5
                          span {{cart.amount_left}}支 / {{cart.weight_left}}吨
                          span.padding-left-xs 吊费:
                          span.ml-10 {{cart.price === '--' ? '--' : cart.lift_charge > 0 ? '￥' + cart.lift_charge + '/吨' : cart.lift_charge == 0 ? '无' : '线下结算'}}
                        .pt-5(v-if="cart.tolerance_range || cart.weight_range")
                          span(v-if="cart.tolerance_range") 公差范围:
                          span.ml-10.mr-10(v-if="cart.tolerance_range") {{cart.tolerance_range}}
                          span.ml-5(v-if="cart.weight_range") 重量范围:
                          span.ml-10(v-if="cart.weight_range") {{cart.weight_range}} 
                      .text-right
                        .text-gray (可让{{cart.allowedPrice}}元)
                        .flex.flex-direction.justify-between.pt-5
                          z-radio(@checkHander="weightChoose(r.m_way, cart)", v-for="(r, rIdx) in cart.radios", :key="rIdx", :label="r.label", :checked="cart.measure_way_id === r.m_way")
                .margin-top-xs.padding-sm.solid-top.solid-bottom.padding-top-sm.padding-bottom-sm.row.text-gray
                  .text-black 定向价格：
                  .col.ml-5.padding-xs.solid.line-gray
                    input(type="number", v-model="cart.dx_prices")
                  .padding-left-xs 元
                  .padding-left-xs.text-black 费用：
                  .col.ml-5.padding-xs.solid.line-gray
                    input(type="number", v-model="cart.cost_prices")
                  .padding-left-xs 元
                .row.padding-sm.justify-end.align-end
                  .col(style="flex: 0 0 60px;")
                    count-step(v-model="cart.count", @click.native="rowCartCount(cart)", @blur="rowCartCount(cart)", :max="cart.amount_left")
                  .padding-left-xs {{cart.countWeight}}吨
    .s-footer(v-if="carts.length > 0", style="height: 100rpx")
      .cart-footer.justify-between
        .col.cart-footer-col
          .row.justify-between
            .row.flex-center(@click="choosedAll", style="padding-left: 10px;")
              .flex.flex-center
                img.choose-icon(src="/static/images/blue_check.png", v-if="allChoosed")
                img.choose-icon(src="/static/images/btn_ck_n.png", v-else)
              .padding-xs 全选
            .text-right.flex.justify-end(v-show="!isEdit")
              span 合计：
              b.text-red ￥{{totalPrice}}
          .text-right.ft-12(style="color:#999;", v-show="!isEdit") 共{{totalCount}}件 ，{{totalWeight}}吨，吊费: {{totalLiftCharge}}元
        .cart-settle-btn.ft-18(@click="auditDxCheck(1)")
          span {{isEdit ? '删除' : '定向'}}
    .tab-select-dialog.solid-top(:style="{top: selectDialogTop + 'rpx'}", v-show="pickWayShow")
      .bg-white(@click.stop="")
        template(v-if="tabActive === 1")
          .padding
            .select-search.bg-gray.round.row.padding-sm
              .cuIcon-search.padding-left-sm
              input.col.margin-left-xs(type="text", v-model="customSearchVal")
              .close-icon(@click="customSearchVal = ''", v-if="customSearchVal")
                .cuIcon-roundclosefill.ft-18
          template(v-if="customList.length > 0")    
            iron-scroll(:height="400", heightUnit="rpx", @scrolltolower="customloadMore", :loadFinish="customLoadFinish")    
              .bg-white.solid-top.row.padding.justify-between(@click="tabSelect('custom', item)", :class="{'text-blue': customerName === item.name}", v-for="(item, customPickIdx) in customList", :key="customPickIdx")
                .col {{item.name}}
                .cuIcon-check(v-if="customerName === item.name")
          template(v-else)         
            .text-center 暂无数据
          .solid-top.text-right.padding.text-gray 共{{customTotal}}条数据
        template(v-else)
          .solid-top.row.padding.justify-between(@click="tabSelect('lift', item)", :class="{'text-blue': liftSelectVal === item.val}", v-for="(item, liftIdx) in liftList", :key="liftIdx")
            span {{item.label}}  
            .cuIcon-check(v-show="liftSelectVal === item.val")
    modal(v-model="modalShow", @cb="modalCb")
      .padding-sm {{modalMsg}}
</template>

<script>
import CountStep from '@/components/CountStep.vue'
import { mapState, mapActions } from 'vuex'
import timeLine from '@/components/TimeLine.vue'
import modal from '@/components/Modal.vue'
export default {
  data () {
    return {
      customerName: '',
      modalShow: false,
      modalMsg: '',
      liftSelect: '收吊费',
      customSearchVal: '',
      liftSelectVal: 1,
      tabActive: 0,
      totalPrice: 0,
      totalWeight: 0,
      totalLiftCharge: 0,
      totalCount: 0,
      pickway: 0,
      pwPhone: '',
      pwAddr: '',
      pwAddrDetail: '',
      allChoosed: false,
      carts: [],
      soldCarts: [],
      btnDisable: false,
      isLoad: false,
      isEdit: false,
      pickWayShow: false,
      liftList: [{
        label: '收吊费',
        val: 1
      }, {
        label: '免吊费',
        val: 2
      }, {
        label: '开平免吊费',
        val: 3
      }],
      pickWayList: [],
      scrollHeight: 0,
      cstmCurrentPage: 1,
      selectDialogTop: 0,
      customList: [],
      customTotal: 0,
      customLoadFinish: 0,
      disabled: false,
      dxFilterArray: []
    }
  },
  components: {
    CountStep,
    timeLine,
    modal
  },
  computed: {
    ...mapState({
      custom: state => state.custom,
      tempObject: state => state.tempObject,
      bottomBarHeight: state => state.bottomBarHeight
    })
  },
  watch: {
    carts: {
      handler (newVal, oldVal) {
        this.cartCalculation(newVal)
      },
      deep: true
    },
    customSearchVal (newVal) {
      const me = this
      this.throttle(function () {
        me.cstmCurrentPage = 0
        me.loadCstmList()
      }, 300)
    }
  },
  onHide () {
    this.carts = []
    this.pickWayShow = false
  },
  onShow () {
    // this.loadCstmList()
    if (this.tempObject.type) {
      this.pickway = this.tempObject.type
      if (this.pickway === 1) {
        this.pwPhone = this.tempObject.phone
        this.pwAddr = this.tempObject.addr
        this.pwAddrDetail = this.tempObject.detail
      }
    }
    this.selectDialogTop = this.getRpx(this.customBar) + 200
    this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - this.getRpx(this.bottomBarHeight) - 300 + 'rpx'
    if (this.carts.length === 0) this.loadCartData()
  },
  onReady () {
    if (this.isLogin) {
      this.loadCstmList()
      this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - this.getRpx(this.bottomBarHeight) - 300 + 'rpx'
      this.selectDialogTop = this.getRpx(this.customBar) + 200
      this.loadCartData()
    }
  },
  methods: {
    ...mapActions([
      'configVal'
    ]),
    clearPicker () {
      this.pickWayShow = false
      this.tabActive = 0
    },
    cartCalculation (newVal) {
      newVal = newVal || this.carts
      let filterArray = newVal.filter(item => {
        item.countWeight = this.$toFixed(Number(item.count * item.weight), 3)
        return item.choosed === true
      })
      this.totalCount = filterArray.length
      this.allChoosed = this.totalCount === newVal.length
      this.totalPrice = 0
      this.totalWeight = 0
      this.totalLiftCharge = 0
      if (filterArray.length > 0) {
        filterArray.map(itm => {
          if (itm.dx_prices.indexOf('--') < 0) {
            if (Number(itm.lift_charge) > 0 && this.liftSelectVal === 1) {
              // const countWeight = itm.count * itm.weight
              const countLiftWeight = Number(itm.countWeight) * itm.lift_charge
              this.totalPrice += itm.dx_prices * Number(itm.countWeight) + countLiftWeight
              this.totalLiftCharge += countLiftWeight
            } else {
              this.totalPrice += itm.dx_prices * Number(itm.count * itm.weight)
            }
            this.totalWeight += Number(itm.countWeight)
          }
        })
        this.totalLiftCharge = this.$toFixed(Number(this.totalLiftCharge), 2)
        this.totalPrice = this.$toFixed(Number(this.totalPrice), 2)
        this.totalWeight = this.$toFixed(Number(this.totalWeight), 3)
      }
    },
    customChange (e) {
      this.customSearchVal = e.mp.detail.value
      const me = this
      this.throttle(function () {
        me.cstmCurrentPage = 0
        me.loadCstmList()
      }, 300)
    },
    customloadMore () {
      const me = this
      this.throttle(function () {
        me.cstmCurrentPage++
        me.loadCstmList()
      }, 300)
    },
    async loadCstmList () {
      try {
        let queryUrl = '?pageSize=' + this.pageSize + '&currentPage=' + this.cstmCurrentPage
        if (this.customSearchVal) queryUrl += '&name=' + encodeURIComponent(this.customSearchVal)
        let data = await this.request(this.crmProxy + this.apiList.crm.cstmList.url + queryUrl, {}, this.apiList.crm.cstmList.method)
        this.customTotal = data.total
        let arr = data.list
        const me = this
        if (arr.length === 0 && me.cstmCurrentPage === 0) {
          me.customList = []
          me.isload = false
        } else if (arr.length > 0 && me.cstmCurrentPage === 0) {
          me.customList = arr
          me.isload = false
        } else if (arr.length > 0 && me.cstmCurrentPage > 0) {
          arr.map(item => {
            me.customList.push(item)
          })
        } else {
          if (me.customList.length >= 10) me.customLoadFinish = 2
          me.cstmCurrentPage--
        }
        if (this.customList.length < 10) this.customLoadFinish = 0
        this.$forceUpdate()
      } catch (e) {
        console.error(e)
      }
    },
    modalCb (flag) {
      if (flag === 'confirm' && this.dxFilterArray.length > 0) {
        this.dx()
      } else {
        this.modalShow = false
      }
    },
    openEdit () {
      this.pickWayShow = false
      this.isEdit = !this.isEdit
    },
    tabSelect (type, item) {
      if (type === 'lift') {
        this.liftSelect = item.label
        this.liftSelectVal = item.val
        // this.totalLiftCharge = item.val !== 1 ? 0
        this.cartCalculation()
        this.pickWayShow = false
      } else {
        this.customerName = item.name
        this.pickWayShow = false
      }
      this.tabActive = 0
    },
    openPickWay (type) {
      if (this.tabActive === type) {
        this.pickWayShow = !(this.tabActive === type)
        this.tabActive = 0
        return false
      }
      this.pickWayShow = true
      this.tabActive = type
    },
    refresher (done) {
      const me = this
      setTimeout(() => {
        me.carts = []
        me.allChoosed = false
        me.loadCartData(done)
      }, 300)
    },
    clearCarts () {
      const me = this
      this.confirm({ content: '确定清空购物车？' }).then((res) => {
        if (res === 'confirm') {
          me.btnDisable = true
          this.showLoading()
          me.ironRequest('cartEmpty.shtml', { user_id: me.currentUser.user_id, data_source: 1 }, 'post').then(resp => {
            if (resp && resp.returncode === '0') {
              me.showMsg('清空成功')
              me.btnDisable = false
              me.carts = []
              me.tabDot(0)
            } else {
              me.showMsg(resp === undefined ? '网络异常' : resp.errormsg)
              me.btnDisable = false
            }
          }).catch(err => {
            me.showMsg(err || '网络异常')
            me.btnDisable = false
          })
          this.hideLoading()
        }
      })
    },
    emptySoldItems () {
      const me = this
      if (!this.btnDisable) {
        this.confirm({ content: '您确定要清空失效物资吗？' }).then((res) => {
          if (res !== 'confirm') return false
          me.btnDisable = true
          me.ironRequest('cartEmpty.shtml', { user_id: me.currentUser.user_id, type: 1 }, 'post').then(resp => {
            if (resp && resp.returncode === '0') {
              me.showMsg('清空成功')
              me.btnDisable = false
              me.soldCarts = []
            }
          }).catch(err => {
            me.showMsg(err || '网络异常')
            me.btnDisable = false
          })
        })
      }
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
    async auditDxCheck (flag) {
      try {
        let filterArray = this.carts.filter(itm => itm.choosed === true)
        if (this.isEdit) {
          if (filterArray.length === 0) {
            this.showMsg('请选择所需删除的商品')
            return false
          }
          // 删除
          this.delCartRow(filterArray)
          return false
        }
        if (filterArray.length === 0) {
          this.showMsg('请选择需要操作的物资')
          return false
        }
        if (this.customerName === '') {
          this.showMsg('请选择客户')
          return false
        }
        let orderIds = []
        let dxPrices = []
        let costPrices = []
        let jlTypes = []
        filterArray.map(itm => {
          orderIds.push(itm.order_id)
          dxPrices.push(itm.dx_prices)
          costPrices.push(itm.cost_prices)
          jlTypes.push(itm.measure_way_id)
        })
        const params = {
          user_id: this.currentUser.user_id,
          buyer_name: this.customerName,
          order_ids: orderIds.toString(),
          dx_prices: dxPrices.toString(),
          cost_prices: costPrices.toString(),
          jl_types: jlTypes.toString(),
          need_lift: this.liftSelectVal
        }
        const data = await this.ironRequest(this.apiList.xy.auditDxCheck.url, params, this.apiList.xy.auditDxCheck.method)
        console.log(data)
        if (data.returncode === '0') {
          if (flag === 1) {
            // 定向
            this.modalMsg = data.errormsg
            this.modalShow = true
            this.dxFilterArray = filterArray
          } else {
            // 生成报价单
            this.generateQuotation(filterArray)
          }
        }
      } catch (e) {
        this.showMsg(e)
      }
    },
    weightChoose (val, rowItem) {
      rowItem.measure_way_id = val
      if (val === 2 || val === 3) {
        rowItem.weight = rowItem.radios[0].weight
        rowItem.price = rowItem.radios[0].price
        rowItem.originPrice = rowItem.radios[0].originPrice
        rowItem.dx_prices = rowItem.radios[0].originPrice
        rowItem.allowedPrice = rowItem.radios[0].allowedPrice
      } else {
        rowItem.weight = rowItem.radios[1].weight
        rowItem.price = rowItem.radios[1].price
        rowItem.originPrice = rowItem.radios[1].originPrice
        rowItem.dx_prices = rowItem.radios[1].originPrice
        rowItem.allowedPrice = rowItem.radios[1].allowedPrice
      }
      this.ironRequest('cartUpdate.shtml', { cart_id: rowItem.cart_id, user_id: this.currentUser.user_id, measure_way: val, count: rowItem.count, data_source: 1 }, 'post').then(res => {
      })
      this.$forceUpdate()
    },
    rowCartCount (obj) {
      console.log(obj.count)
      this.ironRequest('cartUpdate.shtml', { cart_id: obj.cart_id, user_id: this.currentUser.user_id, measure_way: obj.measure_way_id, count: obj.count, data_source: 1 }, 'post').then(res => {
      })
    },
    delCartRow (row) {
      if (!this.btnDisable) {
        const me = this
        const idsList = []
        row.map(item => {
          idsList.push(item.cart_id)
        })
        this.confirm({ content: '您确定要删除吗?' }).then((res) => {
          if (res === 'confirm') {
            me.btnDisable = true
            me.ironRequest('cartDel.shtml', { cart_ids: idsList.toString(), data_source: 1 }, 'post', me).then(res => {
              if (res.returncode === '0') {
                this.showMsg('删除成功')
                me.carts = me.carts.filter(item => {
                  return idsList.indexOf(item.cart_id) === -1
                })
                me.tabDot(me.carts.length)
                me.btnDisable = false
              }
            })
          }
        })
      }
    },
    loadCartData () {
      this.isLoad = false
      const me = this
      const url = `${this.apiList.xy.cartList.url}?user_id=${me.currentUser.user_id}&data_source=1`
      this.ironRequest(url, {}, this.apiList.xy.cartList.method).then(resp => {
        this.isLoad = true
        if (resp.returncode === '0') {
          let arr = resp.carts
          this.soldCarts = resp.sold_out_carts
          arr.map(itm => {
            itm.choosed = false
            let allWeight = itm.one_weight
            let wtArr = allWeight.split('/')
            // let prArr = itm.product_price.split('/')
            let oldPrArr = itm.origin_price.split('/')
            const newWeight = []
            wtArr.map(item => {
              newWeight.push(item.substring(0, item.indexOf('(')))
            })
            if (itm.trade_type === 1) {
              itm.radios = [{
                label: '理计',
                m_way: 2,
                weight: newWeight[0],
                price: oldPrArr[0],
                originPrice: oldPrArr[0],
                allowedPrice: itm.lj_allowed_price
              }, {
                label: '磅计',
                m_way: 1,
                weight: newWeight[1],
                price: oldPrArr[1],
                originPrice: oldPrArr[1],
                allowedPrice: itm.bj_allowed_price
              }]
            } else {
              itm.radios = [{
                label: '16理计',
                m_way: 3,
                weight: newWeight[0],
                price: oldPrArr[0],
                originPrice: oldPrArr[0],
                allowedPrice: itm.lj_allowed_price
              }, {
                label: '10理计',
                m_way: 4,
                weight: newWeight[0],
                price: oldPrArr[1],
                originPrice: oldPrArr[1],
                allowedPrice: itm.lj_allowed_price
              }]
            }
            itm.weight = newWeight[0]
            itm.price = oldPrArr[0]
            itm.originPrice = oldPrArr[0]
            itm.dx_prices = oldPrArr[0]
            itm.allowedPrice = itm.measure_way_id === 1 ? itm.bj_allowed_price : itm.lj_allowed_price
            if (itm.measure_way_id === 1 || itm.measure_way_id === 4) {
              itm.weight = itm.measure_way_id === 4 ? newWeight[0] : newWeight[1]
              itm.price = oldPrArr[1]
              itm.originPrice = oldPrArr[1]
              itm.dx_prices = oldPrArr[1]
            }
            itm.cost_prices = 0
            this.carts.push(itm)
          })
          this.tabDot(this.carts.length + this.soldCarts.length)
          // if (done) done()
        } else {
          this.showMsg(resp ? '网络异常' : resp.errormsg)
          this.carts = []
          this.soldCarts = []
          this.tabDot(0)
          // if (done) done()
        }
      }).catch(err => {
        this.isLoad = true
        me.showMsg(err || '网络异常')
        // if (done) done()
      })
    },
    // 卖家方法
    async dx () {
      try {
        if (this.disabled) return false
        this.disabled = true
        const filterArray = this.dxFilterArray
        let orderIds = []
        let dxPrices = []
        let costPrices = []
        let jlTypes = []
        let amounts = []
        let weights = []
        let orderPrices = []
        filterArray.map(itm => {
          orderIds.push(itm.order_id)
          dxPrices.push(itm.dx_prices)
          costPrices.push(itm.cost_prices)
          jlTypes.push(itm.measure_way_id)
          amounts.push(itm.count)
          weights.push(itm.countWeight)
          orderPrices.push(itm.price)
        })
        const params = {
          user_id: this.currentUser.user_id,
          buyer_name: this.customerName,
          order_ids: orderIds.toString(),
          dx_prices: dxPrices.toString(),
          cost_prices: costPrices.toString(),
          jl_types: jlTypes.toString(),
          need_lift: this.liftSelectVal,
          amount_s: amounts.toString(),
          weight_s: weights.toString(),
          order_prices: orderPrices.toString(),
          total_money: this.totalPrice,
          total_amount: this.totalCount,
          total_weight: this.totalWeight,
          lift_money: this.totalLiftCharge
        }
        const data = await this.ironRequest(
          this.apiList.xy.dx.url,
          params,
          this.apiList.xy.dx.method
        )
        this.showMsg(data.errormsg)
        this.disabled = false
        this.modalShow = false
        this.refresher()
        this.dxFilterArray = []
      } catch (err) {
        this.showMsg(err)
        this.modalShow = false
        this.disabled = false
        this.dxFilterArray = []
      }
    },
    generateQuotation () {
      const filterArray = this.carts.filter(itm => {
        return itm.choosed === true
      })
      const tempObject = {
        list: filterArray,
        buyer_name: this.customerName,
        need_lift: this.liftSelectVal,
        user_id: this.currentUser.user_id,
        totalPrice: this.totalPrice,
        totalCount: this.totalCount,
        totalWeight: this.totalWeight,
        totalLiftCharge: this.totalLiftCharge
      }
      this.configVal({ key: 'tempObject', val: tempObject })
      this.jump('/pages/vendor/quotation/main')
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
  .cart-item
    background #fff
    margin-top 10px
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
    background #F95353
    letter-spacing 2px
    align-items center
    color #fff
    justify-content center
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
.tab-select-dialog
  position fixed
  left 0
  right 0
  z-index 99
  background rgba(0, 0, 0, 0.5)
  bottom 0
.quotation
  padding 5px 10px
  border-radius 100px
.tab-select
  width 50%
  padding 20px 10px
  position relative
  &:after
    content ''
    position absolute
    top 50%
    margin-top -10px
    right 0
    display block
    width 1px
    height 20px
    background rgba(0, 0, 0, 0.1)
  &:last-child
    &:after
      display none
</style>
