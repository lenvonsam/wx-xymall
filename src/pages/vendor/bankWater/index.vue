<template lang="pug">
div
  nav-bar(title="银企直联", isBack)
  .head.bg-white(:style="{height: '210rpx'}")
    .serach.flex.align-center.padding-sm
      .col.search-input.text-gray
        .flex.align-center
          .cuIcon-search
          input.full-width.padding-left-sm(v-model="searchVal", type="text", placeholder="汇款抬头")
          .close-icon(@click="searchVal = ''", v-if="searchVal")
            .cuIcon-roundclosefill.ft-18
      .search-btn.text-blue(@click="searchOrder") 搜索
      .filter-btn.row(@click="openFilter")
        span 筛选
        .cuIcon-filter
    scroll-view.nav(scroll-x, scroll-with-animation, :scroll-into-view="scrollId")
      .flex.text-center
        .cu-item.flex-sub(:id="'idx_'+index", v-for="(item,index) in billTab", :class="item.status === tabName ? 'text-blue cur':''", :key="index", @click="selectTabs(item, index)")
          span {{item.title}}
  swiper.bill-content(@change="swiperChange", :current="swiperCount", :style="{height: scrollHeight+'rpx'}")
    swiper-item(v-for="(tabItem, swiperIdx) in billTab.length", :key="swiperIdx")
      template(v-if="isload")
        time-line(type="mallist")
      template(v-else)
        template(v-if="billTab[swiperIdx].data.length > 0")
          div(:style="{height: scrollHeight+'rpx'}")
            iron-scroll(:swiperIdx="swiperIdx", @scrolltolower="loadMore", heightUnit="rpx", :height="scrollHeight", :refresh="true", @onRefresh="onRefresh", :loadFinish="loadFinish")          
              .bill-list(v-for="(item, itemIdx) in billTab[swiperIdx].data", :key="itemIdx")
                .bg-white.box
                  .padding-sm
                    .flex.justify-between.padding-bottom-sm
                      .col
                        .flex.align-center
                          .ft-16.padding-right-sm {{item.bank_cust_name}}
                      .text-black ￥{{item.bank_money}}
                    .text-gray
                      .padding-bottom-xs 
                        span 流水号： {{item.bank_money_no}}                        
                      .padding-bottom-xs 
                        span 汇款银行：{{item.bank_name}}
                      .padding-bottom-xs 
                        span 汇款银行：{{item.bank_no}}  
                  .solid-top.text-black.ft-15.padding-sm.row
                    .col {{item.bank_date}}
                    .row
                      template(v-if="tabName === '0'")
                        //- .text-gray(v-if="item.match_status === 3") 不匹配
                        .bill-btn.round.margin-left-sm(v-if="item.match_status === 3", @click="delBankWater(item.id)") 删除
                        .bill-btn.round.margin-left-sm(v-else, @click.stop="jumpDetail(item, 'review')") 审核
                      .bill-btn.round.margin-left-sm(@click.stop="jumpDetail(item)", v-else) 详情
                      .bill-btn.round.margin-left-sm(v-if="tabName === '3'", @click.stop="jumpDetail(item, 'restore')") 恢复                      
                      //- .bill-btn.round.margin-left-sm(v-else, @click.stop="jumpDetail(item)") {{tabName === '0' ? '审核' : tabName === '1' ? '详情' : '恢复'}}
                      //- .text-gray(v-if="item.match_status === 3") 不匹配
                      //- .bill-btn.round.margin-left-sm(v-else, @click.stop="bankWaterHandler(item)") {{tabName === '0' ? '审核' : tabName === '1' ? '详情' : '恢复'}}
        .text-center.c-gray.pt-100(v-else)
          empty-image(url="bill_empty.png", className="img-empty")
  modal(v-model="modalShow", @cb="modalCb")
    .padding-sm {{modalMsg}}        
