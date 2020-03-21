<template lang="pug">
div
  nav-bar(title="退货申请", isBack)
  .bg-white(:style="{height: '205rpx'}")
    .serach.flex.align-center.padding-sm
      .col.search-input.text-gray
        .flex.align-center
          .cuIcon-search
          input.full-width.padding-left-sm(v-model="searchVal", type="text", placeholder="提单号/客户/业务员/业务部门", confirm-type="search", @confirm="onRefresh")
          .close-icon(@click="searchVal = ''", v-if="searchVal")
            .cuIcon-roundclosefill.ft-18
      .search-btn.text-blue(@click="onRefresh") 搜索
      .filter-btn.row(@click="openFilter")
        span 筛选
        .cuIcon-filter
    .flex.text-center.nav.bg-white.relative(style="height: 90rpx")
      .tab-line
      .cu-item.flex-sub(v-for="(item,index) in billTab", :class="item.status === tabName?'text-blue cur':''", :key="index", @click="selectTabs(item, index)")
        span {{item.title}}
  template(v-if="isload")
    time-line(type="mallist")  
  template(v-else) 
    template(v-if="listData.length > 0")
      iron-scroll(@scrolltolower="loadMore", :height="scrollHeight", heightUnit="rpx", :refresh="true", @onRefresh="onRefresh", :loadFinish="loadFinish")
        .bill-list(v-for="(item, itemIdx) in listData", :key="itemIdx")
          .bg-white.box
            .padding-sm
              .flex.justify-between.padding-bottom-sm
                .col
                  .ft-16.padding-right-sm.text-blue 
                    span {{item.lad_no}}
                    copy-btn(:copyUrl="item.lad_no")
                div(:class="item.status === 4 ? 'text-red' : 'text-black'") {{statusObj[item.status]}}
              div(@click="jump('/pages/ladbillConfirmDetail/main?no=' + item.lad_no)")  
                .text-black.padding-bottom-xs
                  span {{item.name}}
                .text-gray
                  .padding-bottom-xs 
                    span 共{{item.amount}}支，{{item.weight}}吨
                  .padding-bottom-xs
                    span 收货时间：
                    span.padding-left-xs {{item.receive_time}}
                  div(v-if="tabName === '-1'")
                    span 申请时间：
                    span.padding-left-xs {{item.applyer_date}}  
              .solid-top.text-black.ft-15.margin-top-xs.padding-top-sm.row.justify-end
                template(v-if="tabName === '-1'")
                  .bill-red-btn.round.margin-left-sm(@click.stop="application(item)", v-if="item.status === 4 || item.status === 5") 取消申请
                  .bill-btn.round.margin-left-sm(@click.stop="application(item, '申请')" v-if="item.status === 7") 申请
                  .bill-btn.round.margin-left-sm(@click.stop="application(item, '查看明细')", v-else) 查看明细                  
                template(v-else)  
                  .bill-btn.round.margin-left-sm(@click.stop="application(item, '申请')") 申请
    .text-center.c-gray.pt-100(v-else)
      empty-image(url="bill_empty.png", className="img-empty")      
