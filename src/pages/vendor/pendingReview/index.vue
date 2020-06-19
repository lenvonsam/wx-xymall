<template lang="pug">
div
  nav-bar(title="待审核", isBack)
  .head.bg-white(:style="{height: '115rpx'}")
    .serach.flex.align-center.padding-sm
      .col.search-input.text-gray
        .flex.align-center
          .cuIcon-search
          input.full-width.padding-left-sm(v-model="searchVal", type="text", placeholder="单号", confirm-type="search", @confirm="searchOrder")
          .close-icon(@click="searchVal = ''", v-if="searchVal")
            .cuIcon-roundclosefill.ft-18
      .search-btn.text-blue(@click="searchOrder") 搜索
      .filter-btn.row(@click="openFilter")
        span 筛选
        .cuIcon-filter
  template(v-if="isload")
    time-line(type="mallist")
  template(v-else)
    template(v-if="listData.length > 0")
      div(:style="{height: scrollHeight+'rpx'}")
        iron-scroll(:swiperIdx="swiperIdx", @scrolltolower="loadMore", heightUnit="rpx", :height="scrollHeight", :refresh="true", @onRefresh="onRefresh", :loadFinish="loadFinish")          
          .bill-list(v-for="(item, itemIdx) in listData", :key="itemIdx", @click="jumpDetail(item)")
            .bg-white.box
              .padding-sm
                .flex.justify-between.padding-bottom-sm
                  .col
                    .flex.align-center
                      .ft-16.padding-right-sm {{auditType[item.audit_type]}} - {{item.tstc_no}}
                  .text-red {{item.audit_type === 3 ? '待退款' : statusList[item.status] && item.audit_type === 1 ? statusList[item.status] : '待审核'}}
                .text-gray
                  .flex.justify-between.padding-bottom-xs 
                    span {{item.oper_name}}
                    .text-black(v-if="item.audit_type === 1") 截止时间：{{item.times}}
                    .text-black(v-else) {{item.times}}
                  .padding-bottom-xs {{item.emp_name}}
                  .padding-bottom-xs(v-if="item.reason") 延时理由：{{item.reason}}
    .text-center.c-gray.pt-100(v-else)
      empty-image(url="bill_empty.png", className="img-empty")
      .empty-content 您暂时没有相关合同        
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      currentPage: 0,
      listData: [],
      isload: false,
      searchVal: '',
      isTabDisabled: false,
      btnDisable: false,
      scrollHeight: '0px',
      loadFinish: 0,
      pageSize: 10,
      auditType: {
        '1': '定向',
        '2': '延时',
        '3': '退货',
        '4': 'erp议价'
      },
      statusList: {
        '5': '定向初审',
        '3': '定向复审',
        '6': 'erp议价初审',
        '7': 'erp议价复审'
      },
      filterArr: {}
    }
  },
  computed: {
    ...mapState({
      tempObject: state => state.tempObject
    })
  },
  onUnload () {
    this.filterArr = []
    this.loadFinish = 0
    this.listData = []
    this.searchVal = ''
    this.currentPage = 0
    this.configVal({ key: 'tempObject', val: {} })
  },
  onHide () {
    this.btnDisable = false
  },
  onShow () {
    this.btnDisable = false
    if (this.tempObject.fromPage === 'billFilter') {
      this.filterArr = {}
      const obj = {
        // tstc_no: this.tempObject.no,
        // cust_id: this.tempObject.custom.xyCode,
        // dept_code: this.tempObject.dept.id,
        // employee_code: this.tempObject.employee.id,
        cust_name: this.tempObject.custom.name,
        dept_name: this.tempObject.dept.name,
        employee_name: this.tempObject.employee.name,
        deal_time_s: this.tempObject.startDate,
        deal_time_e: this.tempObject.endDate,
        audit_type: this.tempObject.status
      }
      if (this.tempObject.no) this.searchVal = this.tempObject.no
      Object.keys(obj).forEach(key => {
        if (obj[key]) {
          this.filterArr[key] = obj[key]
          // this.filterArr.push(`${key}=${obj[key]}`)
        }
      })
      this.currentPage = 0
    }
    this.onRefresh()
    this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - 115
  },
  methods: {
    ...mapActions([
      'configVal'
    ]),
    openFilter () {
      const statusList = [{ label: '全部', value: '' }]
      Object.keys(this.auditType).forEach(key => {
        const obj = { label: this.auditType[key], value: key }
        statusList.push(obj)
      })
      const tempObject = this.tempObject
      tempObject.fromPage = 'pendingReview'
      tempObject.statusList = statusList
      this.configVal({ key: 'tempObject', val: tempObject })
      this.jump('/pages/vendor/billFilter/main')
    },
    onRefresh (done) {
      this.currentPage = 0
      this.isload = true
      this.refresher(done)
    },
    searchOrder () {
      const reg = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi
      if (reg.test(this.searchVal)) {
        this.showMsg('请输入单号')
        return false
      }
      this.listData = []
      this.isTabDisabled = true
      this.isload = true
      this.refresher()
    },
    refresher (done) {
      this.loadFinish = 1
      const me = this
      let params = {
        user_id: this.currentUser.user_id,
        current_page: this.currentPage,
        page_size: this.pageSize
      }
      // searchVal
      const sellerNeedAudit = this.apiList.xy.sellerNeedAudit
      // let url = `${sellerNeedAudit.url}?user_id=${this.currentUser.user_id}&current_page=${this.currentPage}&page_size=${this.pageSize}`
      if (this.filterArr) {
        params = Object.assign(params, this.filterArr)
        // const filterStr = this.filterArr.toString().replace(/,/g, '&')
        // url += `&${filterStr}`
      }
      if (this.searchVal) {
        params.search = this.searchVal
        // url += `&search=${this.searchVal}`
      }
      this.ironRequest(sellerNeedAudit.url, params, sellerNeedAudit.method).then(resp => {
        if (resp.returncode === '0') {
          let arr = resp.resultlist
          if (arr.length === 0 && me.currentPage === 0) {
            me.listData = []
            me.isload = false
          } else if (arr.length > 0 && me.currentPage === 0) {
            me.listData = arr
            me.isload = false
          } else if (arr.length > 0 && me.currentPage > 0) {
            me.listData.push(...arr)
            me.isload = false
          } else {
            me.isload = false
            me.currentPage--
            if (me.listData.length >= 10) me.loadFinish = 2
          }
        }
        me.isTabDisabled = false
        if (me.listData.length < 10) me.loadFinish = 3
        me.hideLoading()
        if (done) done()
      })
    },
    loadMore () {
      const me = this
      this.throttle(function () {
        me.currentPage++
        me.refresher()
      }, 300)
    },
    jumpDetail (item) {
      if (this.btnDisable) return false
      this.btnDisable = true
      item.auditType = this.auditType[item.audit_type]
      item.statusStr = this.statusList[item.status] || '待审核'
      // this.configVal({ key: 'tempObject', val: item })
      if (item.auditType) {
        this.jump(`/pages/vendor/reviewDetail/main?auditType=${item.auditType}&statusStr=${item.statusStr}&tstc_no=${item.tstc_no}&return_id=${item.return_id}`)
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
</style>