</template>
<script>
import { mapState, mapActions } from 'vuex'
import Modal from '@/components/Modal.vue'
export default {
  data () {
    return {
      modalShow: false,
      modalMsg: '',
      scrollId: 'idx_0',
      swiperCount: 0,
      openStatus: false,
      billTab: [
        { title: '收款审核', status: '0', data: [], isActive: true },
        { title: '收藏历史', status: '1', data: [], isActive: false },
        { title: '私对公', status: '2', data: [], isActive: false },
        { title: '已删除', status: '3', data: [], isActive: false }
      ],
      tabName: '0',
      currentPage: 0,
      listData: [],
      triggered: false,
      isload: false,
      isTabDisabled: false,
      btnDisable: false,
      scrollHeight: '0px',
      serverTime: '',
      loadFinish: 0,
      pageSize: 10,
      status: '',
      filterArr: [],
      filterObj: {},
      searchVal: '',
      statusList: [],
      delBankWaterId: ''
    }
  },
  components: {
    Modal
  },
  computed: {
    ...mapState({
      tempObject: state => state.tempObject
    })
  },
  onShow () {
    this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - 203
    if (this.tempObject.fromPage === 'bankWaterFilter') {
      this.tabName = '0'
      // this.filterArr = []
      this.filterObj = {
        date_end: this.tempObject.endDate,
        date_start: this.tempObject.startDate
      }
      this.searchVal = this.tempObject.custom.name
      // Object.keys(obj).forEach(key => {
      //   if (obj[key]) {
      //     this.filterArr.push(`${key}=${obj[key]}`)
      //   }
      // })
      this.currentPage = 0
      this.onRefresh()
    } else {
      this.onRefresh()
    }
  },
  onUnload () {
    this.tabName = '0'
    this.swiperCount = 0
  },
  methods: {
    ...mapActions(['configVal']),
    delBankWater (id) {
      this.delBankWaterId = id
      this.modalShow = true
      this.modalMsg = '是否确认删除？'
    },
    modalCb (flag) {
      if (flag === 'confirm') {
        this.bankWaterDelete()
      } else {
        this.modalShow = false
      }
    },
    async bankWaterDelete () {
      try {
        const bankWaterDelete = this.apiList.xy.bankWaterDelete
        const params = {
          id: this.delBankWaterId,
          user_id: this.currentUser.user_id
        }
        const data = await this.ironRequest(bankWaterDelete.url, params, bankWaterDelete.method)
        this.delBankWaterId = ''
        this.modalShow = false
        this.onRefresh()
        this.showMsg(data.errormsg)
      } catch (err) {
        this.modalShow = false
        this.showMsg(err)
      }
    },
    openFilter () {
      // const statusList = this.billTab[this.swiperCount].statusList
      // this.configVal({ key: 'tempObject', val: { statusList: statusList } })
      this.jump('/pages/vendor/bankWaterFilter/main')
    },
    onRefresh (done) {
      this.currentPage = 0
      this.isload = true
      this.refresher(done)
    },
    searchOrder () {
      this.listData = []
      this.isTabDisabled = true
      this.swiperCount = 0
      this.tabName = '0'
      this.billTab[0].data = []
      this.isload = true
      this.refresher()
    },
    swiperChange (e) {
      this.showLoading()
      const idx = e.mp.detail.current
      this.openStatus = false
      if (idx > 2) {
        this.scrollId = 'idx_' + (idx - 2)
      } else {
        this.scrollId = 'idx_0'
      }
      this.swiperCount = idx
      this.tabName = this.billTab[idx].status
      this.isTabDisabled = true
      this.onRefresh()
    },
    refresher (done) {
      this.loadFinish = 1
      const me = this
      const bankWater = this.apiList.xy.bankWater
      const params = {
        current_page: this.currentPage,
        page_size: this.pageSize,
        status: this.tabName
      }
      Object.assign(params, this.filterObj)
      if (this.searchVal) params.cust_name = this.searchVal
      this.ironRequest(bankWater.url, params, bankWater.method).then(resp => {
        const idx = me.swiperCount
        if (resp.returncode === '0') {
          let arr = resp.data.resultlist
          if (arr.length === 0 && me.currentPage === 0) {
            me.listData = []
            me.billTab[idx].data = []
            me.isload = false
          } else if (arr.length > 0 && me.currentPage === 0) {
            me.billTab[idx].data = arr
            me.isload = false
          } else if (arr.length > 0 && me.currentPage > 0) {
            me.billTab[idx].data.push(...arr)
            me.isload = false
          } else {
            me.isload = false
            me.currentPage--
            if (me.billTab[idx].data.length >= 10) me.loadFinish = 2
          }
        }
        me.isTabDisabled = false
        if (me.billTab[idx].data.length < 10) me.loadFinish = 2
        me.hideLoading()
        if (done) done()
      })
    },
    selectTabs (item, idx) {
      console.log('status', item.status)
      this.tabName = item.status
      this.swiperCount = idx
    },
    loadMore () {
      const me = this
      this.throttle(function () {
        me.currentPage++
        me.refresher()
      }, 300)
    },
    jumpDetail (item, flag) {
      let url = `/pages/vendor/bankWaterDetail/main?id=${item.id}`
      if (flag) {
        url += `&flag=${flag}`
      }
      this.jump(url)
    },
    bankWaterHandler (item) {
      // this.jump('/pages')
      // if (this.tabName === '0' || this.tabName === '3') {
      //   this.bankWater(item)
      // }
    },
    async bankWater (item) {
      try {
        let bankWaterUrl = this.apiList.xy.bankWaterRestore
        const params = {
          id: item.id,
          user_id: this.currentUser.user_id
        }
        if (this.tabName === '0') {
          params.cust_no = item.bank_no
          bankWaterUrl = this.apiList.xy.bankWaterAudit
        }
        const data = await this.ironRequest(bankWaterUrl.url, params, bankWaterUrl.method)
        console.log(data)
        // this.showMsg(data.)
        // if (data.returncode === '0') {

        // }
      } catch (err) {
        console.log(err)
        this.showMsg(err || '网络错误')
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.head
  // position fixed
  // left 0
  // right 0
  // z-index 99
  // height 98px
// .bill-box
.search-input
  background #F6F6F6
  padding 5px 10px
  border-radius 35px
.bill-list
  margin-bottom 10px
  margin-top 10px
  padding-left 10px
  padding-right 10px
  .box
    border-radius 5px
    overflow hidden
    .solid-top
      border-top 0.5px solid #eee
.bill-btn, .bill-red-btn, .bill-gray-btn
  padding 2px 8px
  text-align center
  font-size 13px
  color #0081ff
.bill-btn
  border 1px #0081ff solid
.bill-red-btn
  border 1px #e54d42 solid
  color #e54d42
.bill-gray-btn
  border 1px #DCDCDC solid
  color #888888
.bill-content
  height 100%
.filter-btn
  padding 10px 0 10px 10px
.search-btn
  padding 10px
.dingjin-icon
  width 35px
  height 20px
.tab-content
  overflow hidden
.tab-more
  width 50px
.status-box
  position absolute
  top 0
  left 0
  right 0
  background rgba(0, 0, 0, 0.5)
  z-index 999
  .status-item
    width 30%
    padding 10px
    border-radius 20px
    margin-bottom 10px
    border 1px solid #EEEEEE
</style>