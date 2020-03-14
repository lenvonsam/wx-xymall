<template lang="pug">
div
  nav-bar(title="合同延时", isBack)
  .head.bg-white(:style="{height: '115rpx'}")
    .serach.flex.align-center.padding-sm
      .col.search-input.text-gray
        .flex.align-center
          .cuIcon-search
          input.full-width.padding-left-sm(v-model="searchVal", type="text", placeholder="单号")
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
                      .ft-16.padding-right-sm {{item.tstc_no}}
                      img.ding-icon(src="/static/images/ding.png", v-if="item.contract_type === 12")
                      img.dingjin-icon(src="/static/images/dj_icon.png", v-if="item.pay_type === 2")
                  div(:class="item.att54 ? 'text-red' : 'text-gray'") {{statusList[item.att54]}}
                  //- .text-gray 1111{{item.att54}}
                .text-gray
                  .flex.justify-between.padding-bottom-xs 
                    span {{item.cust_name}}
                    .ft-18.text-black ￥{{item.deal_price}}
                  .flex.justify-between.padding-bottom-xs 
                    span 共{{item.amount}}支，{{item.weight}}吨
                    span 延时：{{item.delay_times}}
                .solid-top.text-black.ft-15.margin-top-xs.padding-top-sm.row(v-if="item.status === 15 || item.status === 14")
                  .col
                    span 付款倒计时：
                    span.padding-left-xs.text-black {{item.end_pay_time}}
                  .flex
                    .bill-btn.round.margin-left-sm(@click.stop="delayOpenModal(item)") {{item.att54 == 1 ? '再次延迟' : '延时'}} 
    .text-center.c-gray.pt-100(v-else)
      empty-image(url="bill_empty.png", className="img-empty")
      .empty-content 您暂时没有相关合同  
  modal-input(v-model="modalShow", title="合同延时", confirmText="确定", type="customize", :cb="modalHandler")
    .text-center
      template(v-if="!checkRow.att54")
        .padding-bottom-xs 15:00前最多可延时2小时
        .padding-bottom-xs 15:00后最多可延时19个小时 
      .padding-top-xs.padding-bottom-xs.row.cuIcon-box
        .cuIcon-item(@click="delayHandler('reduce')")
          .cuIcon-move
        input(type="number", v-model="delayDate", :min="0", :max="19")
        .cuIcon-item(@click="delayHandler('add')")
          .cuIcon-add
      template(v-if="checkRow.att54")
        .padding-sm
          .bg-gray.input-box
            input(placeholder="请填写延时备注（必填）", v-model="textVal")
</template>
<script>
import { mapState, mapActions } from 'vuex'
import modalInput from '@/components/ModalInput.vue'
export default {
  data () {
    return {
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
        '0': '未延时',
        '1': '已延迟'
      },
      filterArr: [],
      delayMax: 2,
      checkRow: {},
      textVal: ''
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
      let maxDelayDate = 2
      const delayDate = Number(this.delayDate)
      const minDate = new Date(this.date2Str(new Date()) + ' 15:00').getTime()
      const nowDate = new Date().getTime()
      if (nowDate > minDate) maxDelayDate = 19
      if (delayDate > maxDelayDate) {
        this.delayDate = maxDelayDate
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
  onShow () {
    if (this.tempObject.fromPage === 'billFilter') {
      this.filterArr = []
      const obj = {
        tstc_no: this.tempObject.no,
        cust_id: this.tempObject.custom.id,
        dept_code: this.tempObject.dept.id,
        employee_code: this.tempObject.employee.id,
        deal_time_s: this.tempObject.startDate,
        deal_time_e: this.tempObject.endDate
      }
      Object.keys(obj).forEach(key => {
        if (obj[key]) {
          this.filterArr.push(`${key}=${obj[key]}`)
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
    async orderDelay () {
      try {
        let orderDelay = ''
        let params = {
          id: this.checkRow.discussid,
          user_id: this.currentUser.user_id,
          hour: this.delayDate
        }
        if (this.checkRow.att54) {
          orderDelay = this.apiList.xy.orderDelayAgain
          if (!this.textVal) {
            this.showMsg('请输入延时备注')
            return false
          }
          params.text = this.textVal
          params.deal_no = this.checkRow.tstc_no
        } else {
          orderDelay = this.apiList.xy.orderDelay
        }
        const data = await this.ironRequest(orderDelay.url, params, orderDelay.method)
        if (data.returncode === '0') {
          this.onRefresh()
        }
      } catch (err) {
        this.showMsg(err || '网络错误')
      }
    },
    delayOpenModal (item) {
      this.checkRow = item
      this.modalShow = true
    },
    modalHandler ({ type }) {
      console.log('type', type)
      if (type === 'confirm') {
        this.orderDelay()
      }
    },
    delayHandler (flag) {
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
      const orderDelayList = this.apiList.xy.orderDelayList
      let url = `${orderDelayList.url}?user_id=${this.currentUser.user_id}&current_page=${this.currentPage}&page_size=${this.pageSize}&status=1&is_confirm=0`
      if (this.filterArr.length > 0) {
        const filterStr = this.filterArr.toString().replace(/,/g, '&')
        url += `&${filterStr}`
      }
      if (this.searchVal) {
        url += `&search=${this.searchVal}`
      }
      this.ironRequest(url, '', orderDelayList.method).then(resp => {
        if (resp.returncode === '0') {
          debugger
          let arr = resp.data.resultlist
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
        if (me.listData.length < 10) me.loadFinish = 2
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
      this.jump(`/pages/billDetail/main?id=${item.tstc_no}`)
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