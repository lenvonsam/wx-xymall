<template lang="pug">
div
  nav-bar(title="待确认提单", isBack)
  template(v-if="isload")
    time-line(type="mallist")
  template(v-else)
    template(v-if="listData.length > 0")
      .bg-white.text-gray.padding-sm.margin-top-sm(v-for="(item, idx) in listData", :key="idx")
        .row.margin-bottom-sm
          .col
            span.ft-15.text-blue.text-bold {{item.no}}
            copy-btn(:copyUrl="item.no")
          .confirm-btn.text-blue(@click="jump('/pages/ladbillConfirmDetail/main?no='+item.no)") 确认提单
        .padding-bottom-xs {{item.product_name}}
        .padding-bottom-xs 
          span 共{{item.total_count}}支，{{item.weight_real}}吨
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
      finished: true,
      isLoad: false
    }
  },
  components: {
    copyBtn
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser,
      pageSize: state => state.pageSize,
      tempObject: state => state.tempObject,
      screenHeight: state => state.screenHeight,
      isLogin: state => state.user.isLogin
    })
  },
  onShow () {
    this.loadData()
  },
  methods: {
    loadData () {
      this.showLoading()
      const reqUrl = 'orderLadList.shtml'
      const type = 'post'
      const p = {
        status: 6,
        user_id: this.currentUser.user_id,
        current_page: this.currentPage,
        page_size: this.pageSize
      }
      if (this.currentPage === 0) {
        this.isLoad = true
      } else {
        this.isLoad = false
      }
      this.ironRequest(reqUrl, p, type, this).then(resp => {
        if (resp.returncode === '0') {
          console.log('resp', resp)
          this.listData = resp.order_lads
        }
        this.hideLoading()
      }).catch(err => {
        this.hideLoading()
        this.showMsg(err || '网络错误')
      })
    },
    loadMore () {
      this.currentPage++
      this.loadData()
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