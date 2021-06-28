<template lang="pug">
div
  nav-bar(title="用户余额", isBack)
  .head.bg-white(:style="{height: '115rpx'}")
    .serach.flex.align-center.padding-sm
      .col.search-input.text-gray
        .flex.align-center
          .cuIcon-search
          input.full-width.padding-left-sm(v-model="searchVal", type="text", placeholder="公司名称", confirm-type="search", @confirm="searchOrder")
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
        iron-scroll(@scrolltolower="loadMore", heightUnit="rpx", :height="scrollHeight", :refresh="true", @onRefresh="onRefresh", :loadFinish="loadFinish")
          .bill-list(v-for="(item, itemIdx) in listData", :key="itemIdx", @click="jumpDetail(item)")
            .bg-white.box
              .padding-sm
                .flex.justify-between.padding-bottom-sm
                  .col
                    .flex.align-center
                      .ft-16.padding-right-sm {{item.unitName}}
                  div(:class="item.limitFlag ? 'text-red' : 'text-gray'") {{item.limitFlag ? '已限制' : '未限制'}}
                .text-gray
                  .padding-bottom-xs 余额：￥{{item.balanceMoney}}
                  .padding-bottom-xs 可用：￥{{item.usedMoney}}
                  .padding-bottom-xs.row.justify-between
                    .col 冻结：￥{{item.withdrawingMoney ? item.withdrawingMoney: 0}}
                    .round.margin-left-sm(:class="item.limitFlag ? 'bill-red-btn' : 'bill-btn'", @click.stop="openModal(item)") {{item.limitFlag ? '解除限制' : '限制提现'}}
    .text-center.c-gray.pt-100(v-else)
      empty-image(url="bill_empty.png", className="img-empty")
  modal-input(v-model="modalShow", :title="modalTitle", confirmText="确定", type="customize", :cb="modalHandler")
    .text-center
      .padding-bottom-xs.ft-15 {{modalMsg}}
      .padding-bottom-xs.text-black.ft-16 {{checkRow.unitName}}