</template>
<script>
import { mapState, mapActions } from 'vuex'
import copyBtn from '@/components/CopyBtn.vue'
export default {
  data () {
    return {
      billTab: [
        { title: '待申请', status: '0,2', data: [], isActive: true },
        { title: '申请历史', status: '-1', data: [], isActive: false }
      ],
      isTabDisabled: false,
      tabName: '0,2',
      currentPage: 0,
      listData: [],
      isload: false,
      scrollHeight: 0,
      loadFinish: 0,
      searchVal: '',
      statusObj: {
        '0': '待申请',
        '5': '待审核',
        '3': '财务驳回',
        '4': '待确认',
        '7': '客户取消'
      },
      filterObj: {},
      status: ''
    }
  },
  computed: {
    ...mapState({
      tempObject: state => state.tempObject
    })
  },
  components: {
    copyBtn
  },
  onUnload () {
    this.tabName = '0,2'
    this.currentPage = 0
    this.listData = []
    this.finished = true
    this.isload = false
    this.scrollHeight = 0
    this.filterObj = {}
    this.loadFinish = false
  },
  onShow () {
    if (this.tempObject.fromPage === 'returnApplicationFilter') {
      this.filterObj = {
        // subs_no: this.tempObject.no,
        cust_id: Number(this.tempObject.custom.xyCode) || '',
        dept_code: this.tempObject.dept.id || '',
        employee_code: this.tempObject.employee.id || ''
      }
      this.search = this.tempObject.no
      this.status = this.tempObject.status
      this.currentPage = 0
    }
    this.listData = []
    this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - 205
    if (this.$root.$mp.query.tabName) this.tabName = this.$root.$mp.query.tabName
    this.onRefresh()
  },
  methods: {
    ...mapActions(['configVal']),
    jumpDetail (item) {
      this.jump(`/pages/vendor/quotationDetail/main?id=${item.id}`)
    },
    onRefresh (done) {
      this.currentPage = 0
      this.loadData(done)
    },
    selectTabs (item) {
      this.tabName = item.status
      this.listData = []
      this.isTabDisabled = true
      this.onRefresh()
    },
    loadData (done) {
      this.loadFinish = 1
      if (this.currentPage === 0) {
        this.isload = true
      } else {
        this.isload = false
      }
      const returnGoodsList = this.apiList.xy.returnGoodsList
      const params = {
        current_page: this.currentPage,
        page_size: this.pageSize
      }
      Object.assign(params, this.filterObj)
      if (this.tabName === '-1' && this.status) {
        params.status = this.status
      } else {
        params.status = this.tabName
      }
      if (this.searchVal) {
        params.search = this.searchVal
      }

      const me = this
      this.ironRequest(returnGoodsList.url, params, returnGoodsList.method).then(resp => {
        if (resp && resp.returncode === '0') {
          let arr = resp.list
          if (arr.length === 0 && me.currentPage === 0) {
            me.listData = []
            me.isload = false
          } else if (arr.length > 0 && me.currentPage === 0) {
            me.listData = arr
            me.isload = false
          } else if (arr.length > 0 && me.currentPage > 0) {
            arr.map(item => {
              me.listData.push(item)
            })
          } else {
            if (me.listData.length >= 10) me.loadFinish = 2
            me.currentPage--
          }
        }
        this.isTabDisabled = false
        if (this.listData.length < 10) this.loadFinish = 0
      })
      if (typeof (done) === 'function') done()
    },
    loadMore () {
      const me = this
      this.throttle(function () {
        me.currentPage++
        this.isTabDisabled = true
        me.loadData()
      }, 300)
    },
    openFilter () {
      if (this.tabName === '-1') {
        const statusList = [
          { label: '全部', value: '-1' },
          { label: '完成', value: '26' },
          { label: '财务驳回', value: '3' },
          { label: '待确认', value: '4' },
          { label: '待退款', value: '5' },
          { label: '已取消', value: '7' }
        ]
        this.configVal({ key: 'tempObject', val: { statusList: statusList } })
      }
      this.jump('/pages/vendor/returnApplicationFilter/main?tabName=' + this.tabName)
    },
    async application (item, flag) {
      try {
        if (flag === '申请') {
          this.jump(`/pages/vendor/returnApplication/main?subsNo=${item.lad_no}&status=${item.status}&id=${item.id}`)
          return false
        } else if (flag === '查看明细') {
          // this.jump('/pages/ladbillConfirmDetail/main?no=' + item.lad_no)
          this.jump(`/pages/vendor/returnApplicationDetail/main?subsNo=${item.lad_no}&status=${item.status}`)
          return false
        }
        const returnGoodsCancel = this.apiList.xy.returnGoodsCancel
        const params = {
          uesr_id: this.currentUser.uesr_id,
          return_id: item.id,
          tostatus: 7
        }
        const data = await this.ironRequest(returnGoodsCancel.url, params, returnGoodsCancel.method)
        this.showMsg(data.errormsg)
        this.onRefresh()
        console.log(data)
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
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
    z-index 99
    bottom 0
    left 50%
    margin-left -13px
.search-input
  background #F6F6F6
  padding 5px 10px
  border-radius 35px
.search-btn
  padding 10px
</style>