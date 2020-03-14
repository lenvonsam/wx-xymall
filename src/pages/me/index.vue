<template lang="pug">
div 
  nav-bar(title="我的", :bgClass="'bg-blue text-white'", leftMenu)
    div(slot="leftMenu")
      .relative(@click="jumpNoticeList", v-if="showNoticeIcon")
        img(src="/static/images/notice_w_icon.png", style="width:30rpx; height: 36rpx")
        .red-dot(v-show="rowCountObj.to_notice > 0", style="width: 12rpx; height: 12rpx; top: 0rpx; right: -10rpx;")
  template(v-if="currentUser.type === 'seller'")
    .relative(style="height: 410rpx")
      .bg-blue.flex.padding-sm.text-white.align-center.me-header
        .col(@click="jumpProfile")
          .flex.align-center
            .author
              img(:src="imgOuterUrl + (currentUser.avatar == undefined ? '/webpage/zhd/images/img.png' : currentUser.avatar)", v-if="imgOuterUrl")
            .col.padding-left-sm
              .ft-15.padding-bottom-sm {{currentUser.user_mark}}
              .ft-12 {{currentUser.phone}}
        .cuIcon-right.ft-25   
      .account.vendor.bg-white.contract(@click="jumpBalance")
        .row
          .ft-16.text-bold 合同跟踪
          .col.ft-16.text-right
            span 查看全部
            span.text-gray.cuIcon-right
        .flex.text-center.justify-between.padding-top-lg
          .col(v-for="(bicon, biconIdx) in billTrackIcons", :key="biconIdx", @click="jumpBicon(bicon.url)")
            .relative.contract-img
              img(:src="bicon.icon", mode="widthFix")
              .dot(v-if="rowCountObj[bicon.dotKey] > 0", :class="{'max': rowCountObj[bicon.dotKey] > 9}") 
                label {{rowCountObj[bicon.dotKey] > 99 ? '99+' : rowCountObj[bicon.dotKey]}}
            .padding-top-xs.ft-15 {{bicon.name}} 
    .padding-sm
      .bg-white.features
        .ft-18.text-bold.padding-sm.padding-top.padding-bottom 功能列表
        .grid.col-3.text-center
          .features-card(v-for="(ficon, fIdx) in featuresIcons", :key="fIdx", @click="jump(ficon.url.path)")
            .relative.contract-img(v-if="ficon.icon")
              img(:src="ficon.icon", mode="widthFix")
              .dot(v-if="rowCountObj[ficon.dotKey] > 0", :class="{'max': rowCountObj[ficon.dotKey] > 9}") 
                label {{rowCountObj[ficon.dotKey] > 99 ? '99+' : rowCountObj[ficon.dotKey]}}
            .padding-top-xs.ft-15 {{ficon.name}}
  template(v-else)
    .relative
      .bg-blue.flex.padding-sm.text-white.align-center.me-header
        .col(@click="jumpProfile")
          .flex.align-center
            .author
              img(:src="imgOuterUrl + (currentUser.avatar == undefined ? '/webpage/zhd/images/img.png' : currentUser.avatar)", v-if="imgOuterUrl")
            .col.padding-left-sm
              .ft-15.padding-bottom-sm {{currentUser.user_mark}}
              .ft-12 {{currentUser.phone}}
        .cuIcon-right.ft-25(@click="jumpProfile")
      .account.bg-white.flex.align-center(@click="jumpBalance")
        .ft-16.text-bold 账户余额
        .col.ft-16.text-right
          span.text-blue.text-bold ￥ {{currentUser.account_balance}}
          span.text-gray.cuIcon-right
    .padding-sm
      .bg-white.contract.padding-sm
        .flex.justify-between
          .ft-16.text-bold 我的合同
          .text-gray.ft-14(@click="jumpBillMore") 查看全部
            span.cuIcon-right
        .flex.text-center.justify-between.padding-top-lg
          .col(v-for="(bicon, biconIdx) in billIcons", :key="biconIdx", @click="jumpBicon(bicon.url)")
            .relative.contract-img
              img(:src="bicon.icon", mode="widthFix")
              .dot(v-if="rowCountObj[bicon.dotKey] > 0", :class="{'max': rowCountObj[bicon.dotKey] > 9}") 
                label {{rowCountObj[bicon.dotKey] > 99 ? '99+' : rowCountObj[bicon.dotKey]}}
            .padding-top-xs.ft-15 {{bicon.name}}
      .margin-top-sm.me-icon.bg-white.ft-15(v-for="(cardItem, index) in cardList", :key="index", style="overflow:hidden;border-radius: 10rpx")
        .item.padding-sm.flex.align-center(v-for="(item, idx) in cardItem", :key="idx", @click="jumpToPage(item)")
          .col
            .row
              img(:src="item.imgPath", mode="widthFix")
              .margin-left-sm.col(:class="{'solid-bottom': idx < (cardItem.length - 1)}", style="color:#000") {{item.title}}
          .cuIcon-right.text-gray
      .margin-top-sm.me-icon.bg-white.ft-15(style="overflow:hidden;border-radius: 10rpx")
        .item.padding-sm.flex.align-center(@click="jumpSetting")
          .col
            .row
              img(src="/static/images/wdwld.png", mode="widthFix")
              .margin-left-sm.col.solid-bottom 用户设置
          .cuIcon-right.text-gray
        .item.padding-sm.flex.solid-bottom.align-center.relative.ft-15
          button(open-type="contact", style="position: absolute; left:0;right: 0; top:0; bottom: 0; z-index: 10; background: transparent")
          .col
            .flex.align-center
              img(src="/static/images/customer_icon.png", mode="widthFix")
              .padding-left-sm 在线客服
          .cuIcon-right.text-gray
  
  alert(:msg="alertText", v-model="alertShow", :cb="alertCb")
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      cardList: [
        [
          { title: '合同回收站', imgPath: '/static/images/recycle_icon.png', url: '/pages/billRecycle/main', event: 'click_app_me_recycle' },
          { title: '我的提单', imgPath: '/static/images/order_icon.png', url: '/pages/ladbill/main', event: 'click_app_me_lad' },
          { title: '我的发票', imgPath: '/static/images/wdfp.png', url: '/pages/invoice/main', event: 'click_app_me_invoice' },
          { title: '合同修改', imgPath: '/static/images/contract_icon.png', url: '/pages/modify/main', event: 'click_app_me_editorder' }
        ], [
          { title: '我的加工', imgPath: '/static/images/operating_icon.png', url: '/pages/process/main', event: 'click_app_me_process' },
          { title: '我的求购', imgPath: '/static/images/shop_icon.png', url: '/pages/askBuy/main', event: 'click_app_me_demand' }
        ]
      ],
      // 全部订单下面一行的数字显示
      rowCountObj: {},
      showNoticeIcon: false,
      alertShow: false,
      alertText: ''
    }
  },
  computed: {
    ...mapState({
      billIcons: state => state.billIcons,
      meIconList: state => state.meIconList,
      tempObject: state => state.tempObject,
      serviceCall: state => state.serviceCall,
      featuresIcons: state => state.vendor.featuresIcons,
      billTrackIcons: state => state.vendor.billTrackIcons
    })
  },
  onTabItemTap (item) {
    this.statisticRequest({ event: 'click_app_nav_me' })
  },
  onShow () {
    this.whiteStatusBar()
    this.showNoticeIcon = false
    this.rowCountObj = {}
    if (this.isLogin) {
      this.setCartCount(this.currentUser.user_id)
      this.alertShow = false
      this.showNoticeIcon = this.currentUser.message_switch === '1'
      if (this.currentUser.type === 'seller') {
        // TODO 卖家相关接口
        const orderCount = this.apiList.xy.orderCount
        this.ironRequest(orderCount.url, '', orderCount.method).then(resp => {
          console.log('resp', resp)
          if (resp && resp.returncode === '0') {
            this.rowCountObj = resp.data
            this.$forceUpdate()
          }
        })
      } else {
        this.refreshUser()
        this.ironRequest('toOperCounts.shtml?user_id=' + this.currentUser.user_id, {}, 'get').then(resp => {
          if (resp && resp.returncode === '0') {
            this.rowCountObj = resp
            this.$forceUpdate()
          }
        })
        this.ironRequest('balanceList.shtml?type=0&only_all=1&user_id=' + this.currentUser.user_id, {}, 'get').then(resp => {
          if (resp && resp.returncode === '0') {
            let obj = this.currentUser
            obj.account_balance = resp.balance
            this.currentUser.account_balance = resp.balance
            this.setUser(obj)
            this.$forceUpdate()
          }
        })
      }
    } else {
      this.tabDot(0)
      const me = this
      this.confirm({ title: '友情提示', content: '您未登录,请先登录' }).then(res => {
        if (res === 'confirm') {
          me.jump('/pages/account/login/main')
        } else {
          me.tab('/pages/index/main')
        }
      })
    }
  },
  methods: {
    ...mapActions([
      'setUser',
      'configVal'
    ]),
    jumpNoticeList () {
      this.statisticRequest({ event: 'click_app_me_message' })
      this.jump('/pages/cardList/main?title=消息中心&type=noticeList')
    },
    alertCb () {
      if (this.isLogin) {
        if (this.currentUser.type === 'buyer') this.jump('/pages/account/companyUpdate/main?type=2')
      } else {
        this.jump('/pages/account/login/main')
      }
    },
    async refreshUser () {
      try {
        const data = await this.ironRequest(this.apiList.xy.queryProfile.url, {}, this.apiList.xy.queryProfile.method)
        data.pwd = this.currentUser.pwd
        data.type = this.currentUser.type || 'buyer'
        data.localSearchs = this.currentUser.localSearchs || []
        if (data.avatar) data.avatar = data.avatar.indexOf('webpage/') > 0 ? data.avatar : '/filepool' + data.avatar
        else data.avatar = this.currentUser.avatar
        this.setUser(data)
        if (this.currentUser.isnew) {
          this.alertText = '您还需要完善公司信息才能正常工作'
          this.alertShow = true
        }
      } catch (e) {
        console.error(e)
      }
    },
    jumpSetting () {
      this.statisticRequest({ event: 'click_app_me_setting' })
      this.jump('/pages/account/setting/main')
    },
    jumpToPage (item) {
      this.statisticRequest({ event: item.event })
      this.jump(item.url)
    },
    jumpProfile () {
      this.statisticRequest({ event: 'click_app_me_profile' })
      this.jump('/pages/account/profile/main')
    },
    jumpBalance () {
      if (this.currentUser.type === 'seller') {
        this.jump('/pages/vendor/contractTrack/main')
      } else {
        this.statisticRequest({ event: 'click_app_me_balance' })
        this.jump('/pages/account/balance/main')
      }
    },
    jumpBillMore () {
      // this.statisticRequest({ event: 'click_app_me_myorder_more' })
      this.statisticRequest({ event: 'click_app_me_order_all' })
      this.jump('/pages/bill/main')
    },
    jumpBicon (url) {
      if (url.path === '/pages/bill/main?tabName=1') this.statisticRequest({ event: 'click_app_me_to_pay' })
      if (url.path === '/pages/ladbillConfirm/main') this.statisticRequest({ event: 'click_app_me_to_confirm' })
      if (url.path === '/pages/bill/main?tabName=6') this.statisticRequest({ event: 'click_app_me_to_lad' })
      if (url.path === '/pages/invoice/main?tabName=0') this.statisticRequest({ event: 'click_app_me_to_invoice' })
      this.jump(url.path)
    }
  }
}
</script>
<style lang="stylus" scoped>
.me-header
  padding-bottom 50px
