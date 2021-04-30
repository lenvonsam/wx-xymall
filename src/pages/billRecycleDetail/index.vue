<template lang="pug">
div
  nav-bar(title="合同恢复", isBack)
  .s-layout(@click="clearPicker")
    template(v-if="!isLoad")
      time-line(type="mallist")
    template(v-else)
      .s-empty-content(v-if="carts.length == 0",:style="{height: height+'rpx'}")
        div(style="padding-top: 20%")
          .text-center
            empty-image(url="cart_empty.png", className="img-empty")
          .text-center.empty-content 您暂时没有相关合同
      .s-content-wrap(v-else)
        .s-content
          .flex.padding-sm.bg-white.align-center.justify-end(style="height: 100rpx")
            .text-center
              .padding-xs(v-show="isEdit", @click="openEdit") 完成
              .flex(v-show="!isEdit")
                .padding-xs.mr-5(@click="openEdit") 编辑
          scroll-view.scroll-view(scroll-y, :style="{height: scrollHeight}")
            //- cart-item(v-for="(cart, idx) in carts", :key="idx", :cart="cart")
            .cart-items(v-for="(cart, cartIdx) in carts", :key="cartIdx")
              .cart-item.padding-sm
                .flex.flex-center.align-center.ft-15.text-bold
                  .col.flex-25(@click="cart.choosed = !cart.choosed", style="padding-top: 5px;")
                    img.choose-icon(src="/static/images/blue_check.png", v-if="cart.choosed")
                    img.choose-icon(src="/static/images/btn_ck_n.png", v-else)
                  .col(@click="cart.choosed = !cart.choosed")
                    span {{cart.onlineProductBrandName}}
                    span.padding-left-xs {{cart.specification}}
                  //- .text-blue ￥{{cart.price}}/吨
                  //-   span {{cart.onlineProductBrandName}}
                  //-   span.padding-left-xs {{cart.specification}}
                  .text-blue ￥{{cart.price}}/吨
                .content.ft-13
                  .flex.flex-center.justify-between
                    div
                      div
                        span {{cart.productTextureName}}
                        span.ml-5 {{cart.length}}米
                        span.ml-5 {{cart.stockZoneName}}
                        span.sub-mark.ml-5 {{cart.prodAreaName}}
                      .pt-5
                        span {{cart.amount}}支 / {{cart.quantityType == '02' ? cart.ratioAvailablePoundWeight : cart.ratioAvailableManagerWeight}}吨
                        span.padding-left-xs 吊费:
                        span.ml-10 {{cart.price === '--' ? '--' : cart.liftingFee > 0 ? '￥' + cart.liftingFee + '/吨' : cart.liftingFee == 0 ? '无' : '线下结算'}}
                      .pt-5(v-if="cart.toleranceRange || cart.weightRange")
                        span(v-if="cart.toleranceRange") 公差范围:
                        span.ml-10.mr-10(v-if="cart.toleranceRange") {{cart.toleranceRange}}
                      .pt-5
                        span(v-if="cart.weightRange") 重量范围:
                        span.ml-10(v-if="cart.weightRange") {{cart.weightRange}}
                    .text-right
                      .flex.flex-direction.justify-between
                        z-radio(@checkHander="weightChoose(r.m_way, cart)", v-for="(r, rIdx) in cart.radios", :key="rIdx", :label="r.label", :checked="cart.measure_way_id === r.m_way")

                  .row.padding-xs.justify-end.align-end
                    .col
                    .col(style="flex: 0 0 60px;")
                      count-step(v-model="cart.amount", @change="rowCartCount(cart)", :max="cart.ratioAvailableAmount")
                    .padding-left-xs {{cart.quantityType == '02' ? cart.ratioAvailablePoundWeight : cart.ratioAvailableManagerWeight}}吨
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
        .text-right.ft-12(style="color:#999;", v-show="!isEdit") 共{{totalCount}}支 ，{{totalWeight}}吨，吊费: {{totalLiftCharge}}元
      .cart-settle-btn.ft-18(@click="goToSettle")
        span {{isEdit ? '删除' : '生成合同'}}
  alert(:msg="alertText", :cb="alertCb", v-model="alertShow", force)
  modal(v-model="modalShow", @cb="modalCb", :showWarningIcon = "showWarningIcon", :title="modalTitle")
    .padding-lr-22(style="text-align: left;")
      div 1、合同提交后请
        sapn(style="color: red;font-size: 16px") 2小时
          sapn(style="color: #000;font-size: 14px") 内完成付款，超时合同将会自动取消！
      div 2、付款成功后请
        sapn(style="color: red;font-size: 16px") 5天内
          sapn(style="color: #000;font-size: 14px") 完成提货，超期未提需缴纳相应的仓储费用
