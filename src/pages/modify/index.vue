<template lang="pug">
div
  nav-bar(title="合同修改", isBack)
  .flex.text-center.nav.bg-white.relative
    .tab-line
    .cu-item.flex-sub(v-for="(item,index) in billTab", :class="item.status === tabName?'text-blue cur':''", :key="index", @click="selectTabs(item, index)")
      span {{item.title}}
  .padding-sm.ft-12(style="background: #FEF7E7;")
    span.text-orange 友情提示：仅展示允许修改的合同，修改后出库进行结算
  template(v-if="isload")
    time-line(type="mallist")  
  template(v-else) 
    template(v-if="listData.length > 0")
      scroll-view(scroll-y, @scrolltolower="loadMore", :style="{height: screenHeight - 140 +'px'}")  
        .padding-top-sm
          .padding-sm.bg-white.margin-bottom-sm(v-for="(item, itemIdx) in listData", :key="itemIdx")
            .flex.align-center
              .ft-16.padding-right-sm {{item.tstc_no}}
              img.ding-icon(src="/static/images/ding.png", v-if="item.contract_type == 12")
            .flex.justify-between.text-gray.align-center.margin-top-sm
              .col.text-content
                p {{item.client_name}}
                p 共{{item.amount}}支，{{item.weight}}吨
                p 吊费：¥{{item.lift_price}}
              .card-right
                .ft-16.padding-bottom-xs.text-bold.text-black ￥{{item.price}}
                .text-red(v-if="item.status === 18") 修改中
                .bill-btn.round(v-else, @click="jump(`/pages/modifyDetail/main?id=${item.discussid}&type=${tabName}`)") {{tabName == '1' ? '申请修改' : '去确认'}}
    .text-center.c-gray.pt-100(v-else)
      empty-image(url="bill_empty.png", className="img-empty")
      div 您暂时没有相关合同           
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      swiperCount: 0,
      billTab: [
        { title: '可修改合同', status: '1', data: [], isActive: true },
        { title: '修改中', status: '2', data: [], isActive: false }
      ],
      isTabDisabled: false,
      tabName: '1',
      currentPage: 0,
      listData: [],
      finished: true,
      isload: false,
      startDate: '',
      endDate: '',
      billNo: '',
      totalPrice: 0,
      totalWeight: 0,
      totalCount: 0,
      allChoosed: false
    }
  },
  computed: {
    ...mapState({
      screenHeight: state => state.screenHeight,
      currentUser: state => state.user.currentUser,
      tempObject: state => state.tempObject,
      isLogin: state => state.user.isLogin,
      pageSize: state => state.pageSize
    })
  },
  onShow () {
    this.listData = []
    if (this.$root.$mp.query.tabName) this.tabName = this.$root.$mpd.query.tabName
    this.loadData()
  },
  methods: {
    selectTabs (item) {
      this.tabName = item.status
      this.currentPage = 0
      this.listData = []
      this.isTabDisabled = true
      this.loadData()
    },
    rowBillItem (obj, type) {
    },
    batchPay () {
    },
    loadData () {
      if (this.currentPage === 0) {
        this.isload = true
      } else {
        this.isload = false
      }
      const body = {
        user_id: this.currentUser.user_id,
        status_flag: this.tabName,
        current_page: this.currentPage,
        page_size: this.pageSize
      }
      console.log(body)
      const me = this
      this.ironRequest('contract_edit_app.shtml', body, 'post', this).then(resp => {
        if (resp && resp.returncode === '0') {
          let arr = resp.notices
          if (arr.length === 0 && me.currentPage === 0) {
            me.listData = []
            me.finished = true
            me.isload = false
          } else if (arr.length > 0 && me.currentPage === 0) {
            arr.map(itm => {
              itm.choosed = false
              me.listData.push(itm)
            })
            me.finished = false
            me.isload = false
          } else if (arr.length > 0 && me.currentPage > 0) {
            arr.map(item => {
              item.choosed = false
              me.listData.push(item)
            })
            me.finished = false
          } else {
            me.finished = true
            me.currentPage--
          }
        } else {
          me.msgShow(resp === undefined ? '网络异常' : resp.errormsg)
          me.isload = false
        }
        this.isTabDisabled = false
      })
    },
    loadMore () {
      if (!this.isLoad) {
        this.currentPage++
        this.isTabDisabled = true
        this.loadData()
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.bill-btn, .bill-red-btn
  padding 5px 10px
  text-align center
  color #0081ff
.bill-btn
  border 1px #0081ff solid
.bill-red-btn
  border 1px #e54d42 solid
  color #e54d42
.nav
  .tab-line
    display block
    content ''
    height 25px
    width 2px
    position absolute
    left 50%
    margin-left -1px
    top 10px
    background #e6e6e6
.nav .cu-item.cur
  border-bottom none
  position relative
  &:after
    display block
    content ''
    width 26px
    height 2px
    background #0081ff
    position absolute
    bottom 0
    left 50%
    margin-left -13px
</style>