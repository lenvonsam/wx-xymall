<template lang="pug">
div
  nav-bar(title="我的求购", isBack)
  template(v-if="isload")
    time-line(type="mainres")
  template(v-else)
    template(v-if="listData.length > 0")  
      div(:style="{'padding-bottom': isIpx ? '218rpx' : '150rpx'}")
        .text-content.bg-white.padding-sm.text-blue.margin-top-sm(v-for="(item, itemIdx) in listData", :key="itemIdx")
          .row
            .col.text-blue.ft-15 {{item.requireNo}}
            span.text-gray {{item.createDate}}
          .text-gray
            .row
              .col.ft-15 品名
              span {{item.productBrandName}}
            .row
              .col.ft-15 材质
              span {{item.productTextureName}}
            .row
              .col.ft-15 规格
              span {{item.specification}}
    .text-center.pt-100(v-else)
      empty-image(url="bill_empty.png", className="img-empty")
      .empty-content 您暂时没有加工数据
    //- .bottom-footer.bg-white.padding-sm(style="height: 130rpx")
    .bottom-footer.bg-white.padding-sm(:style="{'padding-bottom': isIpx ? '98rpx' : '20rpx'}")
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
  computed: {
    ...mapState({
      isIpx: state => state.isIpx
    })
  },
  onShow () {
    const self = this
    self.isload = true
    let paramsObj = {
      type: '01',
      productTextureName: '',
      processState: '',
      pageNum: 1,
      pageSize: 10
    }
    self.httpPost(self.apiList.zf.onlineRequireBuyManage, paramsObj).then(res => {
      self.listData = res.data
    }).finally(() => {
      self.isload = false
    })
    // this.ironRequest('demandList.shtml?user_id=' + this.currentUser.user_id, {}, 'get').then(resp => {
    //   this.isload = true
    //   if (resp && resp.returncode === '0') {
    //     this.listData = resp.demands
    //   } else {
    //     this.showMsg(resp === undefined ? '网络异常' : resp.errormsg)
    //   }
    //   this.isload = false
    // }).catch(err => {
    //   this.showMsg(err || '网络异常')
    //   this.isload = false
    // })
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