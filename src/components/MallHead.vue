<template lang="pug">
.bg-white.full-width.text-gra.shop-head(:style="{top: customBar+'px'}")
  .flex.align-center.pl-10.pr-10
    .h-left.ft-25(@click="openFilter")
      .cuIcon-sort.lg.text-gra
      .ft-14 分类
    .search.col(@click="jump('/pages/search/main')")
      .flex.align-center
        .cuIcon-search.text-gra.ft-18
        input.full-width.pl-10(id="mallSearchInput", :disabled="true", type="text", placeholder="品名、材质、规格、产地", v-model="searchVal")
        //- input.full-width.pl-10(id="mallSearchInput", type="text", placeholder="品名、材质、规格、产地", v-model="searchVal")
  .relative
    .mt-15.text-center.flex.align-center
      .col.tab-content
        scroll-view.nav(scroll-x, scroll-with-animation, :scroll-left="scrollLeft")
          .cu-item(v-for="(item,index) in sortList[0].data", :class="item.id === tabVal?'text-blue cur':''", :key="index", @click="selectTab(item, index)")
            span {{item.name}}
      .tab-more      
        .cuIcon-unfold.text-xl(@click="activeTab = 'name'")
    .padding-sm.flex.align-center.solid-top
      .col.filter-list.bg-gray.flex(@click.prevent="sortCb('standard')")
        .col.text-center 规格
        .cuIcon-unfold
      .col.filter-list.bg-gray.flex(@click.prevent="sortCb('material')")
        .col.text-center 材质
        .cuIcon-unfold
      .col.filter-list.bg-gray.flex(@click.prevent="sortCb('origin')")
        .col.text-center 产地
        .cuIcon-unfold
      .setting-list.flex.ft-25
        .cuIcon-list(@click="selectMall(1)", :class="mallFlag ? 'text-blue' : 'text-gra'")
        .cuIcon-cascades.ml-5(@click="selectMall(0)", :class="!mallFlag ? 'text-blue' : 'text-gra'")
    //- 筛选 品名、材质、规格、产地
    .filter-box(@click.prevent="sortClose(sortIdx)", v-show="activeTab === sort.key", v-for="(sort, sortIdx) in sortList", :key="sortIdx")
      .bg-white.padding-sm.ft-11(@click.stop="")
        .flex.align-center.justify-between
          .flex.text-bold.align-center.ft-16
            .dotted.bg-blue
            span.pl-10 {{sort.title}}
          .cuIcon-fold.ft-16(@click="sortClose(sortIdx)")
        .grid.col-3.padding-top-sm.sort-content
          .sort-list(v-if="sort.data.length > 0", v-for="(item, index) in sort.data", :key="index")
            .sort-name(:class="{active: item.isActive}", @click.stop="selectSort(sortIdx, index)") {{item.name}}
              .check.cuIcon-check.bg-blue(v-show="item.isActive")
        .row.padding-sm.justify-around(v-if="sortIdx !== 0")
          .btn-cancel.col(@click="filterCancel(sortIdx)") 重选 
          .btn-sure.margin-left-sm.col(@click="searchHandler()") 确定            
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: {
    mallTabVal: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      sidebarListAreaShow: false,
      sidebarListNameShow: false,
      sidebarListMaterialShow: false,
      sidebarListOriginShow: false,
      sidebarListMoreShow: false,
      tabList: [],
      scrollLeft: 0,
      tabVal: '',
      activeTab: '',
      queryObject: {},
      temporary: [],
      sortList: [
        { label: '品名', key: 'name', data: [], selectSort: [], title: '全部品名' },
        { label: '规格', key: 'standard', data: [], selectSort: [], title: '全部规格' },
        { label: '材质', key: 'material', data: [], selectSort: [], title: '全部材质' },
        { label: '产地', key: 'origin', data: [], selectSort: [], title: '全部产地' }
      ],
      sortQueryList: {
        'standard': {
          reqUrl: 'standardList.shtml',
          chooseIdx: [0, 0],
          respKey: 'standards'
        },
        'name': {
          reqUrl: 'goodsList.shtml',
          chooseIdx: [0, 0],
          respKey: 'goods'
        },
        'material': {
          reqUrl: 'materialList.shtml',
          chooseIdx: [0, 0],
          respKey: 'materials'
        },
        'origin': {
          reqUrl: 'supplyList.shtml',
          chooseIdx: [0, 0],
          respKey: 'supplies'
        },
        'more': {
          reqUrl: 'toleranceAndWeightList.shtml',
          chooseIdx: [0, 0]
        }
      },
      isActive: true,
      searchVal: '',
      mallFlag: 1,
      standards: [],
      materials: [],
      supplys: []
    }
  },
  computed: {
    ...mapState({
      tempObject: state => state.tempObject
    })
  },
  watch: {
    mallTabVal () {
      this.tabVal = this.mallTabVal
      const idx = this.sortList[0].data.findIndex(item => {
        return this.mallTabVal === item.id
      })
      this.sortList[0].data[idx].isActive = true
      this.selectTab(this.sortList[0].data[idx], idx)
    }
    // searchVal (newVal) {
    //   console.log('search', newVal)
    //   console.log('---', this.searchVal)
    //   this.throttle(this.searchChange, 300)
    // }
  },
  onShow () {
    console.log('tempObject', this.tempObject.search)
    this.searchVal = this.tempObject.search || ''
  },
  mounted () {
    this.$nextTick(() => {
      this.sortCb('name')
    })
  },
  methods: {
    filterCancel (sortIdx) {
      if (this.temporary.length > 0) {
        this.temporary.map(item => {
          this.sortList[sortIdx].data[item].isActive = !this.sortList[sortIdx].data[item].isActive
        })
        this.temporary = []
      }
    },
    searchHandler () {
      debugger
      const list = ['standard', 'material', 'supply']
      const filters = {}
      this.sortList.map((item, idx) => {
        filters[item.key] = []
        if (list.indexOf(item.key) !== -1 && item.data) {
          item.data.map(itemKey => {
            if (itemKey.isActive) {
              filters[item.key].push(itemKey.name === '全部' ? '' : itemKey.name)
            }
          })
        }
      })
      this.$emit('filter', filters)
      this.temporary = []
      this.sortClose()
    },
    openFilter () {
      this.jump('/pages/mallFilter/main')
    },
    searchChange () {
      this.$emit('searchChange', this.searchVal)
    },
    selectSort (sortIdx, idx) {
      this.temporary.push(idx)
      if (idx === 0 || sortIdx === 0) {
        this.sortList[sortIdx].data.map(item => {
          item.isActive = false
        })
      } else if (!sortIdx) {
        this.sortList[sortIdx].data[0].isActive = false
      }
      this.sortList[sortIdx].data[idx].isActive = !this.sortList[sortIdx].data[idx].isActive
      if (sortIdx === 0) {
        this.selectTab(this.sortList[sortIdx].data[idx], idx)
        this.sortClose()
      }
    },
    sortClose (sortIdx) {
      if (sortIdx) {
        this.filterCancel(sortIdx)
      }
      this.activeTab = ''
    },
    selectTab (item, index) {
      this.tabVal = item.id
      this.scrollLeft = (index - 1) * 60
      // const idx = this.sortList[0].data.findIndex(item => {
      //   return this.tabVal === item.id
      // })
      this.sortList[0].data.map((item, index) => {
        item.isActive = this.tabVal === item.id
      })
      // this.sortList[0].data[idx].isActive = true
      // this.selectTab(this.sortList[0].data[idx], idx)
      this.$emit('selectTab', item.id)
    },
    sortCb (key) {
      // let result = (key !== 'name' && key !== 'more')
      // if (result) {
      if (this.tabVal) {
        this.queryObject.name = this.tabVal
      }
      let queryObj = Object.assign({}, this.queryObject)
      if (key === 'area') queryObj.region = ''
      if (key === 'material') queryObj.material = ''
      if (key === 'origin') queryObj.supply = ''
      this.ironRequest(this.sortQueryList[key].reqUrl, queryObj, 'post', this).then(resp => {
        if (resp.returncode === '0') {
          let arr = resp[this.sortQueryList[key].respKey]
          const tabList = []

          if (arr.length > 0) {
            arr.unshift({ name: '全部', isActive: false })
            console.log('sortCb', arr)
            const idx = this.sortList.findIndex((item) => {
              return item.key === key
            })
            arr.map(item => {
              item.isActive = false
              const resActive = this.sortList[idx].data.filter((itemFilter) => {
                if (itemFilter.name === item.name && itemFilter.isActive) {
                  item.isActive = true
                }
                return itemFilter.name === item.name && itemFilter.isActive
              })
              console.log('resActive', resActive)
              if (key === 'name') {
                const obj = {
                  name: item.name,
                  id: item.id
                }
                tabList.push(obj)
              }
            })
            this.sortList[idx].data = arr
          }
          if (key === 'name') {
            tabList[0].id = ''
            this.sortList[0].data = tabList
          } else {
            this.activeTab = key
          }
        }
      })
      // }
    },
    sortRest (key) {
      const keyArray = ['area', 'name', 'material', 'origin', 'more']
      const me = this
      keyArray.map(item => {
        if (key !== item) me[`sidebarList${item.substring(0, 1).toUpperCase()}${item.substring(1)}Show`] = false
      })
    },
    selectMall (flag) {
      this.mallFlag = flag
      this.$emit('selectMall', flag)
    }
  }
}
</script>
<style lang="stylus" scoped>
.search
  background #f6f6f6
  border-radius 20px
  width 630px
  margin-left 10px
  padding 8px 10px
