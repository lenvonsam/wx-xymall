<template lang="pug">
div
  nav-bar(title="分类", isBack)
  .flex
    scroll-view.flex-sub.filter-left(scroll-y, :style="{height: screenHeight - customBar + 'px'}")
      .filter-left-list(:class="{active: item.isActive}", @click="selectName(item, index)", v-for="(item, index) in filterNameList", :key="index")
        span {{item.name}}
    .flex-twice.bg-white.padding-sm
      .filter-right-search.flex.align-center
        .cuIcon-search
        input.pl-10(id="searchInput", type="text", placeholder="搜索规格", v-model="searchVal")
      scroll-view.padding-top-sm.filter-right-content(scroll-y, :style="{height: screenHeight - customBar - 60 + 'px'}")
        .filter-right-list(v-for="(item, index) in standardList", :key="index", @click="selectStandard(item.name)") {{item.name}}
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      currentPage: 0,
      pageSize: 100,
      filterNameList: [],
      filterLeftSty: '',
      standardList: [],
      searchVal: ''
    }
  },
  computed: {
    ...mapState({
      customBar: state => state.customBar,
      screenHeight: state => state.screenHeight
    })
  },
  watch: {
    searchVal () {
      this.throttle(this.searchChange, 300)
    }
  },
  mounted () {
    this.$nextTick(() => {
      console.log('mpvue', mpvue)
      // getCurrentPages()
      this.queryObject = {
        current_page: this.currentPage,
        page_size: this.pageSize,
        search: '',
        name: '',
        only_available: 1
      }
      this.getGoods()
      this.getStandardList()
      this.filterLeftSty = `height: ${this.screenHeight} - ${this.customBar} + 'px'`
    })
  },
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
    selectStandard (val) {
      const res = {
        name: this.queryObject.name,
        standard: val
      }
      this.configVal({ key: 'tempObject', val: res })
      this.back(-1)
    },
    searchChange () {
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
      this.ironRequest(this.apiList.xy.goodsList.url, {}, this.apiList.xy.goodsList.method, this).then((res) => {
        res.goods.map(item => {
          item.isActive = false
        })
        this.filterNameList = res.goods
        this.filterNameList.unshift({ name: '全部', id: '', isActive: true })
      })
    },
    getStandardList () {
      this.ironRequest(this.apiList.xy.standardList.url, this.queryObject, this.apiList.xy.standardList.method, this).then((res) => {
        console.log('getStandardList', res)
        this.standardList = res.standards
      })
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
  height 60px
  line-height 60px
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
</style>