<template lang="pug">
div
  nav-bar(title="我的发票", isBack)
  scroll-view.nav.bg-white(scroll-x, style="height: 96rpx")
    .flex.text-center
      .cu-item.flex-sub(v-for="(item,index) in tabList", :class="item.status === tabName ? 'text-blue cur':''", :key="index", @click="selectTabs(item, index)")
        span {{item.title}}
  swiper.bill-content(@change="swiperChange", :current="swiperCount", :style="{height: pageHeight}")
    swiper-item(v-for="(tabItem, tabIdx) in tabList.length", :key="tabIdx")
      template(v-if="isload")
        time-line(type="mallist")
      template(v-else)
        template(v-if="listData.length > 0")
          scroll-view(scroll-y, @scrolltolower="loadMore", :style="{height: pageHeight}")
            .pt-half-rem(v-for="(item,idx) in listData", :key="idx", :class="{'pb-half-rem': (idx == listData.length - 1)}")
              .bg-white
                .flex.padding(@click="chooseSameInvoiceNo(item)")
                  //- .col.flex-25.flex.flex-center(v-if="tabName == '0' || tabName == '2'")
                  .row.col
                    .col.flex-25.flex.flex-center(v-if="tabName == '0' || tabName == '2'")
                      img.choose-icon(src="/static/images/blue_check.png", v-if="item.checked")
                      img.choose-icon(src="/static/images/btn_ck_n.png", v-else)
                    .col.ft-14(:class="{'pl-5': tabName == '0' || tabName == '2'}")
                      .pb-half-rem.c-gray.ft-14 {{item.sourceBusiBillNo}}
                      .pb-half-rem {{item.title}}
                      .text-gray
                        span 重量：
                        span.ml-5 {{item.settlementWeight}}吨
                        span.ml-5 数量：
                        span.ml-5 {{item.settlementAmount}}支
                  .text-right.flex.flex-direction.align-end(:class="tabName !== '3' ? 'justify-between' : 'justify-center'")
                    .text-blue.ft-18 ￥{{item.settleTotalMoney}}
                    .invoice-detail-btn.margin-top-sm(v-if="tabName != '0' && item.settleTotalMoney > 0", @click.stop="jumpDetail(item)") 查看详情
                    .text-gray(v-if="tabName !== '3'") 吊费：￥{{item.hangingFeeMoney || 0}}
            .padding.text-gray.ft-13.text-center(v-if="loading") 努力加载中...
            .padding.text-gray.ft-13.text-center(v-if="finished") 加载完成
        .text-center.c-gray.pt-100(v-else)
          empty-image(url="bill_empty.png", className="img-empty")
          .empty-content 您暂时没有相关发票
  .s-footer(v-if="tabName == '0' || tabName == '2'", :style="{height: isIpx ? '168rpx' : '100rpx', 'padding-bottom': isIpx ? '68rpx' : 0}")
    .invoice-footer.align-center.justify-between
      .flex
        .flex-25.flex.flex-center(@click="allCheckHandler")
          img.choose-icon(src="/static/images/blue_check.png", v-if="allChecked")
          img.choose-icon(src="/static/images/btn_ck_n.png", v-else)
        .flex-40.ml-5(@click="allCheckHandler") 全选
      div(style="box-sizing: border-box; padding-right: .3rem;")
          span 合计：
          span.text-red ￥ {{totalPriceAll}}
      //- .col.apply.flex-100.flex.flex-center(@click="invoiceAction") {{tabName == '0' ? '批量申请' : '批量确认'}}
      .main-btn.margin-right-sm(@click="invoiceAction") {{tabName == '0' ? '批量申请' : '批量确认'}}
  //- alert(:title="alertTitle", :cb="alertCb", v-model="alertShow" )
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      // alertTitle: '',
      // alertShow: false,
      swiperCount: 0,
      tabName: '0',
      tabList: [
        { title: '申请发票', status: '0', data: [], isActive: true },
        { title: '待开发票', status: '1', data: [], isActive: false },
        { title: '发票确认', status: '2', data: [], isActive: false },
        { title: '已收发票', status: '3', data: [], isActive: false }
      ],
      listData: [],
      totalWeight: 0,
      totalPriceAll: 0,
      allChecked: false,
      isload: false,
      finished: false,
      currentPage: 1,
      queryObject: {},
      pageHeight: 0,
      isTabDisabled: false,
      disabledBtn: false,
      queryObj: {
        pageNum: 1,
        pageSize: 10
      },
      postUrl: ''
    }
  },
  computed: {
    ...mapState({
      isIpx: state => state.isIpx,
      custom: state => state.custom,
      tempObject: state => state.tempObject
    })
  },
  watch: {
    listData: {
      handler (newVal, oldVal) {
        if (this.tabName === '0' || this.tabName === '2') {
          let filterArray = newVal.filter(item => item.checked === true)
          this.totalPriceAll = 0
          filterArray.map(fltem => {
            this.totalPriceAll += fltem.settleTotalMoney
          })
          this.allChecked = filterArray.length === newVal.length
          this.totalPriceAll = this.$toFixed(Number(this.totalPriceAll), 2)
        }
      },
      deep: true
    }
    // allChecked (newVal, oldVal) {
    //   if (newVal) {
    //     this.listData.map(itm => {
    //       itm.checked = true
    //     })
    //   }else {
    //     this.listData.map(itm => {
    //       itm.checked = false
    //     })
    //   }
    // }
  },
  onUnload () {
    console.log('onUnload')
    this.listData = []
    this.swiperCount = 0
    this.tabName = '0'
    this.disabledBtn = false
    this.configVal({ key: 'tempObject', val: '' })
  },
  onShow () {
    // this.listData = []
    this.disabledBtn = false
    // if (this.tempObject.tabName) {
    //   this.tabName = this.tempObject.tabName
    //   // this.swiperCount = this.tabName
    // } else if (this.$root.$mp.query.tabName) {
    //   this.tabName = this.$root.$mp.query.tabName
    //   // this.swiperCount = this.tabName
    // }
    const isPhoneHeight = this.isIpx ? 68 : 0
    if (this.tabName === '1' || this.tabName === '3') {
      this.pageHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - 98 - isPhoneHeight + 'rpx'
    } else {
      this.currentPage = 1
      this.queryObject = {
        current_page: this.currentPage,
        page_size: this.pageSize
      }
      this.loadData()
      this.pageHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - 198 - isPhoneHeight + 'rpx'
    }
    if (this.listData.length === 0) {
      this.currentPage = 1
      this.queryObject = {
        current_page: this.currentPage,
        page_size: this.pageSize
      }
      this.loadData()
    }
  },
  onLoad () {
    this.postUrl = this.apiList.zf.invoiceUnApply
  },
  methods: {
    ...mapActions([
      'configVal'
    ]),
    // 点击全选
    allCheckHandler () {
      this.allChecked = !this.allChecked
      if (this.allChecked) {
        this.listData.map(itm => {
          itm.checked = true
        })
      } else {
        this.listData.map(itm => {
          itm.checked = false
        })
      }
    },
    refresher () {
      const self = this
      this.currentPage = 1
      this.queryObject = {
        current_page: this.currentPage,
        user_id: this.currentUser.user_id,
        status: this.tabName
      }
      this.finished = true
      this.isLoad = true
      this.ironRequest('invoiceList.shtml', this.queryObject, 'post').then(resp => {
        if (resp && resp.returncode === '0') {
          if (resp.invoices.length > 0 && self.currentPage === 1) {
            this.listData = []
            resp.invoices.map(itm => {
              let temp = itm
              temp.checked = false
              this.listData.push(temp)
            })
            self.isLoad = false
            self.finished = false
          } else if (resp.invoices.length === 0 && self.currentPage === 1) {
            self.listData = []
            self.finished = true
            self.isLoad = false
          }
        } else {
          self.showMsg(resp === undefined ? '网络异常' : resp.errormsg)
        }
      })
    },
    // 上拉加载
    loadMore () {
      if (!this.isLoad) {
        this.currentPage++
        this.queryObject.current_page = this.currentPage
        this.queryObj.pageNum = this.currentPage
        this.loadData()
      }
    },
    // 选择/不选择
    chooseSameInvoiceNo (item) {
      item.checked = !item.checked
      this.listData.map(itm => {
        if (itm.sourceBusiBillNo === item.sourceBusiBillNo) itm.checked = item.checked
      })
      this.$forceUpdate()
    },
    // selectTabs (name) {
    //   this.tabName = name
    //   this.currentPage = 0
    //   this.isload = false
    //   this.finished = false
    //   this.listData = []
    //   this.allChecked = false
    //   this.pageHeight = window.innerHeight - 148
    //   this.isTabDisabled = true
    //   if (name === '1' || name === '3') {
    //     this.pageHeight = window.innerHeight - 98
    //   }
    //   this.queryObject = {
    //     current_page: this.currentPage,
    //     user_id: this.currentUser.user_id,
    //     page_size: this.pageSize
    //   }
    //   this.loadData()
    // },

    // 点击查看详情
    jumpDetail (obj) {
      // this.configVal({key: 'tempObject', val: obj})
      // this.jump({path: '/invoice/detail', query: {id: this.tabName}})
      // 合同编号
      let ids = obj.sourceBusiBillNo
      // 发票确认编码
      let sus = [obj.arInvocieId]
      sus = JSON.stringify(sus)
      // this.ironRequest('invoiceDetail.shtml?id=' + obj.id, {}, 'get').then(resp => {
      //   if (resp.returncode === '0') {
      //     resp.tabName = this.tabName
      //     this.configVal({ key: 'tempObject', val: resp })
      //     this.jump(`/pages/invoiceDetail/main?id=${this.tabName}&name=查看详情`)
      //   } else {
      //     this.showMsg('查看失败')
      //     this.disabledBtn = false
      //   }
      // }).catch(e => {
      //   this.disabledBtn = false
      //   this.showMsg('查看失败')
      // })
      // 获取发票信息
      if (this.tabName === '0') {
        this.httpPost(this.apiList.zf.invoiceUnApplyDetail, ids.split(',')).then(res => {
          console.log(res)
          this.configVal({ key: 'tempObject', val: res.data })
          // this.showObj = res.data
        })
      } else {
        this.httpGet(this.apiList.zf.customerAppliedDetail + '?sourceBusiBillNo=' + ids).then(res => {
          console.log(res)
          this.configVal({ key: 'tempObject', val: res.data })
          // this.showObj = res.data
        })
      }
      if (this.tabName !== '0') {
        this.jump('/pages/invoiceDetail/main?tabName=' + this.tabName + '&ids=' + ids + '&sus=' + sus + '&name=查看详情')
      }
    },
    // 批量申请/批量确认
    invoiceAction () {
      if (this.disabledBtn) return false
      let filterArray = this.listData.filter(item => item.checked === true)
      const self = this
      this.disabledBtn = true
      if (filterArray.length > 0) {
        // 合同编号
        let ids = filterArray.map(item => item.sourceBusiBillNo).join(',')
        // 申请发票编号
        let sds = filterArray.map(item => {
          return {
            settlementUnitId: item.settlementUnitId,
            sourceBusiBillNo: item.sourceBusiBillNo
          }
        })
        // 发票确认编码
        let sus = filterArray.map(item => {
          return item.arInvocieId
        })
        sds = JSON.stringify(sds)
        sus = JSON.stringify(sus)
        let obj = {
          tabName: this.tabName
        }
        self.configVal({ key: 'tempObject', val: obj })
        // 获取发票信息
        if (this.tabName === '0') {
          this.httpPost(this.apiList.zf.invoiceUnApplyDetail, ids.split(',')).then(res => {
            console.log(res)
            this.configVal({ key: 'tempObject', val: res.data })
            // this.showObj = res.data
            this.jump('/pages/invoiceDetail/main?tabName=' + this.tabName + '&ids=' + ids + '&sds=' + sds + '&sus=' + sus)
          })
        } else {
          this.httpGet(this.apiList.zf.customerAppliedDetail + '?sourceBusiBillNo=' + ids).then(res => {
            console.log(res)
            this.configVal({ key: 'tempObject', val: res.data })
            if (this.tabName === '2') {
              this.jump('/pages/invoiceDetail/main?tabName=' + this.tabName + '&ids=' + ids + '&sds=' + sds + '&sus=' + sus + '&name=发票确认')
            }
            // this.showObj = res.data
          })
        }
        // if (this.tabName === '0') {
        //   this.jump('/pages/invoiceDetail/main?tabName=' + this.tabName + '&ids=' + ids + '&sds=' + sds + '&sus=' + sus)
        //   // 发票申请
        //   // let title = filterArray[0].title
        //   // let type = filterArray[0].type
        //   // 发票编号
        //   // let nos = filterArray.map(item => item.settlementUnitId).join(',')
        //   // // 总金额
        //   // let totalPrice = filterArray.map(item => item.settleTotalMoney).reduce((a, b) => a + b)
        //   // totalPrice = this.$toFixed(totalPrice, 2)
        //   // // 货款金额
        //   // let goodsPrice = filterArray.map(item => item.goods_price).reduce((a, b) => a + b).toFixed(2)
        //   // // 吊费金额
        //   // let liftPrice = filterArray.map(item => item.lift_price).reduce((a, b) => a + b).toFixed(2)
        //   // let obj = {
        //   //   contract_no: nos,
        //   //   id: ids,
        //   //   price: totalPrice,
        //   //   goods_price: goodsPrice,
        //   //   lift_price: liftPrice,
        //   //   title,
        //   //   type
        //   // }
        //   // if (nos.split(',').length === 1) {
        //   //   // self.httpPost(self.apiList.zf.invoiceAdd, obj).then(res => {
        //   //   //   debugger
        //   //   //   console.log(res)
        //   //   // })
        //   //   // this.ironRequest('invoiceDetail.shtml?id=' + filterArray[0].id, {}, 'get').then(resp => {
        //   //   //   if (resp.returncode === '0') {
        //   //   //     obj.goods_price = resp.goods_price
        //   //   //     obj.lift_price = resp.lift_price
        //   //   //     obj.invoice_no = resp.invoice_no
        //   //   //     // self.showMsg('申请成功')
        //   //   //     self.configVal({ key: 'tempObject', val: obj })
        //   //   //     // self.back(-1)
        //   //   //     self.jump('/pages/invoiceDetail/main?id=' + self.tabName)
        //   //   //   } else {
        //   //   //     self.showMsg(resp ? resp.errormsg : '网络错误')
        //   //   //     self.disabledBtn = false
        //   //   //   }
        //   //   //   self.allChecked = false
        //   //   // })
        //   // } else {
        //   //   // this.configVal({ key: 'tempObject', val: obj })
        //   //   this.jump('/pages/invoiceDetail/main?id=' + this.tabName)
        //   //   this.allChecked = false
        //   // }
        // }
        // if (this.tabName === '2') {
        //   this.jump('/pages/invoiceDetail/main?tabName=' + this.tabName + '&ids=' + ids + '&sds=' + sds + '&sus=' + sus + '&name=发票确认')
        //   // 发票确认
        //   // this.ironRequest('confirmInvoice.shtml', { user_id: this.currentUser.user_id, id: ids }, 'post').then(resp => {
        //   //   if (resp && resp.returncode === '0') {
        //   //     self.showMsg('发票确认成功')
        //   //     self.listData = []
        //   //     self.loadData()
        //   //     self.disabledBtn = false
        //   //   }
        //   // })
        // }
      } else {
        this.showMsg('请选择需开发票')
        self.disabledBtn = false
      }
    },
    // 加载数据
    loadData () {
      if (this.currentPage === 1) {
        this.isLoad = true
      } else {
        this.isLoad = false
      }
      this.queryObject.status = this.tabName
      const self = this
      this.loading = true
      this.queryObj.pageNum = this.currentPage
      // this.queryObj.busiBillDateEnd = ''
      // this.queryObj.busiBillDateStart = ''
      // this.queryObj.sourceBusiBillNo = ''
      if (this.swiperCount === 2) {
        self.queryObj.receiptSignFlagList = ['1', '2']
      }
      if (this.swiperCount === 3) {
        self.queryObj.receiptSignFlagList = ['3']
      }
      self.httpPost(self.postUrl, self.queryObj).then(res => {
        if (!res.data) {
          res.data = []
        }
        if (res.data.length > 0 && self.currentPage === 1) {
          self.listData = []
          res.data.map(itm => {
            let temp = itm
            // temp.checked = self.allChecked
            temp.price = Number(itm.price)
            self.listData.push(temp)
          })
          self.isLoad = false
          self.finished = false
        } else if (res.data.length === 0 && self.currentPage === 1) {
          self.listData = []
          self.finished = true
          self.isLoad = false
        } else if (res.data.length === 0 && self.currentPage > 1) {
          self.finished = true
          self.currentPage--
          self.queryObj.pageNum = self.currentPage
        } else {
          res.data.map(itm => {
            let temp = itm
            // temp.checked = self.allChecked
            temp.price = Number(itm.price)
            self.listData.push(temp)
          })
          this.finished = false
        }
        console.log('列表数据++++', this.listData)
      }).finally(() => {
        self.loading = false
        self.isload = false
        self.finished = false
        self.hideLoading()
      })

      // this.ironRequest('invoiceList.shtml', this.queryObject, 'post').then(resp => {
      //   if (resp && resp.returncode === '0') {
      //     if (resp.invoices.length > 0 && self.currentPage === 0) {
      //       self.listData = []
      //       resp.invoices.map(itm => {
      //         let temp = itm
      //         temp.checked = self.allChecked
      //         temp.price = Number(itm.price)
      //         self.listData.push(temp)
      //       })
      //       self.isLoad = false
      //       self.finished = false
      //     } else if (resp.invoices.length === 0 && self.currentPage === 0) {
      //       self.listData = []
      //       self.finished = true
      //       self.isLoad = false
      //     } else if (resp.invoices.length === 0 && self.currentPage > 0) {
      //       self.finished = true
      //       self.currentPage--
      //       self.queryObject.current_page = self.currentPage
      //     } else {
      //       resp.invoices.map(itm => {
      //         let temp = itm
      //         temp.checked = self.allChecked
      //         temp.price = Number(itm.price)
      //         self.listData.push(temp)
      //       })
      //       this.finished = false
      //     }
      //   }
      //   this.loading = false
      //   this.isTabDisabled = false
      // }).catch(err => {
      //   this.isTabDisabled = false
      //   self.showMsg(err || '网络异常')
      // })
    },
    // 点击切换tabs
    selectTabs (item, idx) {
      this.tabName = item.status
      this.swiperCount = idx
    },
    // 滑动轮播
    swiperChange (e) {
      const idx = e.mp.detail.current
      if (idx === 0) {
        this.postUrl = this.apiList.zf.invoiceUnApply
      } else if (idx === 1) {
        this.postUrl = this.apiList.zf.invoiceApplied
      } else if (idx === 2) {
        this.postUrl = this.apiList.zf.confirmReceiptDetails
      } else {
        this.postUrl = this.apiList.zf.confirmReceiptDetails
      }
      console.log(idx)
      this.swiperCount = idx
      this.tabName = this.tabList[idx].status
      console.log('name', this.tabName)
      const name = this.tabName
      this.tabList[idx].data = []
      this.currentPage = 1
      this.isload = false
      this.finished = false
      this.listData = []
      this.allChecked = false
      this.pageHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - 198 + 'rpx'
      // this.pageHeight = this.screenHeight - 148
      this.isTabDisabled = true
      if (name === '1' || name === '3') {
        this.pageHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - 98 + 'rpx'
      }
      console.log('pageHeight', this.pageHeight)
      this.queryObject = {
        current_page: this.currentPage,
        user_id: this.currentUser.user_id,
        page_size: this.pageSize
      }
      this.queryObj = {
        pageNum: this.currentPage + 1,
        pageSize: this.pageSize
      }
      this.loadData()
    }
  }
}
</script>
<style lang="stylus" scoped>
.h-16
  height 16px
.invoice-detail-btn
  border 1px #0081ff solid
  color #0081ff
  border-radius 30px
  text-align center
  width 80px
  padding 5px 3px
.invoice-footer
  padding-left 10px
  height 50px
  width 100%
  background #fff
  display flex
  .apply
    background #3da7ff
    color #fff
    font-size 16px
    height 50px
.padding
  padding 10px
.s-footer
  position fixed
  left 0
  right 0
  bottom 0
  background #fff
  height 50px
.main-btn
  width 120px
  height 40px
  font-size 15px
</style>
