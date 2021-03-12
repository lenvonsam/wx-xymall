<template lang="pug">
div
  nav-bar(title="商城")
  div(style="height: 285rpx;")
    mall-head(:mallTabVal="mallTabVal", @cleanSearch="cleanSearch", @getName="getName", @filter="multipleFilter", @selectMall="selectMall", @selectTab="selectTab", @searchChange="searchChange")

  swiper(v-if="goodsNameList.length > 0", @change="swiperChange", @transition="swiperTransition", :current="swiperCount", :style="{height: scrollHeight+'rpx'}")
    swiper-item(v-for="(tabItem, swiperIdx) in goodsNameList.length", :key="swiperIdx")
      .bg-gray.text-center.text-gray.pt-100(:style="{height: scrollHeight + 'rpx'}", v-if="swiperCount === swiperIdx && !isload && goodsNameList[swiperIdx].data.length === 0")
        empty-image(url="bill_empty.png", className="img-empty")
        .empty-content 
          span 暂时没有相关商品
          div 详情请联系400-8788-361
      template(v-else)
        div(:style="{height: scrollHeight + 'rpx'}")
          iron-scroll(:swiperIdx="swiperIdx", @scrolltolower="loadMore", heightUnit="rpx", :height="scrollHeight", :refresh="true", @onRefresh="onRefresh", :loadFinish="loadFinish")
            //- div(:class="{cardSty: !mallFlag}", :style="{height: scrollHeight + 'rpx', 'padding-top': '6rpx'}")
            div(:class="{cardSty: !mallFlag}", style="margin-top: 8rpx")
              .padding.pr-10.pl-10(v-for="(item,idx) in goodsNameList[swiperIdx].data", :key="idx", :class="!mallFlag ? 'card-list' : 'bg-white margin-bottom-xs'")
                template(v-if="mallFlag === 1")
                  .row
                    .col.text-bold.ft-15
                      span {{item[mallTypeObject[itemType].name]}}
                      span.ml-5 {{item[mallTypeObject[itemType].standard]}}
                      //- .sub-mark.ml-5 {{item[mallTypeObject[itemType].supply]}}
                      //- span.ml-5.ft-12(style="color:#666") ({{weightMark}})
                    .text-right.ft-16
                      span.text-red.ft-13(v-if="item.price === '--'") 开售时间:{{item.show_time}}
                      span.text-blue(v-else-if="isLogin") ￥{{item.price}}
                      .blue-buy.ft-12(v-else, @click="mallItemCb(item, 'showPrice', $event)") 查看价格
                  .row.pt-5.flex-center.ft-12
                    .col.c-gray
                      span {{item[mallTypeObject[itemType].material]}}
                      span.ml-8 {{item[mallTypeObject[itemType].length]}}米
                      span.ml-8 {{item[mallTypeObject[itemType].wh_name]}}
                      .sub-mark.ml-5 {{item[mallTypeObject[itemType].supply]}}
                    .text-right
                      span ({{item.weightMark}})
                  .pt-5.c-gray.ft-12(v-if="item[mallTypeObject[itemType].tolerance] || item[mallTypeObject[itemType].weightRange]")
                    span(v-if="item[mallTypeObject[itemType].tolerance]") 公差范围: {{item[mallTypeObject[itemType].tolerance]}}
                    span.ml-8(v-if="item[mallTypeObject[itemType].weightRange]") 重量范围: {{item[mallTypeObject[itemType].weightRange]}}
                  .row.pt-5.flex-center.ft-13.text-gray
                    .col
                      span(v-if="item[mallTypeObject[itemType].max_count] > 0 && isLogin") {{item[mallTypeObject[itemType].max_count]}}支/{{item[mallTypeObject[itemType].max_weight]}}吨
                      span(v-else) --支/--吨
                    .flex-120.relative.text-right.ft-14.row.justify-end
                      //- .mall-row(:class="{'notice': item.max_count === 0}")
                      .blue-buy(v-if="item.max_count == 0 && isLogin",style="background:#f44336!important", @click="mallItemCb(item, 'notice', $event)") 到货通知
                      .blue-buy(@click="mallItemCb(item, 'cart', $event)", v-else-if="isLogin") 购买
                template(v-else)
                  .ft-15.row
                    span.text-bold {{item[mallTypeObject[itemType].name]}}
                    .supply.margin-left-sm {{item[mallTypeObject[itemType].supply]}}
                  .text-bold
                    span {{item[mallTypeObject[itemType].standard]}}
                  .text-gray.ft-12
                    span {{item[mallTypeObject[itemType].material]}}
                    span.ml-8 {{item[mallTypeObject[itemType].length]}}米
                    span.ml-8 {{item[mallTypeObject[itemType].wh_name]}}
                  .text-gray.ft-12
                    span.ft-10 公差/重量范围
                    span.ml-8 {{item[mallTypeObject[itemType].tolerance] ? item[mallTypeObject[itemType].tolerance] : '--'}}/{{item[mallTypeObject[itemType].weightRange]?item[mallTypeObject[itemType].weightRange]: '--'}}
                  .text-gray.ft-12
                    span(v-if="item[mallTypeObject[itemType].max_count] > 0 && isLogin") {{item[mallTypeObject[itemType].max_count]}}支/{{item[mallTypeObject[itemType].max_weight]}}吨
                    span(v-else) --支/--吨
                  .text-blue.ft-15.text-bold 
                    //- ￥{{item[mallTypeObject[itemType].price]}}
                    span.text-red.ft-13(v-if="item.price === '--'") 开售时间:{{item.show_time}}
                    span(v-else-if="item.show_price === true") ￥{{item[mallTypeObject[itemType].price]}}
                    //- .blue-buy.ft-12(v-else, @click="mallItemCb(item, 'showPrice', $event)") 查看价格
                  .text-gray.flex
                    .ft-11.col ({{item.weightMark}})
                    .text-right
                      //- .blue-buy(v-if="item.max_count == 0 && isLogin",style="background:#f44336!important", @click="mallItemCb(item, 'notice', $event)") 到货通知
                      //- .blue-buy(@click="mallItemCb(item, 'cart', $event)", v-else-if="item.show_price") 购买
                      //- .blue-buy.ft-12(v-else, @click="mallItemCb(item, 'showPrice', $event)", style="padding-top: 2rpx") 查看价格1
                      .blue-buy(v-if="item.max_count == 0 && isLogin",style="background:#f44336!important", @click="mallItemCb(item, 'notice', $event)") 到货通知
                      .blue-buy(@click="mallItemCb(item, 'cart', $event)", v-else-if="isLogin") 购买
                      .blue-buy.ft-12(v-else, @click="mallItemCb(item, 'showPrice', $event)") 查看价格
            //- .padding.text-gray.ft-13.text-center(v-if="loading") 努力加载中...
            //- .padding.text-gray.ft-13.text-center(v-if="goodsNameList[tabIdx].finished") 加载完成
            //- span(v-for="(item,idx) in mallItems", :key="idx") {{idx}}
            //- mall-item(:mallFlag="mallFlag", :cb="mallItemCb", v-for="(item,idx) in mallItems", :item="item", :key="idx")
      
    //- template(v-if="mallItems.length > 0")
    //-   mall-item(:mallFlag="mallFlag", :cb="mallItemCb", v-for="(item,idx) in mallItems", :item="item", :key="idx")
    //- .col.text-center.text-gray.pt-100(v-else)
    //-   empty-image(url="bill_empty.png", className="img-empty")
    //-   .empty-content 您暂时没有相关合同
  modal-intro(v-model="modalIntroShow", :images="introImages", :cb="modalIntroCb")
  //- cart-ball(v-model="ballValue", :cb="ballCb")
  modal(v-model="erpModalShow", @cb="erpModalCb", :title="erpModalTitle" :btns="btn")
    div
      .padding-15 {{erpModalMsg}}
  modal(v-model="modalShow", :title="modalTitle", :btns="modalBtns", @cb="modalCb")
    .padding-sm(v-if="modalMsg == '1'")
      div 恭喜您成为型云用户，您的商城体验天数还剩
        sapn(style="color: red;font-size: 16px;font-weight: 600;") {{trial}}
          sapn(style="color: #000;font-size: 14px;font-weight: 400;") 天，请尽快完善信息哦！
    .padding-sm(v-else-if="modalMsg == '2'")
      div 尊敬的用户，您的商城体验权限时间已经结束，如需继续查看商城物资详情，请尽快完善个人信息并等待审核通过
    .padding-sm(v-else)
      div 恭喜您成为型云用户，您的信息正在审核中，请耐心等待
  modal(v-model="fillModalShow", :title="modalTitle", @cb="fillModalCb")
    .padding-sm {{fillModalMsg}}
