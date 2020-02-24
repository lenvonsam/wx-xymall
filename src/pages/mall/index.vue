<template lang="pug">
div
  nav-bar(title="商城")
  div(style="height: 270rpx;")
    mall-head(:mallTabVal="mallTabVal", @getName="getName", @filter="multipleFilter", @selectMall="selectMall", @selectTab="selectTab", @searchChange="searchChange")
  .mall-content(style="margin-top: 20rpx")
    .mt-10
      swiper.bill-content(@change="swiperChange", :current="swiperCount", :style="{height: scrollHeight}")
        swiper-item(v-for="(tabItem, tabIdx) in goodsNameList.length", :key="tabIdx")
          template(v-if="isload")
            time-line(type="mallist")
          template(v-else)  
            template(v-if="goodsNameList[tabIdx].data.length > 0")
              scroll-view(scroll-y, @scrolltolower="loadMore", :style="{height: scrollHeight}")
                div(:class="{cardSty: !mallFlag}", style="padding-top: 6rpx")
                  .padding.pr-10.pl-10(v-for="(item,idx) in goodsNameList[tabIdx].data", :key="idx", :class="!mallFlag ? 'card-list' : 'bg-white margin-bottom-xs'")
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
                          //- span.c-red.ft-13(v-if="item.price === '--'") 开售时间:{{item.show_time}}
                          //- span.c-red(v-else-if="item.show_price === true") ￥{{item[mallTypeObject[itemType].price]}}
                          //- .blue-buy.ft-12(v-else, @click="cb(item, 'showPrice', $event)") 查看价格
                      .row.pt-5.flex-center.ft-12
                        .col.c-gray
                          span {{item[mallTypeObject[itemType].material]}}
                          //- span.ml-8 {{item[mallTypeObject[itemType].standard]}}
                          span.ml-8 {{item[mallTypeObject[itemType].length]}}米
                          span.ml-8 {{item[mallTypeObject[itemType].wh_name]}}
                          .sub-mark.ml-5 {{item[mallTypeObject[itemType].supply]}}
                        .text-right
                          span ({{item.weightMark}})
                          //- span {{item.price.split('/').length === 1 ? '理计' : '理计/磅计'}}
                      //- .row.pt-5.flex-center.ft-13(v-if="item[mallTypeObject[itemType].tolerance]||item[mallTypeObject[itemType].weightRange]")
                        .col.c-gray
                          span(v-if="item[mallTypeObject[itemType].tolerance]") 公差范围: {{item[mallTypeObject[itemType].tolerance]}}
                          span.ml-8(v-if="item[mallTypeObject[itemType].weightRange]") 重量范围: {{item[mallTypeObject[itemType].weightRange]}}
                      //- .row.pt-0.flex-center.ft-13.c-gray(v-if="item.show_price === true")
                      .pt-5.c-gray.ft-12(v-if="item[mallTypeObject[itemType].tolerance] || item[mallTypeObject[itemType].weightRange]")
                        span(v-if="item[mallTypeObject[itemType].tolerance]") 公差范围: {{item[mallTypeObject[itemType].tolerance]}}
                        span.ml-8(v-if="item[mallTypeObject[itemType].weightRange]") 重量范围: {{item[mallTypeObject[itemType].weightRange]}}
                      .row.pt-5.flex-center.ft-13.c-gray
                        .col
                          span(v-if="item[mallTypeObject[itemType].max_count] > 0") {{item[mallTypeObject[itemType].max_count]}}支/{{item[mallTypeObject[itemType].max_weight]}}吨
                        .flex-120.relative.text-right.ft-14
                          div(style="position: absolute; right: 0rpx; top: -16rpx")
                            .blue-buy(v-if="item.max_count == 0",style="background:#f44336!important", @click="mallItemCb(item, 'notice', $event)") 到货通知
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
                        span(v-if="item[mallTypeObject[itemType].max_count] > 0") {{item[mallTypeObject[itemType].max_count]}}支/{{item[mallTypeObject[itemType].max_weight]}}吨
                      .text-blue.ft-15.text-bold 
                        //- ￥{{item[mallTypeObject[itemType].price]}}
                        span.text-red.ft-13(v-if="item.price === '--'") 开售时间:{{item.show_time}}
                        span(v-else-if="item.show_price === true") ￥{{item[mallTypeObject[itemType].price]}}
                        //- .blue-buy.ft-12(v-else, @click="mallItemCb(item, 'showPrice', $event)") 查看价格
                      .text-gray.flex
                        .ft-11.col ({{item.weightMark}})
                        .text-right
                          .blue-buy(v-if="item.max_count == 0",style="background:#f44336!important", @click="mallItemCb(item, 'notice', $event)") 到货通知
                          .blue-buy(@click="mallItemCb(item, 'cart', $event)", v-else-if="item.show_price") 购买
                          .blue-buy.ft-12(v-else, @click="mallItemCb(item, 'showPrice', $event)") 查看价格
                .padding.text-gray.ft-13.text-center(v-if="loading") 努力加载中...
                .padding.text-gray.ft-13.text-center(v-if="goodsNameList[tabIdx].finished") 加载完成
                //- span(v-for="(item,idx) in mallItems", :key="idx") {{idx}}
                //- mall-item(:mallFlag="mallFlag", :cb="mallItemCb", v-for="(item,idx) in mallItems", :item="item", :key="idx")
            .col.text-center.text-gray.pt-100(v-else)
              empty-image(url="bill_empty.png", className="img-empty")
              .empty-content 
                span 暂时没有相关商品
                div 详情请联系400-8788-361
      //- template(v-if="mallItems.length > 0")
      //-   mall-item(:mallFlag="mallFlag", :cb="mallItemCb", v-for="(item,idx) in mallItems", :item="item", :key="idx")
      //- .col.text-center.text-gray.pt-100(v-else)
      //-   empty-image(url="bill_empty.png", className="img-empty")
      //-   .empty-content 您暂时没有相关合同
  modal-intro(v-model="modalIntroShow", :images="introImages", :cb="modalIntroCb")
