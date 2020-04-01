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
                      .ft-16.padding-right-sm {{item.cust_name}}
                  div(:class="item.restrict ? 'text-red' : 'text-gray'") {{statusList[item.restrict]}}
                .text-gray
                  .padding-bottom-xs 余额：￥{{item.useablemoney_total}}
                  .padding-bottom-xs 可用：￥{{item.avlb_fund}}
                  .padding-bottom-xs.row.justify-between
                    .col 冻结：￥{{item.frz_fund}}
                    .round.margin-left-sm(:class="item.restrict ? 'bill-red-btn' : 'bill-btn'", @click.stop="openModal(item)") {{item.restrict ? '解除限制' : '限制提现'}} 
    .text-center.c-gray.pt-100(v-else)
      empty-image(url="bill_empty.png", className="img-empty")
  modal-input(v-model="modalShow", :title="modalTitle", confirmText="确定", type="customize", :cb="modalHandler")
    .text-center
      .padding-bottom-xs.ft-15 {{modalMsg}}
      .padding-bottom-xs.text-black.ft-16 {{checkRow.cust_name}}
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
      statusList: {
        '0': '未限制',
        '1': '已限制'
      },
      filterArr: [],
      filterObj: {},
      delayMax: 2,
      checkRow: {},
      textVal: '',
      hideZero: 'on'
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
    this.hideZero = 'on'
    this.searchVal = ''
    this.currentPage = 0
    this.configVal({ key: 'tempObject', val: {} })
  },
  onHide () {
    this.btnDisable = false
  },
  onShow () {
    if (this.tempObject.fromPage === 'balanceFilter') {
      this.filterObj = {
        buyer_id: Number(this.tempObject.custom.xyCode) || '',
        dept_code: this.tempObject.dept.id || ''
      }
      this.hideZero = this.tempObject.hideZero ? 'on' : ''
      this.currentPage = 0
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
      this.jump('/pages/account/balanceList/main?sellerId=' + item.cust_id)
    },
    async balanceRestrict (item) {
      try {
        const checkRow = item || this.checkRow
        let params = {
          id: checkRow.cust_id,
          user_id: this.currentUser.user_id,
          restrict: checkRow.restrict
        }
        const balanceRestrict = this.apiList.xy.balanceRestrict
        const data = await this.ironRequest(balanceRestrict.url, params, balanceRestrict.method)
        if (data.returncode === '0') {
          this.onRefresh()
        }
      } catch (err) {
        this.showMsg(err || '网络错误')
      }
    },
    openModal (item) {
      if (item.restrict) {
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
      this.currentPage = 0
      this.showLoading()
      this.refresher(done)
    },
    searchOrder () {
      this.listData = []
      this.isTabDisabled = true
      this.isload = true
      this.refresher()
    },
    refresher (done) {
      this.loadFinish = 1
      const me = this
      const sellerBalance = this.apiList.xy.sellerBalance
      // let url = `${sellerBalance.url}?hide_zero=${this.hideZero}&current_page=${this.currentPage}&page_size=${this.pageSize}`
      // if (this.filterArr.length > 0) {
      //   const filterStr = this.filterArr.toString().replace(/,/g, '&')
      //   url += `&${filterStr}`
      // }
      const params = {
        hide_zero: this.hideZero,
        current_page: this.currentPage,
        page_size: this.pageSize
      }
      Object.assign(params, this.filterObj)
      if (this.searchVal) {
        params.search = this.searchVal
      }
      this.ironRequest(sellerBalance.url, params, sellerBalance.method).then(resp => {
        if (resp.returncode === '0') {
          let arr = resp.list
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