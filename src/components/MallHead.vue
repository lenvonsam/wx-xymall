<template lang="pug">
.bg-white.full-width.text-gra.shop-head
  .flex.align-center.pl-10.pr-10
    .h-left.ft-25
      .cuIcon-sort.lg.text-gra
      .ft-14 分类
    .search.col
      .flex.align-center
        .cuIcon-search.text-gra.ft-18
        input.full-width.pl-10(type="text", placeholder="品名、材质、规格、产地")
  .relative
    .mt-15.text-center.flex.align-center
      .col.tab-content
        scroll-view.nav(scroll-x, scroll-with-animation, :scroll-left="scrollLeft")
          .cu-item(v-for="(item,index) in tabList", :class="item.value === tabVal?'text-blue cur':''", :key="index", @click="selectTab(item, index)")
            span {{item.label}}
      .tab-more      
        .cuIcon-unfold.text-xl(@click="sortCb('name')")
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
        .cuIcon-list.text-blue
        .cuIcon-cascades.text-gra.ml-5
    //- 筛选 品名、材质、规格、产地
    .filter-box(@click.prevent="sortClose", v-show="activeTab === sort.key", v-for="(sort, sortIdx) in sortList", :key="sortIdx")
      .bg-white.padding-sm
        .flex.align-center.justify-between
          .flex.text-bold.align-center.ft-16
            .dotted.bg-blue
            span.pl-10 {{sort.title}}
          .cuIcon-fold.ft-16(@click="sortClose")
        .grid.col-3.padding-top-sm.sort-content
          .sort-list(v-if="sort.data.length > 0", v-for="(item, index) in sort.data", :key="index")
            .sort-name(:class="{active: sort.selectSort.indexOf(item.name)}", @click.stop="selectSort(item.name, sortIdx)") {{item.name}}
</template>
<script>
export default {
  data () {
    return {
      sidebarListAreaShow: false,
      sidebarListNameShow: false,
      sidebarListMaterialShow: false,
      sidebarListOriginShow: false,
      sidebarListMoreShow: false,
      tabList: [
        { label: '全部', value: '' },
        { label: '低合金H型钢', value: '1' },
        { label: '工字钢', value: '2' },
        { label: '等边角钢', value: '3' },
        { label: '等边角钢', value: '4' },
        { label: '等边角钢', value: '5' }
      ],
      scrollLeft: 0,
      tabVal: '',
      activeTab: '',
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
          reqUrl: ['goodsList.shtml', 'standardList.shtml'],
          chooseIdx: [0, 0]
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
      isActive: true
    }
  },
  // computed: {
  //   isSelect (sort, name) {
  //     // debugger
  //     const className = sort.selectSort.indexOf(name) !== -1 ? 'active' : ''
  //     // console.log('isSelect', className)
  //     return className
  //   }
  // },
  methods: {
    isSelect (sort, name) {
      // debugger
      // const className = sort.selectSort.indexOf(name) !== -1 ? 'active' : ''
      // console.log('isSelect', className)
      debugger
      // console.log(sort.selectSort)
      console.log('isSelect', sort.selectSort.indexOf(name))
      return this.isActive
    },
    selectSort (val, idx) {
      this.sortList[idx].selectSort.push(val)
      console.log(this.sortList[idx].selectSort)
    },
    sortClose () {
      this.activeTab = ''
    },
    selectTab (item, index) {
      this.tabVal = item.value
      this.scrollLeft = (index - 1) * 60
    },
    sortCb (key) {
      this.activeTab = key
      let result = (key !== 'name' && key !== 'more')
      if (result) {
        console.log(key)
        let queryObj = Object.assign({}, this.queryObject)
        if (key === 'area') queryObj.region = ''
        if (key === 'material') queryObj.material = ''
        if (key === 'origin') queryObj.supply = ''
        // debugger
        this.ironRequest(this.sortQueryList[key].reqUrl, queryObj, 'post', this).then(resp => {
          if (resp.returncode === '0') {
            let arr = resp[this.sortQueryList[key].respKey]
            if (arr.length > 0) {
              arr.unshift({ name: '全部' })
              console.log('sortCb', arr)
              const idx = this.sortList.findIndex((item) => {
                return item.key === key
              })
              this.sortList[idx].data = arr
              // this[`mallSort${key.substring(0, 1).toUpperCase()}${key.substring(1)}`] = this.arr2DoubleArr(arr, false)
              // let originVal = ''
              // if (key === 'area') originVal = this.queryObject.region
              // if (key === 'material') originVal = this.queryObject.material
              // if (key === 'origin') originVal = this.queryObject.supply
              // let index = arr.findIndex(item => item.name === originVal)
              // if (index > -1) {
              //   let row = Math.ceil((index + 1) / 3) - 1
              //   let col = 0
              //   if (((index + 1) % 3 === 0)) {
              //     col = 2
              //   } else {
              //     col = index - row * 3
              //   }
              //   this.sortQueryList[key].chooseIdx[0] = row
              //   this.sortQueryList[key].chooseIdx[1] = col
              // }
            } else {
              this[`mallSort${key.substring(0, 1).toUpperCase()}${key.substring(1)}`] = []
            }
          }
        })
      }
    },
    sortRest (key) {
      const keyArray = ['area', 'name', 'material', 'origin', 'more']
      const me = this
      keyArray.map(item => {
        if (key !== item) me[`sidebarList${item.substring(0, 1).toUpperCase()}${item.substring(1)}Show`] = false
      })
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
  top 75px
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
    &.active
      border-color #0081ff
      color #0081ff
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
</style>