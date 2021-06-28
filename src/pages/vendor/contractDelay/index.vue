<template lang="pug">
div
  nav-bar(title="合同延时", isBack)
  .head.bg-white(:style="{height: '115rpx'}")
    .serach.flex.align-center.padding-sm
      .col.search-input.text-gray
        .flex.align-center
          .cuIcon-search
          input.full-width.padding-left-sm(v-model="searchVal", type="text", placeholder="合同号/公司名称", confirm-type="search", @confirm="searchOrder")
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
                      .ft-16.padding-right-sm {{item.saleContractNo}}
                      img.ding-icon.margin-right-xs(src="/static/images/ding.png", v-if="item.sourceType == '01' && item.orgId == 'C00011'")
                      img.dingjin-icon.margin-right-xs(src="/static/images/dj_icon.png", v-if="item.payMethod == '03'")
                      img.dingjin-icon(src="/static/images/baitiao_icon.png", v-if="item.payMethod == '02'")
                  div(:class="item.contractDelayTimes > 0 ? 'text-red' : 'text-gray'") {{item.contractDelayTimes > 0 ? '已延时' : '未延时'}}
                .text-gray
                  .flex.justify-between.padding-bottom-xs
                    span {{item.buyUnitName}}
                    .ft-18.text-black ￥{{item.inTaxReceiveMoney}}
                  .flex.justify-between.padding-bottom-xs
                    span 共{{item.contractAmount}}支，{{item.contractManagerWeight}}吨
                    span 延时：{{item.contractDelayTimes}}
                .solid-top.text-black.ft-15.margin-top-xs.padding-top-sm.row
                  .col
                    span 付款截止时间：
                    span.padding-left-xs.text-black {{item.contractDelayDate}}
                  .flex
                    .bill-btn.round.margin-left-sm(@click.stop="delayOpenModal(item)") {{item.contractDelayTimes == 1 ? '再次延迟' : '延时'}}
    .text-center.c-gray.pt-100(v-else)
      empty-image(url="bill_empty.png", className="img-empty")
      .empty-content 您暂时没有相关合同
  modal-input(v-model="modalShow", title="合同延时", confirmText="确定", type="customize", :cb="modalHandler")
    .text-center
      template(v-if="!checkRow.contractDelayTimes")
        .padding-bottom-xs 15:00前最多可延时2小时
        .padding-bottom-xs 15:00后最多可延时19个小时
      .padding-top-xs.padding-bottom-xs.row.cuIcon-box
        .cuIcon-item(@click="delayHandler('reduce')")
          .cuIcon-move
        input(type="number", v-model="delayDate", @blur="delayBlur", @focus="delayFocus", :focus="false")
        .cuIcon-item(@click="delayHandler('add')")
          .cuIcon-add
      template(v-if="checkRow.contractDelayTimes")
        .padding-sm
          .bg-gray.input-box
            input(placeholder="请填写延时备注（必填）", v-model="textVal", maxlength="20")
