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
              img(:src="currentUser.avatar == undefined ? (imgProxy + 'wx2104_img.png') : currentUser.avatar", v-if="imgProxy")
            .col.padding-left-sm
              .ft-15.padding-bottom-sm {{currentUser.user_mark}}
              .ft-12 {{currentUser.type === 'seller' ? currentUser.nickname : currentUser.phone}}
        .cuIcon-right.ft-25
      .account.vendor.bg-white.contract
        .row
          .ft-16.text-bold 合同跟踪
          .col.ft-16.text-right(@click="jumpBalance")
            span 查看全部
            span.text-gray.cuIcon-right
        .flex.text-center.justify-between.padding-top-lg
          .col(v-for="(bicon, biconIdx) in billTrackIcons", :key="biconIdx", @click="jumpBicon(bicon)")
            .relative.contract-img
              img(:src="bicon.icon", mode="widthFix")
              .dot(v-if="rowCountObj[bicon.dotKey] > 0", :class="{'max': rowCountObj[bicon.dotKey] > 9}")
                label {{rowCountObj[bicon.dotKey] > 99 ? '99+' : rowCountObj[bicon.dotKey]}}
            .padding-top-xs.ft-15 {{bicon.name}}
    .padding-sm
      .bg-white.features
        .ft-18.text-bold.padding-sm.padding-top.padding-bottom 功能列表
        .grid.col-3.text-center.features-top
          .features-card(v-for="(ficon, fIdx) in featuresIcons", :key="fIdx", @click="jumpModules(ficon)")
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
              img(:src="currentUser.avatar == undefined ? (imgProxy + 'wx2104_img.png') : currentUser.avatar", v-if="imgProxy", mode="aspectFill")
            .col.padding-left-sm
              template(v-if="isLogin")
                .ft-15.padding-bottom-sm {{currentUser.username}}
                .ft-12 {{currentUser.phone}}
              template(v-else)
                .ft-16.padding-bottom-xs
                  span 登录
                  span.padding-left-xs.padding-right-xs /
                  span 注册
                .ft-12(style="color: rgba(255,255,255,0.5)") 您未登录哦，登录后查看信息。
        .cuIcon-right.ft-25(@click="jumpProfile")
      .account.bg-white.flex.align-center(@click="jumpBalance")
        .ft-16.text-bold 账户余额
        .col.ft-16.text-right
          span(v-if="isLogin").text-blue.text-bold ￥ {{rowCountObj.unitFundBalance}}
          span(v-else).text-blue.text-bold ￥--
          span.text-gray.cuIcon-right
    .padding-sm
      .bg-white.contract.padding-sm
        .flex.justify-between
          .ft-16.text-bold 我的合同
          .text-gray.ft-14(@click="jumpBillMore") 查看全部
            span.cuIcon-right
        .flex.text-center.justify-between.padding-top-lg
          .col(v-for="(bicon, biconIdx) in billIcons", :key="biconIdx", @click="jumpBicon(bicon)")
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
  modal(v-model="modalShow", @cb="modalCb")
    .padding-sm {{modalMsg}}
  //- alert(:title="ruleModalTitle" :msg="ruleModalMsg", v-model="ruleModalShow", :cb="ruleModalCb")
  // modal(v-model="ruleModalShow", @cb="ruleModalCb", :title="ruleModalTitle" :btns="btn")
    div
      .padding-15 {{ruleModalMsg}}
