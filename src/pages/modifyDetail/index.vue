<template lang="pug">
div
  nav-bar(title="合同修改", isBack)
    // .row.flex-between.padding-sm.bg-white.mb-10
    //   .col.text-blue
    //     span {{saleContractNo}}
    //     span.padding-left-sm {{cStatus}}
    //   .text-right(@click="openEdit()", v-else-if="contractDetail.status === 14 || currentUser.type === 'seller'") {{isEdit ? '完成' : '编辑'}}
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
            .col.text-blue
              span {{saleContractNo}}
              span.padding-left-sm {{cStatus}}
            .text-center
              .padding-xs(v-show="isEdit", @click="openEdit") 完成
              .flex(v-show="!isEdit")
                .padding-xs.mr-5(@click="openEdit") 编辑
          scroll-view.scroll-view(scroll-y, :style="{height: scrollHeight}")
            //- cart-item(v-for="(cart, idx) in carts", :key="idx", :cart="cart")
            .cart-items(v-for="(cart, cartIdx) in carts", :key="cartIdx")
              .cart-item.padding-sm
                .flex.flex-center.align-center.ft-15.text-bold
                  .col.flex-25(@click="changeSelect(cart)", style="padding-top: 5px;")
                    img.choose-icon(src="/static/images/blue_check.png", v-if="cart.choosed")
                    img.choose-icon(src="/static/images/btn_ck_n.png", v-else)
                  .col(@click="changeSelect(cart)")
                    span {{cart.productBrandName}}
                    span.padding-left-xs {{cart.specification}}
                  //- .text-blue ￥{{cart.price}}/吨
                  //-   span {{cart.onlineProductBrandName}}
                  //-   span.padding-left-xs {{cart.specification}}
                  .text-blue ￥{{cart.inTaxPrice}}/吨
                .content.ft-13
                  .flex.flex-center.justify-between
                    div
                      div
                        span {{cart.productTextureName}}
                        span.ml-5 {{cart.length}}米
                        span.ml-5 {{cart.stockZoneName}}
                        span.sub-mark.ml-5 {{cart.prodAreaName}}
                      .pt-5
                        span {{cart.firstAmount}}支 / {{cart.quantityType == '02' ? cart.firstPound : cart.firstManager}}吨
                        span.padding-left-xs 吊费:
                        span.ml-10 {{cart.price === '--' ? '--' : cart.liftingFee > 0 ? '￥' + cart.liftingFee + '/吨' : cart.liftingFee == 0 ? '无' : '线下结算'}}
                      .flex
                        .pt-5.margin-right-sm(v-if="cart.toleranceRange || cart.weightRange")
                          span(v-if="cart.toleranceRange") 公差范围:
                          span.ml-10.mr-10(v-if="cart.toleranceRange") {{cart.toleranceRange}}
                        .pt-5
                          span(v-if="cart.weightRange") 重量范围:
                          span.ml-10(v-if="cart.weightRange") {{cart.weightRange}}
                    .text-right
                      .flex.flex-direction.justify-between
                        z-radio(@checkHander="weightChoose(r.m_way, cart)", v-for="(r, rIdx) in cart.radios", :key="rIdx", :label="r.label", :checked="cart.measure_way_id === r.m_way")

                  .row.padding-xs.justify-end
                    .col(style="flex: 0 0 60px;")
                      count-step(v-model="cart.amount", @change="rowCartCount($event, cart)", :max="cart.ratioAvailableAmount")
                    .padding-left-xs {{cart.countWeight}}吨
          // .s-footer(v-if="carts.length > 0", style="height: 100rpx")

          .text-center.c-gray
            .bottom-option.bg-white.flex.align-center.padding-lr.justify-between(v-if="isEdit", :style="{height: isIpx ? '168rpx' : '100rpx', 'padding-bottom': isIpx ? '68rpx' : 0}")
              .flex.align-center(@click="choosedAll()")
                .flex.flex-center
                  img.choose-icon(src="/static/images/blue_check.png", v-if="allChoosed")
                  img.choose-icon(src="/static/images/btn_ck_n.png", v-else)
                .padding-xs 全选
              .main-btn.bg-red(@click="delCartRow()") 删除
            .bottom-panel.bg-white.padding-sm(v-else, :style="{height: isIpx ? '308rpx' : '240rpx'}")
              .flex
                .text-black 旧单金额
                .text-gray.text-right.col ￥{{oldOrderPrice.allPrice}}（含吊费：{{oldOrderPrice.liftingFeeMoney}}）
              .flex
                .text-black 新单金额
                .text-gray.text-right.col ￥{{newOrderPrice.allPrice}}（含吊费：{{newOrderPrice.liftingFeeMoney}}）
              .solid-top.solid-top-sm.row(v-if="contractStatus === 19")
                .col.padding-right-xs
                  button.text-white.bg-red(@click="overrule()") 驳回
                .col.padding-left-xs
                  button.text-white.bg-blue(@click="agreeEdit()") 同意修改
              .solid-top.solid-top-sm(v-else-if="contractStatus === 18")
                button.bg-gray 修改审核中
              //- .solid-top.solid-top-sm.row(v-else-if="((contractStatus === 12 || contractStatus === 14) && currentUser.type === 'buyer') || ((contractStatus === 15 || contractStatus === 16) && currentUser.type === 'seller')")
              .solid-top.solid-top-sm.row(v-else-if="contractStatus === 20")
                .col.padding-right-xs.padding-top
                  //- button.bg-gray.ft-15(@click="btnDisabled ? '' : back") 放弃修改
                  button.bg-gray.ft-15(@click="giveUp") 放弃修改
                .col.padding-left-xs.padding-top-sm
                  button.text-white.bg-blue.ft-15(@click="applyEdit") 申请修改
            //- .bill-foot.bg-white.padding-sm
  alert(:msg="alertText", v-model="alertShow")
  my-toast(:toastShow="toastShow" :toastMsg="toastMsg")