.author
  width 60px
  height 60px
  overflow hidden
  border 1px #fff solid
  border-radius 100%
  img
    width 60px
    height 60px
.account
  padding 15px 10px
  border-radius 5px
  position absolute
  top 90px
  width 96%
  left 50%
  margin-left -48%
  &.vendor
    top auto
    bottom 0px
.contract
  margin-top 20px
  border-radius 5px
  .contract-img
    width 25px
    // height 20px
    margin 0 auto
.me-icon
  img
    width 20px
    // height 20px
.border-radius
  border-radius 10px
.dot
  position absolute
  background #fff
  top -5px
  right -9px
  color #e54d42
  text-align center
  font-size 10px
  display inline-block
  height 15px
  width 15px
  border 0.5px solid #e54d42
  box-sizing content-box
  border-radius 50%
  line-height 15px
  &.max
    width auto
    padding 0px 6px
    border-radius 20px
    font-size 9px
    right -12px
    height 14px
/deep/ button::after
  border 0px !important
.item
  height 50px
  line-height 50px
.features-card
  padding 20px 0
  border-top 1px #EEEEEE solid
  border-right 1px #EEEEEE solid
  &:nth-child(3n)
    border-right none
  .contract-img
    width 25px
    // height 20px
    margin 0 auto
.features
  border-radius 6px
</style>
