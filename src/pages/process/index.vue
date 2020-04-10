<template lang="pug">
div
  nav-bar(title="我的加工", isBack)
  template(v-if="isload")
    time-line(type="mainres")
  template(v-else)
    template(v-if="listData.length > 0")  
      div(:style="{'padding-bottom': isIpx ? '208rpx' : '140rpx'}")
        .text-content.bg-white.padding-sm.text-blue.margin-top-sm(v-for="(item, itemIdx) in listData", :key="itemIdx" @click="jump('/pages/processDetail/main?pno='+ item.process_no)")
          .row
            .col.text-blue.ft-15 {{item.process_no}}
            span {{item.status}}
          .text-gray
            .row
              .col.ft-15 材质
              span {{item.material}}
            .row
              .col.ft-15 预计时间
              span {{item.appoint_time}}
            .row
              .col.ft-15 申请时间
              span {{item.apply_time}}
    .text-center.pt-100(v-else)
      empty-image(url="bill_empty.png", className="img-empty")
      .empty-content 您暂时没有加工数据
    .bottom-footer.bg-white.padding-sm(:style="{height: isIpx ? '198rpx' : '130rpx'}")
      .main-btn(@click="jump('/pages/processDetail/main')") 发布加工  
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
  computed: {
    ...mapState({
      isIpx: state => state.isIpx
    })
  },
  onShow () {
    this.isload = true
    this.ironRequest('processList.shtml?user_id=' + this.currentUser.user_id, {}, 'get').then(resp => {
      this.isload = false
      if (resp && resp.returncode === '0') {
        this.listData = resp.process
      } else {
        this.showMsg(resp === undefined ? '网络异常' : resp.errormsg)
      }
    }).catch(err => {
      this.showMsg(err || '网络异常')
      this.isload = true
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