<template lang="pug">
div
  nav-bar(title="我的加工", isBack)
  template(v-if="isload")
    time-line(type="mainres")
  template(v-else)
    template(v-if="listData.length > 0")
      div(:style="{'padding-bottom': isIpx ? '208rpx' : '140rpx'}")
        .text-content.bg-white.padding-sm.text-blue.margin-top-sm(v-for="(item, itemIdx) in listData", :key="itemIdx" @click="jump('/pages/processDetail/main?processId='+ item.processId)")
          .row
            .col.text-blue.ft-15 {{item.processNo}}
            span {{status[item.processState]}}
          .text-gray
            .row
              .col.ft-15 材质
              span {{item.productTextureName}}
            .row
              .col.ft-15 预计时间
              span {{item.deliveryDate}}
            .row
              .col.ft-15 申请时间
              span {{item.createDate}}
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
      isload: false,
      status: {
        '01': '待受理',
        '02': '受理完成',
        '03': '已拒绝',
        '04': '已过期'
      }
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
      pageSize: 20
    }
    self.httpPost(self.apiList.zf.onlineProcessTrack, paramsObj).then(res => {
      self.listData = res.data
      self.listData.map(item => {
        item.deliveryDate = item.deliveryDate ? item.deliveryDate.slice(0, 10) : ''
        // item.createDate = item.createDate ? item.createDate.slice(0, 10) : ''
      })
    }).finally(() => {
      self.isload = false
    })
    // this.ironRequest('processList.shtml?user_id=' + this.currentUser.user_id, {}, 'get').then(resp => {
    //   this.isload = false
    //   if (resp && resp.returncode === '0') {
    //     this.listData = resp.process
    //   } else {
    //     this.showMsg(resp === undefined ? '网络异常' : resp.errormsg)
    //   }
    // }).catch(err => {
    //   this.showMsg(err || '网络异常')
    //   this.isload = true
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
