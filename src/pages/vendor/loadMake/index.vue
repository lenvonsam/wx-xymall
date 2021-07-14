<template lang="pug">
  .s-layout(@click="clearPicker")
    nav-bar(title="制作提单", isBack)
    template(v-if="!isLoad")
      time-line(type="mallist")
    template(v-else)
      .s-content-wrap
        .s-content
          .head(:style="{height: '200rpx', top: (selectDialogTop - 200)+'rpx'}")
            .row.solid-bottom.flex.padding-sm.bg-white.align-center.justify-between(style="height: 100rpx")
              .flex
                img.margin-right-xs(src="/static/images/user.png", style="height:40rpx;width:40rpx;")
                span.ft-bold 江苏钢铁贸易有限公司
              span(@click.stop="openPickWay(2)", class="'text-blue") {{liftSelect}}
            .row.bg-white.padding-sm(style="height: 100rpx")
              span.tab-select.text-left 提货车牌
              .row.col.tab-select.text-gray.text-center(@click.stop="openPickWay(1)")
                // .col.text-cut {{customerName || '请输入或选择车牌'}}
                input.col.text-cut(v-model="customerName", placeholder="请输入或选择车牌")
                i(:class="pickWayShow && tabActive === 1 ? 'cuIcon-fold' : 'cuIcon-unfold'")
          div(style="margin-top: 200rpx")
            scroll-view.scroll-view(scroll-y, :style="{height: scrollHeight}")
              .cart-items.bg-white(v-for="(item, itemIdx) in loadData", :key="itemIdx")
                .flex.align-center.solid-bottom.padding-sm(@click="chooseItemAll(item)")
                  img.choose-icon(src="/static/images/blue_check.png", v-if="item.itemAllchoosed")
                  img.choose-icon(src="/static/images/btn_ck_n.png", v-else)
                  .ft-16.text-blue.margin-left-sm {{item.saleContractNo}}
                .cart-item(v-for="(cart, cartIdx) in item.ladingDetailVOList", :key="cartIdx")
                  .padding-sm.solid-bottom
                    .flex.flex-center.align-center.ft-15.text-bold
                      .col.flex-25(@click="chooseItem(cart, item)", style="padding-top: 5px;")
                        img.choose-icon(src="/static/images/blue_check.png", v-if="cart.choosed")
                        img.choose-icon(src="/static/images/btn_ck_n.png", v-else)
                      .col.margin-left-sm
                        span {{cart.productBrandName}}
                        span.padding-left-xs {{cart.specification}}
                    .content.ft-13
                      .flex.flex-center.justify-between.padding-bottom-sm
                        div.full-width
                          .flex.flex-center.justify-between
                            div
                              span {{cart.productTextureName}}
                              span.ml-5 {{cart.length}}米
                              span.ml-5 {{cart.stockZoneName}}
                              span.sub-mark.ml-5 {{cart.prodAreaName}}
                            span.text-bold 可提：{{cart.avbleAmount}}支/{{cart.quantityType == '01' ? cart.avbleManagerWeight : cart.avblePoundWeight}}吨
                  .row.padding-sm.justify-end.align-end.solid-top
                    .col(style="flex: 0 0 60px;")
                      count-step(v-model="cart.amount", @change="rowCartCount($event, cart)", :max="cart.avbleAmount")
                    .padding-left-xs {{cart.weight}}吨
    .s-footer(v-if="loadData.length > 0", style="height: 100rpx")
      .cart-footer.justify-between
        .col.cart-footer-col
          .row.justify-between
            .row.flex-center(@click="choosedAll", style="padding-left: 10px;")
              .flex.flex-center
                img.choose-icon(src="/static/images/blue_check.png", v-if="allChoosed")
                img.choose-icon(src="/static/images/btn_ck_n.png", v-else)
              .padding-xs 全选
              .text-right.margin-left-sm.ft-12(v-show="!isEdit") 已选{{totalCount}}支 ，{{totalWeight}}吨
        .cart-settle-btna.ft-16(@click="deleteLoading")
          span 删除
        .cart-settle-btnb.ft-16(@click="makeLoading")
          span {{saleLadingIdList ? '确认制作' : '制作提单'}}
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
              .bg-white.solid-top.row.padding.justify-between(@click="tabSelect('driver', item)", :class="{'text-blue': customerName === item.carNo}", v-for="(item, customPickIdx) in customList", :key="customPickIdx")
                .col {{item.carNo}}
                .cuIcon-check(v-if="customerName === item.carNo")
          template(v-else)
            .text-center 暂无数据
          .solid-top.text-right.padding.text-gray 共{{customTotal}}条数据
        template(v-else)
          .solid-top.row.padding.justify-between(@click="tabSelect('load', item)", :class="{'text-blue': liftSelectVal === item.val}", v-for="(item, liftIdx) in liftList", :key="liftIdx")
            span {{item.label}}
            .cuIcon-check(v-show="liftSelectVal === item.val")
    // modal(v-model="modalShow", @cb="modalCb")
      // .padding-sm {{modalMsg}}
    // modal(v-model="noticeClientModalShow", @cb="noticeClientModalCb" :showWarningIcon = "showWarningIcon", :title="noticeClientModalTitle")
    //   .padding-lr-22(style="text-align: left;")
    //     div 1、合同提交后请
    //       sapn(style="color: red;font-size: 16px") 2小时
    //         sapn(style="color: #000;font-size: 14px") 内完成付款，超时合同将会自动取消！
    //     div 2、付款成功后请
    //       sapn(style="color: red;font-size: 16px") 5天内
    //         sapn(style="color: #000;font-size: 14px") 完成提货，超期未提需缴纳相应的仓储费用
