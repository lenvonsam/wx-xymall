<template lang="pug">
div
  nav-bar(title="电子名片", isBack)
  .main.flex.mt-10
    .half
      img(:src="urlImg",style="height:100%;width:100%;")
    .info
      .name.flex.flex-direction.justify-center.align-center
        .ft-20.text-bold {{businessUserName}}
        .ft-15.text-gray {{departmentName}} {{positionName}}
        .ft-12.text-gray {{unitName}}
      .num.flex.flex-direction.justify-center.align-end
        .flex.align-center.margin-bottom-s.margin-right
          .text-gray.ft-13 {{phone}}
          img.num-img(src="/static/images/card_tel.png")
        .flex.align-center.margin-bottom-s.margin-right
          .text-gray.ft-13 {{WX}}
          img.num-img(src="/static/images/card_wx.png")
        .flex.align-center.margin-bottom-s.margin-right
          .text-gray.ft-13 {{QQ}}
          img.num-img(src="/static/images/card_qq.png")
        .flex.align-center.margin-bottom-s.margin-right
          .text-gray.ft-13 {{mail}}
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
      .ft-12.text-gray {{phone}}
    .bg-white.card-link.flex.flex-direction.justify-center.align-center.border-radius(@click="addWX")
      .flex.align-center.margin-bottom-xs
        img.cell-white-img(src="/static/images/card_wx_blue.png")
        span.text-bold 加我微信
      .ft-12.text-gray.overflow-hidden {{WX}}
    .bg-white.card-link.flex.flex-direction.justify-center.align-center.border-radius(@click="addQQ")
      .flex.align-center.margin-bottom-xs
        img.cell-white-img(src="/static/images/card_qq_blue.png")
        span.text-bold 加我QQ
      .ft-12.text-gray {{QQ}}
  .about.bg-white.flex.mt-10
    .text-bold.padding.ft-14.text-gray(@click="selectTab('1')", :class="tabIndex === '1' ? 'active-tab' : ''") 关于我
    .text-bold.padding.ft-14.text-gray(v-if="isSalesman === 0" @click="selectTab('2')", :class="tabIndex === '2' ? 'active-tab' : ''") 评价我 {{openId}}
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
            span.cell-title-tag {{pitem.subTitle[pitem.num].name}}
          .cell-stars
            img.cell-star(
              v-for="(item, index) in pitem.star",
              :key="index",
              :src="item",
              @click="getStar(pidx, index)"
            )
        .star-btn(@click="confirmApprise" v-if="!isSelf && !haveRemarked") 提交评价
        .text-center.ft-12.text-gray.mt-20(v-else) 共{{remarkNum}}个评价
  .mask(v-if="isShare")
    .share
      .text-gray.ft-14.text-center.padding-top 分享至
      .flex.justify-center.align-center
        button.share-btn.flex.flex-direction.align-center.justify-center.padding(plain="true" open-type="share")
          img.margin-bottom-xs.shareimg(src="/static/images/card_alert_wx.png")
          .text-gray.ft-13 微信好友
        // button.share-btn.flex.flex-direction.align-center.justify-center.padding(plain="true" open-type="share")
        //   img.margin-bottom-xs.shareimg(src="/static/images/card_alert_quan.png")
        //   .text-gray.ft-13 微信朋友圈
      .ft-16.border-top(@click="cancelShare") 取消
  .mask(v-if="isSave")
    .save.flex.flex-direction.align-center.relative
      .close
        img(src="/static/images/close.jpg", @click="closePoster", style="position:absolute;top:0rpx;right:0rpx;height:50rpx;width:50rpx;z-index:999;")
      img(:src="posterImg", style="height:1000rpx;width:550rpx")
      .save-btn(@click="saveToAlbum") 保存名片至相册
  .mask(v-if="isExchange")
    .exchange
      .top.flex.justify-between.align-center.bg-gray
        .ft-14.text-gray.text-bold(@click="cancelExchange") 关闭
        .ft-15.text-bold 交换名片
        .ft-14.text-blue.text-bold(@click="confirmExchange") 提交
      .form.flex.flex-direction.justify-around.align-center
        .cell
          .ft-14.margin-bottom-xs.text-bold 公司名称
          input.bg-gray.pl-10(placeholder="点击输入", v-model="customCompany")
        .cell
          .ft-14.margin-bottom-xs.text-bold 客户姓名
          input.bg-gray.pl-10(placeholder="点击输入", v-model="customName")
        .cell
          .ft-14.margin-bottom-xs.text-bold 联系方式
          input.bg-gray.pl-10(placeholder="点击输入", v-model="customPhone")
        .cell
          .ft-14.margin-bottom-xs.text-bold 需求物资（选填）
          input.bg-gray.pl-10(placeholder="点击输入", v-model="customNeed")
  .company.flex.flex-direction.align-center.justify-center(@click="goCompanyInfo")
    img.company-img(src="/static/images/card_company.png")
    .ft-12.text-bold 公司介绍
  .empty
  .go.text-bold.ft-14(@click="goShop") {{isSalesman === 0 ? '去型云采购' : '去型云商城'}}
  alert(:msg="alertText", v-model="alertShow", :cb="alertCb")
