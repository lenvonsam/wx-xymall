<template lang="pug">
div
  nav-bar(title="电子名片", isBack)
  .main.flex.mt-10
    .half(:style="{backgroundImage: 'url('+ urlImg + ')'}")
      // img(:src="urlImg",style="height:100%;width:100%;")
    .info
      .name.flex.flex-direction.justify-center.align-center
        .ft-20.text-bold 王熙烨
        .ft-15.text-gray 营销一部 销售专员
        .ft-12.text-gray 江苏智恒达投资集团有限公司
      .num.flex.flex-direction.justify-center.align-end
        .flex.align-center.margin-bottom-xs.margin-right
          .text-gray.ft-13 123
          img.num-img(src="/static/images/card_tel.png")
        .flex.align-center.margin-bottom-xs.margin-right
          .text-gray.ft-13 123
          img.num-img(src="/static/images/card_WX.png")
        .flex.align-center.margin-bottom-xs.margin-right
          .text-gray.ft-13 123
          img.num-img(src="/static/images/card_QQ.png")
        .flex.align-center.margin-bottom-xs.margin-right
          .text-gray.ft-13 123
          img.num-img(src="/static/images/card_mail.png")

  .card.flex.justify-between.mt-15
    .card-blue(@click="selectCard('1')", :class="cardIndex === '1' ? 'active-card' : ''") 分享名片
    .card-blue(@click="selectCard('2')", :class="cardIndex === '2' ? 'active-card' : ''") 保存名片
    .card-blue(@click="selectCard('3')", :class="cardIndex === '3' ? 'active-card' : ''") 交换名片
  .link.flex.justify-between.mt-10
    .bg-white.card-link.flex.flex-direction.justify-center.align-center.border-radius(@click="phoneCall")
      .flex.align-center.margin-bottom-xs
        img.cell-white-img(src="/static/images/card_tel_blue.png")
        span.text-bold 拨打电话
      .ft-12.text-gray 12345678
    .bg-white.card-link.flex.flex-direction.justify-center.align-center.border-radius(@click="addWX")
      .flex.align-center.margin-bottom-xs
        img.cell-white-img(src="/static/images/card_wx_blue.png")
        span.text-bold 加我微信
      .ft-12.text-gray 12345678
    .bg-white.card-link.flex.flex-direction.justify-center.align-center.border-radius(@click="addQQ")
      .flex.align-center.margin-bottom-xs
        img.cell-white-img(src="/static/images/card_qq_blue.png")
        span.text-bold 加我QQ
      .ft-12.text-gray 12345678
  .about.bg-white.flex.mt-10
    .text-bold.padding.ft-14.text-gray(@click="selectTab('1')", :class="tabIndex === '1' ? 'active-tab' : ''") 关于我
    .text-bold.padding.ft-14.text-gray(@click="selectTab('2')", :class="tabIndex === '2' ? 'active-tab' : ''") 评价我
  .me.mt-10
    template(v-if="tabIndex === '1'")
      .padding.bg-white.margin-bottom-xs.card-content(v-for="(item,index) in aboutMeList" :key="index")
        .text-bold.ft-14.margin-bottom {{item.title}}
        .text-gray.ft-12 {{item.detail}}
    template(v-else)
      .stars
        .cell(v-for="(pitem, pidx) in starList", :key="pidx")
          .cell-title
            span.cell-title-main {{pitem.title}}
            span.cell-title-tag {{pitem.subTitle[pitem.num]}}
          .cell-stars
            img.cell-star(
              v-for="(item, index) in pitem.star",
              :key="index",
              :src="item",
              @click="getStar(pidx, index)"
            )
        .star-btn(@click="confirmApprise") 提交评价
  .mask(v-if="isShare")
    .share
      .text-gray.ft-14.text-center.padding-top 分享至
      .flex.justify-center.align-center
        .flex.flex-direction.align-center.justify-center.padding
          img.margin-bottom-xs.shareimg(src="/static/images/card_alert_wx.png")
          .text-gray 微信好友
        .flex.flex-direction.align-center.justify-center.padding
          img.margin-bottom-xs.shareimg(src="/static/images/card_alert_quan.png")
          .text-gray 微信朋友圈
      .ft-16.border-top(@click="cancelShare") 取消
  .mask(v-if="isExchange")
    .exchange
      .top.flex.justify-between.align-center.bg-gray
        .ft-14.text-gray.text-bold(@click="cancelExchange") 关闭
        .ft-15.text-bold 交换名片
        .ft-14.text-blue.text-bold(@click="confirmExchange") 提交
      .form.flex.flex-direction.justify-around.align-center
        .cell
          .ft-14.margin-bottom-xs.text-bold 公司名称
          input.bg-gray(placeholder="点击输入")
        .cell
          .ft-14.margin-bottom-xs.text-bold 客户姓名
          input.bg-gray(placeholder="点击输入")
        .cell
          .ft-14.margin-bottom-xs.text-bold 联系方式
          input.bg-gray(placeholder="点击输入")
        .cell
          .ft-14.margin-bottom-xs.text-bold 需求物资（选填）
          input.bg-gray(placeholder="点击输入")
  .company.flex.flex-direction.align-center.justify-center(@click="goCompanyInfo")
    img.company-img(src="/static/images/card_company.png")
    .ft-12.text-bold 公司介绍
  .go.text-bold.ft-14 去型云采购