</template>
<script>
import { mapState, mapActions } from 'vuex'
import mallHead from '@/components/MallHead'
import mallItem from '@/components/MallItem'
import modalIntro from '@/components/ModalIntro.vue'
export default {
  components: {
    mallHead,
    mallItem,
    modalIntro
  },
  data () {
    return {
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
      isLoad: false,
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
      filterObj: {},
      finished: false
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser,
      tempObject: state => state.tempObject,
      isLogin: state => state.user.isLogin,
      customBar: state => state.customBar
    })
  },
  onShow () {
    this.isLoad = false
    this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - 290 + 'rpx'
    if (this.tempObject.search === '' || this.tempObject.search || this.tempObject.name === '') {
      // this.goodsNameList[this.swiperCount].data = []
      this.isRefresh = 'refresh'
      this.currentPage = 0
      this.swiperCount = 0
      Object.assign(this.queryObject, this.tempObject)
      this.refresher()
    } else if (this.tempObject.name === this.mallTabVal) {
      Object.assign(this.queryObject, this.tempObject)
      this.refresher()
    } else {
      this.queryObject = {
        current_page: this.currentPage,
        page_size: this.pageSize,
        search: '',
        only_available: 1
      }
      Object.assign(this.queryObject, this.tempObject)
      this.mallTabVal = this.tempObject.name || ''
    }
    // if (!this.tempObject.name) {
    //   this.btnDisable = false
    //   // this.mallItems = []
    //   // this.goodsNameList[this.swiperCount].data = []
    //   this.refresher()
    // }
    // this.mallClassName = !this.mallFlag ? 'card-list' : 'solid-bottom bg-white'

    console.log('mallTabVal', this.mallTabVal)
    if (this.isLogin) {
      this.setCartCount(this.currentUser.user_id)
    } else {
      this.tabDot(0)
    }
  },
  onUnload () {
    this.queryObject = {
      current_page: this.currentPage,
      page_size: this.pageSize,
      search: '',
      only_available: 1
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.showShareMall()
      if (this.goodsNameList.length > 0) {
        this.queryObject = {
          current_page: this.currentPage,
          page_size: this.pageSize,
          search: '',
          only_available: 1
        }
        this.refresher()
      }
    })
  },
  // onReachBottom () {
  //   this.currentPage++
  //   this.isRefresh = 'reachBottom'
  //   this.refresher()
  // },
  // onPullDownRefresh () {
  //   this.isRefresh = 'refresh'
  //   this.currentPage = 0
  //   this.refresher()
  // },
  methods: {
    ...mapActions(['configVal']),
    loadMore () {
      if (!this.isLoad && !this.goodsNameList[this.swiperCount].finished) {
        this.currentPage++
        this.isRefresh = 'reachBottom'
        this.refresher()
      }
    },
    showShareMall () {
      const firstShare = mpvue.getStorageSync('firstShareMall') || false
      if (!firstShare) {
        this.modalIntroShow = true
        mpvue.setStorageSync('firstShareMall', true)
      }
    },
    swiperChange (e) {
      const idx = e.mp.detail.current
      this.mallTabVal = this.goodsNameList[idx].id
    },
    getName (list) {
      console.log('goodsName', list)
      list.map(item => {
        item.data = []
      })
      this.goodsNameList = list
      if (!this.tempObject.name) {
        this.btnDisable = false
        this.refresher()
      }
    },
    multipleFilter (filter) {
      console.log('filter', filter)
      const obj = {}
      Object.keys(filter).forEach((key) => {
        if (filter[key].length > 0) {
          const keyName = `${key}s` === 'origins' ? 'supplys' : `${key}s`
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
      this.filterObj = obj
      Object.assign(this.queryObject, obj)
      this.refresher()
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
      console.log('type', type)
      const me = this
      if (type === 'showPrice') {
        if (this.isLogin) {
          this.showMsg('请完善信息，耐心等待审核通过')
        } else {
          this.confirm({ content: '请登录后查看价格，去登录' }).then((res) => {
            if (res === 'confirm') {
              me.configVal({
                key: 'tempObject',
                val: { preRoute: me.$root.$mp.appOptions.path }
              })
              me.jump('/pages/account/login/main')
            }
          })
        }
        return
      }
      if (type === 'cart') { this.statisticRequest({ event: 'click_app_mall_add_cart' }, this) }

      if (obj.name === 'H型钢' && obj.price === '--') {
        this.showMsg(`此商品会在${obj.show_time}后开售`)
        return
      }
      if (this.isLogin) {
        if (!this.btnDisable) {
          this.btnDisable = true
          this.addCart(obj, type, this.currentUser.user_id).then(
            rt => {
              me.showMsg('加入购物车成功', '', 1000)
              me.setCartCount(me.currentUser.user_id)
              // if (rt.type === 'cart') {
              //   if (this.browserName() === 'wxpub') {
              //     me.zgRequest(
              //       me.zgEventStatic(me.currentUser, '加入购物车', {
              //         productid: obj.id,
              //         count: 1,
              //         measure_way: rt.mway
              //       })
              //     )
              //   }
              //   this.cartEvt = evt
              // } else {
              //   me.msgShow(rt.msg, 'positive')
              // }
              me.btnDisable = false
            },
            err => {
              me.showMsg(err)
              me.btnDisable = false
            }
          )
        }
      } else {
        this.confirm({ content: '请您登录后购买，去登录' }).then(() => {
          me.configVal({
            key: 'tempObject',
            val: { preRoute: me.$root.$mp.appOptions.path }
          })
          me.jump('/pages/account/login/main')
        })
      }
    },
    selectTab ({ id, idx }) {
      // this.configVal({key: 'tempObject', val: { search: '' }})
      if (this.goodsNameList[idx]) {
        this.goodsNameList[idx].data = []
        this.currentPage = 0
        this.mallTabVal = id
        this.swiperCount = idx
        // this.queryObject = {
        //   current_page: this.currentPage,
        //   page_size: this.pageSize,
        //   // search: '',
        //   name: id,
        //   only_available: 1
        // }
        this.queryObject.current_page = this.currentPage
        this.queryObject.name = id
        Object.assign(this.queryObject, this.filterObj)
        this.isRefresh = 'refresh'
        this.refresher()
      }
    },
    refresher () {
      // if (this.isLoad) return false
      this.showLoading()
      this.goodsNameList[this.swiperCount].finished = false
      const me = this
      this.queryObject.current_page = this.currentPage
      this.isLoad = true
      this.ironRequest(
        this.apiList.xy.mallList.url,
        this.queryObject,
        this.apiList.xy.mallList.method,
        this
      ).then(res => {
        if (res.returncode === '0') {
          const idx = this.swiperCount
          res.products.map(item => {
            item.weightMark = item.price.split('/').length === 1 ? '理计' : '理计/磅计'
          })
          if (me.isRefresh === 'refresh') {
            if (res.products.length > 0 && me.currentPage === 0) {
              me.goodsNameList[idx].data = res.products
              // me.mallItems = res.products
              console.log('goodsNameList', me.goodsNameList[idx].data)
            } else if (res.products.length === 0 && me.currentPage === 0) {
              // me.mallItems = []
              me.goodsNameList[idx].data = []
            }
            // wx.stopPullDownRefresh()
          } else {
            if (res.products.length > 0) {
              // me.mallItems.push(...res.products)
              me.goodsNameList[idx].data.push(...res.products)
              // console.log('mallItems-reachBottom', me.mallItems)
            } else {
              me.currentPage--
              this.goodsNameList[idx].finished = true
              // me.finished = true
            }
          }
          me.$forceUpdate()
        } else {
          me.showMsg(res === undefined ? '网络异常' : res.errormsg)
          return false
        }

        this.hideLoading()
        this.isLoad = false
      })
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
.notice-btn
  position absolute
  right 0px
  top -6px
  padding 0px 10px
  box-shadow 1px 3px 5px #ddd
.cart-icon
  width 45px
  height 45px
  position absolute
  top -20px
  right 0px
  background-size cover
  background-position center
  box-shadow 1px 3px 5px #ddd
  border-radius 50%
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
  font-size 14px
  border-radius 10px
  color #262626
</style>