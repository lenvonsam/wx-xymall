<template lang="pug">
.s-layout.bg-white
  nav-bar(title="购物车")
  template(v-if="currentUser.isLogin")
    seller-cart-temp(v-if="currentUser.type === 'seller' && isLogin")
    buyer-cart-temp(v-if="currentUser.type === 'buyer' && isLogin")
  template(v-else)  
    noData
  //- modal(v-model="alertShow", @cb="modalCb")
    .padding-sm 您未登录,请先登录
  //- alert(msg="您未登录,请先登录", v-model="alertShow", :cb="alertCb")
</template>

<script>
import SellerCartTemp from '@/components/SellerCartTemp.vue'
import buyerCartTemp from '@/components/BuyerCartTemp.vue'
import modal from '@/components/Modal.vue'
import noData from '@/components/NoData'
import { mapState } from 'vuex'
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
      alertShow: false
    }
  },
  onHide () {
    console.log('cart----')
    this.alertShow = false
  },
  onShow () {
    if (!this.isLogin) {
      this.alertShow = true
    }
  },
  onTabItemTap (item) {
    this.statisticRequest({ event: 'click_app_nav_cart' })
  },
  methods: {
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
