<template lang="pug">
.s-layout
  nav-bar(title="购物车")
  seller-cart-temp(v-if="currentUser.type === 'seller' && isLogin")
  buyer-cart-temp(v-if="currentUser.type === 'buyer' && isLogin")
  modal(v-model="alertShow", @cb="modalCb")
    .padding-sm 您未登录,请先登录
  //- alert(msg="您未登录,请先登录", v-model="alertShow", :cb="alertCb")
</template>

<script>
import SellerCartTemp from '@/components/SellerCartTemp.vue'
import buyerCartTemp from '@/components/BuyerCartTemp.vue'
import modal from '@/components/Modal.vue'
import { mapState } from 'vuex'
export default {
  components: {
    SellerCartTemp,
    buyerCartTemp,
    modal
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
