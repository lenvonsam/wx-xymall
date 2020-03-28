<template lang="pug">
div
  nav-bar(title="ERP现货物资", isBack)
  div(style="height: 285rpx;")
    sum-goods-head(:mallTabVal="mallTabVal", @cleanSearch="cleanSearch", @getName="getName", @filter="multipleFilter", @selectMall="selectMall", @selectTab="selectTab", @searchChange="searchChange")

  swiper(v-if="goodsNameList.length > 0", @change="swiperChange", @transition="swiperTransition", :current="swiperCount", :style="{height: scrollHeight+'rpx'}")
    swiper-item(v-for="(tabItem, swiperIdx) in goodsNameList.length", :key="swiperIdx")
      .bg-gray.text-center.text-gray.pt-100(:style="{height: scrollHeight + 'rpx'}", v-if="swiperCount === swiperIdx && !isload && goodsNameList[swiperIdx].data.length === 0")
        empty-image(url="bill_empty.png", className="img-empty")
        .empty-content 
          span 暂时没有物资
      template(v-else)
        div(:style="{height: scrollHeight + 'rpx'}")
          iron-scroll(:swiperIdx="swiperIdx", @scrolltolower="loadMore", heightUnit="rpx", :height="scrollHeight", :refresh="true", @onRefresh="onRefresh", :loadFinish="loadFinish")
            div(:class="{cardSty: !mallFlag}", style="margin-top: 8rpx")
              .padding.pr-10.pl-10(v-for="(item,idx) in goodsNameList[swiperIdx].data", :key="idx", :class="!mallFlag ? 'card-list' : 'bg-white margin-bottom-xs'")
                template(v-if="mallFlag === 1")
                  .row
                    .col.text-bold.ft-15
                      span {{item.name}}
                      span.ml-5 {{item.standard}}
                    .text-right.ft-16
                      span.text-blue ￥{{item.metering_way === '磅计' ? item.bjprice : item.ljprice}}
                  .row.pt-5.flex-center.ft-12
                    .col.c-gray
                      span {{item.material}}
                      span.ml-8 {{item.length}}米
                      span.ml-8 {{item.wh_name}}
                      .sub-mark.ml-5 {{item.supply}}
                    .text-right
                      span ({{item.metering_way}})
                  .pt-5.c-gray.ft-12(v-if="item.weight_range || item.tolerance_range")
                    span(v-if="item.tolerance_range") 公差范围: {{item.tolerance_range}}
                    span.ml-8(v-if="item.weight_range") 重量范围: {{item.weight_range}}
                  .row.pt-5.flex-center.ft-13.text-gray
                    .col
                      span(v-if="item.max_count > 0") {{item.max_count}}支/{{item.max_weight}}吨
                    .flex-120.relative.text-right.ft-14.row.justify-end
                      .blue-buy(@click="mallItemCb(item, 'cart', $event)") 详情
</template>
<script>
import { mapState, mapActions } from 'vuex'
import SumGoodsHead from '@/components/SumGoodsHead'
import mallItem from '@/components/MallItem'
import modalIntro from '@/components/ModalIntro.vue'
import cartBall from '@/components/ParabolicPic.vue'
export default {
  components: {
    SumGoodsHead,
    mallItem,
    modalIntro,
    cartBall
  },
  data () {
    return {
      ballValue: null,
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
  onUnload () {
    this.ballValue = null
    this.mallTabVal = ''
    this.mallItems = []
    this.queryObject = {}
    this.isRefresh = 'refresh'
    this.currentPage = 0
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
        this.mallTabVal = this.tempObject.name || ''
      }
    } else {
      this.hideLoading()
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
      console.log('swiperChange---------')
      const idx = e.mp.detail.current
      this.mallTabVal = this.goodsNameList[idx].id
      if (this.goodsNameList[idx]) {
        // this.showLoading()
        this.isload = true
        this.isRefresh = 'refresh'
        this.queryObject.current_page = this.currentPage
        this.queryObject.name = this.mallTabVal
        if (this.swiperFirst !== 1) {
          delete this.queryObject.standards
        }
        delete this.queryObject.materials
        delete this.queryObject.supplys
        delete this.queryObject.warehouses
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
      this.isRefresh = 'refresh'
      this.currentPage = 0
      this.swiperCount = 0
      this.swiperFirst = 1
      this.queryObject.current_page = this.currentPage
      this.queryObject.name = this.mallTabVal
      this.queryObject.search = val
      delete this.queryObject.standards
      delete this.queryObject.materials
      delete this.queryObject.supplys
      if (!this.tempObject.name) this.refresher()
    },
    mallItemCb (obj, type, evt) {
      if (this.btnDisable) return false
      this.btnDisable = true
      console.log('evt', evt)
      const me = this
      me.ballValue = evt
      this.jump(`/pages/vendor/sumGoodsDetail/main?sumgoodsBatch=${obj.sumgoods_batch}`)
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
        const me = this
        this.queryObject.current_page = this.currentPage
        this.queryObject.page_size = 20
        const data = await this.ironRequest(
          this.apiList.xy.sumGoodsList.url,
          this.queryObject,
          this.apiList.xy.sumGoodsList.method
        )
        const res = data
        const resList = data.list
        if (res.returncode === '0') {
          const idx = this.swiperCount
          if (me.isRefresh === 'refresh') {
            if (resList.length > 0 && me.currentPage === 0) {
              me.goodsNameList[idx].data = resList
              me.isload = false
              if (me.goodsNameList[idx].data.length < 10) me.loadFinish = 2
            } else if (resList.length === 0 && me.currentPage === 0) {
              me.goodsNameList[idx].data = []
              me.isload = false
            }
          } else {
            if (resList.length > 0) {
              me.goodsNameList[idx].data.push(...resList)
              if (resList.length < 10) me.loadFinish = 2
            } else {
              me.currentPage--
              if (me.currentPage > 0 && me.goodsNameList[idx].data.length > 10) me.loadFinish = 2
            }
          }
          me.$forceUpdate()
          if (me.prevIdx !== null && me.prevIdx !== -1) {
            me.goodsNameList[me.prevIdx].data = []
            me.prevIdx = null
          }
          if (me.goodsNameList[idx].data.length < 10) me.loadFinish = 0
          me.$nextTick(() => {
            me.hideLoading()
          })
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