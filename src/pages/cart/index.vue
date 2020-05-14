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
      tempObject: state => state.tempObject
    })
  },
  data () {
    return {
      alertShow: false,
      showCartContent: false
    }
  },
  onHide () {
    console.log('cart----')
    this.alertShow = false
  },
  onShow () {
    const self = this
    const uid = self.currentUser.user_id
    debugger
    if (self.isLogin) {
      self.showLoading()
      self.ironRequest(`${self.apiList.xy.checkUUID.url}?user_id=${uid}`, {}, self.apiList.xy.checkUUID.method).then(resp => {
        console.log('page_cart_checkoutuuid=======>' + JSON.stringify(resp))
        self.hideLoading()
        if (resp.returncode.toString() === '0') {
          self.showCartContent = true
          self.alertShow = false
        } else {
          self.showCartContent = false
          self.alertShow = true
          self.exitUser()
        }
      }).catch(e => {
        self.hideLoading()
        console.log('page_cart_checkoutuuid_已失效catch=======>' + e)
        self.showMsg('登录已失效，请重新登录')
        self.showCartContent = false
        self.alertShow = true
        self.exitUser()
        self.tabDot(0)
      })
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
      this.alertShow = false
      if (flag === 'confirm') {
        this.jump('/pages/account/login/main')
      } else {
        this.tab('/pages/index/main')
      }
    }
  }
}
</script>
<style lang="stylus", scoped></style>
