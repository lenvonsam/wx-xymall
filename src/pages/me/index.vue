<template lang="pug">
div 
  nav-bar(title="我的", :bgClass="'bg-blue text-white'", leftMenu)
    div(slot="leftMenu")
      img(src="/static/images/notice_w_icon.png", style="width:30rpx; height: 36rpx", @click="jump('/pages/cardList/main?title=消息中心&type=noticeList')", v-if="isLogin")
  .relative
    .bg-blue.flex.padding-sm.text-white.align-center.me-header
      .col(@click="jumpProfile")
        .flex.align-center
          .author
            img(:src="imgOuterUrl + (currentUser.avatar == undefined ? '' : currentUser.avatar)", v-if="imgOuterUrl")
          .col.padding-left-sm
            .ft-15.padding-bottom-sm {{currentUser.user_mark}}
            .ft-12 {{currentUser.phone}}
      .cuIcon-right.ft-25   
    .account.bg-white.flex.align-center
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
      .flex.text-center.text-gray.justify-between.padding-top-lg
        .col(v-for="(bicon, biconIdx) in billIcons", :key="biconIdx", @click="jumpBicon(bicon.url)")
          .relative.contract-img
            img(:src="bicon.icon")
            .dot(v-if="rowCountObj[bicon.dotKey] > 0", :class="{'max': rowCountObj[bicon.dotKey] > 9}") {{rowCountObj[bicon.dotKey] > 99 ? '99+' : rowCountObj[bicon.dotKey]}}
          .padding-top-xs {{bicon.name}}
    .margin-top-sm.me-icon.bg-white(v-for="(cardItem, index) in cardList", :key="index")
      .padding-sm.flex.solid-bottom.border-radius.align-center(v-for="(item, idx) in cardItem", :key="idx", @click="jump(item.url)")
        .col
          .flex.align-center
            img(:src="item.imgPath")
            .padding-left-sm {{item.title}}
        .cuIcon-right.text-gray
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      cardList: [
        [
          { title: '合同回收站', imgPath: '/static/images/recycle_icon.png' },
          { title: '我的提单', imgPath: '/static/images/order_icon.png' },
          { title: '我的发票', imgPath: '/static/images/wdfp.png' },
          { title: '合同修改', imgPath: '/static/images/contract_icon.png', url: '/pages/billEditList/main' }
        ], [
          { title: '我的加工', imgPath: '/static/images/operating_icon.png' },
          { title: '我的求购', imgPath: '/static/images/shop_icon.png' }
        ], [
          { title: '用户设置', imgPath: '/static/images/wdwld.png' },
          { title: '在线客服', imgPath: '/static/images/customer_icon.png' }
        ]
      ],
      avatarDirection: 'none',
      // 全部订单下面一行的数字显示
      rowCountObj: {}
    }
  },
  computed: {
    ...mapState({
      billIcons: state => state.billIcons,
      meIconList: state => state.meIconList,
      isLogin: state => state.user.isLogin,
      currentUser: state => state.user.currentUser,
      tempObject: state => state.tempObject,
      imgOuterUrl: state => state.imgOuterUrl,
      serviceCall: state => state.serviceCall,
      chatUrl: state => state.chatUrl
    })
  },
  onShow () {
    if (this.isLogin) {
      this.ironRequest('toOperCounts.shtml?user_id=' + this.currentUser.user_id, {}, 'get', this).then(resp => {
        // console.log(resp.data)
        if (resp.data && resp.data.returncode === '0') {
          this.rowCountObj = resp.data
        }
      })
      this.ironRequest('balanceList.shtml?type=0&only_all=1&user_id=' + this.currentUser.user_id, {}, 'get', this).then(resp => {
        if (resp.data && resp.data.returncode === '0') {
          let obj = this.currentUser
          obj.account_balance = resp.data.balance
          this.setCurrentUser(obj)
        }
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      const me = this
      if (!this.isLogin) {
        this.confirm({ content: '您还未登录，去登录' }).then(() => {
          me.configVal({
            key: 'tempObject',
            val: { preRoute: me.$root.$mp.appOptions.path }
          })
          me.jump('/pages/account/login/main')
        })
      } else {
        if (this.currentUser.isnew) {
          this.confirm({ content: '您还需要完善公司信息才能正常操作' }).then(() => {
            me.jump({ path: '/user/auth' })
          })
        }
      }
    })
  },
  methods: {
    ...mapActions([
      'setCurrentUser',
      'configVal'
    ]),
    jumpToPage (obj) {
      console.log('jumpToPage', obj)
      if (obj.url.path === '/bill/modify') this.statisticRequest({ event: 'click_app_me_modify' }, this)
      if (obj.url.path === '/bill/recycle') this.statisticRequest({ event: 'click_app_me_recycle' }, this)
      if (obj.url.path === '/ladbill') this.statisticRequest({ event: 'click_app_me_lad' }, this)
      if (obj.url.path === '/invoice') this.statisticRequest({ event: 'click_app_me_invoice' }, this)
      if (obj.url.path === '/contract') this.statisticRequest({ event: 'click_app_me_contract' }, this)
      if (obj.url.path === '/process') this.statisticRequest({ event: 'click_app_me_process' }, this)
      if (obj.url.path === '/askBuy') this.statisticRequest({ event: 'click_app_me_demand' }, this)
      if (obj.url.path === '/address') this.statisticRequest({ event: 'click_app_me_address' }, this)
      if (obj.url.path === '/onlineService') {
        this.statisticRequest({ event: 'click_app_me_kf' }, this)
        const me = this
        this.lcRequest('online', { peers: ['wy', 'syl', 'zyt', 'fh', 'wqf', 'lzy'] }).then(resp => {
          let res = JSON.parse(resp.data)
          if (res.results.length === 0) {
            me.confirmDialog('在线客服忙，是否要联系人工客服').then(() => {
              window.location.href = 'tel://4008788361'
            })
          } else {
            let url = `${me.chatUrl}targetName=${res.results[0]}&username=${this.currentUser.user_mark}&nickname=${this.currentUser.nickname}`
            window.location.href = url
          }
        }).catch(err => {
          console.log(err.message)
          me.confirmDialog('在线客服忙，是否要联系人工客服').then(() => {
            window.location.href = 'tel://4008788361'
          })
        })
      } else {
        this.jump(obj.url)
      }
    },
    jumpProfile () {
      this.statisticRequest({ event: 'click_app_me_information' }, this)
      this.jump('/pages/account/profile/main')
    },
    jumpBalance () {
      this.statisticRequest({ event: 'click_app_me_balance' }, this)
      this.jump({ path: '/balance' })
    },
    jumpBillMore () {
      // this.statisticRequest({ event: 'click_app_me_myorder_more' }, this)
      this.jump('/pages/bill/main')
    },
    jumpBicon (url) {
      // if (url.path === '/bill?tabName=1') this.statisticRequest({ event: 'click_app_me_to_pay_order' }, this)
      // if (url.path === '/ladbill/confirm/list') this.statisticRequest({ event: 'click_app_me_to_confirm' }, this)
      // if (url.path === '/ladbill?tabName=4') this.statisticRequest({ event: 'click_app_me_to_pay_contract' }, this)
      // if (url.path === '/invoice') this.statisticRequest({ event: 'click_app_me_to_invoice' }, this)
      console.log('url', url)
      this.jump(url.path)
    },
    serviceCallUrl () {
      this.statisticRequest({ event: 'click_app_me_tel' }, this)
      window.location.href = 'tel://' + this.serviceCall
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
.contract
  margin-top 20px
  border-radius 5px
  .contract-img
    width 30px
    height 28px
    margin 0 auto
  img
    width 30px
    height 28px
.me-icon
  img
    width 15px
    height 15px
.border-radius
  border-radius 10px
.dot
  position absolute
  background #fff
  top -8px
  right -10px
  color #e54d42
  text-align center
  font-size 12px
  display inline-block
  height 18px
  width 18px
  line-height 18px
  border 2px solid #e54d42
  border-radius 50%
  font-weight 700
</style>