</template>

<script>
import CountStep from '@/components/CountStep.vue'
import { mapState, mapActions } from 'vuex'
import timeLine from '@/components/TimeLine.vue'
import modal from '@/components/Modal.vue'
import zInput from '@/components/ZInput.vue'
export default {
  data () {
    return {
      inputZero: true,
      height: 0,
      customerName: '',
      modalShow: false,
      modalMsg: '',
      liftSelect: '自提',
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
      loadData: [],
      carts: [],
      soldCarts: [],
      btnDisable: false,
      isLoad: false,
      isEdit: false,
      pickWayShow: false,
      liftList: [{
        label: '自提',
        val: '01'
      }, {
        label: '配送',
        val: '02'
      }],
      pageType: '',
      pickWayList: [],
      scrollHeight: 0,
      cstmCurrentPage: 1,
      selectDialogTop: 0,
      customList: [],
      customTotal: 0,
      customLoadFinish: 0,
      dxFilterArray: [],
      flag: 1,
      firstLoad: false,
      saleLadingIdList: '',
      saleContractIdList: [],
      auditDxCheckDisable: true,
      showWarningIcon: true,
      noticeClientModalShow: false,
      noticeClientModalTitle: '请及时通知客户付款、提货'
    }
  },
  components: {
    CountStep,
    timeLine,
    modal,
    zInput
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
    loadData: {
      handler (newVal, oldVal) {
        console.log('数据变更+++', newVal)
        this.$forceUpdate()
        this.cartCalculation(newVal)
      },
      deep: true
    },
    customSearchVal (newVal) {
      const me = this
      this.throttle(function () {
        me.cstmCurrentPage = 1
        me.loadDriverList()
      }, 300)
    },
    liftSelectVal (newVal, oldVal) {
      const cartList = JSON.parse(JSON.stringify(this.loadData))
      if (newVal === 2) {
        cartList.map(item => {
          if (Number(item.liftingFee) > 0) item.dx_prices = Number(item.price) + 30
        })
      } else if (oldVal === 2) {
        cartList.map(item => {
          if (Number(item.liftingFee) > 0) item.dx_prices = Number(item.price)
        })
      }
      this.carts = cartList
    }
  },
  onHide () {
    this.carts = []
    this.btnDisable = false
    this.pickWayShow = false
    this.modalShow = false
    this.liftSelectVal = 1
    this.liftSelect = '收吊费'
    this.firstLoad = false
    this.saleLadingIdList = ''
    this.saleContractIdList = []
    this.tabActive = 0
    this.totalPrice = 0
    this.totalWeight = 0
    this.totalLiftCharge = 0
    this.totalCount = 0
    this.noticeClientModalShow = false
    this.pageType = ''
  },
  onLoad (options) {
    console.log(options)
    if (options.saleContractIdList) {
      // 制作提单
      this.saleContractIdList = options.saleContractIdList.split(',')
      this.pageType = 'make'
    } else {
      // 修改提单
      this.saleLadingIdList = options.saleLadingIdList
      this.pageType = 'edit'
    }
  },
  onUnload () {
    this.allChoosed = false
    this.liftSelect = '自提'
    this.customerName = ''
  },
  onShow () {
    if (this.tempObject.type) {
      this.pickway = this.tempObject.type
      if (this.pickway === 1) {
        this.pwPhone = this.tempObject.phone
        this.pwAddr = this.tempObject.addr
        this.pwAddrDetail = this.tempObject.detail
      }
    }
    console.log('isIpx', this.isIpx)
    this.selectDialogTop = this.getRpx(this.customBar) + 200
    this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - this.getRpx(this.bottomBarHeight) - 300 + 'rpx'
    if (this.tempObject.isIpx) {
      this.selectDialogTop -= 68
      this.scrollHeight -= 68
    }
    this.loadCartData()
    // if (this.carts.length === 0 && !this.firstLoad) {
    //   this.firstLoad = true
    //   this.loadCartData()
    // }
  },
  onReady () {
    if (this.isLogin) {
      this.loadDriverList()
      this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - this.getRpx(this.bottomBarHeight) - 300 + 'rpx'
      this.selectDialogTop = this.getRpx(this.customBar) + 200
      if (this.carts.length === 0 && !this.firstLoad) {
        this.firstLoad = true
        this.loadCartData()
      }
    }
  },
  methods: {
    ...mapActions([
      'configVal'
    ]),
    chooseItemAll (item) {
      console.log(item)
      item.itemAllchoosed = !item.itemAllchoosed
      if (item.itemAllchoosed) {
        let olist = []
        this.loadData.forEach(item => {
          if (item.itemAllchoosed) {
            olist.push(item)
          }
        })
        if (olist.length === this.loadData.length) {
          this.allChoosed = true
        }
        item.ladingDetailVOList.forEach(itm => {
          itm.choosed = true
        })
      } else {
        item.ladingDetailVOList.forEach(itm => {
          itm.choosed = false
        })
        this.allChoosed = false
      }
      this.$forceUpdate()
    },
    chooseItem (cart, item) {
      console.log(cart)
      cart.choosed = !cart.choosed
      if (cart.choosed) {
        let list = item.ladingDetailVOList.filter(itm => {
          return itm.choosed
        })
        console.log(list, 'hh++', item.ladingDetailVOList)
        if (list.length === item.ladingDetailVOList.length) {
          item.itemAllchoosed = true
          // item.ladingDetailVOList.forEach(itm => {
          //   itm.choosed = true
          // })
          let olist = []
          this.loadData.forEach(item => {
            if (item.itemAllchoosed) {
              olist.push(item)
            }
          })
          if (olist.length === this.loadData.length) {
            this.allChoosed = true
          }
        }
      } else {
        item.itemAllchoosed = false
        this.allChoosed = false
      }
      this.$forceUpdate()
    },
    async changeDirectionPrice (val, cart) {
      console.log(val, cart)
      cart.dx_prices = val
      let params = {
        id: cart.id,
        directionManagerPrice: val
      }
      try {
        let res = await this.httpPost(this.apiList.zf.sellerUpdateMoney, params)
        console.log(res)
      } catch (e) {
        console.log(e)
        this.showMsg(e.message)
      }
    },
    clearPicker () {
      this.pickWayShow = false
      this.tabActive = 0
    },
    inputFormat (cart, key) {
      const newVal = this.numberFormat(cart[key]).toString().match(/\d+\.\d{2}/)
      if (newVal) cart[key] = newVal ? newVal[0] : this.numberFormat(cart[key])
      if (!cart[key]) cart[key] = key === 'dx_prices' ? cart.price : 0
    },
    // 计算购物车费用
    cartCalculation (newVal) {
      let newValList = newVal || this.loadData
      console.log('重新计算+++', newValList)
      // 返回选中的物资
      if (newValList.length > 0) {
        console.log('长度', newValList.length)
        this.totalWeight = 0
        this.totalCount = 0
        newValList.forEach(item => {
          item.ladingDetailVOList.filter(itm => {
            if (itm.choosed) {
              this.totalCount += itm.amount // 总数量
              this.totalWeight += Number(itm.weight) // 总重量
              // totalPrice += Number(this.$toFixed(Number(itm.dx_prices) * Number(itm.countWeight), 2))
            }
          })
        })
        this.totalWeight = this.totalWeight.toFixed(3)
      }
    },
    customChange (e) {
      this.customSearchVal = e.mp.detail.value
      const me = this
      this.throttle(function () {
        me.cstmCurrentPage = 1
        me.loadDriverList()
      }, 300)
    },
    customloadMore () {
      const me = this
      this.throttle(function () {
        me.cstmCurrentPage++
        me.loadDriverList()
      }, 300)
    },

    // 获取提货车牌列表
    async loadDriverList () {
      try {
        var params = {
          pageNum: this.cstmCurrentPage,
          pageSize: 20,
          carNo: this.customSearchVal,
          driverName: ''
        }
        let data = await this.httpPost(this.apiList.zf.queryCarsByUnitId, params)
        console.log('+++', data)
        this.customTotal = data.total
        let arr = data.data
        console.log(arr)

        // {
        //   erpCode: "027493"
        //   id: 33654473
        //   name: "浙江金投钢铁有限公司"
        //   updateAt: 1614368096012
        //   xyCode: null
        // }

        const me = this
        if (arr.length === 0 && me.cstmCurrentPage === 1) {
          me.customList = []
          me.isload = false
        } else if (arr.length > 0 && me.cstmCurrentPage === 1) {
          me.customList = arr
          me.isload = false
        } else if (arr.length > 0 && me.cstmCurrentPage > 1) {
          arr.map(item => {
            me.customList.push(item)
          })
        } else {
          // if (me.customList.length >= 10) me.customLoadFinish = 2
          me.cstmCurrentPage--
        }
        // if (this.customList.length < 10) this.customLoadFinish = 0
        this.customLoadFinish = 0
        this.$forceUpdate()
      } catch (e) {
        console.error(e)
      }
    },
    modalCb (flag) {
      if (flag === 'confirm' && this.dxFilterArray.length > 0) {
        if (this.flag === 1) {
          this.noticeClientModalShow = true
        } else {
          this.generateQuotation()
        }
        this.modalShow = false
      } else {
        this.modalShow = false
      }
    },
    noticeClientModalCb (flag) {
      if (flag === 'confirm') {
        this.dx()
      } else {
        this.noticeClientModalShow = false
      }
    },
    // 选择tab（车牌/自提）
    tabSelect (type, item) {
      if (type === 'load') {
        this.liftSelect = item.label
        this.liftSelectVal = item.val
        this.pickWayShow = false
        this.cartCalculation() // 重新计算费用
        this.loadData.forEach(itm => {
          itm.deliveryType = this.liftSelectVal
        })
      } else {
        this.customerName = item.carNo
        this.pickWayShow = false
        this.loadData.forEach(itm => {
          itm.carNo = this.customerName
        })
      }
      this.tabActive = 0
    },
    // 切换选择
    openPickWay (type) {
      if (this.tabActive === type) {
        this.pickWayShow = !(this.tabActive === type)
        this.tabActive = 0
        return false
      }
      this.pickWayShow = true
      this.tabActive = type
    },
    choosedAll () {
      // this.logEventGet({ event: 'click_app_quotation_checkall' })
      this.allChoosed = !this.allChoosed
      if (this.allChoosed) {
        this.loadData.map(item => {
          item.itemAllchoosed = true
          console.log(item)
          item.ladingDetailVOList.map(itm => {
            itm.choosed = true
          })
        })
      } else {
        this.loadData.map(item => {
          item.itemAllchoosed = false
          console.log(item)
          item.ladingDetailVOList.map(itm => {
            itm.choosed = false
          })
        })
      }
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
      console.log('修改后的商品重量', cart.weight)
    },
    // 获取购物车数据
    async loadCartData () {
      this.isLoad = false
      const self = this
      let getSaleLoadingUrl = ''
      if (this.saleLadingIdList) {
        getSaleLoadingUrl = this.apiList.zf.editSaleLading + '?saleLadingId=' + this.saleLadingIdList
        await self.httpGet(getSaleLoadingUrl).then(res => {
          console.log(res)
          if (res.success) {
            this.customerName = res.data.carNo
            this.liftSelect = res.data.deliveryType === '01' ? '自提' : '配送'
            // this.buyUnitName = res.data.buyUnitName
            res.data.forEach(item => {
              item.itemAllchoosed = false
              item.ladingDetailVOList.forEach(itm => {
                itm.choosed = false
                itm.weight = this.calcWeight(
                  itm.quantityType, // 购物车计量方式
                  itm.amount,
                  itm.meterWeight,
                  itm.length,
                  itm.tolerance,
                  itm.floatingRatio
                )
                console.log([itm.quantityType, // 购物车计量方式
                  itm.amount,
                  itm.meterWeight,
                  itm.length,
                  itm.tolerance,
                  itm.floatingRatio])
              })
            })
            this.loadData = res.data
          }
        }).catch(e => {
          self.showMsg(e.message)
        }).finally(() => {
          this.isLoad = true
        })
      } else {
        getSaleLoadingUrl = this.apiList.zf.createSaleLadingFromContractList
        let params = this.saleContractIdList
        await self.httpPost(getSaleLoadingUrl, params).then(res => {
          console.log(res)
          if (res.success) {
            // this.customerName = res.data.carNo
            // this.liftSelect = res.data.deliveryType === '01' ? '自提' : '配送'
            // this.buyUnitName = res.data.buyUnitName
            res.data.forEach(item => {
              item.itemAllchoosed = false
              item.ladingDetailVOList.forEach(itm => {
                itm.choosed = false
                itm.weight = this.calcWeight(
                  itm.quantityType, // 购物车计量方式
                  itm.amount,
                  itm.meterWeight,
                  itm.length,
                  itm.tolerance,
                  itm.floatingRatio
                )
                console.log([itm.quantityType, // 购物车计量方式
                  itm.amount,
                  itm.meterWeight,
                  itm.length,
                  itm.tolerance,
                  itm.floatingRatio])
              })
            })
            this.loadData = res.data
          }
        }).catch(e => {
          self.showMsg(e.message)
        }).finally(() => {
          this.isLoad = true
        })
      }
    },
    deleteLoading () {
      this.confirm({ content: '您确定要删除吗？' }).then((res) => {
        if (res === 'confirm') {
          let list = this.loadData.filter(item => {
            return !item.itemAllchoosed
          })
          if (list.length > 0) {
            list.map(item => {
              item.ladingDetailVOList = item.ladingDetailVOList.filter(itm => {
                return !item.choosed
              })
            })
            this.loadData = list
          } else {
            this.loadData = []
            this.$forceUpdate()
          }
        }
      })
      // if (!choosedDeleteItem) {
      //   this.showMsg('请选择需要删除的物资')
      //   return false
      // }
    },
    makeLoading () {
      this.confirm({ content: '您确定要制作提单吗？' }).then((res) => {
        if (res === 'confirm') {
          // let list = this.loadData.map(item => {
          //   if (!item.itemAllchoosed) {
          //     return item
          //   } else {
          //     item.ladingDetailVOList.map(itm => {
          //       return !item.choosed
          //     })
          //     return item
          //   }
          // })
          if (!this.customerName) {
            this.showMsg('请输入或选择提货车牌')
            return
          }
          this.loadData.forEach((item, index) => {
            item.saleLadingDetailDTOS = item.ladingDetailVOList
          })
          let addSaleLadingUrl = ''
          if (this.saleLadingIdList) {
            addSaleLadingUrl = this.apiList.zf.updateSaleLading
          }
          if (this.saleContractIdList) {
            addSaleLadingUrl = this.apiList.zf.addSaleLadingList
          }
          this.httpPost(addSaleLadingUrl, this.loadData).then(res => {
            console.log(res)
            if (res.success) {
              if (this.saleLadingIdList) {
                this.showMsg('提单修改成功！')
                setTimeout(() => {
                  this.back()
                }, 1500)
              }
              if (this.saleContractIdList) {
                this.showMsg('提单制作成功！')
                setTimeout(() => {
                  this.back()
                }, 1500)
              }
            }
          }).catch(err => {
            this.showMsg(err.message)
          })
        }
      })
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
  margin-top 15px
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
  .cart-settle-btna
    display flex
    width 150rpx
    background #F95353
    letter-spacing 2px
    align-items center
    color #fff
    justify-content center
  .cart-settle-btnb
    display flex
    width 200rpx
    background #0081ff
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
.price
  input
    color #333
    font-size 30rpx
    font-weight bold
.head
  position fixed
  top 0
  left 0
  right 0
  z-index 3
.padding-lr-22
  padding 0 22px
</style>


