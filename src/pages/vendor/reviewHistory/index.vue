<template lang="pug">
div
  nav-bar(title="审核历史", isBack)
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
                  .col
                    .flex.align-center
                      .ft-16.padding-right-sm {{item.name}} - {{item.businessId}}
                  .text-gray {{status[item.status]}}
                .text-gray
                  .flex.justify-between.padding-bottom-xs
                    span 操作人： {{item.userName}}
                    // .text-black {{item.audit_time}}
                  .padding-bottom-xs {{item.groupName}}
                  .padding-bottom-xs(v-if="item.delay_text") 延时理由：{{item.delay_text}}
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
      triggered: false,
      isload: false,
      startDate: '',
      endDate: '',
      searchVal: '',
      isTabDisabled: false,
      btnDisable: false,
      scrollHeight: '0px',
      loadFinish: 0,
      pageSize: 10,
      status: {
        '0': '发起',
        '1': '审核中',
        '2': '审核通过',
        '3': '审核驳回',
        '4': '取消',
        '5': '弃审'
      },
      auditType: {
        '1': '定向',
        '2': '延时',
        '3': '退货',
        '4': 'ERP议价',
        '5': 'ERP销售定价'
      },
      statusList: {
        '0': '已拒绝',
        '1': '已审核'
      },
      dxStatusList: {
        '2': '已初审',
        '3': '已复审',
        '1': '初审拒绝'
        // '2': '复审拒绝'
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
  onLoad (options) {
    console.log(options.configId)
    // this.onRefresh()
  },
  onShow () {
    if (this.tempObject.fromPage === 'billFilter') {
      this.filterArr = {}
      const obj = {
        // tstc_no: this.tempObject.no,
        // cust_id: Number(this.tempObject.custom.xyCode) || '',
        // dept_code: this.tempObject.dept.id || '',
        // employee_code: this.tempObject.employee.id || '',
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
      try {
        this.loadFinish = 1
        // const me = this
        // let params = {
        //   user_id: this.currentUser.user_id,
        //   current_page: this.currentPage,
        //   page_size: this.pageSize
        // }
        // // const auditHistory = this.apiList.xy.auditHistory
        // // let url = `${auditHistory.url}?user_id=${this.currentUser.user_id}&current_page=${this.currentPage}&page_size=${this.pageSize}`
        // if (this.filterArr) {
        //   params = Object.assign(params, this.filterArr)
        //   // const filterStr = this.filterArr.toString().replace(/,/g, '&')
        //   // url += `&${filterStr}`
        // }

        // let testUserId = '1346277615056457730' // 员工 何建龙
        let testUserId = '1346282719734140929' // 采购部长 于成龙

        let params = {
          configId: '39',
          limit: 20,
          offset: 0,
          tenantId: 1,
          businessId: this.searchVal || '',
          userId: testUserId,
          disposeUserId: testUserId,
          status: [1, 2, 3, 4, 5]
        }
        console.log('+++++', params)
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

        // this.ironRequest(auditHistory.url, params, auditHistory.method).then(resp => {
        //   if (resp.returncode === '0') {
        //     let arr = resp.resultlist
        //     arr.map(item => {
        //       if (item.audit_type === 1 || item.audit_type === 4) {
        //         if (item.status === 1 && item.audit_num === 1) {
        //           item.statusStr = '已初审'
        //         } else if (item.status === 1 && item.audit_num === 2) {
        //           item.statusStr = '已复审'
        //         } else if (item.status === 0 && item.audit_num === 1) {
        //           item.statusStr = '初审拒绝'
        //         } else if (item.status === 0 && item.audit_num === 2) {
        //           item.statusStr = '复审拒绝'
        //         }
        //       } else {
        //         item.statusStr = this.statusList[item.status]
        //       }
        //     })
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
      } catch (err) {
        console.log('err', err)
        this.isload = false
        this.showMsg(err)
      }
    },
    loadMore () {
      const me = this
      this.throttle(function () {
        me.currentPage++
        me.refresher()
      }, 300)
    },
    jumpDetail (item) {
      if (item.tstc_no.indexOf('DD') !== -1) {
        this.jump(`/pages/billDetail/main?id=${item.tstc_no}`)
        return false
      }
      if (item.audit_type === 3) {
        this.jump(`/pages/vendor/returnApplicationDetail/main?subsNo=${item.tstc_no}`)
        return false
      }
      if (item.audit_type === 4) {
        this.jump(`/pages/vendor/reviewDetail/main?auditType=ERP议价&statusStr=${item.statusStr}&tstc_no=${item.tstc_no}&return_id=${item.tstc_no}&fromPage=reviewHistory`)
        return false
      }
      if (item.audit_type === 5) {
        this.jump(`/pages/vendor/reviewDetail/main?auditType=ERP销售定价&statusStr=${item.statusStr}&tstc_no=${item.tstc_no}&fromPage=reviewHistory&time=${item.audit_time}&partsname_name=${item.tstc_no}&oper_name=${item.emp_name}`)
        return false
      }
      // item.auditType = this.auditType[item.audit_type]
      // item.statusStr = this.statusList[item.status] || '待审核'
      // item.fromPage = 'reviewHistory'
      // item.return_id = item.discussid
      // this.configVal({ key: 'tempObject', val: item })
      // this.jump(`/pages/vendor/reviewDetail/main`)
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