</template>
<script>
import { mapState, mapActions } from 'vuex'
import modalInput from '@/components/ModalInput.vue'
export default {
  data () {
    return {
      modalTitle: '解除限制提现',
      modalMsg: '是否确认解除限制提现',
      delayDate: 0,
      modalShow: false,
      currentPage: 1,
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
      filterArr: [],
      filterObj: {},
      delayMax: 2,
      checkRow: {},
      textVal: '',
      hideZero: true
    }
  },
  computed: {
    ...mapState({
      tempObject: state => state.tempObject
    })
  },
  components: {
    modalInput
  },
  watch: {
    delayDate () {
      const delayDate = Number(this.delayDate)
      if (delayDate > 19) {
        this.delayDate = 19
        return false
      } else if (delayDate < 0) {
        this.delayDate = 0
        return false
      }
      let delayDateStr = this.delayDate.toString()
      if (delayDateStr.length === 1) {
        delayDateStr = delayDateStr.replace(/[^1-9]/g, '')
      } else {
        delayDateStr = delayDateStr.replace(/\D/g, '')
      }
      this.delayDate = Number(delayDateStr)
    }
  },
  onUnload () {
    this.filterObj = {}
    this.hideZero = true
    this.searchVal = ''
    this.currentPage = 1
    this.configVal({ key: 'tempObject', val: {} })
  },
  onHide () {
    this.btnDisable = false
  },
  onShow () {
    console.log(this.tempObject)
    if (this.tempObject.fromPage === 'balanceFilter') {
      console.log(this.tempObject.custom.unitId)
      this.filterObj = {
        unitId: this.tempObject.custom.unitId || '',
        departmentId: this.tempObject.dept.code || '',
        hideZero: this.tempObject.hideZero
      }
      this.hideZero = this.tempObject.hideZero
      this.currentPage = 1
    }
    this.onRefresh()
    this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - 115
  },
  methods: {
    ...mapActions([
      'configVal'
    ]),
    jumpDetail (item) {
      if (this.btnDisable) return false
      this.btnDisable = true
      this.jump('/pages/vendor/balanceList/main?unitId=' + item.unitId)
    },
    async balanceRestrict (item) {
      const checkRow = item || this.checkRow
      if (this.modalTitle === '解除限制提现') {
        try {
          const data = await this.httpGet(this.apiList.zf.delRestrict, {unitId: checkRow.unitId})
          if (data.success) {
            this.onRefresh()
          }
        } catch (err) {
          this.showMsg(err.message || '网络错误')
        }
      } else {
        try {
          const data = await this.httpGet(this.apiList.zf.addRestrict, {unitId: checkRow.unitId})
          if (data.success) {
            this.onRefresh()
          }
        } catch (err) {
          this.showMsg(err.message || '网络错误')
        }
      }
    },
    openModal (item) {
      if (item.limitFlag) {
        this.modalTitle = '解除限制提现'
        this.modalMsg = '是否确认解除限制提现'
      } else {
        this.modalTitle = '限制提现'
        this.modalMsg = `是否确认限制提现`
        // this.modalMsg = `是否确认将客户[${item.cust_name}]设为限制提现`
      }
      this.checkRow = item
      this.modalShow = true
    },
    modalHandler ({ type }) {
      console.log('type', type)
      if (type === 'confirm') {
        this.balanceRestrict()
      }
    },
    openFilter () {
      const tempObject = {
        filter: [
          { label: '客户名称', prop: 'customName', type: 'custom' },
          { label: '业务部门', prop: 'deptName', type: 'dept' },
          { label: '业务部门', prop: 'hideZero' }
        ]
      }
      this.configVal({ key: 'tempObject', val: tempObject })
      this.jump('/pages/vendor/balanceFilter/main')
    },
    onRefresh (done) {
      this.currentPage = 1
      this.showLoading()
      this.refresher(done)
    },
    searchOrder () {
      this.listData = []
      this.isTabDisabled = true
      this.isload = true
      this.refresher()
    },
    // refresher (done) {
    //   this.loadFinish = 1
    //   const me = this
    //   // let url = `${sellerBalance.url}?hide_zero=${this.hideZero}&current_page=${this.currentPage}&page_size=${this.pageSize}`
    //   // if (this.filterArr.length > 0) {
    //   //   const filterStr = this.filterArr.toString().replace(/,/g, '&')
    //   //   url += `&${filterStr}`
    //   // }
    //   const params = {
    //     companyCode: "C00001",
    //     createDateS: "2020-10-04",
    //     createDateE: "2020-12-08",
    //     moneyType: "01"
    //   }

    //   Object.assign(params, this.filterObj)
    //   if (this.searchVal) {
    //     params.search = this.searchVal
    //   }
    //   this.ironRequest(this.apiList.zf.searchCustomerFunds, params).then(res => {
    //     if (res.success) {
    //       let arr = res.list
    //       if (arr.length === 0 && me.currentPage === 0) {
    //         me.listData = []
    //         me.isload = false
    //       } else if (arr.length > 0 && me.currentPage === 0) {
    //         me.listData = arr
    //         me.isload = false
    //       } else if (arr.length > 0 && me.currentPage > 0) {
    //         me.listData.push(...arr)
    //         me.isload = false
    //       } else {
    //         me.isload = false
    //         me.currentPage--
    //         if (me.listData.length >= 10) me.loadFinish = 2
    //       }
    //     }
    //     me.isTabDisabled = false
    //     if (me.listData.length < 10) me.loadFinish = 3
    //     me.hideLoading()
    //     if (done) done()
    //   })
    // },
    refresher (done) {
      this.loadFinish = 1
      // let url = `${sellerBalance.url}?hide_zero=${this.hideZero}&current_page=${this.currentPage}&page_size=${this.pageSize}`
      // if (this.filterArr.length > 0) {
      //   const filterStr = this.filterArr.toString().replace(/,/g, '&')
      //   url += `&${filterStr}`
      // }
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        unitId: '',
        departmentId: '',
        hiddenZero: false
      }
      Object.assign(params, this.filterObj)
      if (this.searchVal) {
        params.unitName = this.searchVal
      }
      this.httpPost(this.apiList.zf.selectUnitMoney, params).then(res => {
        console.log(res)
        if (res.success) {
          let arr = res.data
          if (arr.length === 0 && this.currentPage === 1) {
            this.listData = []
            this.isload = false
          } else if (arr.length > 0 && this.currentPage === 1) {
            this.listData = arr
            this.isload = false
          } else if (arr.length > 0 && this.currentPage > 1) {
            this.listData.push(...arr)
            this.isload = false
          } else {
            this.isload = false
            this.currentPage--
            if (this.listData.length >= 10) this.loadFinish = 2
          }
        }
        this.isTabDisabled = false
        if (this.listData.length < 10) this.loadFinish = 3
        this.hideLoading()
        if (done) done()
      })
    },
    loadMore () {
      const me = this
      this.throttle(function () {
        me.currentPage++
        me.refresher()
      }, 300)
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
.cuIcon-box
  width 160px
  margin 0 auto
.cuIcon-item
  border 1px #c9c9c9 solid
  color #c9c9c9
  font-weight bold
  font-size 18px
  text-align center
  width 45px
  height 35px
  line-height 35px
  border-radius 5px
.input-box
  border-radius 5px
  width 100%
  height 40px
  input
    height 40px
    width 100%
</style>
