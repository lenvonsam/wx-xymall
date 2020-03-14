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
                      span.text-blue(v-else-if="item.show_price === true") ￥{{item[mallTypeObject[itemType].price]}}
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
                      .blue-buy(@click="mallItemCb(item, 'cart', $event)", v-else-if="item.show_price") 购买
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
                      .blue-buy(v-if="item.max_count == 0 && isLogin",style="background:#f44336!important", @click="mallItemCb(item, 'notice', $event)") 到货通知
                      .blue-buy(@click="mallItemCb(item, 'cart', $event)", v-else-if="item.show_price") 购买
                      .blue-buy.ft-12(v-else, @click="mallItemCb(item, 'showPrice', $event)", style="padding-top: 2rpx") 查看价格
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
</template>
<script>
import { mapState, mapActions } from 'vuex'
import mallHead from '@/components/MallHead'
import mallItem from '@/components/MallItem'
import modalIntro from '@/components/ModalIntro.vue'
import cartBall from '@/components/ParabolicPic.vue'
export default {
  components: {
    mallHead,
    mallItem,
    modalIntro,
    cartBall
  },
  data () {
    return {
      ballValue: null,
      mallTypeObject: {
        'product': {
          name: 'name',
          supply: 'supply',
          price: 'price',
          standard: 'standard',
          material: 'material',
          wh_name: 'wh_name',
          max_count: 'max_count',
          max_weight: 'max_weight',
          tolerance: 'tolerance_range',
          length: 'length',
          weightRange: 'weight_range'
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
      pageSize: 10,
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
      prevIdx: null
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
    this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - this.getRpx(this.bottomBarHeight) - 285
    if (this.tempObject.fromPage === 'home') {
      // 首页
      this.mallTabVal = this.tempObject.name
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
      this.setCartCount(this.currentUser.user_id)
    } else {
      this.tabDot(0)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.showShareMall()
    })
  },
  methods: {
    ...mapActions(['configVal']),
    ballCb () {
      console.log('ball cb')
    },
    cleanSearch () {
      delete this.queryObject.search
      this.onRefresh()
    },
    onRefresh (done) {
      this.currentPage = 0
      this.refresher(done)
    },
    loadMore () {
      const me = this
      this.throttle(function () {
        me.isload = true
        me.loadFinish = 1
        me.currentPage++
        me.isRefresh = 'reachBottom'
        me.refresher()
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
      // debugger
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
        const me = this
        setTimeout(() => {
          me.onRefresh()
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
      // this.filterObj = obj
      Object.assign(this.queryObject, obj)
      if (!this.tempObject.standards) {
        this.refresher()
      }
    },
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
      this.refresher()
    },
    mallItemCb (obj, type, evt) {
      console.log('evt', evt)
      const me = this
      me.ballValue = evt
      if (obj.name === 'H型钢' && obj.price === '--') {
        this.showMsg(`此商品会在${obj.show_time}后开售`)
        return
      }
      if (this.isLogin) {
        switch (type) {
          case 'showPrice':
            this.showMsg('请完善信息，耐心等待审批通过')
            break
          case 'notice':
          case 'cart':
            if (type === 'cart') this.statisticRequest({ event: 'click_app_mall_add_cart' })
            if (!this.btnDisable) {
              this.btnDisable = true
              this.addCart(obj, type, this.currentUser.user_id).then(
                rt => {
                  // me.ballValue = evt
                  me.showMsg(rt.msg, '', 1000)
                  if (type === 'cart') me.setCartCount(me.currentUser.user_id)
                  me.btnDisable = false
                },
                err => {
                  me.showMsg(err === '该商品已经存在于购物车中' ? '该商品已加入购物车' : err)
                  me.btnDisable = false
                }
              )
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
            me.jump('/pages/account/login/main')
          }
        })
      }
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
        this.loadFinish = 1
        const me = this
        this.queryObject.current_page = this.currentPage
        this.queryObject.page_size = 20
        const data = await this.ironRequest(
          this.apiList.xy.mallList.url,
          this.queryObject,
          this.apiList.xy.mallList.method
        )
        const res = data
        if (res.returncode === '0') {
          const idx = this.swiperCount
          res.products.map(item => {
            item.weightMark = item.price.split('/').length === 1 ? '理计' : '理计/磅计'
          })
          if (me.isRefresh === 'refresh') {
            if (res.products.length > 0 && me.currentPage === 0) {
              me.goodsNameList[idx].data = res.products
              me.isload = false
              if (me.goodsNameList[idx].data.length < 10) me.loadFinish = 2
            } else if (res.products.length === 0 && me.currentPage === 0) {
              me.goodsNameList[idx].data = []
              me.isload = false
            }
          } else {
            if (res.products.length > 0) {
              me.goodsNameList[idx].data.push(...res.products)
              if (res.products.length < 10) me.loadFinish = 2
            } else {
              me.currentPage--
              if (me.currentPage > 0 && me.goodsNameList[idx].data.length > 10) me.loadFinish = 2
            }
          }
          me.$forceUpdate()
          me.hideLoading()
          if (me.prevIdx !== null && me.prevIdx !== -1) {
            me.goodsNameList[me.prevIdx].data = []
            me.prevIdx = null
          }
          if (me.goodsNameList[idx].data.length < 10) me.loadFinish = 0
          // me.goodsNameList.mp((item, index) => {
          //   if (Math.abs(index - idx) > 1) {
          //     item.data = []
          //   }
          // })
          // this.isload = true
        }
        console.log('loadfinish:>>', this.loadFinish)
        if (this.swiperFirst === 1) {
          this.configVal({ key: 'tempObject', val: '' })
          this.swiperFirst = 0
        }
        if (done) done()
      } catch (err) {
        console.log('异常', err)
        this.loadFinish = 0
        this.swiperFirst = 0
        this.isload = false
        this.hideLoading()
        this.showMsg(err)
      }
    }
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
</style>