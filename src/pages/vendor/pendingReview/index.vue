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
      // .filter-btn.row(@click="openFilter")
        // span 筛选
        // .cuIcon-filter
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
                  .col(style="width: 80%;")
                    .flex.align-center
                      .ft-16.pr-40.white-nowrap {{item.name}}
                  .text-red {{status[item.status]}}
                .text-gray
                  .padding-bottom-xs 单号：{{item.businessId}}
                    // .text-black(v-if="item.audit_type === 1") 截止时间：{{item.times}}
                    // .text-black(v-else) {{item.times}}
                  .padding-bottom-xs
                    span 操作人：{{item.userName}}
                  .padding-bottom-xs {{item.groupName}}
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
      status: {
        '0': '发起',
        '1': '审核中',
        '2': '审核通过',
        '3': '审核驳回',
        '4': '取消',
        '5': '弃审'
      },
      configId: '',
      listData: [],
      // listData: [
      //   {
      //     businessId: 'XSTH202105120007',
      //     businessUserId: '1351071855070539777',
      //     callbackUrl: 'http://zf-sale-server/saleReturn/workflow/callBack',
      //     code: '171',
      //     configId: 39,
      //     createTime: '2021-05-12 14:22:55',
      //     currentNodeCreateTime: '2021-05-12 14:22:55',
      //     currentNodeName: '发起审批',
      //     detailUrl: '/sale/saleReturn/edit?pageStatus=review&isAudit=1',
      //     groupBusinessId: 'D1346268726369980418',
      //     groupId: '15',
      //     groupName: '营销一部',
      //     id: '1320',
      //     name: '销售退货工作审核',
      //     processId: '7cbec307-b2ea-11eb-84b4-00163e218024',
      //     status: 0,
      //     tenantId: '1',
      //     userId: '59',
      //     userName: '何建龙'
      //   }
      // ],
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
        '4': 'ERP议价',
        '5': 'ERP销售定价'
      },
      statusList: {
        '5': '定向初审',
        '3': '定向复审',
        '6': '待初审',
        '7': '待复审'
      },
      filterArr: {}
    }
  },
  computed: {
    ...mapState({
      tempObject: state => state.tempObject
    })
  },
  // watch: {
  //   searchVal () {
  //     this.throttle(this.searchOrder, 300)
  //   }
  // },
  onUnload () {
    this.filterArr = []
    this.loadFinish = 0
    // this.listData = []
    this.searchVal = ''
    this.currentPage = 0
    this.configVal({ key: 'tempObject', val: {} })
  },
  onHide () {
    this.btnDisable = false
  },
  onLoad (options) {
    console.log(options.configId)
    this.configId = options.configId
    this.onRefresh()
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
      // this.isload = true
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
      // const me = this
      // let params = {
      //   user_id: this.currentUser.user_id,
      //   current_page: this.currentPage,
      //   page_size: this.pageSize
      // }
      // searchVal
      // const sellerNeedAudit = this.apiList.xy.sellerNeedAudit
      // let url = `${sellerNeedAudit.url}?user_id=${this.currentUser.user_id}&current_page=${this.currentPage}&page_size=${this.pageSize}`
      // if (this.filterArr) {
      //   params = Object.assign(params, this.filterArr)
      //   // const filterStr = this.filterArr.toString().replace(/,/g, '&')
      //   // url += `&${filterStr}`
      // }
      // if (this.searchVal) {
      //   params.search = this.searchVal
      //   // url += `&search=${this.searchVal}`
      // }

      // let testUserId = '1400343202594037762' // 员工 何建龙
      // let testUserId = '1346282719734140929' // 采购部长 于成龙

      let params = {
        configId: this.configId,
        limit: 100,
        offset: this.currentPage,
        tenantId: 1,
        businessId: this.searchVal || '',
        userId: this.currentUser.employeeId,
        status: [0, 1]
      }
      this.httpPost(this.apiList.zf.queryWorkflowProcessList, params).then(res => {
        console.log(res)
        let arr = res.data
        if (arr.length === 0 && this.currentPage === 0) {
          this.listData = []
          this.isload = false
        } else if (arr.length > 0 && this.currentPage === 0) {
          this.listData = arr
          this.isload = false
        } else if (arr.length > 0 && this.currentPage > 0) {
          this.listData.push(...arr)
          this.isload = false
        } else {
          this.isload = false
          this.currentPage--
          if (this.listData.length >= 10) this.loadFinish = 2
        }
        this.isTabDisabled = false
        if (this.listData.length < 10) this.loadFinish = 3
        this.hideLoading()
      }).catch(err => {
        console.log(err)
      })
      // this.ironRequest(sellerNeedAudit.url, params, sellerNeedAudit.method).then(resp => {
      //   if (resp.returncode === '0') {
      //     let arr = resp.resultlist
      //     if (arr.length === 0 && me.currentPage === 0) {
      //       me.listData = []
      //       me.isload = false
      //     } else if (arr.length > 0 && me.currentPage === 0) {
      //       me.listData = arr
      //       me.isload = false
      //     } else if (arr.length > 0 && me.currentPage > 0) {
      //       me.listData.push(...arr)
      //       me.isload = false
      //     } else {
      //       me.isload = false
      //       me.currentPage--
      //       if (me.listData.length >= 10) me.loadFinish = 2
      //     }
      //   }
      //   me.isTabDisabled = false
      //   if (me.listData.length < 10) me.loadFinish = 3
      //   me.hideLoading()
      //   if (done) done()
      // })
    },
    loadMore () {
      const me = this
      this.throttle(function () {
        me.currentPage++
        me.refresher()
      }, 300)
    },
    jumpDetail (item) {
      console.log('item++++', item)
      if (this.btnDisable) return false
      this.btnDisable = true
      // this.configVal({ key: 'tempObject', val: item })
      let auditTypeText = ''
      if (this.configId === '715') {
        auditTypeText = '退货'
        this.jump(`/pages/vendor/reviewDetailReturn/main?id=${item.id}&auditType=${auditTypeText}`)
      } else if (this.configId === '73') {
        auditTypeText = '延时'
        this.jump(`/pages/vendor/reviewDetailDelay/main?id=${item.id}&auditType=${auditTypeText}`)
      } else if (this.configId === '57') {
        auditTypeText = '定价'
        this.jump(`/pages/vendor/reviewDetailPrice/main?id=${item.id}&auditType=${auditTypeText}`)
      } else if (this.configId === '726') {
        auditTypeText = '议价'
        this.jump(`/pages/vendor/reviewDetailDiscuss/main?id=${item.id}&auditType=${auditTypeText}`)
      } else if (this.configId === '730') {
        auditTypeText = '低买'
        this.jump(`/pages/vendor/reviewDetailLower/main?id=${item.id}&auditType=${auditTypeText}`)
      } else if (this.configId === '716' || this.configId === '710') {
        auditTypeText = '修改'
        this.jump(`/pages/vendor/reviewDetailChange/main?id=${item.id}&auditType=${auditTypeText}`)
      } else {
        auditTypeText = '通用'
        this.jump(`/pages/vendor/reviewDetailCommon/main?id=${item.id}&auditType=${auditTypeText}`)
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
.pr-40
  padding-right 40rpx
.white-nowrap
  overflow hidden
  text-overflow ellipsis
  white-space nowrap
</style>
