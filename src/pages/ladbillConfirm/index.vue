<template lang="pug">
div
  nav-bar(title="待确认提单", isBack)
  //- template(v-if="isload")
    time-line(type="mallist")
  //- template(v-if="!isload")
  template(v-if="listData.length > 0")
    iron-scroll(@scrolltolower="loadMore", :height="screenHeight - customBar", :refresh="true", @onRefresh="onRefresh", :loadFinish="loadFinish")
      .bg-white.text-gray.padding-sm.margin-top-sm(v-for="(item, idx) in listData", :key="idx")
        .row.margin-bottom-sm
          .col
            span.ft-15.text-blue.text-bold {{item.no}}
            copy-btn(:copyUrl="item.no")
          .confirm-btn.text-blue(@click="jump('/pages/ladbillConfirmDetail/main?no='+item.no)") 确认提单
        .padding-bottom-xs {{item.product_name}}
        .padding-bottom-xs 
          span 共{{item.total_count}}支，{{item.weight_csg}}吨
        .padding-bottom-xs 生成时间：{{item.create_time}}
  .text-center.text-gray.pt-100(v-else)
    empty-image(url="bill_empty.png", className="img-empty")
    .empty-content 您暂时没有相关提单  
</template>
<script>
import copyBtn from '@/components/CopyBtn.vue'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      listData: [],
      currentPage: 0,
      isload: true,
      loadFinish: 0
    }
  },
  components: {
    copyBtn
  },
  computed: {
    ...mapState({
      tempObject: state => state.tempObject
    })
  },
  onShow () {
    this.showLoading()
    this.listData = []
    // this.isLoad = true
    this.currentPage = 0
    this.onRefresh()
  },
  methods: {
    loadMore (done) {
      const me = this
      this.throttle(function () {
        me.currentPage++
        me.loadData(done)
      }, 300)
    },
    onRefresh (done) {
      this.currentPage = 0
      this.loadData(done)
    },
    loadData (done) {
      const reqUrl = 'orderLadList.shtml'
      const type = 'post'
      const p = {
        status: 6,
        user_id: this.currentUser.user_id,
        current_page: this.currentPage,
        page_size: this.pageSize
      }
      this.loadFinish = 1
      // if (this.currentPage > 0) this.loading = false
      this.ironRequest(reqUrl, p, type).then(resp => {
        if (resp.returncode === '0') {
          console.log('resp', resp)
          const me = this
          // this.listData = resp.order_lads
          const arr = resp.order_lads
          if (arr.length === 0 && me.currentPage === 0) {
            me.listData = []
          } else if (arr.length > 0 && me.currentPage === 0) {
            me.listData = arr
          } else if (arr.length > 0 && me.currentPage > 0) {
            me.listData.push(...arr)
          } else {
            me.currentPage--
            if (me.listData.length >= 10) me.loadFinish = 2
          }
        }
        this.hideLoading()
        if (this.listData.length < 10) this.loadFinish = 0
        this.isload = false
        if (done) done()
      }).catch(err => {
        this.hideLoading()
        this.isload = false
        this.loadFinish = 0
        if (done) done()
        this.showMsg(err || '网络错误')
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
.confirm-btn
  border 1px solid #0081ff
  padding 3px 8px
  border-radius 15px
</style>