.tab-content
  overflow hidden
.tab-more
  width 50px
.filter-list
  margin 0 10px
  line-height 30px
  padding 0 5px
  border-radius 5px
.shop-head
  position fixed
  width 100%
  // top 64px
  left 0
  right 0
  z-index 2
.dotted
  width 10px
  height 10px
  border-radius 100%
.filter-box
  position absolute
  top 2px
  left 0
  right 0
  bottom 0
  height calc(100vh - 100px)
  z-index 4
  background rgba(0, 0, 0, 0.5)
.sort-list
  padding 5px
  text-align center
  .sort-name
    border 1px #eeeeee solid
    border-radius 35px
    line-height 30px
    position relative
    &.active
      border-color #0081ff
      color #0081ff
    .check
      position absolute
      right -2px
      bottom -2px
      color #ffffff
      width 15px
      height 15px
      line-height 15px
      text-align center
      border-radius 100%
.bg-mask
  position absolute
  left 0
  top 0
  right 0
  bottom 0
  z-index 2
  background ragb(0, 0, 0, 0.5)
.sort-content
  max-height calc(100vh - 180px)
  overflow auto
.btn-cancel,.btn-sure
  text-align center
  border-radius 5px
  padding 10px
  font-size 14px
.btn-cancel
  border 1px solid #EEEEEE
  background #fff
.btn-sure
  color #fff
  border 1px solid #2485FF
  background #2485FF  
</style>