</template>

<script>
import CountStep from '@/components/CountStep.vue'
// import CartItem from '@/components/CartItem.vue'
import { mapState, mapActions } from 'vuex'
import modal from '@/components/Modal.vue'
import myToast from '@/components/MyToast.vue'
export default {
  data () {
    return {
      toastShow: false,
      toastMsg: '',
      saleContractNo: '',
      cStatus: '',
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
      modalMsg: '<div>1、合同提交后请2小时内完成付款，超时合同将会自动取消！<br />2、付款成功后请5天内完成提货，超期未提需缴纳相应的仓储费用</div>',
      oldOrderPrice: {
        allPrice: '',
        liftingFeeMoney: ''
      },
      newOrderPrice: {
        allPrice: '',
        liftingFeeMoney: ''
      },
      contractStatus: 20,
      contractDetail: {},
      alertShow: false,
      isHasRoll: false,
      alertText: '此合同含有卷类物资，不能进行修改，如需修改请联系业务员!'
    }
  },
  components: {
    CountStep,
    modal,
    myToast
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
        // 监听已选物资的变化
        let filterArray = newVal.filter(item => {
          item.countWeight = item.weight
          return item.choosed === true
        })
        // this.totalCount = filterArray.length
        // this.allChoosed = this.totalCount === newVal.length
        this.allChoosed = filterArray.length === newVal.length
        this.totalPrice = 0
        this.totalWeight = 0
        this.totalLiftCharge = 0
        let totalCount = 0
        console.log('filterArray', filterArray)
        if (filterArray.length > 0) {
          filterArray.map(itm => {
            totalCount += itm.amount
            if (String(itm.inTaxPrice).indexOf('--') < 0) {
              if (Number(itm.liftingFee) > 0) {
                const countWeight = itm.weight
                const countLiftWeight = countWeight * itm.liftingFee
                this.totalPrice += itm.inTaxPrice * countWeight + countLiftWeight
                this.totalLiftCharge += countLiftWeight
              } else {
                this.totalPrice += itm.inTaxPrice * itm.weight
              }
              this.totalWeight += itm.weight
            }
          })
          this.totalLiftCharge = this.$toFixed(Number(this.totalLiftCharge), 2)
          this.totalPrice = this.$toFixed(Number(this.totalPrice), 2)
          this.totalWeight = this.$toFixed(Number(this.totalWeight), 3)
          this.newOrderPrice.allPrice = this.totalPrice
          this.newOrderPrice.liftingFeeMoney = this.totalLiftCharge
        } else {
          this.newOrderPrice.allPrice = 0
          this.newOrderPrice.liftingFeeMoney = 0
        }
        this.totalCount = totalCount
      },
      deep: true
    },
    isEdit: {
      handler (newVal, oldVal) {
        if (newVal) {
          this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - this.getRpx(this.bottomBarHeight) - 110 + 'rpx'
        } else {
          this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - this.getRpx(this.bottomBarHeight) - 240 + 'rpx'
        }
      }
    }
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
      this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - this.getRpx(this.bottomBarHeight) - 240 + 'rpx'
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
    applyEdit () {
      if (this.isHasRoll) {
        this.alertShow = true
        return
      }
      if (this.btnDisabled) return false
      this.btnDisabled = true
      console.log(this.carts)
      let filterArray = this.carts.filter(item => {
        return item.choosed
      })
      console.log(filterArray)
      if (filterArray.length === 0) {
        this.showMsg('请选择结算商品', 'none')
        this.btnDisabled = false
      } else {
        this.confirm({ content: '请确认修改合同' }).then((res) => {
          if (res !== 'confirm') {
            this.btnDisabled = false
            return false
          } else {
            this.showLoading()
            let params = this.contractDetail
            params.contractDetailList = filterArray
            params.saleContractDetailDTOS = filterArray
            params.list = filterArray
            this.httpPost(this.apiList.zf.updateSaleContract, params)
              .then((res) => {
                this.hideLoading()
                this.btnDisabled = false
                this.showMsg('修改成功')
                // 企业微信通知业务员
                const salesman = mpvue.getStorageSync('salesman')
                console.log('业务员++', salesman)
                // 企业微信通知业务员
                if (salesman) {
                  const time = this.formatDateTime(new Date())
                  const content = `${salesman}您好：您的客户${this.currentUser.companyName}，${time}发起合同修改，修改合同编号为${this.saleContractNo}，请及时进行确认，联系电话${this.currentUser.phone}`
                  this.httpPost(this.apiList.zf.autoNotify, {
                    content: content,
                    members: salesman
                  }).catch(err => {
                    console.log(err)
                  })
                }
                setTimeout(() => {
                  this.back()
                }, 1500)
              })
              .catch((e) => {
                this.hideLoading()
                this.btnDisabled = false
                // this.showMsg(e.message)
                this.toastShow = true
                this.toastMsg = e.message
                setTimeout(() => {
                  this.toastShow = false
                  this.toastMsg = ''
                }, 1500)
              })
          }
        })
      }
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
      this.confirm({ content: '删除后将从合同中移除此规格，是否继续？(点击申请修改后，删除操作生效)' }).then((res) => {
        if (res === 'confirm') {
          me.carts = list
          console.log('剩下的++++++', me.carts)
        }
      })
    },
    // promptClose () {
    //   this.confirm({ content: '删除后将从合同中移除此规格，是否继续？(点击申请修改后，删除操作生效)' }).then((conRes) => {
    //     if (conRes !== 'confirm') return false
    //     const me = this
    //     const modifyList = JSON.parse(JSON.stringify(me.modifyList))
    //     const list = []
    //     const lift = me.wh_lift.lift
    //     let newWeight = 0
    //     let newPrice = 0
    //     modifyList.find((res, index) => {
    //       if (res.choosed) {
    //         // delPrice += res.price
    //         res.count = 0
    //         me.delModifyList.push(res)
    //       } else {
    //         let isLift = me.wh_lift[res.wh_name]
    //         newWeight += isLift === '1' ? Number(res.weight) : 0
    //         if (me.contractDetail.is_lift !== 1) {
    //           isLift = 2
    //         }
    //         newPrice += res.price
    //         list.push(res)
    //       }
    //     })
    //     // me.newLift = Number(this.$toFixed(newWeight * lift, 2))
    //     me.newLift = list.length ? Number(this.$toFixed(newWeight * lift, 2)) : 0
    //     me.modifyList = list
    //     me.newPrice = list.length ? Number(this.$toFixed(newPrice, 2)) : 0
    //     this.getNewBillPrice()
    //   })
    // },
    giveUp () {
      if (!this.btnDisabled) {
        this.back()
      }
    },
    agreeEdit () {
      if (this.btnDisabled) return false
      this.btnDisabled = true
      const params = {
        id: this.contractDetail.id,
        contract_id: this.contractDetail.contract_id
      }
      const me = this
      this.showLoading()
      this.ironRequest('confirm_contract_app.shtml', params, 'post').then(res => {
        this.hideLoading()
        if (res.returncode === '0') {
          me.showMsg(res.msg ? res.msg : '修改成功', 'positive')
          setTimeout(() => {
            me.back()
          }, 1000)
        } else {
          me.showMsg(res.msg ? res.msg : '操作失败')
          this.btnDisabled = false
        }
      }).catch(err => {
        this.hideLoading()
        this.btnDisabled = false
        this.showMsg(err || '网络错误')
      })
    },
    overrule () {
      if (this.btnDisabled) return false
      this.btnDisabled = true
      const params = {
        id: this.contractDetail.id,
        contract_id: this.contractDetail.contract_id
      }
      const me = this
      this.showLoading()
      this.ironRequest('reject_contract_app.shtml', params, 'post').then(res => {
        this.hideLoading()
        if (res.returncode === '0') {
          me.showMsg('驳回成功', 'positive')
          setTimeout(() => {
            me.back()
          }, 1000)
        } else {
          me.showMsg(res.data.msg)
          me.btnDisabled = false
        }
      }).catch(err => {
        this.hideLoading()
        me.btnDisabled = false
        this.showMsg(err || '网络错误')
        // if (done) done()
      })
    },
    clearPicker () {
      this.pickWayShow = false
    },
    jumpMall () {
      this.tab('/pages/mall/main')
    },
    alertCb () {
      // this.jump('/pages/account/login/main')
      this.alertShow = false
    },
    openEdit () {
      this.pickWayShow = false
      this.isEdit = !this.isEdit
      if (this.isEdit) {
        this.carts.forEach(item => {
          item.choosed = false
        })
      } else {
        this.carts.forEach(item => {
          item.choosed = true
        })
      }
    },
    changeSelect (cart) {
      if (this.isEdit) {
        cart.choosed = !cart.choosed
      }
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
    change () {
      let a = 0
      let b = 0
      let c = 0
      this.carts.map((ic) => {
        ic.amount = ic.secondNumber
        console.log(ic.amount)
        if (ic.floatType === '03') {
          ic.secondWeight = ic.maxWeight
        } else {
          ic.secondWeight = this.calcWeight(
            ic.quantityType,
            ic.secondNumber,
            ic.meterWeight,
            ic.length,
            ic.tolerance,
            ic.floatingRatio
          )
        }
        // 新单信息
        // 货款 = 单价 * 重量
        a += ic.secondWeight * ic.inTaxPrice
        // 吊费 =  吊费单价 * 重量
        b += ic.secondWeight * ic.liftingFee
        // 合同共计吊费 + 货款
        c = a + b
      })
      // 合同共计
      this.newOrderPrice.allPrice = c.toFixed(2)
      this.newOrderPrice.liftingFeeMoney = b.toFixed(2)
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
    jumpToPickway () {
      this.configVal({ key: 'tempObject', val: { type: this.pickway, phone: this.pwPhone, addr: this.pwAddr, detail: this.pwAddrDetail } })
      this.jump({ path: '/pickway?type=' + this.pickway })
    },
    // 结算/删除
    goToSettle () {
      let filterArray = this.carts.filter(itm => itm.choosed === true)
      // const self = this
      if (this.isEdit) {
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
    // 选择计量方式
    weightChoose (val, cart) {
      console.log('选择计量方式', val, cart)
      cart.measure_way_id = val
      if (val === '01') {
        // 理计
        // 修改当前物资显示的总重量和定价
        // cart.weight = cart.radios[0].weight
        cart.price = cart.radios[0].price
        cart.quantityType = '01'
        cart.weight = this.calcWeight(
          cart.quantityType, // 购物车计量方式
          cart.amount,
          cart.meterWeight,
          cart.length,
          cart.tolerance,
          cart.floatingRatio
        )
      } else {
        // 磅计
        // 修改当前物资显示的总重量和定价
        // cart.weight = cart.radios[1].weight
        cart.price = cart.radios[1].price
        cart.quantityType = '02'
        cart.weight = this.calcWeight(
          cart.quantityType, // 购物车计量方式
          cart.amount,
          cart.meterWeight,
          cart.length,
          cart.tolerance,
          cart.floatingRatio
        )
      }
      this.$forceUpdate()
    },
    rowCartCount (num, cart) {
      console.log('修改后的商品数量', num, cart)
      cart.amount = num
      cart.weight = this.calcWeight(
        cart.quantityType, // 购物车计量方式
        cart.amount,
        cart.meterWeight,
        cart.length,
        cart.tolerance,
        cart.floatingRatio
      )
      console.log(cart.weight)
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
        this.saleContractNo = res.data.saleContractNo
        this.cStatus = this.getStatus(res.data.xingyunContractStatus)
        // this.deliveryType = res.data.deliveryType // 01：表示自提
        // this.sourceType = res.data.sourceType // 合同来源：01:ERP,02:型云商城,03:小程序
        this.oldOrderPrice.allPrice = res.data.inTaxReceiveMoney
        this.oldOrderPrice.liftingFeeMoney = res.data.liftingFeeMoney
        // 有效物资
        let arr = res.data.contractDetailList
        // 失效物资
        this.soldCarts = []
        arr.forEach(itm => {
          // 商品列表
          itm.goodsInfo = {}
          itm.goodsInfo.productBrandName = itm.productBrandName
          itm.goodsInfo.productTextureName = itm.productTextureName
          itm.goodsInfo.specifitmation = itm.specifitmation
          itm.goodsInfo.length = itm.length
          itm.goodsInfo.prodAreaName = itm.prodAreaName
          itm.goodsInfo.toleranceRange = itm.toleranceRange
          itm.goodsInfo.weightRange = itm.weightRange

          itm.weight = {}
          itm.weight.quantityType = itm.quantityType
          itm.weight.avbleManagerWeight = itm.managerWeight
          itm.weight.avblePoundWeight = itm.poundWeight

          itm.fhWeight = {}
          itm.fhWeight.quantityType = itm.quantityType
          itm.fhWeight.outManagerWeight = itm.outManagerWeight
          itm.fhWeight.outPoundWeight = itm.outPoundWeight

          itm.secondNumber = itm.amount
          // itm.ratioAvailableAmount = itm.ratioAvailableAmount
          itm.ratioAvailableAmount = itm.ratioAvailableAmount + itm.amount
          itm.ownid = '-1'

          // const weightMark = []
          // const prArr = []
          // const wtArr = []
          // const oldPrArr = []
          // if (itm.trade_type === 1) {
          // 非H型钢
          itm.radios = []
          // if (Number(itm.ratioPriceManager) > 0) {
          // 挂牌计量方式

          if (itm.quantityType === '01') {
            let temp = self.calcWeight(
              '01',
              itm.amount, // 数量(支)
              itm.meterWeight, // 16标米重
              itm.length, // 长度
              itm.tolerance, // 公差
              itm.floatingRatio // 上浮比例
            )
            itm.radios.push({
              label: '理计',
              m_way: '01',
              weight: temp, // 该物资理计总重量
              price: itm.ratioPriceManager, // 该物资理计定价
              originPrice: itm.lj_origin_price
            })
            itm.price = itm.ratioPriceManager
          }
          if (itm.quantityType === '02') {
            let temp = self.calcWeight(
              '02',
              itm.amount, // 数量(支)
              itm.meterWeight, // 16标米重
              itm.length, // 长度
              itm.tolerance, // 公差
              itm.floatingRatio // 上浮比例
            )
            itm.radios.push({
              label: '磅计',
              m_way: '02',
              weight: temp, // 该物资磅计的总重量
              price: itm.ratioPricePound, // 该物资磅计定价
              originPrice: itm.bj_origin_price
            })
            itm.price = itm.ratioPricePound
          }
          // if (itm.onlineQuantityType === '00' || itm.onlineQuantityType === '01') {
          //   let temp = self.calcWeight(
          //     '01',
          //     itm.amount, // 数量(支)
          //     itm.meterWeight, // 16标米重
          //     itm.length, // 长度
          //     itm.tolerance, // 公差
          //     itm.floatingRatio // 上浮比例
          //   )
          //   itm.radios.push({
          //     label: '理计',
          //     m_way: '01',
          //     weight: temp, // 该物资理计总重量
          //     price: itm.ratioPriceManager, // 该物资理计定价
          //     originPrice: itm.lj_origin_price
          //   })
          //   itm.price = itm.ratioPriceManager
          // }
          // // 挂牌计量方式
          // if (itm.onlineQuantityType === '00' || itm.onlineQuantityType === '02') {
          //   let temp = self.calcWeight(
          //     '02',
          //     itm.amount, // 数量(支)
          //     itm.meterWeight, // 16标米重
          //     itm.length, // 长度
          //     itm.tolerance, // 公差
          //     itm.floatingRatio // 上浮比例
          //   )
          //   itm.radios.push({
          //     label: '磅计',
          //     m_way: '02',
          //     weight: temp, // 该物资磅计的总重量
          //     price: itm.ratioPricePound, // 该物资磅计定价
          //     originPrice: itm.bj_origin_price
          //   })
          //   itm.price = itm.ratioPricePound
          // }
          // if (!itm.measure_way_id) itm.measure_way_id = '01'
          if (!itm.quantityType) {
            itm.measure_way_id = '00'
          } else {
            itm.measure_way_id = itm.quantityType
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
          itm.choosed = true
          // itm.num = Number(itm.amount)
          // 该物资当前计量方式的总重量
          itm.weight = self.calcWeight(
            itm.quantityType ? itm.quantityType : '01',
            itm.amount,
            itm.meterWeight,
            itm.length,
            itm.tolerance,
            itm.floatingRatio
          )
          // 该物资当前计量方式的定价
          itm.price = itm.quantityType === '02' ? itm.ratioPricePound : itm.ratioPriceManager

          if (itm.productBrandName.includes('卷')) {
            this.alertShow = true
            this.isHasRoll = true
          }

          console.log('购物车数据整理')
          console.log({
            radios: itm.radios,
            price: itm.price,
            // count: itm.amount,
            choosed: itm.choosed,
            weight: itm.weight,
            measure_way_id: itm.measure_way_id
          })

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
        // res.data.saleContractDetailDTOS = arr
        // res.data.list = arr
        this.contractDetail = res.data
      }).catch(e => {
        self.showMsg(e.message)
      }).finally(() => {
        this.isLoad = true
      })
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
.main-btn
  background #e54d42
  font-size 16px
  height 30px
  width 100px
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