</template>
<script>
import { mapState, mapActions } from 'vuex'

export default {
  components: {

  },
  data () {
    return {
      urlImg: 'http://xymobile.xingyun361.com/defaultHead.png',
      cardIndex: '0',
      tabIndex: '1',
      cardId: '',
      businessUserName: '',
      departmentName: '',
      positionName: '',
      unitName: '',
      phone: '',
      WX: '',
      QQ: '',
      mail: '',
      responsibleArea: '', // 主要负责
      goodAt: '', // 擅长
      customCompany: '',
      customName: '',
      customPhone: '',
      customNeed: '',
      isSalesman: '',
      isShare: false,
      isSave: false,
      isExchange: false,
      posterImg: '',
      haveRemarked: false,
      remarkNum: 0,
      optionId: '',
      optionCardId: '',
      isSelf: false,
      aboutMeList: [],
      alertShow: false,
      alertText: '',
      starList: [
        {
          name: 'xjxy',
          title: '询价响应',
          subTitle: [],
          // subTitle: [
          //   '请您评价',
          //   '没有相应',
          //   '虚报价格',
          //   '需要等待',
          //   '正常回复',
          //   '快速回复'
          // ],
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
          subTitle: [],
          // subTitle: [
          //   '请您评价',
          //   '恶语相向',
          //   '爱理不理',
          //   '延迟冷漠',
          //   '正常开单',
          //   '热情耐心'
          // ],
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
          subTitle: [],
          // subTitle: [
          //   '请您评价',
          //   '毫不配合',
          //   '借故推脱',
          //   '指引模糊',
          //   '正常提货',
          //   '高效有序'
          // ],
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
          subTitle: [],
          // subTitle: [
          //   '请您评价',
          //   '拒不处理',
          //   '推三阻四',
          //   '延时解决',
          //   '正常跟踪',
          //   '圆满解决'
          // ],
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
          subTitle: [],
          // subTitle: [
          //   '请您评价',
          //   '非常恶劣',
          //   '评价较低',
          //   '质量一般',
          //   '正常服务',
          //   '非常满意'
          // ],
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
    this.isSelf = false
    this.haveRemarked = false
    this.isShare = false
    this.isSave = false
    this.isExchange = false
  },
  onLoad (options) {
    // this.wxAuthLogin()
    // mpvue.showShareMenu({
    //   withShareTicket: true,
    //   menus: ['shareAppMessage', 'shareTimeline']
    // })
    Object.assign(this.$data, this.$options.data())
    mpvue.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage']
    })
    if (options.id) {
      console.log('客户打开分享小程序页面进入id:' + options.id)
      // var newScene = scene.split('=')
      // console.log(newScene)
      this.optionId = options.id
      this.getInfoByName(options.id) // 这里的id指name
    } else if (options.cardId) {
      console.log('客户扫海报进入id:' + options.cardId)
      this.optionCardId = options.cardId
      this.getInfoById(options.cardId)
    } else {
      console.log('业务员打开页面进入id')
      if (this.isLogin) {
        this.isSelf = true
        this.getInfoByName()
      }
    }
  },
  onShow () {
    if (this.isLogin) {
      if (this.optionId) {
        this.getInfoByName(this.optionId) // 这里的id指name
      } else if (this.optionCardId) {
        this.getInfoById(this.optionCardId)
      } else {
        this.getInfoByName()
      }

      // 获取业务员平均分
      if (this.cardId && this.currentUser.name) {
        this.getDisplayRemarkInfo()
      }
    }
    this.getOptionsData()
  },
  // 转发分享
  onShareAppMessage (res) {
    let nickName = this.businessUserName // 业务员名称
    return {
      title: `${nickName}的电子名片`,
      path: '/pages/vendor/businessCard/main?id=' + nickName,
      success: function (res) {
        console.log('分享成功')
      }
    }
  },
  // onShareTimeline (res) {
  //   let nickName = this.businessUserName // 业务员名称
  //   return {
  //     title: `${nickName}的电子名片`,
  //     path: '/pages/vendor/businessCard/main?id=' + nickName,
  //     imageUrl: 'http://xymobile.xingyun361.com/2021Q2-score-no.png'
  //   }
  // },
  methods: {
    ...mapActions(['configVal']),
    alertCb () {
      if (this.isLogin) {
        if (this.currentUser.type === 'seller') {
          this.tab('/pages/me/main')
        }
      } else {
        this.jump('/pages/account/login/main')
      }
    },
    closePoster () {
      this.isSave = false
      this.cardIndex = ''
    },
    async selectCard (val) {
      this.cardIndex = val
      if (!this.isLogin) {
        this.jump('/pages/account/login/main')
        this.isShare = false
        this.isSave = false
        this.isExchange = false
        this.cardIndex = ''
        return
      }
      if (val === '1') {
        console.log('分享名片')
        this.isShare = true
      } else if (val === '2') {
        console.log('保存名片')
        // mpvue.showLoading({
        //   title: '名片生成中...',
        //   mask: true
        // })
        // try {
        //   const res = await this.requestDecode('zf', this.zfProxy + 'businesscard/public/businessCard/getBusinessCardPoster?id=' + this.cardId, {}, 'get', 'utf8')
        //   console.log('res:>>', res)
        //   mpvue.hideLoading()
        //   let imgBase64 = res.data
        //   if (imgBase64 !== null) {
        //     const reg = /\s/g
        //     imgBase64 = imgBase64.replace(reg, '+')
        //   }
        //   this.isSave = true
        // } catch (err) {
        //   console.log(err)
        // }
        this.posterImg = this.zfBASICURL + 'businesscard/public/businessCard/getBusinessCardPoster?id=' + this.cardId
        this.isSave = true
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
        phoneNumber: this.phone || ''
      })
    },
    getStar (cellIndex, clickIndex, transform = false) {
      // console.log(cellIndex, clickIndex)
      // if (this.haveRemarked) {
      //   return
      // }

      // 如果是业务员或者已经评价过的用户，无法进行点击
      if (!transform && (this.isSelf || this.haveRemarked)) {
        console.log('是业务员或者已经评价过的用户，无法进行点击')
        return false
      } else {
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
      }
    },
    // 评价业务员
    async confirmApprise () {
      if (!this.isLogin) {
        this.jump('/pages/account/login/main')
        this.isShare = false
        this.isSave = false
        this.isExchange = false
        this.cardIndex = ''
        return
      }
      console.log('提交评价')
      try {
        if (this.starList[0].num === 0) {
          mpvue.showToast({
            title: '请对询价响应进行评价',
            icon: 'none'
          })
        } else if (this.starList[1].num === 0) {
          mpvue.showToast({
            title: '请对开单态度进行评价',
            icon: 'none'
          })
        } else if (this.starList[2].num === 0) {
          mpvue.showToast({
            title: '请对配合提货进行评价',
            icon: 'none'
          })
        } else if (this.starList[3].num === 0) {
          mpvue.showToast({
            title: '请对异议跟踪进行评价',
            icon: 'none'
          })
        } else if (this.starList[4].num === 0) {
          mpvue.showToast({
            title: '请对满意程度进行评价',
            icon: 'none'
          })
        } else {
          let params = {
            businessCardId: this.cardId, // 名片id
            unitName: this.currentUser.name, // 客户名称
            departmentName: this.departmentName, // 业务员部门
            businessUserName: this.businessUserName, // 业务员姓名
            positionName: this.positionName, // 业务员职位名称
            scoreInquiryResponse: this.starList[0].num,
            scoreOrderAttitude: this.starList[1].num,
            scoreCooperateDelivery: this.starList[2].num,
            scoreObjectionTrack: this.starList[3].num,
            scoreSatisfaction: this.starList[4].num
          }
          const res = await this.httpPost(this.apiList.zf.businessRemarkAdd.url, params)
          // const res = await this.requestDecode('zf', this.zfProxy + this.apiList.zf.businessRemarkAdd.url, params, this.apiList.zf.businessCustomerAdd.method, 'utf8')
          if (res.success) {
            mpvue.showToast({
              title: '评价成功'
            })
            this.getDisplayRemarkInfo()
          }
        }
      } catch (err) {
        console.log(err)
      }
    },
    addWX () {
      this.confirm({ content: '业务员微信', title: this.WX, confirmText: '立即添加', confirmColor: '#0077FF' }).then(res => {
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
      this.confirm({ content: '业务员QQ', title: this.QQ, confirmText: '立即添加', confirmColor: '#0077FF' }).then(res => {
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
    saveToAlbum () {
      this.isSave = false
      this.cardIndex = ''
      mpvue.showLoading({
        title: '保存中...',
        mask: true
      })
      console.log(this.posterImg)
      wx.downloadFile({
        url: this.posterImg, // 资源图片
        success: res => {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          if (res.statusCode === 200) {
            console.log(res.tempFilePath)
            mpvue.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: (result) => {
                console.log('result', result)
                mpvue.showToast({
                  title: '保存成功'
                })
              },
              fail: (res) => {
                console.log(res)
                this.cardIndex = ''
                if (
                  res.errMsg === 'saveImageToPhotosAlbum:fail auth deny' ||
                  res.errMsg === 'saveImageToPhotosAlbum:fail:auth denied' ||
                  res.errMsg === 'saveImageToPhotosAlbum:fail authorize no response'
                ) {
                  mpvue.showModal({
                    title: '提示',
                    content: '需要授权才可保存图片',
                    showCancel: false,
                    success (res) {
                      if (res.confirm) {
                        // 调出权限设置界面
                        mpvue.openSetting({
                          // 成功调出权限设置界面
                          success (settingdata) {
                            // 如果在界面中手动设置了保存到相册权限
                            if (settingdata.authSetting['scope.writePhotosAlbum']) {
                              mpvue.showToast({
                                title: '获取权限成功，再次点击可保存图片',
                                icon: 'none',
                                duration: 2000
                              })
                            } else {
                              mpvue.showToast({
                                title: '获取权限失败',
                                icon: 'none',
                                duration: 2000
                              })
                            }
                          },
                          fail () {
                            mpvue.showToast({
                              title: '获取权限失败',
                              icon: 'none',
                              duration: 2000
                            })
                          }
                        })
                      }
                    }
                  })
                } else {
                  mpvue.showToast({
                    title: '保存失败',
                    icon: 'none'
                  })
                }
              },
              complete: () => {
                this.cardIndex = ''
                setTimeout(() => {
                  mpvue.hideLoading()
                }, 1500)
              }
            })
          }
        },
        fail: err => {
          console.log('下载图片失败', err)
        }
      })
    },
    cancelExchange () {
      this.isExchange = false
      this.cardIndex = ''
    },
    // 交换名片
    async confirmExchange () {
      console.log('提交名片')
      if (!this.customCompany.trim()) {
        mpvue.showToast({
          title: '请填写公司名称',
          icon: 'none'
        })
        return
      }
      if (!this.customName.trim()) {
        mpvue.showToast({
          title: '请填写姓名',
          icon: 'none'
        })
        return
      }
      if (!this.customPhone.trim()) {
        mpvue.showToast({
          title: '请填写联系方式',
          icon: 'none'
        })
        return
      }
      if (!this.phoneReg.test(this.customPhone.trim())) {
        mpvue.showToast({
          title: '请填写正确的联系方式',
          icon: 'none'
        })
        return
      }
      let params = {
        businessCardId: this.cardId, // 业务员名片id
        unitName: this.customCompany,
        customerName: this.customName,
        linkPhone: this.customPhone,
        demandMaterials: this.customNeed
      }
      try {
        const res = await this.httpPost(this.apiList.zf.businessCustomerAdd.url, params)
        // const res = await this.requestDecode('zf', this.zfProxy + this.apiList.zf.businessCustomerAdd.url, params, this.apiList.zf.businessCustomerAdd.method, 'utf8')
        if (res.success) {
          mpvue.showToast({
            title: '交换成功'
          })
          this.isExchange = false
          this.cardIndex = ''
        }
      } catch (err) {
        console.log(err)
      }
    },
    goCompanyInfo () {
      this.jump('/pages/vendor/companyInfo/main?isSalesman=' + this.isSalesman)
    },
    goShop () {
      this.tab('/pages/mall/main')
    },
    // 获取业务员名片信息
    async getInfoByName (id) {
      let cardId = ''
      if (id) {
        cardId = id
      } else {
        cardId = this.currentUser.name
      }
      console.log('cardId>>>', cardId)
      // console.log(this.zfProxy + 'businesscard/public/businessCard/getInfoByName?name=' + cardId)
      try {
        const res = await this.httpGet(this.apiList.zf.getInfoByName.url + '?name=' + encodeURIComponent(cardId))
        // const res = await this.requestDecode('zf', this.zfProxy + this.apiList.zf.getInfoByName.url + '?name=' + encodeURIComponent(cardId), {}, this.apiList.zf.getInfoByName.method, 'utf8')
        console.log('+++++', res)
        let data = res.data
        console.log(data)
        this.cardId = data.id
        this.businessUserName = data.businessUserName
        this.departmentName = data.departmentName
        this.positionName = data.positionName
        this.unitName = data.unitName
        this.WX = data.weixinNumber
        this.QQ = data.qqNumber
        this.phone = data.phone
        this.mail = data.mail
        this.isSalesman = data.isSalesman
        this.responsibleArea = data.mainAreaResponsibility
        this.goodAt = data.goodAt
        console.log('*****', this.cardId, this.businessUserName, this.departmentName)
        this.urlImg = this.zfBASICURL + this.apiList.zf.getBusinessCardHead2Base64.url + '?id=' + this.cardId
        if (data.isSalesman === 0) {
          this.aboutMeList = [
            {
              title: '主要负责区域',
              detail: data.mainAreaResponsibility || ''
            },
            {
              title: '擅长型材品类',
              detail: data.goodAtCategory || ''
            }
          ]
        } else {
          this.aboutMeList = [
            {
              title: '个人介绍',
              detail: data.introduce || ''
            }
          ]
        }
        // 如果是业务员自己打开分享内容
        if (this.isLogin) {
          if (this.businessUserName === this.currentUser.name) {
            console.log('业务员自己打开分享内容')
            this.isSelf = true
          } else {
            this.isSelf = false
          }
        }
        // this.getHeadImg()
        this.getDisplayRemarkInfo()
      } catch (err) {
        mpvue.hideToast()
        console.log('>>>', err)
        if (this.currentUser.type === 'seller') {
          this.alertShow = true
          this.alertText = '请先录入您的电子名片'
        }
      }
    },
    // 获取业务员名片信息
    async getInfoById (id) {
      const cardId = id
      // console.log(this.zfProxy + 'businesscard/public/businessCard/getInfoByName?name=' + cardId)
      try {
        const res = await this.httpGet(this.apiList.zf.getInfoById.url + '?id=' + encodeURIComponent(cardId))
        // const res = await this.requestDecode('zf', this.zfProxy + this.apiList.zf.getInfoById.url + '?id=' + encodeURIComponent(cardId), {}, this.apiList.zf.getInfoById.method, 'utf8')
        console.log('+++++', res)
        let data = res.data
        console.log(data)
        this.cardId = data.id
        this.businessUserName = data.businessUserName
        this.departmentName = data.departmentName
        this.positionName = data.positionName
        this.unitName = data.unitName
        this.WX = data.weixinNumber
        this.QQ = data.qqNumber
        this.phone = data.phone
        this.mail = data.mail
        this.responsibleArea = data.mainAreaResponsibility
        this.goodAt = data.goodAt
        this.urlImg = this.zfBASICURL + this.apiList.zf.getBusinessCardHead2Base64.url + '?id=' + this.cardId
        this.aboutMeList = [
          {
            title: '主要负责区域',
            detail: data.mainAreaResponsibility || ''
          },
          {
            title: '擅长型材品类',
            detail: data.goodAtCategory || ''
          }
        ]
        console.log(this.cardId, this.businessUserName, this.departmentName)
        // 如果是业务员自己打开分享内容
        if (this.isLogin) {
          if (this.businessUserName === this.currentUser.name) {
            console.log('业务员自己打开分享内容')
            this.isSelf = true
          } else {
            this.isSelf = false
          }
        }
        // this.getHeadImg()
        this.getDisplayRemarkInfo()
      } catch (err) {
        mpvue.hideToast()
        console.log('>>>', err)
        if (this.currentUser.type === 'seller' && err === '查询数据信息有误，可能是name重复或没有数据！') {
          this.alertShow = true
          this.alertText = '请先录入您的电子名片'
        }
      }
    },
    // 获取用户头像
    // async getHeadImg () {
    //   try {
    //     const res = await this.requestDecode('zf', this.zfProxy + this.apiList.zf.getBusinessCardHead2Base64.url + '?id=' + this.cardId, {}, this.apiList.zf.getBusinessCardHead2Base64.method, 'utf8')
    //     let imgBase64 = res.data
    //     if (imgBase64 !== null) {
    //       const reg = /\s/g
    //       imgBase64 = imgBase64.replace(reg, '+')
    //     }
    //     this.urlImg = imgBase64
    //     this.urlImg = imgBase64
    //   } catch (err) {
    //     console.log(err)
    //   }
    // },
    // getHeadImg () {
    //   wx.request({
    //     url: this.zfProxy + this.apiList.zf.getBusinessCardHead2Base64.url + '?id=' + this.cardId,
    //     method: this.apiList.zf.getBusinessCardHead2Base64.method,
    //     header: {
    //       'PlatformId': 'ZF',
    //       'content-type': 'application/json' // 默认值
    //     },
    //     success: res => {
    //       console.log(res)
    //       if (res.data) {
    //         this.urlImg = res.data
    //       }
    //     },
    //     fail: err => {
    //       console.log(err)
    //     }
    //   })
    // },
    // 获取评价信息
    async getOptionsData () {
      try {
        const res = await this.httpGet(this.apiList.zf.getOptionsData.url)
        // const res = await this.requestDecode('zf', this.zfProxy + this.apiList.zf.getOptionsData.url, {}, this.apiList.zf.getOptionsData.method, 'utf8')
        let data = res.data
        let defaultSubTitle = [{ name: '请您评价' }]
        this.starList[0].subTitle = defaultSubTitle.concat(data.inquiryResponse)
        this.starList[1].subTitle = defaultSubTitle.concat(data.orderAttitude)
        this.starList[2].subTitle = defaultSubTitle.concat(data.cooperateDelivery)
        this.starList[3].subTitle = defaultSubTitle.concat(data.objectionTrack)
        this.starList[4].subTitle = defaultSubTitle.concat(data.satisfaction)
      } catch (err) {
        console.log(err)
      }
    },
    // 获取平均分
    async getDisplayRemarkInfo () {
      try {
        const res = await this.httpGet(this.apiList.zf.displayRemarkInfo.url + '?businessCardId=' + this.cardId + '&unitName=' + encodeURIComponent(this.currentUser.name))
        // const res = await this.requestDecode('zf', this.zfProxy + this.apiList.zf.displayRemarkInfo.url + '?businessCardId=' + this.cardId + '&unitName=' + encodeURIComponent(this.currentUser.name), {}, this.apiList.zf.displayRemarkInfo.method, 'utf8')
        let data = res.data
        console.log('获取平均分')
        console.log(data)
        this.haveRemarked = data.haveRemarked
        this.remarkNum = data.remarkNum
        if (this.haveRemarked) {
          this.starList[0].num = data.inquiryResponse - 1
          this.starList[1].num = data.orderAttitude - 1
          this.starList[2].num = data.cooperateDelivery - 1
          this.starList[3].num = data.objectionTrack - 1
          this.starList[4].num = data.satisfaction - 1
          this.getStar(0, data.inquiryResponse - 1, true)
          this.getStar(1, data.orderAttitude - 1, true)
          this.getStar(2, data.cooperateDelivery - 1, true)
          this.getStar(3, data.objectionTrack - 1, true)
          this.getStar(4, data.satisfaction - 1, true)
        } else {
          // this.starList[0].num = 0
          // this.starList[1].num = 0
          // this.starList[2].num = 0
          // this.starList[3].num = 0
          // this.starList[4].num = 0
          // this.starList[0].star = -1
          // this.starList[1].star = -1
          // this.starList[2].star = -1
          // this.starList[3].star = -1
          // this.starList[4].star = -1
          this.starList.forEach(item => {
            item.num = 0
            item.star = [
              'http://xymobile.xingyun361.com/2021Q2-score-no.png',
              'http://xymobile.xingyun361.com/2021Q2-score-no.png',
              'http://xymobile.xingyun361.com/2021Q2-score-no.png',
              'http://xymobile.xingyun361.com/2021Q2-score-no.png',
              'http://xymobile.xingyun361.com/2021Q2-score-no.png'
            ]
          })
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.main
  height 400rpx
  width 93%
  margin-left 3%
  border-radius 15rpx
  overflow hidden
  box-shadow 0px 8px 13px 0px rgba(0, 0, 0, 0.09)
  .half
    height 100%
    width 300rpx
    // border-top: 437rpx solid green;
    // border-right: 150rpx solid transparent;
    // overflow hidden
  .info
    // height: 0;
    // width: 436rpx;
    // border-bottom: 437rpx solid white;
    // border-left: 150rpx solid transparent;
    // margin-left: -120rpx;
    // overflow hidden
    height 100%
    width calc(100% - 300rpx)
    background-color #fff
    .name
      height 158rpx
      width 100%
      background-image url('http://xymobile.xingyun361.com/card_img_a.png') // xymobile.xingyun361.com/card_bg.png)
      background-size cover
      // margin-left: -62rpx;
      // margin-top: 30rpx;
    .num
      margin-top 26rpx
      .num-img
        height 30rpx
        width 30rpx
        margin-left 10rpx
.card
  width 93%
  margin-left 3%
  .card-blue
    color #3675FE
    border 2rpx solid #3675FE
    width 226rpx
    height 90rpx
    text-align center
    line-height 90rpx
    border-radius 4rpx
    box-shadow 0px 8px 13px 0px rgba(0, 0, 0, 0.09)
    &.active-card
      color #ffffff
      background-color #3675FE
.link
  width 93%
  margin-left 3%
  border-radius 4rpx
  .cell-white-img
    height 35rpx
    width 35rpx
    margin-right 10rpx
  .card-link
    width 226rpx
    height 140rpx
    box-shadow 0px 8px 13px 0px rgba(0, 0, 0, 0.09)
    text-align center
.about
  width 93%
  margin-left 3%
  border-radius 4rpx
  .active-tab
    position relative
    display inline-block
    color #000
    &::after
      content ''
      position absolute
      left 50%
      bottom 0
      transform translateX(-50%)
      height 6rpx
      width 42rpx
      background-color #3675FE
.me
  width 93%
  margin-left 3%
  margin-bottom 60rpx
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
      width 388rpx
      height 90rpx
      background #3675FE
      border-radius 4rpx
      color #fff
      font-size 28rpx
      margin-top 40rpx
      text-align center
      line-height 90rpx
      margin-left 50%
      transform translateX(-50%)
.empty
  width 100%
  height 98rpx
.go
  width 100%
  height 98rpx
  line-height 98rpx
  text-align center
  background #FFFFFF
  box-shadow 0px -2px 10px 0px rgba(0, 0, 0, 0.09)
  position fixed
  bottom 0
  left 0
.mask
  z-index 998
  height 100%
  width 100%
  position fixed
  top 0
  left 0
  bottom 0
  right 0
  background-color rgba(0, 0, 0, 0.7)
  .share
    position fixed
    bottom 0
    left 0
    width 100%
    z-index 999
    background #FFFFFF
    .share-btn
      width 200rpx
      border none
    .shareimg
      height 90rpx
      width 90rpx
    .border-top
      border-top 1rpx solid #ccc
      height 90rpx
      line-height 90rpx
      text-align center
  .save
    position fixed
    top 50%
    left 50%
    transform translate(-50%, -45%)
    width 550rpx
    height 1130rpx
    z-index 999
    background #FFFFFF
    // padding 10rpx
    border-radius 12rpx
    .close
      height 58rpx
      width 58rpx
      background-color #fff
      position absolute
      top 0
      right 0
      border-bottom-left-radius 100%
      z-index 998
    .save-btn
      height 80rpx
      width 380rpx
      background-color #3675FE
      color #fff
      font-size 36rpx
      text-align center
      line-height 80rpx
      margin-top 34rpx
      border-radius 4rpx
  .exchange
    position fixed
    bottom 0
    left 0
    width 100%
    z-index 999
    background #FFFFFF
    height 858rpx
    border-radius 40rpx 40rpx 0 0
    .top
      height 90rpx
      padding 0 20rpx
    .form
      height 768rpx
      input
        height 100rpx
        text-indent 20rpx
      .cell
        width 90%
.company
  position fixed
  right 40rpx
  top 880rpx
  width 120rpx
  height 100rpx
  background #FFFFFF
  box-shadow 0px -4px 20px 0px rgba(0, 0, 0, 0.13)
  border-radius 8rpx
  .company-img
    height 40rpx
    width 40rpx
</style>