</template>
<script>
import { mapState, mapActions } from 'vuex'
import modalInput from '@/components/ModalInput.vue'
export default {
  data () {
    return {
      delayDate: 1,
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
      statusList: {
        '0': '未延时',
        '1': '已延迟'
      },
      filterArr: [],
      filterObj: {},
      delayMax: 2,
      checkRow: {},
      textVal: '',
      delayInputFlag: ''
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
      this.delayDateChange()
    }
  },
  onUnload () {
    this.modalShow = false
    this.searchVal = ''
    this.currentPage = 1
    this.filterObj = {}
    this.delayDate = 1
    this.textVal = ''
    this.configVal({ key: 'tempObject', val: {} })
  },
  onHide () {
    this.delayDate = 1
    this.textVal = ''
    this.modalShow = false
    wx.hideKeyboard()
  },
  onShow () {
    if (this.tempObject.fromPage === 'billFilter') {
      console.log('tempObject+++', this.tempObject)
      this.filterObj = {
        saleContractNo: this.tempObject.no,
        createDateStart: this.tempObject.startDate, // 起始日期
        createDateEnd: this.tempObject.endDate, // 结束日期
        buyUnitId: this.tempObject.custom.id || '', // 客户名称(传id)
        businessDepartmentId: this.tempObject.dept.id || '', // 业务部门(传id)
        businessUserCode: this.tempObject.employee.id // 业务员(传code)
      }
      this.searchVal = this.tempObject.no
      this.currentPage = 1
    }
    this.onRefresh()
    this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - 115
  },
  methods: {
    ...mapActions([
      'configVal'
    ]),
    delayFocus () {
      this.delayInputFlag = 'focus'
    },
    delayBlur () {
      this.delayInputFlag = 'blur'
      this.delayDateChange()
    },
    delayDateChange () {
      if (this.delayInputFlag === 'focus') return false
      let maxDelayDate = 2
      const delayDate = Number(this.delayDate)
      const minDate = new Date(this.date2Str(new Date()) + ' 15:00').getTime()
      const nowDate = new Date().getTime()
      if (nowDate > minDate) maxDelayDate = 19
      if (this.checkRow.contractDelayTimes) maxDelayDate = 99
      if (delayDate > maxDelayDate) {
        this.delayDate = maxDelayDate
        return false
      } else if (delayDate < 1) {
        this.delayDate = 1
        return false
      }
      let delayDateStr = this.delayDate.toString()
      if (delayDateStr.length === 1) {
        delayDateStr = delayDateStr.replace(/[^1-9]/g, '')
      } else {
        delayDateStr = delayDateStr.replace(/\D/g, '')
      }
      this.delayDate = Number(delayDateStr)
    },
    async orderDelay () {
      try {
        let params = {
          saleContractId: this.checkRow.saleContractId,
          contractDelayTimes: this.checkRow.contractDelayTimes + 1,
          delayDay: this.delayDate,
          type: '02' // 01 天 02 小时
        }
        if (this.checkRow.contractDelayTimes) {
          if (!this.textVal) {
            this.showMsg('请输入延时备注')
            return false
          }
          params.delayReason = this.textVal
        }
        const data = await this.httpGet(this.apiList.zf.delaySaleContract, params)
        if (data.success) {
          this.showMsg('延时成功！')
          this.currentPage = 1
          this.refresher()
          this.delayDate = 1
          this.textVal = ''
        }
      } catch (err) {
        this.delayDate = 1
        this.textVal = ''
        this.showMsg(err.message)
      }
    },
    delayOpenModal (item) {
      this.checkRow = item
      this.modalShow = true
    },
    modalHandler ({ type }) {
      console.log('type', type)
      if (type === 'confirm') {
        this.delayBlur()
        this.orderDelay()
      } else {
        this.delayDate = ''
        this.textVal = ''
      }
    },
    delayHandler (flag) {
      this.delayInputFlag = flag
      switch (flag) {
        case 'reduce':
          if (this.delayDate > 0) {
            this.delayDate--
          }
          break
        case 'add':
          this.delayDate++
          break
      }
    },
    openFilter () {
      this.jump('/pages/vendor/billFilter/main')
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
    refresher (done) {
      this.loadFinish = 1
      const me = this
      // let url = `${orderDelayList.url}?user_id=${this.currentUser.user_id}&current_page=${this.currentPage}&page_size=${this.pageSize}&status=1&is_confirm=0`
      // if (this.filterArr.length > 0) {
      //   const filterStr = this.filterArr.toString().replace(/,/g, '&')
      //   url += `&${filterStr}`
      // }
      //  等待接口修改
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
      Object.assign(params, this.filterObj)
      if (this.searchVal) {
        // url += `&search=${this.searchVal}`
        params.keyword = this.searchVal
      }
      this.httpPost(this.apiList.zf.querySaleContractPage, params).then(res => {
        if (res.success) {
          let arr = res.data
          if (arr.length === 0 && me.currentPage === 1) {
            me.listData = []
            me.isload = false
          } else if (arr.length > 0 && me.currentPage === 1) {
            me.listData = arr
            me.isload = false
          } else if (arr.length > 0 && me.currentPage > 1) {
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
        me.delayDate = 1
        me.textVal = ''
        if (done) done()
      })
    },
    // refresher (done) {
    //   this.loadFinish = 1
    //   const me = this
    //   const orderDelayList = this.apiList.xy.orderDelayList
    //   // let url = `${orderDelayList.url}?user_id=${this.currentUser.user_id}&current_page=${this.currentPage}&page_size=${this.pageSize}&status=1&is_confirm=0`
    //   // if (this.filterArr.length > 0) {
    //   //   const filterStr = this.filterArr.toString().replace(/,/g, '&')
    //   //   url += `&${filterStr}`
    //   // }
    //   //  等待接口修改
    //   const params = {
    //     current_page: this.currentPage,
    //     page_size: this.pageSize,
    //     status: 1,
    //     is_confirm: 0
    //   }
    //   Object.assign(params, this.filterObj)
    //   if (this.searchVal) {
    //     // url += `&search=${this.searchVal}`
    //     params.search = this.searchVal
    //   }
    //   this.ironRequest(orderDelayList.url, params, orderDelayList.method).then(resp => {
    //     if (resp.returncode === '0') {
    //       let arr = resp.resultlist
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
    //     me.delayDate = 1
    //     me.textVal = ''
    //     if (done) done()
    //   })
    // },
    loadMore () {
      console.log('aaaa')
      const me = this
      this.throttle(function () {
        me.currentPage++
        me.refresher()
      }, 300)
    },
    jumpDetail (item) {
      this.jump(`/pages/billDetail/main?contractId=${item.saleContractId}`)
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