</template>
<script>
import { mapState, mapActions } from 'vuex'
import modal from '@/components/Modal.vue'
export default {
  components: {
    modal
  },
  data () {
    return {
      modalShow: false,
      modalMsg: '',
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
      alertText: '',
      featuresModules: [],
      ruleModalShow: false,
      ruleModalTitle: '超时未提货物收费标准',
      ruleModalMsg: '对于在库物资，买方在平台上购买物资并支付货款后，应在约定的时间内（系统默认时间为5天）制作提单并提货。超过约定时间未提的合同物资将被判定为违约（超期未提），买方须承担未及时提货而产生的仓储管理费，并于提货时自行与仓库管理方结算。卖方有权对违约合同物资进行处置，进行合同取消并退还对应货款。',
      btn: [{ label: '确定', flag: 'confirm', className: 'main-btn' }]
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
  onHide () {
    this.alertShow = false
    this.rowCountObj = {}
    this.modalShow = false
    this.modalMsg = ''
    console.log('onhide---------me')
  },
  onLoad () {
  },
  onShow () {
    const self = this
    console.log('+++++++++++++++++++++')
    self.modalShow = false
    if (self.isLogin) {
      self.httpPost(self.apiList.zf.queryUserCenterContractInfo, {}).then(res => {
        console.log(res.data)
        this.rowCountObj = res.data
      }).catch(err => {
        this.hideLoading()
        console.log(err)
      })
      /** 判断账号状态
       * 已完善信息账号可打开“我的”
       * 未完善信息账号点击“我的”提示去完善信息 */
      this.refreshUser()
      this.getSummaryQuantity()

      // if (self.currentUser.userStatus === '01') {
      //   setTimeout(() => {
      //     self.jump('/pages/account/companyUpdate/main?type=2')
      //   }, 1000)
      // }
      //  else {
      //   self.httpPost(self.apiList.zf.queryUserCenterContractInfo, {}).then(res => {
      //     debugger
      //     console.log(res)
      //   })
      // }
      // console.log('me_state.currentUser======>' + JSON.stringify(this.currentUser))
      // self.showNoticeIcon = self.currentUser.message_switch === '1'
      // if (self.currentUser.type === 'seller') {
      //   self.ironRequest(`${self.apiList.xy.checkUUID.url}?user_id=${uid}`, {}, self.apiList.xy.checkUUID.method).then(resp => {
      //     console.log('page_me_checkoutuuid=======>' + JSON.stringify(resp))
      //     if (resp.returncode.toString() === '0') {
      //       self.whiteStatusBar()
      //       self.setCartCount(self.currentUser.user_id)
      //       self.alertShow = false
      //       if (self.currentUser.type === 'seller') {
      //         self.ironRequest(self.apiList.xy.modules.url, { user_id: self.currentUser.user_id }, self.apiList.xy.modules.method).then(res => {
      //           const resData = res.list
      //           self.rowCountObj.waitAudit = 0
      //           const modules = {}
      //           resData.map(item => {
      //             modules[item.memu_name] = item.flag
      //             if (item.flag) {
      //               self.rowCountObj[item.memu_name] = item.count
      //               self.rowCountObj.waitAudit += Number(item.count)
      //             }
      //           })
      //           self.featuresModules = self.featuresIcons.filter(item => {
      //             return !item.dotKey || (item.dotKey && self.rowCountObj.hasOwnProperty(item.dotKey)) || item.dotKey === 'waitAudit'
      //           })
      //           self.configVal({ key: 'modules', val: modules })
      //         }).catch((e) => {
      //           self.showMsg(e)
      //           self.featuresModules = []
      //         })
      //         const orderCount = self.apiList.xy.orderCount
      //         self.ironRequest(orderCount.url, '', orderCount.method).then(resp => {
      //           console.log('resp', resp)
      //           if (resp.returncode === '0') {
      //             Object.assign(self.rowCountObj, resp.data)
      //             self.$forceUpdate()
      //           }
      //         })
      //       } else {
      //         self.refreshUser()
      //         self.ironRequest('toOperCounts.shtml?user_id=' + this.currentUser.user_id, {}, 'get').then(resp => {
      //           if (resp && resp.returncode === '0') {
      //             self.rowCountObj = resp
      //             self.$forceUpdate()
      //           }
      //         })
      //         self.ironRequest('balanceList.shtml?type=0&only_all=1&user_id=' + this.currentUser.user_id, {}, 'get').then(resp => {
      //           if (resp && resp.returncode === '0') {
      //             let obj = self.currentUser
      //             obj.account_balance = resp.balance
      //             self.currentUser.account_balance = resp.balance
      //             self.setUser(obj)
      //             self.$forceUpdate()
      //           }
      //         })
      //       }
      //     } else {
      //       self.exitUser()
      //       self.tabDot(0)
      //     }
      //   }).catch(e => {
      //     console.log('page_me_checkoutuuid_已失效catch=======>' + e)
      //     self.showMsg('登录已失效，请重新登录')
      //     self.exitUser()
      //     self.tabDot(0)
      //   })
      // } else {
      //   self.getUserRule()
      //   self.ironRequest('toOperCounts.shtml?user_id=' + self.currentUser.user_id, {}, 'get').then(resp => {
      //     if (resp && resp.returncode === '0') {
      //       self.rowCountObj = resp
      //       self.$forceUpdate()
      //     }
      //   })
      //   self.ironRequest('balanceList.shtml?type=0&only_all=1&user_id=' + self.currentUser.user_id, {}, 'get').then(resp => {
      //     if (resp && resp.returncode === '0') {
      //       let obj = self.currentUser
      //       obj.account_balance = resp.balance
      //       self.currentUser.account_balance = resp.balance
      //       self.setUser(obj)
      //       self.$forceUpdate()
      //     }
      //   })
      // }
    } else {
      self.showNoticeIcon = false
      self.tabDot(0)
      // self.showMsg('登录已失效，请重新登录')
      // setTimeout(() => {
      //   self.jump('/pages/account/login/main')
      // }, 1000)
    }
  },
  methods: {
    ...mapActions([
      'setUser',
      'configVal',
      'exitUser'
    ]),
    getSummaryQuantity () {
      this.httpGet(this.apiList.zf.summaryQuantity).then(res => {
        if (res.success) {
          let cartNumber = res.data.cartNumber || 0
          this.tabDot(cartNumber)
          mpvue.setStorageSync('cartAllCount', cartNumber)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 跳转消息中心
    jumpNoticeList () {
      if (!this.isLogin) {
        this.modalMsg = '您未登录,请先登录'
        this.modalShow = true
      } else {
        this.statisticRequest({ event: 'click_app_me_message' })
        this.jump('/pages/cardList/main?title=消息中心&type=noticeList')
      }
    },
    // 登陆提示模态框回调
    modalCb (flag) {
      this.modalShow = false
      if (flag === 'confirm') {
        this.jump('/pages/account/login/main')
      } else {
        // 弹出未登录提示框，选择取消停留在当前页面
        return false
        // this.tab('/pages/index/main')
      }
    },
    // 完善公司信息弹窗回调
    alertCb () {
      if (this.isLogin) {
        if (this.currentUser.type === 'buyer') this.jump('/pages/account/companyUpdate/main?type=2')
      } else {
        this.jump('/pages/account/login/main')
      }
    },
    // 刷新获取用户信息
    async refreshUser () {
      try {
        const res = await this.httpPost(this.apiList.zf.getPersonInfo, {})
        this.modalShow = false
        this.setUser({ user: res.data })
        // 超时未提货物模态框
        // if (this.isLogin && this.currentUser.type === 'buyer' && !this.currentUser.userGeneralAgreement) {
        //   this.ruleModalShow = true
        // }
        // 信息未完善提示
        if (this.currentUser.userStatus === '01') {
          this.alertText = '您还需要完善公司信息才能正常工作'
          this.alertShow = true
        }
      } catch (e) {
        console.error(e)
        this.hideLoading()
        this.showMsg(e.message)
        this.exitUser()
      }
    },
    // async getUserRule () {
    //   await this.refreshUser()
    //   console.log('me_rule======>' + this.currentUser.rule)
    //   if (this.currentUser.type === 'buyer' && this.currentUser.rule === 0) {
    //     this.modalShow = false
    //     this.ruleModalShow = true
    //   } else if (this.currentUser.userStatus === '01') {
    //     this.alertText = '您还需要完善公司信息才能正常操作'
    //     this.alertShow = true
    //   } else {
    //     this.ruleModalShow = false
    //   }
    // },
    // 跳转用户设置
    jumpSetting () {
      if (!this.isLogin) {
        this.modalMsg = '您未登录,请先登录'
        this.modalShow = true
      } else {
        this.statisticRequest({ event: 'click_app_me_setting' })
        this.jump('/pages/account/setting/main')
      }
    },
    // 跳转页面
    jumpToPage (item) {
      if (!this.isLogin) {
        this.modalMsg = '您未登录,请先登录'
        this.modalShow = true
      } else {
        this.statisticRequest({ event: item.event })
        this.jump(item.url)
      }
    },
    // 用户登陆/查看用户信息
    jumpProfile () {
      // if (!this.isLogin) return false
      if (!this.isLogin) {
        this.jump('/pages/account/login/main')
      } else {
        // this.statisticRequest({ event: 'click_app_me_profile' })
        this.jump('/pages/account/profile/main')
      }
    },
    // 查看账户余额
    jumpBalance () {
      if (!this.isLogin) {
        this.modalMsg = '您未登录,请先登录'
        this.modalShow = true
      } else {
        if (this.currentUser.type === 'seller') {
          this.statisticRequest({ event: 'click_app_me_order_all_seller' }, true)
          this.jump('/pages/vendor/contractTrack/main')
        } else {
          this.statisticRequest({ event: 'click_app_me_balance' })
          this.jump('/pages/account/balance/main')
        }
      }
    },
    // 查看全部合同
    jumpBillMore () {
      if (!this.isLogin) {
        this.modalMsg = '您未登录,请先登录'
        this.modalShow = true
      } else {
        // this.statisticRequest({ event: 'click_app_me_myorder_more' })
        // this.statisticRequest({ event: 'click_app_me_order_all' })
        this.jump('/pages/bill/main')
      }
    },
    // 点击功能图标
    jumpBicon (icon) {
      if (!this.isLogin) {
        this.modalMsg = '您未登录,请先登录'
        this.modalShow = true
      } else {
        // if (this.currentUser.type === 'seller') {
        //   this.statisticRequest({ event: icon.event }, true)
        // } else {
        //   if (icon.url.path === '/pages/bill/main?tabName=1') this.statisticRequest({ event: 'click_app_me_to_pay' })
        //   if (icon.url.path === '/pages/ladbillConfirm/main') this.statisticRequest({ event: 'click_app_me_to_confirm' })
        //   if (icon.url.path === '/pages/bill/main?tabName=6') this.statisticRequest({ event: 'click_app_me_to_lad' })
        //   if (icon.url.path === '/pages/invoice/main?tabName=0') this.statisticRequest({ event: 'click_app_me_to_invoice' })
        // }
        this.jump(icon.url.path)
      }
    },
    jumpModules (icon) {
      if (!this.isLogin) {
        this.modalMsg = '您未登录,请先登录'
        this.modalShow = true
      } else {
        this.statisticRequest({ event: icon.event }, true)
        this.jump(icon.url.path)
      }
    }
    // 超时未提货物收费标准模态框回调
    // ruleModalCb (flag) {
    //   this.httpPost(this.apiList.zf.updatePersonAgreement, {userGeneralAgreement: true}).then(res => {
    //     console.log('updateRule_res=====>' + JSON.stringify(res))
    //   }).catch(e => {
    //     console.log('updateRule_e=====>' + e)
    //   })
    //   this.ruleModalShow = false
    //   if (this.currentUser.userStatus === '01') {
    //     this.alertText = '您还需要完善公司信息才能正常工作'
    //     this.alertShow = true
    //   }
    // }
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
.features-top
  border-top 1px #EEEEEE solid
.features-card
  padding 20px 0
  // border-top 1px #EEEEEE solid
  border-bottom 1px #EEEEEE solid
  border-right 1px #EEEEEE solid
  &:nth-child(3n)
    border-right none
  &:nth-child(n+7)
    border-bottom none
  .contract-img
    width 25px
    // height 20px
    margin 0 auto
.features
  border-radius 6px
.padding-15
  padding 15px
</style>