</template>
<script>
import { mapState, mapActions } from 'vuex'
import mallHead from '@/components/MallHead'
import mallItem from '@/components/MallItem'
import modalIntro from '@/components/ModalIntro.vue'
import cartBall from '@/components/ParabolicPic.vue'
import modal from '@/components/Modal.vue'
export default {
  components: {
    mallHead,
    mallItem,
    modalIntro,
    cartBall,
    modal
  },
  data () {
    return {
      ballValue: null,
      mallTypeObject: {
        'product': {
          name: 'onlineProductBrandName',
          supply: 'prodAreaName',
          price: 'price',
          standard: 'specification',
          material: 'productTextureName',
          wh_name: 'stockZoneName',
          max_count: 'ratioAvailableAmount',
          max_weight: 'ratioAvailableManagerWeight',
          tolerance: 'toleranceRange',
          length: 'length',
          weightRange: 'weightRange'
        },
        'trove': {
          name: 'product_name',
          supply: 'supply',
          price: 'price',
          standard: 'product_standard',
          material: 'product_material',
          wh_name: 'wh_name',
          max_count: 'max_count',
          max_weight: 'max_weight',
          tolerance: 'tolerance_range',
          length: 'product_length',
          weightRange: 'weight_range'
        }
      },
      weightMark: '',
      itemType: 'product',
      introImages: ['mall_classify.png', 'mall_good.png', 'mall_standard.png'],
      mallTabVal: '',
      mallItems: [],
      queryObject: {},
      isload: true,
      isRefresh: 'refresh',
      pullDownRefresh: false,
      currentPage: 0,
      pageSize: 20,
      mallFlag: 1,
      btnDisable: false,
      goodsNameList: [],
      swiperCount: 0,
      scrollHeight: 0,
      modalIntroShow: false,
      // filterObj: {},
      finished: false,
      loadFinish: 0,
      swiperFirst: 0,
      prevIdx: null,
      modalShow: false,
      erpModalShow: false,
      erpModalTitle: '超时未提货物收费标准',
      erpModalMsg: '对于在库物资，买方在平台上购买物资并支付货款后，应在约定的时间内（系统默认时间为5天）制作提单并提货。超过约定时间未提的合同物资将被判定为违约（超期未提），买方须承担未及时提货而产生的仓储管理费，并于提货时自行与仓库管理方结算。卖方有权对违约合同物资进行处置，进行合同取消并退还对应货款。',
      btn: [{ label: '确定', flag: 'confirm', className: 'main-btn' }],
      modalTitle: '提示',
      modalBtns: [{ label: '确定', flag: 'confirm', className: 'main-btn' }],
      modalMsg: '1',
      fillModalShow: false,
      fillModalMsg: '',
      trial: -1,
      queryObj: {
        pageNum: 1,
        pageSize: 20
      }
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
  onShareAppMessage () {
    return {
      title: '型云商城',
      path: 'pages/mall/main',
      success () {
        this.showMsg('转发成功')
      },
      error () {
        this.showMsg('转发失败')
      }
    }
  },
  onTabItemTap (item) {
    this.statisticRequest({ event: 'click_app_nav_mall' })
  },
  onShow () {
    this.isload = true
    if (this.currentUser.type === 'buyer') {
      // let isAuditing = 0 // 账号是否正在审核中
      // let lastExperienceDay = mpvue.getStorageSync('lastExperienceDay') || ''
      // let isAuditingReminder = mpvue.getStorageSync('isAuditingReminder') || ''
      // let overdueReminder = mpvue.getStorageSync('overdueReminder') || ''
      // this.ironRequest(this.apiList.xy.queryProfile.url, {}, this.apiList.xy.queryProfile.method).then(data => {
      //   if (data.returncode === '0') {
      //     this.trial = data.trial
      //     isAuditing = data.is_auditing
      //     this.currentUser.isnew = data.isnew
      //     if (this.trial > 0) {
      //       if (data.isnew === 1) { // 新用户
      //         if (lastExperienceDay !== this.trial) {
      //           this.modalMsg = '1'
      //           this.modalShow = true
      //           mpvue.setStorageSync('lastExperienceDay', this.trial)
      //         }
      //       } else if (data.isnew === 0 && isAuditing === 1) { // 已完善未审核过
      //         if (isAuditingReminder !== this.getDate()) {
      //           this.modalMsg = '3'
      //           this.modalShow = true
      //           mpvue.setStorageSync('isAuditingReminder', this.getDate())
      //         }
      //       }
      //     } else if (this.trial === 0) { // 超过体验期限
      //       if (overdueReminder !== this.getDate()) {
      //         this.modalMsg = '2'
      //         this.modalShow = true
      //         mpvue.setStorageSync('lastExperienceDay', this.trial)
      //         mpvue.setStorageSync('overdueReminder', this.getDate())
      //         // 超过体验时间，商城显示未登录状态页面
      //       }
      //     } else {
      //       mpvue.setStorageSync('lastExperienceDay', this.trial)
      //     }
      //   } else {
      //     this.showMsg(data.errormsg)
      //     this.exitUser()
      //   }
      // }).catch(e => {
      //   console.log('mall.vue_queryProfile_catch=====>', JSON.stringify(e))
      //   // this.showMsg(e)
      //   this.isLogin = false
      // })
    }

    this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - this.getRpx(this.bottomBarHeight) - 285
    if (this.tempObject.fromPage === 'home') {
      // 首页
      this.mallTabVal = this.tempObject.name
      this.queryObject.name = this.tempObject.name
    } else if (this.tempObject.fromPage === 'search' && this.tempObject.noBack) {
      // 搜索
      this.isRefresh = 'refresh'
      this.currentPage = 0
      this.swiperCount = 0
      this.swiperFirst = 1
      this.queryObject.current_page = this.currentPage
      this.queryObject.name = this.mallTabVal
      this.queryObject.search = this.tempObject.search
      delete this.queryObject.standards
      delete this.queryObject.materials
      delete this.queryObject.supplys
      delete this.queryObject.fromPage
      if (!this.tempObject.name) this.refresher()
    } else if (this.tempObject.fromPage === 'mallFilter' && this.tempObject.noBack) {
      // 分类
      this.swiperFirst = 1
      Object.assign(this.queryObject, this.tempObject)
      delete this.queryObject.fromPage
      delete this.queryObject.search
      if (this.tempObject.name === '') {
        this.isRefresh = 'refresh'
        this.currentPage = 0
        this.swiperCount = 0
        this.refresher()
      } else if (this.tempObject.name === this.mallTabVal) {
        this.refresher()
      } else if (this.tempObject.standards) {
        delete this.queryObject.noBack
        // delete this.queryObject.materials
        // delete this.queryObject.supplys
        // delete this.queryObject.fromPage
        // delete this.queryObject.search
        this.mallTabVal = this.tempObject.name || ''
      }
    } else {
      this.onRefresh()
    }
    // this.refresher()
    if (this.isLogin) {
      // this.setCartCount(this.currentUser.user_id)
      console.log('mall_state.currentUser======>' + JSON.stringify(this.currentUser))
      this.ironRequest(this.apiList.xy.queryProfile.url, {}, this.apiList.xy.queryProfile.method).then(res => {
        if (res.returncode === '0') {
          console.log('mall.vue_接口返回_rule=====>' + res.rule)
          if (this.currentUser.type === 'buyer' && res.rule === 0) {
            this.erpModalShow = true
          } else {
            this.erpModalShow = false
          }
        }
      })
    } else {
      this.tabDot(0)
    }
  },
  onHide () {
    if (this.modalShow) {
      this.modalShow = false
    }
    if (this.fillModalShow) {
      this.fillModalShow = false
    }
    if (this.erpModalShow) {
      this.erpModalShow = false
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.showShareMall()
    })
  },
  methods: {
    ...mapActions(['configVal', 'exitUser']),
    ballCb () {
      console.log('ball cb')
    },
    getDate () {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      date = year + '-' + month + '-' + day
      return date
    },
    modalCb () {
      this.modalShow = false
    },
    fillModalCb (flag) {
      console.log(flag)
      this.fillModalShow = false
      if (flag.toString() === 'confirm') {
        this.jump('/pages/account/companyUpdate/main?type=2')
      }
    },
    cleanSearch () {
      delete this.queryObject.search
      this.onRefresh()
    },
    onRefresh (done) {
      this.isRefresh = 'refresh'
      this.currentPage = 0
      this.refresher(done)
    },
    loadMore () {
      const self = this
      this.throttle(function () {
        self.isload = true
        self.loadFinish = 1
        self.currentPage++
        self.isRefresh = 'reachBottom'
        self.refresher()
      }, 300)
    },
    showShareMall () {
      const firstShare = mpvue.getStorageSync('firstShareMall') || false
      if (!firstShare) {
        this.modalIntroShow = true
        mpvue.setStorageSync('firstShareMall', true)
      }
    },
    swiperTransition (e) {
      // console.log('swiperTransition', e)
      // this.isload = true
    },
    swiperChange (e) {
      console.log('swiperChange---------')
      const idx = e.mp.detail.current
      this.mallTabVal = this.goodsNameList[idx].id
      if (this.goodsNameList[idx]) {
        this.showLoading()
        this.isload = true
        this.isRefresh = 'refresh'
        this.queryObject.current_page = this.currentPage
        this.queryObject.name = this.mallTabVal
        if (this.swiperFirst !== 1) {
          delete this.queryObject.standards
        }
        delete this.queryObject.materials
        delete this.queryObject.supplys
        console.log('swiperFirst', this.swiperFirst)
        const self = this
        setTimeout(() => {
          self.onRefresh()
        }, 100)
        console.log('prevIdx', this.prevIdx)
      }
    },
    getName (list) {
      list.map(item => {
        item.data = []
      })
      this.goodsNameList = list
      this.btnDisable = false
      // this.refresher()
      this.onRefresh()
    },
    multipleFilter (filter) {
      console.log('filter', filter)
      const obj = {}
      Object.keys(filter).forEach((key) => {
        const keyName = `${key}s` === 'origins' ? 'supplys' : `${key}s`
        obj[keyName] = ''
        if (filter[key].length > 0) {
          obj[keyName] = filter[key][0] === '全部' ? '' : filter[key].toString()
        }
      })
      // this.mallItems = []
      this.goodsNameList[this.swiperCount].data = []
      this.currentPage = 0
      this.isRefresh = 'refresh'
      // this.queryObject = {
      //   current_page: this.currentPage,
      //   page_size: this.pageSize,
      //   name: this.mallTabVal,
      //   only_available: 1
      // }
      this.queryObject.current_page = this.currentPage
      this.queryObject.name = this.mallTabVal
      Object.assign(this.queryObject, obj)
      if (!this.tempObject.standards) {
        this.refresher()
      }
    },
    // 切换商城排版格式
    selectMall (flag) {
      console.log(flag)
      this.mallFlag = flag
      this.$forceUpdate()
    },
    searchChange (val) {
      // this.mallItems = []
      this.goodsNameList[this.swiperCount].data = []
      this.currentPage = 0
      this.isRefresh = 'refresh'
      this.queryObject = {
        current_page: this.currentPage,
        page_size: this.pageSize,
        search: val,
        only_available: 1
      }
      this.queryObj.keyword = val
      this.refresher()
    },
    mallItemCb (obj, type, evt) {
      console.log('evt', evt)
      const self = this
      self.ballValue = evt
      if (obj.name === 'H型钢' && obj.price === '--') {
        this.showMsg(`此商品会在${obj.show_time}后开售`)
        return
      }
      if (this.isLogin) {
        switch (type) {
          case 'showPrice':
            // if (this.currentUser.type === 'seller') {
            //   this.showMsg('登录已失效，请重新登录')
            //   return false
            // }
            this.showMsg('请完善信息，耐心等待审批通过')
            break
          case 'notice':
          case 'cart':
            // if (type === 'cart') {
            //   this.currentUser.type === 'seller' ? this.statisticRequest({ event: 'click_app_mall_add_cart_seller' }, true) : this.statisticRequest({ event: 'click_app_mall_add_cart' })
            // }
            if (this.currentUser.userStatus === '01' || this.currentUser.userStatus === '02' || this.currentUser.userStatus === '03') {
              this.fillModalMsg = '请先完善信息'
              this.fillModalShow = true
            } else {
              if (!this.btnDisable) {
                this.btnDisable = true
                obj.num = 1
                this.addCartItem(obj)
                // this.addCart(obj, type, this.currentUser.user_id).then(
                //   rt => {
                //     // self.ballValue = evt
                //     self.showMsg(rt.msg, '', 1000)
                //     // if (type === 'cart') self.setCartCount(self.currentUser.user_id)
                //     self.btnDisable = false
                //   },
                //   err => {
                //     self.showMsg(err === '该商品已经存在于购物车中' ? '该商品已加入购物车' : err)
                //     self.btnDisable = false
                //   }
                // )
              }
            }
            break
          default:
            break
        }
      } else {
        let msg = '请您登录后购买，去登录'
        if (type === 'showPrice') msg = '请登录后查看价格，去登录'
        this.confirm({ content: msg }).then((res) => {
          if (res === 'confirm') {
            self.jump('/pages/account/login/main')
          }
        })
      }
    },
    async addCartItem (obj) {
      obj.cartQuantityType = obj.onlineQuantityType
      const self = this
      await self.httpPost(this.apiList.zf.addCartItem, obj).then(res => {
        console.log(res)
        self.showMsg('加购成功！')
        self.btnDisable = false
      }).catch(e => {
        self.showMsg(e.message)
        self.btnDisable = false
      })
    },
    selectTab ({ id, idx }) {
      if (this.goodsNameList[idx]) {
        this.mallTabVal = id
        this.swiperCount = idx
        console.log('prevIdx', this.prevIdx)
      }
    },
    async refresher (done) {
      try {
        this.showLoading()
        this.loadFinish = 1
        const self = this
        this.queryObject.current_page = this.currentPage
        this.queryObject.page_size = this.pageSize
        // const data = await this.ironRequest(
        //   this.apiList.xy.mallList.url,
        //   this.queryObject,
        //   this.apiList.xy.mallList.method
        // )
        const data = await this.httpPost(this.apiList.zf.shopMallList, this.queryObj)
        const res = data
        // const resData = data.products
        const resData = res.data.stocks
        // const userType = this.currentUser.type
        // if (res.returncode === '0') {
        const idx = this.swiperCount
        resData.map(item => {
          const weightMark = []
          const price = []
          if (item.onlineQuantityType === '02' || item.onlineQuantityType === '00') {
            weightMark.push('磅计')
            price.push(item.ratioPricePound)
            item.max_weight = item.ratioAvailablePoundWeight
          }
          if (item.onlineQuantityType === '01' || item.onlineQuantityType === '00') {
            weightMark.push('理计')
            price.push(item.ratioPriceManager)
            item.max_weight = item.ratioAvailableManagerWeight
          }
          item.weightMark = weightMark.toString().replace(/,/g, '/')
          item.price = price.toString().replace(/,/g, '/')
        })
        if (self.isRefresh === 'refresh') {
          if (resData.length > 0 && self.currentPage === 0) {
            self.goodsNameList[idx].data = resData
            self.isload = false
            if (self.goodsNameList[idx].data.length < 10) self.loadFinish = 2
          } else if (resData.length === 0 && self.currentPage === 0) {
            self.goodsNameList[idx].data = []
            self.isload = false
          }
        } else {
          if (resData.length > 0) {
            self.goodsNameList[idx].data.push(...resData)
            if (resData.length < 10) self.loadFinish = 2
          } else {
            self.currentPage--
            if (self.currentPage > 0 && self.goodsNameList[idx].data.length > 10) self.loadFinish = 2
          }
        }
        self.$forceUpdate()
        // self.hideLoading()
        if (self.prevIdx !== null && self.prevIdx !== -1) {
          self.goodsNameList[self.prevIdx].data = []
          self.prevIdx = null
        }
        if (self.goodsNameList[idx].data.length < 10) self.loadFinish = 3
        // self.goodsNameList.mp((item, index) => {
        //   if (Math.abs(index - idx) > 1) {
        //     item.data = []
        //   }
        // })
        // this.isload = true
        // }
        console.log('loadfinish:>>', this.loadFinish)
        if (this.swiperFirst === 1) {
          this.configVal({ key: 'tempObject', val: '' })
          this.swiperFirst = 0
        }
        this.$nextTick(() => {
          const self = this
          setTimeout(() => {
            self.hideLoading()
          }, 800)
        })
        if (done) done()
      } catch (err) {
        console.log('异常', err)
        this.loadFinish = 0
        this.swiperFirst = 0
        this.isload = false
        this.hideLoading()
        this.showMsg(err)
      }
    },
    erpModalCb (flag) {
      this.ironRequest(this.apiList.xy.updateRule.url, {user_id: this.currentUser.user_id}, this.apiList.xy.updateRule.method).then(res => {
        if (res.returncode === '0') {
          console.log('updateRule_res=====>' + JSON.stringify(res))
        }
      }).catch(e => {
        console.log('updateRule_e=====>' + e)
      })
      this.erpModalShow = false
    }
    // modalCb (flag) {
    //   this.ironRequest(this.apiList.xy.updateRule.url, {user_id: this.currentUser.user_id}, this.apiList.xy.updateRule.method).then(res => {
    //     if (res.returncode === '0') {
    //       console.log('updateRule_res=====>' + JSON.stringify(res))
    //     }
    //   }).catch(e => {
    //     console.log('updateRule_e=====>' + e)
    //   })
    //   this.modalShow = false
    // }
  }
}
</script>
<style lang="stylus" scoped>
.mall-content
  // margin-top 150px
.cardSty
  padding 0 8px
  display flex
  flex-wrap wrap
  justify-content space-between
// .blue-buy
// border 1px solid #0081ff
// border-radius 15px
// width 70px
// padding 5px 0
// text-align center
// color #0081ff
.mall-row
  position absolute
  right 0px
  top -8px
  &.notice
    top -14px
.blue-buy
  display inline-block
  border-radius 20px
  letter-spacing 1px
  padding-left 10px
  padding-top 2px
  padding-right 10px
  text-align center
  // min-width 100px
  font-size 12px
  color #fff
  background #2485ff !important
  box-shadow none
  height 22px
  z-index 0
.sub-mark
  display inline-block
  padding 1px 3px
  background #3da7ff
  color #fff
  font-size 12px
  border-radius 4px
  box-shadow 1px 2px 5px rgba(61, 167, 255, 0.3)
  letter-spacing 1px
.ml-8
  margin-left 8px !important
.card-list
  width 49%
  line-height 20px
  background #fff
  margin-bottom 8px
.supply
  background #F6F6F6
  padding 0 8px
  text-align center
  font-size 12px
  border-radius 10px
  color #262626
.padding-15
  padding 15px
</style>