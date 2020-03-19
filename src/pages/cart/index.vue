<template lang="pug">
.s-layout
  nav-bar(title="购物车")
  seller-cart-temp(v-if="currentUser.type === 'seller'")
  buyer-cart-temp(v-else)
</template>

<script>
import SellerCartTemp from '@/components/SellerCartTemp.vue'
import buyerCartTemp from '@/components/BuyerCartTemp.vue'
import { mapState } from 'vuex'
export default {
  components: {
    SellerCartTemp,
    buyerCartTemp
  },
  computed: {
    ...mapState({
      tempObject: state => state.tempObject
    })
  },
  onTabItemTap (item) {
    this.statisticRequest({ event: 'click_app_nav_cart' })
  }
}
</script>
<style lang="stylus", scoped></style>
