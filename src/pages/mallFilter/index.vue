<template lang="pug">
div
  nav-bar(title="分类", isBack)
  .flex
    scroll-view.flex-sub.filter-left(scroll-y, :style="{height: screenHeight - customBar + 'px'}")
      .filter-left-list(:class="{active: item.isActive}", @click="selectName(item, index)", v-for="(item, index) in filterNameList", :key="index")
        span {{item.name}}
    .flex-twice.bg-white.padding-sm
      .filter-right-search.row
        .cuIcon-search
        input.col.pl-10(type="text", placeholder="搜索规格", v-model="searchVal")
        .close-icon(@click="cleanSearch", v-if="searchVal")
          .cuIcon-roundclosefill.ft-18
      // iron-scroll(@scrolltolower="getStandardList", heightUnit="rpx", :height="scrollHeight", :loadFinish="loadFinish")
      scroll-view.padding-top-sm.filter-right-content(scroll-y, :scroll-into-view="searchCurId", :style="{height: screenHeight - customBar - 60 + 'px'}", v-if="standardList.length > 0")
        .filter-right-list(:id="'idx-' + item.first", v-for="(item, index) in standardList", :key="index", @click="selectStandard(item.name)") {{item.name}}
        .ft-12.padding.text-gray.text-center(v-if="standardList.length > 15") 加载完成
      .padding.text-center.text-gray.ft-12.margin-top-xl(v-if="isLoad && standardList.length === 0")
        span 暂无更多
        div 详情请联系400-8788-361
    .filter-cur(v-if="standardList.length > 0")
      .tag.text-gray(:class="{'active': searchIdx === item+1}", v-for="item in 9", :key="item", @click="selectTag(item)") {{item+1}}
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      currentPage: 0,
      pageSize: 1000,
      filterNameList: [],
      filterLeftSty: '',
      standardList: [],
      searchVal: '',
      searchIdx: 1,
      isLoad: false,
      scrollHeight: '',
      loadFinish: 0
    }
  },
  computed: {
    ...mapState({
      customBar: state => state.customBar,
      screenHeight: state => state.screenHeight
    }),
    searchCurId: function () {
      return 'idx-' + this.searchIdx
    }
  },
  watch: {
    searchVal () {
      console.log('tag', '')
      this.throttle(this.searchChange, 300)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getGoods()
      this.filterLeftSty = `height: ${this.screenHeight} - ${this.customBar} + 'px'`
    })
  },
  // onShow () {
  //   this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - 200
  //   console.log('scrollHeight', this.scrollHeight)
  // },
  // onReachBottom () {
  //   console.log('onReachBottom')
  //   this.currentPage++
  //   this.isLoad = 'reachBottom'
  //   this.refresher()
  // },
  // onPullDownRefresh () {
  //   this.isLoad = 'refresh'
  //   this.currentPage = 0
  //   this.refresher()
  // },
  // methods: {
  //   ...mapActions([
  //     'configVal'
  //   ])
  // },
  methods: {
    ...mapActions([
      'configVal'
    ]),
    // 刷新页面
    // onRefresh (done) {
    //   this.isRefresh = 'refresh'
    //   this.currentPage = 1
    //   this.getStandardList(done)
    // },
    // // 上拉加载
    // loadMore () {
    //   const self = this
    //   this.throttle(function () {
    //     self.isload = true
    //     self.loadFinish = 1
    //     self.currentPage++
    //     self.isRefresh = 'reachBottom'
    //     self.getStandardList()
    //   }, 300)
    // },
    // 清除搜索关键词
    cleanSearch () {
      this.searchVal = ''
    },
    // 选择规格并返回上一级
    selectStandard (val) {
      const res = {
        name: this.queryObject.name,
        standards: val,
        fromPage: 'mallFilter',
        noBack: true
      }
      this.logEventPost({ event: 'app_mall_category', type: '02', param: {goods_name: res.name, standard: res.standards} })
      this.configVal({key: 'tempObject', val: res, fromPage: 'mallFilter'})
      this.back(-1)
    },
    // 关键词搜索
    searchChange () {
      this.currentUser.type === 'seller' ? this.logEvent({ event: 'click_app_mall_category_search_seller', type: '01' }) : this.logEvent({ event: 'click_app_mall_category_search', type: '01' })
      this.supplyList = []
      this.queryObject.specification = this.searchVal.replace(/x/g, '*')
      this.queryObject.specification = this.searchVal.replace(/×/g, '*')
      this.currentPage = 0
      this.getStandardList()
    },
    // 点击左侧选择分类
    selectName (item, idx) {
      this.filterNameList.map(item => {
        item.isActive = false
      })
      this.filterNameList[idx].isActive = true
      this.queryObject.productBrandName = item.name === '全部' ? '' : item.name
      this.getStandardList()
    },
    // 获取商品信息
    // getGoods () {
    //   // this.ironRequest(this.apiList.xy.goodsList.url, {}, this.apiList.xy.goodsList.method).then((res) => {
    //   //   const nameId = this.$root.$mp.query.name
    //   //   this.queryObject = {
    //   //     current_page: this.currentPage,
    //   //     page_size: this.pageSize,
    //   //     search: '',
    //   //     name: nameId,
    //   //     only_available: 1
    //   //   }
    //   //   this.getStandardList()
    //   //   this.filterNameList = res.goods
    //   //   this.filterNameList.unshift({ name: '全部', id: '', isActive: false })
    //   //   const tempObject = {
    //   //     name: nameId,
    //   //     standards: ''
    //   //   }
    //   //   this.configVal({ key: 'tempObject', val: tempObject })
    //   //   this.filterNameList.map(item => {
    //   //     if (item.id === nameId) {
    //   //       item.isActive = true
    //   //     } else {
    //   //       item.isActive = false
    //   //     }
    //   //   })
    //   // })
    //   //获取分类名称
    //   this.httpPost(this.apiList.zf.searchBrand, {}).then(res => {
    //     const nameId = this.$root.$mp.query.name
    //     console.log('nameId+++', nameId)
    //     this.queryObject = {
    //       'productBrandName': nameId,
    //       'specification': ''
    //     }
    //     // 获取某个分类对应的规格
    //     this.getStandardList()
    //     this.filterNameList = res.data.productBrandNameList.map(item => ({
    //       name: item
    //     }))
    //     this.filterNameList.unshift({ name: '全部', isActive: false })
    //     this.filterNameList.map(item => {
    //       if (item.name === nameId) {
    //         item.isActive = true
    //       } else {
    //         item.isActive = false
    //       }
    //     })
    //   })
    // },
    getGoods () {
      this.httpPost(this.apiList.zf.queryProductBrandNameSortPage, {}).then(res => {
        const nameId = this.$root.$mp.query.name
        console.log('nameId+++', nameId)
        if (nameId === '全部') {
          this.queryObject = {
            'productBrandName': '',
            'specification': ''
          }
        } else {
          this.queryObject = {
            'productBrandName': nameId,
            'specification': ''
          }
        }
        // 获取某个分类对应的规格
        this.getStandardList()
        this.filterNameList = res.data.map(item => {
          return {
            name: item.productBrandName
          }
        })
        this.filterNameList.unshift({ name: '全部', isActive: false })
        this.filterNameList.map(item => {
          if (item.name === nameId) {
            item.isActive = true
          } else {
            item.isActive = false
          }
        })
      })
    },
    // 获取某个分类对应的规格
    getStandardList () {
      this.isLoad = false
      // this.ironRequest(this.apiList.xy.standardList.url, this.queryObject, this.apiList.xy.standardList.method).then((res) => {
      //   debugger
      //   console.log('getStandardList', res)
      //   this.searchIdx = 1
      //   res.standards.map(item => {
      //     item.first = item.name.substr(0, 1)
      //   })
      //   this.standardList = res.standards
      //   this.isLoad = true
      // })
      this.httpPost(this.apiList.zf.appletQuerySpecificationList, this.queryObject).then(res => {
        this.searchIdx = 1
        this.standardList = res.data.specificationList.map(item => ({
          name: item
          // item.first = item.substr(0, 1)
        }))
        // console.log('standardList++++++', this.standardList)
        // this.standardList.map(item => {
        //   item.first = item.name.substr(0, 1)
        // })
        // console.log('standardList++++++', this.standardList)
        var arr = [[], [], [], [], [], [], [], [], [], [], []]
        this.standardList.forEach(item => {
          var firstName = item.name.substr(0, 1)
          item.first = firstName
          var reg = /^\d/
          if (reg.test(firstName)) {
            arr[firstName].push(item)
          } else {
            arr[10].push(item)
          }
        })
        // console.log('分类', arr)
        var newArr = arr.reduce(function (a, b) {
          return a.concat(b)
        })
        this.standardList = newArr
        // this.standardList = res.data.specificationList
        this.isLoad = true
      }).catch(e => {
        this.showMsg(e.message)
      })
    },
    // 点击右侧数字导航
    selectTag (idx) {
      this.currentUser.type === 'seller' ? this.logEvent({ event: 'click_app_mall_category_right_seller', type: '01' }) : this.logEvent({ event: 'click_app_mall_category_right', type: '01' })
      this.searchIdx = idx
    }
  }
}
</script>
<style lang="stylus" scoped>
.head
  position absolute
  width 100%
  left 0
  right 0
.filter-left
  height 100vh
  overflow auto
  background #F2F2F2
.filter-left-list
  text-align center
  height 40px
  line-height 40px
  color #262626
  white-space nowrap
  overflow hidden
  text-overflow ellipsis
  &.active
    background #fff
    color #0081ff
.filter-right-search
  background #F2F2F2
  border-radius 25px
  width 100%
  height 35px
  line-height 35px
  padding 0 10px
  color #888888
.filter-right-content
  overflow auto
  .filter-right-list
    line-height 40px
.filter-cur
  position fixed
  right 5px
  top 150px
  .tag
    text-align center
    width 20px
    height 20px
    line-height 20px
    margin-bottom 20px
    border-radius 100%
    &.active
      background #2485FF
      color #fff
</style>
