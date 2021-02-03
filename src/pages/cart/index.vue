<template lang="pug">
.s-layout.bg-white
  nav-bar(title="购物车")
  template(v-if="showCartContent")
    seller-cart-temp(v-if="currentUser.type === 'seller' && isLogin")
    buyer-cart-temp(v-if="currentUser.type === 'buyer' && isLogin")
  noData(v-if="alertShow")
  //- modal(v-model="alertShow", @cb="modalCb")
    .padding-sm 您未登录,请先登录
  //- alert(msg="您未登录,请先登录", v-model="alertShow", :cb="alertCb")
  modal(v-model="modalShow", @cb="modalCb", :title="modalTitle" :btns="btn")
    div
      .padding-15 {{modalMsg}}
</template>

<script>
import SellerCartTemp from '@/components/SellerCartTemp.vue'
import buyerCartTemp from '@/components/BuyerCartTemp.vue'
import modal from '@/components/Modal.vue'
import noData from '@/components/NoData'
import { mapState, mapActions } from 'vuex'
export default {
  components: {
    SellerCartTemp,
    buyerCartTemp,
    modal,
    noData
  },
  computed: {
    ...mapState({
      tempObject: state => state.tempObject,
      rule: state => state.rule
    })
  },
  data () {
    return {
      alertShow: false,
      showCartContent: false,
      modalShow: false,
      modalTitle: '超时未提货物收费标准',
      modalMsg: '对于在库物资，买方在平台上购买物资并支付货款后，应在约定的时间内（系统默认时间为5天）制作提单并提货。超过约定时间未提的合同物资将被判定为违约（超期未提），买方须承担未及时提货而产生的仓储管理费，并于提货时自行与仓库管理方结算。卖方有权对违约合同物资进行处置，进行合同取消并退还对应货款。',
      btn: [{ label: '确定', flag: 'confirm', className: 'main-btn' }]
    }
  },
  onHide () {
    console.log('cart----')
    this.alertShow = false
    if (this.modalShow) {
      this.modalShow = false
    }
  },
  onShow () {
    const self = this
    // const uid = self.currentUser.user_id
    if (self.isLogin) {
      console.log('cart_state.currentUser======>' + JSON.stringify(this.currentUser))
      // self.showCartContent = true
      // self.alertShow = false
      // if (typeof self.currentUser.type !== 'undefined') {
      //   if (self.currentUser.type === 'seller') {
      //     self.showLoading()
      //     self.ironRequest(`${self.apiList.xy.checkUUID.url}?user_id=${uid}`, {}, self.apiList.xy.checkUUID.method).then(resp => {
      //       console.log('page_cart_checkoutuuid=======>' + JSON.stringify(resp))
      //       self.hideLoading()
      //       if (resp.returncode === 0) {
      //         self.alertShow = false
      //       } else {
      //         self.showCartContent = false
      //         self.alertShow = true
      //         self.exitUser()
      //       }
      //     }).catch(e => {
      //       self.hideLoading()
      //       console.log('page_cart_checkoutuuid_已失效catch=======>' + e)
      //       self.showMsg('登录已失效，请重新登录')
      //       self.showCartContent = false
      //       self.alertShow = true
      //       self.exitUser()
      //       self.tabDot(0)
      //     })
      //   } else if (self.currentUser.type === 'buyer') {
      //     this.ironRequest(this.apiList.xy.queryProfile.url, {}, this.apiList.xy.queryProfile.method).then(res => {
      //       if (res.returncode === '0') {
      //         console.log('cart.vue_接口返回_rule=====>' + res.rule)
      //         if (res.rule === 0) {
      //           this.modalShow = true
      //         }
      //       }
      //     })
      //   }
      // } else {
      //   console.log('self.currentUser.type======>' + self.currentUser.type)
      // }
    } else {
      self.showCartContent = false
      self.alertShow = true
    }
  },
  onTabItemTap (item) {
    this.statisticRequest({ event: 'click_app_nav_cart' })
  },
  methods: {
    ...mapActions([
      'exitUser'
    ]),
    modalCb (flag) {
      this.ironRequest(this.apiList.xy.updateRule.url, { user_id: this.currentUser.user_id }, this.apiList.xy.updateRule.method).then(res => {
        if (res.returncode === '0') {
          console.log('updateRule_res=====>' + JSON.stringify(res))
        }
      }).catch(e => {
        console.log('updateRule_e=====>' + e)
      })
      this.modalShow = false
    }
  }
}
</script>
<style lang="stylus", scoped>
.padding-15
  padding 15px
</style>