</template>
<script>
import { mapState, mapActions } from 'vuex'

export default {
  components: {

  },
  data () {
    return {
      urlImg: 'http://xymobile.xingyun361.com/card_img.png',
      cardIndex: '0',
      tabIndex: '1',
      WX: '123WX',
      QQ: '123QQ',
      isShare: false,
      isExchange: false,
      aboutMeList: [
        {
          title: '主要负责区域',
          detail: 'H型钢工字钢角钢槽钢扁钢热冷卷H型钢工字钢角钢槽钢扁钢热冷卷H型钢工字钢角钢槽钢扁钢热冷卷H型钢工字钢角钢槽钢扁钢热冷卷H型,钢扁钢热冷卷H型钢工字钢'
        },
        {
          title: '擅长型材品类',
          detail: 'H型钢工字钢角钢槽钢扁钢热冷卷H型钢工字钢角钢槽钢扁钢热冷卷H型钢工字钢角钢槽钢扁钢热冷卷H型钢工字钢角钢槽钢扁钢热冷卷H型,钢扁钢热冷卷H型钢工字钢'
        },
        {
          title: '擅长型材品类',
          detail: 'H型钢工字钢角钢槽钢扁钢热冷卷H型钢工字钢角钢槽钢扁钢热冷卷H型钢工字钢角钢槽钢扁钢热冷卷H型钢工字钢角钢槽钢扁钢热冷卷H型,钢扁钢热冷卷H型钢工字钢'
        }
      ],
      starList: [
        {
          name: 'xjxy',
          title: '询价响应',
          subTitle: [
            '请您评价',
            '没有相应',
            '虚报价格',
            '需要等待',
            '正常回复',
            '快速回复'
          ],
          star: [
            'http://xymobile.xingyun361.com/2021Q2-score-no.png',
            'http://xymobile.xingyun361.com/2021Q2-score-no.png',
            'http://xymobile.xingyun361.com/2021Q2-score-no.png',
            'http://xymobile.xingyun361.com/2021Q2-score-no.png',
            'http://xymobile.xingyun361.com/2021Q2-score-no.png'
          ],
          num: 0
        },
        {
          name: 'kdtd',
          title: '开单态度',
          subTitle: [
            '请您评价',
            '恶语相向',
            '爱理不理',
            '延迟冷漠',
            '正常开单',
            '热情耐心'
          ],
          star: [
            'http://xymobile.xingyun361.com/2021Q2-score-no.png',
            'http://xymobile.xingyun361.com/2021Q2-score-no.png',
            'http://xymobile.xingyun361.com/2021Q2-score-no.png',
            'http://xymobile.xingyun361.com/2021Q2-score-no.png',
            'http://xymobile.xingyun361.com/2021Q2-score-no.png'
          ],
          num: 0
        },
        {
          name: 'phth',
          title: '配合提货',
          subTitle: [
            '请您评价',
            '毫不配合',
            '借故推脱',
            '指引模糊',
            '正常提货',
            '高效有序'
          ],
          star: [
            'http://xymobile.xingyun361.com/2021Q2-score-no.png',
            'http://xymobile.xingyun361.com/2021Q2-score-no.png',
            'http://xymobile.xingyun361.com/2021Q2-score-no.png',
            'http://xymobile.xingyun361.com/2021Q2-score-no.png',
            'http://xymobile.xingyun361.com/2021Q2-score-no.png'
          ],
          num: 0
        },
        {
          name: 'yygz',
          title: '异议跟踪',
          subTitle: [
            '请您评价',
            '拒不处理',
            '推三阻四',
            '延时解决',
            '正常跟踪',
            '圆满解决'
          ],
          star: [
            'http://xymobile.xingyun361.com/2021Q2-score-no.png',
            'http://xymobile.xingyun361.com/2021Q2-score-no.png',
            'http://xymobile.xingyun361.com/2021Q2-score-no.png',
            'http://xymobile.xingyun361.com/2021Q2-score-no.png',
            'http://xymobile.xingyun361.com/2021Q2-score-no.png'
          ],
          num: 0
        },
        {
          name: 'mycd',
          title: '满意程度',
          subTitle: [
            '请您评价',
            '非常恶劣',
            '评价较低',
            '质量一般',
            '正常服务',
            '非常满意'
          ],
          star: [
            'http://xymobile.xingyun361.com/2021Q2-score-no.png',
            'http://xymobile.xingyun361.com/2021Q2-score-no.png',
            'http://xymobile.xingyun361.com/2021Q2-score-no.png',
            'http://xymobile.xingyun361.com/2021Q2-score-no.png',
            'http://xymobile.xingyun361.com/2021Q2-score-no.png'
          ],
          num: 0
        }
      ]
    }
  },
  computed: {
    ...mapState({
      tempObject: state => state.tempObject,
      screenHeight: state => state.screenHeight,
      customBar: state => state.customBar,
      bottomBarHeight: state => state.bottomBarHeight
    })
  },
  watch: {
    mallTabVal (newVal, oldVal) {
      this.prevIdx = this.goodsNameList.findIndex(item => {
        return item.id === oldVal
      })
    }
  },
  onUnload () {
    this.ballValue = null
    this.mallTabVal = ''
    this.mallItems = []
    this.queryObject = {}
    this.isRefresh = 'refresh'
    this.currentPage = 1
    this.mallFlag = 1
    this.btnDisable = false
    this.goodsNameList = []
    this.swiperCount = 0
    this.scrollHeight = 0
    this.swiperFirst = 0
    this.prevIdx = null
  },
  onHide () {
    this.btnDisable = false
    // this.queryObject.search = ''
  },
  onShow () {
    this.showLoading()
    this.isload = true
    this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - 285
    if (this.tempObject.fromPage === 'mallFilter' && this.tempObject.noBack) {
      // 分类
      this.swiperFirst = 1
      Object.assign(this.queryObject, this.tempObject)
      delete this.queryObject.fromPage
      delete this.queryObject.keyword
      if (this.tempObject.name === '') {
        this.isRefresh = 'refresh'
        this.currentPage = 1
        this.swiperCount = 0
        this.refresher()
      } else if (this.tempObject.name === this.mallTabVal) {
        this.refresher()
      } else if (this.tempObject.standards) {
        delete this.queryObject.noBack
        this.mallTabVal = this.tempObject.name || ''
      }
    } else {
      this.hideLoading()
    }
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    ...mapActions(['configVal']),
    selectCard (val) {
      this.cardIndex = val
      if (val === '1') {
        console.log('分享名片')
        this.isShare = true
      } else if (val === '2') {
        console.log('保存名片')
      } else {
        console.log('交换名片')
        this.isExchange = true
      }
    },
    selectTab (val) {
      this.tabIndex = val
    },
    phoneCall () {
      mpvue.makePhoneCall({
        phoneNumber: '110'
      })
    },
    getStar (cellIndex, clickIndex) {
      // console.log(cellIndex, clickIndex)
      this.starList.map((item, index) => {
        if (cellIndex === index) {
          item.num = clickIndex + 1
          item.star = [
            'http://xymobile.xingyun361.com/2021Q2-score-no.png',
            'http://xymobile.xingyun361.com/2021Q2-score-no.png',
            'http://xymobile.xingyun361.com/2021Q2-score-no.png',
            'http://xymobile.xingyun361.com/2021Q2-score-no.png',
            'http://xymobile.xingyun361.com/2021Q2-score-no.png'
          ]
          for (let i = clickIndex; i >= 0; i--) {
            item.star[i] = 'http://xymobile.xingyun361.com/2021Q2-score-yes.png'
          }
        }
      })
    },
    confirmApprise () {
      console.log('提交评价')
    },
    addWX () {
      this.confirm({content: '业务员微信', title: this.WX, confirmText: '立即添加', confirmColor: '#0077FF'}).then(res => {
        if (res === 'confirm') {
          mpvue.setClipboardData({
            data: this.WX,
            success (res) {
              mpvue.showToast({
                title: '复制成功',
                icon: 'success',
                duration: 1500
              })
            }
          })
        }
      })
    },
    addQQ () {
      this.confirm({content: '业务员QQ', title: this.QQ, confirmText: '立即添加', confirmColor: '#0077FF'}).then(res => {
        if (res === 'confirm') {
          mpvue.setClipboardData({
            data: this.QQ,
            success (res) {
              mpvue.showToast({
                title: '复制成功',
                icon: 'success',
                duration: 1500
              })
            }
          })
        }
      })
    },
    cancelShare () {
      this.isShare = false
      this.cardIndex = ''
    },
    cancelExchange () {
      this.isExchange = false
      this.cardIndex = ''
    },
    confirmExchange () {
      console.log('提交名片')
    },
    goCompanyInfo () {
      this.jump('/pages/vendor/companyInfo/main')
    },
    getInfo () {
      this.httpGet(this.apiList.zf.businesscardInfo + '?name=王旭东', {}).then((res) => {
        console.log(res)
      }).catch((e) => {
        this.showErrMsg(e.message)
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
.main
  height:426rpx;
  width:93%;
  margin-left:3%;
  border-radius 15rpx;
  overflow hidden
  .half
    height: 0;
    width: 426rpx;
    border-top: 437rpx solid green;
    border-right: 150rpx solid transparent;
    overflow hidden
  .info
    height: 0;
    width: 436rpx;
    border-bottom: 437rpx solid white;
    border-left: 150rpx solid transparent;
    margin-left: -120rpx;
    // overflow hidden
    .name
      height 158rpx
      width 326rpx
      background-image url(http://xymobile.xingyun361.com/card_bg.png)
      background-size cover
      margin-left: -62rpx;
      margin-top: 30rpx;
    .num
      margin-top 26rpx
      .num-img
        height 30rpx
        width 30rpx
        margin-left 10rpx
.card
  width:93%;
  margin-left:3%;
  .card-blue
    color #3675FE
    border 2rpx solid #3675FE
    width 226rpx
    height 90rpx
    text-align center
    line-height 90rpx
    border-radius 4rpx
    &.active-card
      color #ffffff
      background-color #3675FE

.link
  width:93%;
  margin-left:3%;
  border-radius 4rpx
  .cell-white-img
    height 35rpx
    width 35rpx
    margin-right 10rpx
  .card-link
    width 226rpx
    height 140rpx
    box-shadow 0px 8px 13px 0px rgba(0, 0, 0, 0.09)
.about
  width:93%;
  margin-left:3%;
  border-radius 4rpx
  .active-tab
    position relative
    display inline-block
    color #000
    &::after
      content: "";
      position absolute
      left 50%;
      bottom 0;
      transform translateX(-50%)
      height 6rpx
      width 42rpx
      background-color: #3675FE
.me
  width:93%;
  margin-left:3%;
  margin-bottom 120rpx;
  .card-content
    border-radius 4rpx
  .stars
    padding 20rpx 20rpx 40rpx 20rpx
    background-color #fff
    .cell
      margin-top 25rpx
      .cell-title
        display flex
        align-items center
        margin-bottom 15rpx
        .cell-title-main
          color #262626
          font-size 28rpx
          margin-right 10rpx
        .cell-title-tag
          color #888888
          font-size 22rpx
          border 2rpx solid #888888
          padding 0 4rpx
      .cell-stars
        display flex
        align-items center
        margin-left 160rpx
        .cell-star
          height 35rpx
          width 35rpx
          margin-right 40rpx
    .star-btn
      width: 388rpx;
      height: 90rpx;
      background: #3675FE;
      border-radius: 4rpx;
      color: #fff;
      font-size: 28rpx;
      margin-top: 40rpx;
      text-align: center;
      line-height: 90rpx;
      margin-left: 50%;
      transform: translateX(-50%);
.go
  width: 100%;
  height: 98rpx;
  line-height: 98rpx;
  text-align: center;
  background: #FFFFFF;
  box-shadow: 0px -2px 10px 0px rgba(0, 0, 0, 0.09);
  position: fixed;
  bottom: 0;
  left: 0;
.mask
  z-index: 998;
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color:rgba(0, 0, 0, 0.7)
  .share
    position fixed
    bottom: 0;
    left: 0;
    width: 100%;
    z-index 999
    background: #FFFFFF;
    .shareimg
      height 90rpx
      width 90rpx
    .border-top
      border-top 1rpx solid #ccc
      height 90rpx
      line-height 90rpx
      text-align center
  .exchange
    position fixed
    bottom: 0;
    left: 0;
    width: 100%;
    z-index 999
    background: #FFFFFF;
    height 858rpx;
    border-radius 40rpx 40rpx 0 0;
    .top
      height 90rpx
      padding 0 20rpx
    .form
      height 768rpx
      input
        height 100rpx
        text-indent 20rpx
      .cell
        width 90%;
.company
  position fixed;
  right 40rpx;
  bottom 350rpx;
  width: 120rpx;
  height: 100rpx;
  background: #FFFFFF;
  box-shadow: 0px -4px 20px 0px rgba(0, 0, 0, 0.13);
  border-radius: 8rpx;
  .company-img
    height 40rpx
    width 40rpx
</style>
