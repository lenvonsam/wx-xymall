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
                      .pb-half-rem.c-gray.ft-14 {{item.contract_no}}
                      .pb-half-rem {{item.title}}
                      .text-gray
                        span 重量：
                        span.ml-5 {{item.weight}}吨
                        span.ml-5 数量：
                        span.ml-5 {{item.amount}}支
                  .text-right.flex.flex-direction.align-end(:class="tabName == '2' ? 'justify-between' : 'justify-center'")
                    .text-blue.ft-18 ￥{{item.price}}
                    .invoice-detail-btn.margin-top-sm(v-if="tabName != '0' && item.price > 0", @click="jumpDetail(item)") 查看详情
                    .text-gray(v-if="tabName == '2'") 吊费：{{item.lift_price}}
            .padding.text-gray.ft-13.text-center(v-if="loading") 努力加载中... 
            .padding.text-gray.ft-13.text-center(v-if="finished") 加载完成 
        .text-center.c-gray.pt-100(v-else)
          empty-image(url="bill_empty.png", className="img-empty")
          .empty-content 您暂时没有相关发票
  .s-footer(v-if="tabName == '0' || tabName == '2'", style="height: 100rpx")
    .invoice-footer.align-center.justify-between
      .flex
        .flex-25.flex.flex-center(@click="allChecked = !allChecked")
          img.choose-icon(src="/static/images/blue_check.png", v-if="allChecked")
          img.choose-icon(src="/static/images/btn_ck_n.png", v-else)
        .flex-40.ml-5(@click="allChecked = !allChecked") 全选
      div(style="box-sizing: border-box; padding-right: .3rem;")
          span 合计：
          span.text-red ￥ {{totalPriceAll}}
      //- .col.apply.flex-100.flex.flex-center(@click="invoiceAction") {{tabName == '0' ? '批量申请' : '批量确认'}}  
      .main-btn.margin-right-sm(@click="invoiceAction") {{tabName == '0' ? '批量申请' : '批量确认'}}      
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
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
      currentPage: 0,
      queryObject: {},
      pageHeight: 0,
      isTabDisabled: false
    }
  },
  computed: {
    ...mapState({
      custom: state => state.custom,
      customBar: state => state.customBar,
      screenHeight: state => state.screenHeight,
      currentUser: state => state.user.currentUser,
      tempObject: state => state.tempObject,
      pageSize: state => state.pageSize
    })
  },
  watch: {
    listData: {
      handler (newVal, oldVal) {
        if (this.tabName === '0' || this.tabName === '2') {
          let filterArray = newVal.filter(item => item.checked === true)
          this.totalPriceAll = 0
          filterArray.map(fltem => {
            this.totalPriceAll += fltem.price
          })
          this.totalPriceAll = this.$toFixed(Number(this.totalPriceAll), 2)
        }
      },
      deep: true
    },
    allChecked (newVal, oldVal) {
      if (newVal) {
        this.listData.map(itm => {
          itm.checked = true
        })
      } else {
        this.listData.map(itm => {
          itm.checked = false
        })
      }
    }
  },
  onShow () {
    this.queryObject = {
      current_page: this.currentPage,
      page_size: this.pageSize
    }
    if (this.tempObject.tabName) {
      this.tabName = this.tempObject.tabName
      this.swiperCount = this.tabName
    } else if (this.$root.$mp.query.tabName) {
      this.tabName = this.$root.$mp.query.tabName
      this.swiperCount = this.tabName
    }

    if (this.tabName === '1' || this.tabName === '3') {
      this.pageHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - 98 + 'rpx'
    } else {
      this.pageHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - 198 + 'rpx'
    }
    this.loadData()
  },
  onUnload () {
    console.log('onUnload')
    this.swiperCount = 0
    this.tabName = '0'
    this.configVal({key: 'tempObject', val: ''})
  },
  methods: {
    ...mapActions([
      'configVal'
    ]),
    refresher () {
      const me = this
      this.currentPage = 0
      this.queryObject = {
        current_page: this.currentPage,
        user_id: this.currentUser.user_id,
        status: this.tabName
      }
      this.finished = true
      this.isLoad = true
      this.ironRequest('invoiceList.shtml', this.queryObject, 'post', this).then(resp => {
        if (resp && resp.returncode === '0') {
          if (resp.invoices.length > 0 && me.currentPage === 0) {
            this.listData = []
            resp.invoices.map(itm => {
              let temp = itm
              temp.checked = false
              this.listData.push(temp)
            })
            me.isLoad = false
            me.finished = false
          } else if (resp.invoices.length === 0 && me.currentPage === 0) {
            me.listData = []
            me.finished = true
            me.isLoad = false
          }
        } else {
          me.showMsg(resp === undefined ? '网络异常' : resp.errormsg)
        }
      })
    },
    loadMore () {
      if (!this.isLoad) {
        this.currentPage++
        this.queryObject.current_page = this.currentPage
        this.loadData()
      }
    },
    chooseSameInvoiceNo (item) {
      item.checked = !item.checked
      this.listData.map(itm => {
        if (itm.contract_no === item.contract_no) itm.checked = item.checked
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
    jumpDetail (obj) {
      // this.configVal({key: 'tempObject', val: obj})
      // this.jump({path: '/invoice/detail', query: {id: this.tabName}})
      this.ironRequest('invoiceDetail.shtml?id=' + obj.id, {}, 'get', this).then(resp => {
        if (resp.returncode === '0') {
          resp.tabName = this.tabName
          this.configVal({ key: 'tempObject', val: resp })
          this.jump(`/pages/invoiceDetail/main?id=${this.tabName}&name=查看详情`)
        } else {
          this.showMsg('查看失败')
        }
      })
    },
    invoiceAction () {
      let filterArray = this.listData.filter(item => item.checked === true)
      const me = this
      if (filterArray.length > 0) {
        let ids = filterArray.map(item => item.id).join(',')
        if (this.tabName === '0') {
          // 发票申请
          let title = filterArray[0].title
          let type = filterArray[0].type
          // 发票编号
          let nos = filterArray.map(item => item.contract_no).join(',')
          // 总金额
          let totalPrice = filterArray.map(item => item.price).reduce((a, b) => a + b)
          totalPrice = this.$toFixed(totalPrice, 2)
          // 货款金额
          // let goodsPrice = filterArray.map(item => item.goods_price).reduce((a, b) => a + b).toFixed(2)
          // 吊费金额
          // let liftPrice = filterArray.map(item => item.lift_price).reduce((a, b) => a + b).toFixed(2)
          let obj = {
            contract_no: nos,
            id: ids,
            price: totalPrice,
            title,
            type
          }
          if (nos.split(',').length === 1) {
            this.ironRequest('invoiceDetail.shtml?id=' + filterArray[0].id, {}, 'get', this).then(resp => {
              if (resp.returncode === '0') {
                obj.goods_price = resp.goods_price
                obj.lift_price = resp.lift_price
                // me.showMsg('申请成功')
                me.configVal({ key: 'tempObject', val: obj })
                me.jump('/pages/invoiceDetail/main?id=' + me.tabName)
              } else {
                me.showMsg(resp ? resp.errormsg : '网络错误')
              }
              me.allChecked = false
            })
          } else {
            this.configVal({ key: 'tempObject', val: obj })
            this.jump('/pages/invoiceDetail/main?id=' + this.tabName)
            this.allChecked = false
          }
        }
        if (this.tabName === '2') {
          // 发票确认
          this.ironRequest('confirmInvoice.shtml', { user_id: this.currentUser.user_id, id: ids }, 'post', this).then(resp => {
            if (resp && resp.returncode === '0') {
              this.confirm({ content: '发票确认成功' }).then(() => {
                me.listData = []
                me.loadData()
              })
            } else {
              this.showMsg(resp === undefined ? '网路异常' : resp.errormsg)
            }
          })
        }
      } else {
        this.showMsg('请选择需开发票')
      }
    },
    loadData () {
      debugger
      if (this.currentPage === 0) {
        this.isLoad = true
      } else {
        this.isLoad = false
      }
      this.queryObject.status = this.tabName
      const me = this
      // if (me.currentPage === 0) {
      //   me.$ironLoad.show()
      // }
      this.loading = true
      this.ironRequest('invoiceList.shtml', this.queryObject, 'post', this).then(resp => {
        if (resp && resp.returncode === '0') {
          debugger
          if (resp.invoices.length > 0 && me.currentPage === 0) {
            me.listData = []
            resp.invoices.map(itm => {
              let temp = itm
              temp.checked = me.allChecked
              temp.price = Number(itm.price)
              me.listData.push(temp)
            })
            me.isLoad = false
            me.finished = false
          } else if (resp.invoices.length === 0 && me.currentPage === 0) {
            me.listData = []
            me.finished = true
            me.isLoad = false
          } else if (resp.invoices.length === 0 && me.currentPage > 0) {
            me.finished = true
            me.currentPage--
            me.queryObject.current_page = me.currentPage
          } else {
            resp.invoices.map(itm => {
              let temp = itm
              temp.checked = me.allChecked
              temp.price = Number(itm.price)
              me.listData.push(temp)
            })
            this.finished = false
          }
          // if (done) done()
          // if (me.currentPage === 0) {
          //   me.$ironLoad.hide()
          // }
        }
        this.loading = false
        this.isTabDisabled = false
      }).catch(err => {
        this.isTabDisabled = false
        me.showMsg(err || '网络异常')
      })
    },
    selectTabs (item, idx) {
      this.tabName = item.status
      this.swiperCount = idx
    },
    swiperChange (e) {
      const idx = e.mp.detail.current
      console.log(idx)
      this.swiperCount = idx
      this.tabName = this.tabList[idx].status
      console.log('name', this.tabName)
      const name = this.tabName
      this.tabList[idx].data = []
      this.currentPage = 0
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