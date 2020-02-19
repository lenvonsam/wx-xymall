<template lang="pug">
div
  nav-bar(title="我的求购", isBack)
  template(v-if="isload")
    time-line(type="mainres")
  template(v-else)
    template(v-if="listData.length > 0")  
      div(style="padding-bottom 70px")
        .text-content.bg-white.padding-sm.text-blue.margin-top-sm(v-for="(item, itemIdx) in listData", :key="itemIdx")
          .row
            .col.text-blue.ft-15 {{item.no}}
            span.text-gray {{item.publish_time}}
          .text-gray
            .row
              .col.ft-15 品名
              span {{item.name}}
            .row
              .col.ft-15 材质
              span {{item.material}}
            .row
              .col.ft-15 规格
              span {{item.standard}}
    .text-center.pt-100(v-else)
      img.img-empty(src="/static/images/bill_empty.png")
      .empty-content 您暂时没有加工数据
    .bottom-footer.bg-white.padding-sm
      .main-btn(@click="jump('/pages/askBuyCreate/main')") 发布求购
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      listData: [],
      isload: false
    }
  },
  onShow () {
    this.ironRequest('demandList.shtml?user_id=' + this.currentUser.user_id, {}, 'get', this).then(resp => {
      this.isload = true
      if (resp && resp.returncode === '0') {
        this.listData = resp.demands
      } else {
        this.showMsg(resp === undefined ? '网络异常' : resp.errormsg)
      }
      this.isload = false
    }).catch(err => {
      console.log(err.message)
      this.showMsg()
      this.isload = false
    })
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser
    })
  }
}
</script>
<style lang="stylus" scoped>
  .bottom-footer
    position fixed
    left 0
    right 0
    bottom 0  
    z-index 6
</style>