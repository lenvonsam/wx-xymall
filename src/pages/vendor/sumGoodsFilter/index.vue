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
      isLoad: false
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
      this.throttle(this.searchChange, 300)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getGoods()
      this.filterLeftSty = `height: ${this.screenHeight} - ${this.customBar} + 'px'`
    })
  },
  methods: {
    ...mapActions([
      'configVal'
    ]),
    cleanSearch () {
      this.searchVal = ''
    },
    selectStandard (val) {
      const res = {
        name: this.queryObject.name,
        standards: val,
        fromPage: 'mallFilter',
        noBack: true
      }
      // this.statisticRequest({ event: 'app_mall_category', goods_name: res.name, standard: res.standards })
      this.configVal({ key: 'tempObject', val: res })
      this.back(-1)
    },
    searchChange () {
      // this.statisticRequest({ event: 'click_app_mall_category_search' })
      this.supplyList = []
      this.queryObject.search = this.searchVal
      this.currentPage = 0
      this.getStandardList()
    },
    selectName (item, idx) {
      this.filterNameList.map(item => {
        item.isActive = false
      })
      this.filterNameList[idx].isActive = true
      this.queryObject.name = item.id
      this.getStandardList()
    },
    getGoods () {
      this.ironRequest(this.apiList.xy.sumGoodsNameList.url, {
        page_size: 1000,
        current_page: 0
      }, this.apiList.xy.sumGoodsNameList.method).then((res) => {
        const nameId = this.$root.$mp.query.name
        this.queryObject = {
          current_page: this.currentPage,
          page_size: this.pageSize,
          search: '',
          name: nameId,
          only_available: 1
        }
        this.getStandardList()
        res.list.map(item => {
          item.id = item.name
        })
        this.filterNameList = res.list
        this.filterNameList.unshift({ name: '全部', id: '', isActive: false })
        const tempObject = {
          name: nameId,
          standards: ''
        }
        this.configVal({ key: 'tempObject', val: tempObject })
        this.filterNameList.map(item => {
          if (item.id === nameId) {
            item.isActive = true
          } else {
            item.isActive = false
          }
        })
      })
    },
    getStandardList () {
      this.isLoad = false
      this.ironRequest(this.apiList.xy.sumGoodsStandardList.url, this.queryObject, this.apiList.xy.sumGoodsStandardList.method).then((res) => {
        console.log('getStandardList', res)
        this.searchIdx = 1
        res.list.map(item => {
          item.first = item.name.substr(0, 1)
        })
        this.standardList = res.list
        this.isLoad = true
      })
    },
    selectTag (idx) {
      // this.statisticRequest({ event: 'click_app_mall_category_right' })
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