</template>

<script>
import CountStep from '@/components/CountStep.vue'
// import CartItem from '@/components/CartItem.vue'
import { mapState, mapActions } from 'vuex'
import modal from '@/components/Modal.vue'
export default {
  data () {
    return {
      height: 0,
      // 卖家变量
      liftSelect: '收吊费',
      liftSelectVal: 1,
      tabActive: 0,
      customerName: '无锡海铭通物贸有限公司',
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
      // 买家变量
      alertText: '',
      alertShow: false,
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
      pickWayList: [
        { title: '自提点1-常州东港库', content: '江苏省常州市武进区湖塘-常州东港A库(1，2，3，4，5，6，7号门)G库(8，9，10，11号门)' },
        { title: '自提点2-合肥徽商库', content: '合肥市庐阳区徽商钢材市场' },
        { title: '自提点3-合肥东港库', content: '合肥市大兴镇南淝河旁，合肥东港码头w' }
      ],
      scrollHeight: 0,
      firstLoad: false,
      modalShow: false,
      showWarningIcon: true,
      modalTitle: '是否继续提交？',
      modalMsg: '<div>1、合同提交后请2小时内完成付款，超时合同将会自动取消！<br />2、付款成功后请5天内完成提货，超期未提需缴纳相应的仓储费用</div>'
    }
  },
  components: {
    CountStep,
    modal
    // CartItem
  },
  computed: {
    ...mapState({
      custom: state => state.custom,
      tempObject: state => state.tempObject,
      bottomBarHeight: state => state.bottomBarHeight,
      isIpx: state => state.isIpx,
      screenHeight: state => state.screenHeight,
      customBar: state => state.customBar
    })
  },
  beforeMount () {
    this.height = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - this.getRpx(this.bottomBarHeight)
  },
  watch: {
    carts: {
      handler (newVal, oldVal) {
        let filterArray = newVal.filter(item => {
          item.countWeight = item.managerWeight
          return item.choosed === true
        })
        // this.totalCount = filterArray.length
        // this.allChoosed = this.totalCount === newVal.length
        this.allChoosed = filterArray.length === newVal.length
        this.totalPrice = 0
        this.totalWeight = 0
        this.totalLiftCharge = 0
        let totalCount = 0
        if (filterArray.length > 0) {
          filterArray.map(itm => {
            totalCount += itm.amount
            if (String(itm.price).indexOf('--') < 0) {
              if (Number(itm.liftingFee) > 0) {
                const countWeight = itm.managerWeight
                const countLiftWeight = countWeight * itm.liftingFee
                this.totalPrice += itm.ratioPriceManager * countWeight + countLiftWeight
                this.totalLiftCharge += countLiftWeight
              } else {
                this.totalPrice += itm.ratioPriceManager * itm.managerWeight
              }
              this.totalWeight += itm.managerWeight
            }
          })
          this.totalLiftCharge = this.$toFixed(Number(this.totalLiftCharge), 2)
          this.totalPrice = this.$toFixed(Number(this.totalPrice), 2)
          this.totalWeight = this.$toFixed(Number(this.totalWeight), 3)
        }
        this.totalCount = totalCount
      },
      deep: true
    }
  },
  onTabItemTap (item) {
    this.statisticRequest({ event: 'click_app_nav_cart' })
  },
  onHide () {
    this.carts = []
    this.soldCarts = []
    this.alertShow = false
    this.firstLoad = false
    this.modalShow = false
  },
  onUnload () {
    this.carts = []
    this.soldCarts = []
    this.alertShow = false
    this.firstLoad = false
  },
  onReady () {
    if (this.isLogin) {
      this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - this.getRpx(this.bottomBarHeight) - 200 + 'rpx'
      if (this.carts.length === 0 && !this.firstLoad) {
        this.firstLoad = true
        this.loadCartData()
      }
    }
  },
  onShow () {
    this.alertShow = false
    this.isEdit = false
    if (this.tempObject.type) {
      this.pickway = this.tempObject.type
      if (this.pickway === 1) {
        this.pwPhone = this.tempObject.phone
        this.pwAddr = this.tempObject.addr
        this.pwAddrDetail = this.tempObject.detail
      }
    }
    this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - this.getRpx(this.bottomBarHeight) - 200 + 'rpx'
    if (this.carts.length === 0 && !this.firstLoad) {
      this.firstLoad = true
      this.loadCartData()
    }
  },
  methods: {
    ...mapActions([
      'configVal'
    ]),
    clearPicker () {
      this.pickWayShow = false
    },
    jumpMall () {
      this.statisticRequest({ event: 'click_app_cart_go_mall' })
      this.tab('/pages/mall/main')
    },
    alertCb () {
      // this.jump('/pages/account/login/main')
      this.alertShow = false
    },
    openEdit () {
      this.pickWayShow = false
      if (!this.isEdit) this.statisticRequest({ event: 'click_app_cart_modify' })
      this.isEdit = !this.isEdit
    },
    tabSelect (type, item) {
      if (type === 'lift') {
        this.liftSelect = item.label
        this.liftSelectVal = item.val
        this.pickWayShow = false
        this.tabActive = 0
      }
    },
    openPickWay (type) {
      this.statisticRequest({ event: 'click_app_cart_address' })
      this.pickWayShow = !this.pickWayShow
    },
    refresher (done) {
      const self = this
      setTimeout(() => {
        self.carts = []
        self.soldCarts = []
        self.allChoosed = false
        self.loadCartData(done)
      }, 300)
    },
    // 清空购物车
    clearCarts () {
      // this.statisticRequest({ event: 'click_app_cart_del_all' })
      const self = this
      console.log(this.carts)
      if (this.carts.length > 0) {
        const ids = this.carts.map(itm => itm.id)
        this.confirm({ content: '确定清空购物车？' }).then((res) => {
          if (res === 'confirm') {
            self.btnDisable = true
            this.showLoading()
            self.httpPost(this.apiList.zf.deleteItem, { ids }).then(res => {
              self.showMsg('清空成功')
              self.carts = []
              self.soldCarts = []
              this.tabDot(this.carts.length + this.soldCarts.length)
            }).catch(e => {
              self.showMsg(e.message || '网络异常')
            }).finally(() => {
              self.hideLoading()
              self.btnDisable = false
            })
          }
        })
      } else {
        self.showMsg('没有物资，无需清空')
      }
    },
    // 清空失效物资
    emptySoldItems () {
      const self = this
      console.log('清空+++')
      if (!this.btnDisable) {
        this.confirm({ content: '您确定要清空失效物资吗？' }).then((res) => {
          if (res !== 'confirm') return false
          self.btnDisable = true
          self.httpPost(this.apiList.zf.failureMaterial, {}).then(res => {
            self.showMsg('清空成功')
            self.soldCarts = []
          }).catch(e => {
            self.showMsg(e.message || '网络异常')
          }).finally(() => {
            self.btnDisable = false
          })
        })
      }
    },
    choosedAll () {
      this.statisticRequest({ event: 'click_app_cart_checkall' })
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
    jumpToPickway () {
      this.configVal({ key: 'tempObject', val: { type: this.pickway, phone: this.pwPhone, addr: this.pwAddr, detail: this.pwAddrDetail } })
      this.jump({ path: '/pickway?type=' + this.pickway })
    },
    // 结算/删除
    goToSettle () {
      let filterArray = this.carts.filter(itm => itm.choosed === true)
      // const self = this
      if (this.isEdit) {
        // this.statisticRequest({ event: 'click_app_cart_del' })
        if (filterArray.length === 0) {
          this.showMsg('请选择所需删除的商品')
          return
        }
        // 删除
        this.delCartRow(filterArray)
        return
      }
      console.log(filterArray)
      if (filterArray.length > 0 && !this.btnDisable) {
        this.modalShow = true // 是否继续提交说明弹窗
      } else {
        this.showMsg('请选择结算商品', 'warn')
      }
    },
    // 提交说明弹窗回调
    async modalCb (flag) {
      let self = this
      let filterArray = this.carts.filter(itm => itm.choosed === true)
      if (flag.toString() === 'confirm') {
        self.btnDisable = true
        this.showLoading()
        let params = {
          deliveryType: '01',
          sourceType: '02',
          detailList: [
            {
              id: filterArray[0].id,
              num: filterArray[0].amount,
              quantityType: filterArray[0].quantityType,
              oldQuantityType: filterArray[0].oldQuantityType
            }
          ]
        }
        // 生成合同
        self.httpPost(this.apiList.zf.generateContractRecovery, params).then(res => {
          this.modalShow = false
          this.hideLoading()
          self.btnDisable = false
          this.tab('/pages/me/main')
        }).catch(e => {
          self.btnDisable = false
          this.modalShow = false
          this.hideLoading()
          this.alertText = e.message || '网络异常' // 合同生成失败弹窗提示
          this.alertShow = true
          console.log(e)
        })
      } else {
        this.modalShow = false
      }
    },
    // 选择计量方式
    weightChoose (val, rowItem) {
      rowItem.measure_way_id = val
      if (val === '01') {
        rowItem.weight = rowItem.radios[0].weight
        rowItem.price = rowItem.radios[0].price
        // rowItem.originPrice = rowItem.radios[0].originPrice
      } else {
        rowItem.weight = rowItem.radios[1].weight
        rowItem.price = rowItem.radios[1].price
        // rowItem.originPrice = rowItem.radios[1].price
      }
      let paramsObj = {
        id: rowItem.id,
        cartQuantityType: val
      }
      this.httpGet(this.apiList.zf.changeQuantityType, paramsObj).catch(e => {
        this.showMsg(e.message || '网络异常')
      })
      // this.ironRequest('cartUpdate.shtml', { cart_id: rowItem.cart_id, user_id: this.currentUser.user_id, measure_way: val, count: rowItem.count }, 'post').then(res => {
      // })
      this.$forceUpdate()
    },
    rowCartCount (obj) {
      console.log(obj.count)
      // let params = {
      //   id: obj.id,
      //   num: obj.count,
      //   batchNo: ''
      // }
      // this.httpGet(this.apiList.zf.changeNum, params).then(res => {
      //   console.log(res)
      // }).catch(e => {
      //   console.log(e)
      // })
    },
    delCartRow () {
      const me = this
      const list = []
      this.carts.map(item => {
        if (!item.choosed) {
          list.push(item)
        }
      })
      if (list.length === this.carts.length) {
        this.showMsg('请选择需要删除的物资')
        return false
      }
      this.confirm({ content: '您确定要删除吗？' }).then((res) => {
        if (res === 'confirm') {
          me.carts = list
        }
      })
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
          needLift: this.liftSelectVal
        }
        const data = await this.ironRequest(this.apiList.xy.auditDxCheck.url, params, this.apiList.xy.auditDxCheck.method)
        console.log(data)
        if (data.returncode === '0') {
          if (flag === 1) {
            // 定向
            this.dx(filterArray)
          } else {
            // 生成报价单
            this.generateQuotation(filterArray)
          }
        }
      } catch (e) {
        this.showMsg(e)
      }
    },
    // 获取购物车数据
    async loadCartData () {
      this.isLoad = false
      const self = this
      await self.httpPost(this.apiList.zf.saleContractDetail, {contractId: this.$root.$mp.query.contractId}).then(res => {
        // 有效物资
        let arr = res.data.contractDetailList
        // 失效物资
        this.soldCarts = []
        arr.forEach(itm => {
          // const weightMark = []
          const prArr = []
          const wtArr = []
          const oldPrArr = []
          // if (itm.trade_type === 1) {
          // 非H型钢
          itm.radios = []
          // if (Number(itm.ratioPriceManager) > 0) {
          // 挂牌计量方式
          if (itm.onlineQuantityType === '00' || itm.onlineQuantityType === '01') {
            let temp = self.calcWeight(
              '01',
              itm.num, // 数量(支)
              itm.meterWeight, // 16标米重
              itm.length, // 长度
              itm.tolerance, // 公差
              itm.floatingRatio // 上浮比例
            )
            itm.radios.push({
              label: '理计',
              m_way: '01',
              weight: temp,
              price: itm.ratioPriceManager, // 上架理计定价
              originPrice: itm.lj_origin_price
            })
            itm.price = itm.ratioPriceManager
            prArr.push(itm.ratioPriceManager)
            wtArr.push(self.calcWeight(
              itm.cartQuantityType, // 购物车计量方式
              itm.num,
              itm.meterWeight,
              itm.length,
              itm.tolerance,
              itm.floatingRatio
            ))
            oldPrArr.push(itm.lj_origin_price)
          }
          // if (Number(itm.ratioPricePound) > 0) {
          // 挂牌计量方式
          if (itm.onlineQuantityType === '00' || itm.onlineQuantityType === '02') {
            let temp = self.calcWeight(
              '02',
              itm.num, // 数量(支)
              itm.meterWeight, // 16标米重
              itm.length, // 长度
              itm.tolerance, // 公差
              itm.floatingRatio // 上浮比例
            )
            itm.radios.push({
              label: '磅计',
              m_way: '02',
              weight: temp,
              price: itm.ratioPricePound, // 上架磅计定价
              originPrice: itm.bj_origin_price
            })
            itm.price = itm.ratioPricePound
            prArr.push(itm.ratioPricePound)
            wtArr.push(self.calcWeight(
              itm.cartQuantityType, // 购物车计量方式
              itm.num,
              itm.meterWeight,
              itm.length,
              itm.tolerance,
              itm.floatingRatio
            ))
            oldPrArr.push(itm.bj_origin_price)
          }
          // if (!itm.measure_way_id) itm.measure_way_id = '01'
          if (!itm.cartQuantityType) {
            itm.measure_way_id = '00'
          } else {
            itm.measure_way_id = itm.cartQuantityType
          }
          // } else if (itm.trade_type === 2) {
          //   // H型钢
          //   itm.radios = [{
          //     label: '理计',
          //     m_way: itm.measure_way_id,
          //     weight: itm.lj_weight16,
          //     price: '--',
          //     originPrice: itm.lj_origin_price16
          //   }]
          //   if (Number(itm.lj_price16) > 0) itm.radios[0].price = itm.lj_price16
          // }
          itm.choosed = false
          itm.count = Number(itm.num)
          itm.weight = self.calcWeight(
            itm.cartQuantityType ? itm.cartQuantityType : '01',
            itm.num,
            itm.meterWeight,
            itm.length,
            itm.tolerance,
            itm.floatingRatio
          )
          itm.price = itm.cartQuantityType === '02' ? itm.ratioPricePound : itm.ratioPriceManager
          this.carts.push(itm)
          // const idx = itm.radios.findIndex(item => {
          //   return item.m_way === itm.measure_way_id
          // })
          // if (idx !== -1) {
          //   itm.weight = itm.radios[idx].weight
          //   itm.price = itm.radios[idx].price
          //   itm.originPrice = itm.radios[idx].originPrice
          //   itm.dx_prices = itm.radios[idx].price
          //   itm.allowedPrice = itm.radios[idx].allowedPrice
          //   this.carts.push(itm)
          // }
        })
        // 显示底部tabbar购物车数量
        this.tabDot(this.carts.length + this.soldCarts.length)
      }).catch(e => {
        self.showMsg(e.message)
      }).finally(() => {
        this.isLoad = true
      })
      // this.ironRequest('cartList.shtml?data_source=0&user_id=' + self.currentUser.user_id, {}, 'get').then(resp => {
      //   this.isLoad = true
      //   if (resp.returncode === '0') {
      //     let arr = resp.carts
      //     this.soldCarts = resp.sold_out_carts
      //     // const userType = this.currentUser.type
      //     arr.map(itm => {
      //       // const weightMark = []
      //       const prArr = []
      //       const wtArr = []
      //       const oldPrArr = []
      //       if (itm.trade_type === 1) {
      //         // 非H型钢
      //         itm.radios = []
      //         if (Number(itm.lj_price) > 0) {
      //           itm.radios.push({
      //             label: '理计',
      //             m_way: 2,
      //             weight: itm.lj_weight,
      //             price: itm.lj_price,
      //             originPrice: itm.lj_origin_price
      //           })
      //           prArr.push(itm.lj_price)
      //           wtArr.push(itm.lj_weight)
      //           oldPrArr.push(itm.lj_origin_price)
      //         }
      //         if (Number(itm.bj_price) > 0) {
      //           itm.radios.push({
      //             label: '磅计',
      //             m_way: 1,
      //             weight: itm.bj_weight,
      //             price: itm.bj_price,
      //             originPrice: itm.bj_origin_price
      //           })
      //           prArr.push(itm.bj_price)
      //           wtArr.push(itm.bj_weight)
      //           oldPrArr.push(itm.bj_origin_price)
      //         }
      //         if (!itm.measure_way_id) itm.measure_way_id = 2
      //       } else if (itm.trade_type === 2) {
      //         // H型钢
      //         itm.radios = [{
      //           label: '理计',
      //           m_way: itm.measure_way_id,
      //           weight: itm.lj_weight16,
      //           price: '--',
      //           originPrice: itm.lj_origin_price16
      //         }]
      //         if (Number(itm.lj_price16) > 0) itm.radios[0].price = itm.lj_price16
      //       }
      //       itm.choosed = false
      //       const idx = itm.radios.findIndex(item => {
      //         return item.m_way === itm.measure_way_id
      //       })
      //       if (idx !== -1) {
      //         itm.weight = itm.radios[idx].weight
      //         itm.price = itm.radios[idx].price
      //         itm.originPrice = itm.radios[idx].originPrice
      //         itm.dx_prices = itm.radios[idx].price
      //         itm.allowedPrice = itm.radios[idx].allowedPrice
      //         this.carts.push(itm)
      //       }
      //     })
      //     this.tabDot(this.carts.length + this.soldCarts.length)
      //   } else {
      //     this.showMsg(resp ? '网络异常' : resp.errormsg)
      //     this.carts = []
      //     this.soldCarts = []
      //     this.tabDot(0)
      //   }
      // }).catch(err => {
      //   this.isLoad = true
      //   self.showMsg(err || '网络异常')
      // })
    },
    // 卖家方法
    async dx (filterArray) {
      // this.jump('/pages/vendor/quotation/main')
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
      console.log(data)
    },
    generateQuotation () {
      const filterArray = this.carts.filter(itm => itm.choosed === true)
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
  background-color #F1F1F1
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
// 卖家样式
.quotation
  padding 5px 10px
  border-radius 100px
.tab-select-dialog
  position fixed
  left 0
  right 0
  z-index 99
  background rgba(0, 0, 0, 0.5)
  bottom 0
.tab-select
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
.padding-lr-22
  padding 0 22px
</style>



