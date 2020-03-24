<template lang="pug">
.bg-white.full-width.text-gra.shop-head(:style="{top: customBar+'px'}")
  .flex.align-center.pl-10.pr-10(style="height: 90rpx")
    .h-left.ft-25(@click="classifyClick")
      .cuIcon-sort.lg.text-gra
      .ft-14 分类
    .search.col
      .row
        .cuIcon-search.text-gray.ft-18
        input.full-width.pl-10(type="text", placeholder="品名、材质、规格、产地(空格号隔开)", v-model="searchVal")
        .close-icon(@click="cleanSearch", v-if="searchVal")
          .cuIcon-roundclosefill.ft-18
    .padding-left-xs.text-blue(@click="searchChange") 搜索
  .relative
    .mt-15.text-center.flex.align-stretch
      .col.tab-content
        scroll-view.nav(scroll-x, :scroll-into-view="scrollId")  
          .cu-item(:id="'idx_'+index", v-for="(item,index) in sortList[0].data", :class="item.id === tabVal?'text-blue cur':''", :key="index", @click="selectTab(item, index)")
            span {{item.name}}
      .tab-more.row.justify-center(@click="openName")
        .cuIcon-unfold.text-xl
    .padding-sm.flex.align-center.solid-top
      .col.filter-list.bg-gray.flex(:class="{active: standardStr}", @click.prevent="openStandard")
        .col.text-center.text-cut {{standardStr || '规格'}}
        .cuIcon-unfold
      .col.filter-list.bg-gray.flex(:class="{active: materialStr}", @click.prevent="openMaterial")
        .col.text-center.text-cut {{materialStr || '材质'}}
        .cuIcon-unfold
      .col.filter-list.bg-gray.flex(:class="{active: originStr}", @click.prevent="openSupply")
        .col.text-center.text-cut {{originStr || '产地'}}
        .cuIcon-unfold
      .col.filter-list.bg-gray.flex(:class="{active: warehouseStr}", @click.prevent="openWarehouse")
        .col.text-center.text-cut {{warehouseStr || '仓库'}}
        .cuIcon-unfold
    //- 筛选 品名、材质、规格、产地
    .filter-box(:style="{height: filterHeight+'rpx'}", @click.prevent="sortClose(sortIdx)", @touchmove.stop="catchtouchmove", v-show="activeTab === sort.key", v-for="(sort, sortIdx) in sortList", :key="sortIdx")
      .bg-white.padding-sm.ft-11(@click.stop="")
        .flex.align-stretch.justify-between
          .flex.align-center
            .dotted.bg-blue
            span.pl-10.text-bold.ft-16 {{sort.title}}
            .search-input.row.bg-gray.margin-left-sm.text-gray(v-if="activeTab === 'standard'")
              .cuIcon-search.ft-16
              input.full-width.pl-10.ft-13(@input="standardChange", v-model="standardVal", type="text", placeholder="请输入规格快速查询")
              .close-icon(@click="cleanStandard", v-if="standardVal")
                .cuIcon-roundclosefill.ft-16
          .row.padding-sm(@click="sortClose(sortIdx)")
            .cuIcon-fold.ft-16
        scroll-view(scroll-y, style="max-height: 700rpx", :scroll-top="scrollTop", @scrolltolower="loadMore")
          .grid.col-3.padding-top-sm.sort-content
            .sort-list(v-if="sort.data.length > 0", v-for="(item, index) in sort.data", :key="index")
              .sort-item(:class="{active: item.isActive, 'big': sortIdx !== 1}", @click.stop="selectSort(sortIdx, index)") 
                .sort-name {{item.name}}
                .check.cuIcon-check.bg-blue(v-show="item.isActive")
          //- .padding-sm.text-center 加载完成
        .row.padding-sm.justify-around(v-if="sortIdx !== 0")
          .btn-cancel.col(@click="selectSort(sortIdx, 0)") 重选 
          .btn-sure.margin-left-sm.col(@click="searchHandler()") 确定            
  modal-intro(v-model="modalIntroShow", :images="modalIntroImages", :cb="modalIntroCb")
</template>
<script>
import { mapState, mapActions } from 'vuex'
import modalIntro from '@/components/ModalIntro.vue'
export default {
  props: {
    mallTabVal: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      modalIntroImages: ['mall_classify_num.png'],
      modalIntroShow: false,
      tabList: [],
      scrollLeft: 0,
      scrollTop: 3,
      tabVal: '',
      activeTab: '',
      pageSize: 50,
      currentPage: 0,
      queryObject: {
        current_page: 0,
        page_size: 50
      },
      temporary: [],
      sortList: [
        { label: '品名', key: 'name', data: [], selectSort: [], title: '品名展示' },
        { label: '规格', key: 'standard', data: [], selectSort: [], title: '规格展示' },
        { label: '材质', key: 'material', data: [], selectSort: [], title: '材质展示' },
        { label: '产地', key: 'origin', data: [], selectSort: [], title: '产地展示' },
        { label: '仓库', key: 'warehouse', data: [], selectSort: [], title: '仓库展示' }
      ],
      sortQueryList: {
        'standard': {
          reqUrl: 'seller/erp/standard.shtml',
          chooseIdx: [0, 0],
          respKey: 'list',
          key: 'standard'
        },
        'name': {
          reqUrl: 'seller/erp/goods.shtml',
          chooseIdx: [0, 0],
          respKey: 'list',
          key: 'name'
        },
        'material': {
          reqUrl: 'seller/erp/material.shtml',
          chooseIdx: [0, 0],
          respKey: 'list',
          key: 'material'
        },
        'origin': {
          reqUrl: 'seller/erp/supply.shtml',
          chooseIdx: [0, 0],
          respKey: 'list',
          key: 'origin'
        },
        'warehouse': {
          reqUrl: 'seller/erp/warehouse.shtml',
          chooseIdx: [0, 0],
          respKey: 'list',
          key: 'warehouse'
        }
      },
      isActive: true,
      searchVal: '',
      mallFlag: 1,
      standardStr: '',
      materialStr: '',
      originStr: '',
      warehouseStr: '',
      filterStr: '',
      isMore: false,
      scrollId: 'idx_0',
      standardVal: '',
      isFilter: false,
      filterHeight: 0
    }
  },
  components: {
    modalIntro
  },
  computed: {
    ...mapState({
      tempObject: state => state.tempObject,
      screenWidth: state => state.screenWidth
    })
  },
  onHide () {
    const sortIdx = this.sortList.findIndex(item => item.key === this.activeTab)
    this.sortClose(sortIdx)
  },
  watch: {
    mallTabVal () {
      this.mallTabValChange()
    }
  },
  beforeMount () {
    // if (this.tempObject.fromPage === 'search' && this.tempObject.noBack) {
    //   this.searchVal = this.tempObject.search || ''
    // }
    this.sortCb('name')
    this.filterHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - 95
  },
  onShow () {
    this.isFilter = false
    if (this.sortList[0].data.length === 0) this.sortCb('name')
    if (this.tempObject.fromPage === 'search' && this.tempObject.noBack) {
      this.searchVal = this.tempObject.search || ''
      this.standardStr = ''
      this.materialStr = ''
      this.originStr = ''
      this.warehouseStr = ''
      this.sortList[1].data = []
      this.sortList[2].data = []
      this.sortList[3].data = []
      this.sortList[4].data = []
    } else if (this.tempObject.fromPage === 'mallFilter' && this.tempObject.noBack) {
      const filters = {
        standard: [this.tempObject.standards]
      }
      this.sortList[1].data = [
        { name: '全部', isActive: false },
        { name: this.tempObject.standards, isActive: true }
      ]
      this.$emit('filter', filters)
      if (this.tempObject.name !== this.mallTabVal) {
        this.isFilter = true
      }
      this.standardStr = this.tempObject.standards
      this.searchVal = ''
    }
    console.log('tempObject', this.tempObject.search)
    this.currentPage = 0
  },
  methods: {
    ...mapActions([
      'configVal'
    ]),
    openStandard () {
      // this.statisticRequest({ event: 'click_app_mall_standard' })
      this.currentPage = 0
      this.sortCb('standard')
    },
    openMaterial () {
      // this.statisticRequest({ event: 'click_app_mall_material' })
      this.currentPage = 0
      this.sortCb('material')
    },
    openSupply () {
      // this.statisticRequest({ event: 'click_app_mall_supply' })
      this.currentPage = 0
      this.sortCb('origin')
    },
    openWarehouse () {
      this.currentPage = 0
      this.sortCb('warehouse')
    },
    openName () {
      // this.statisticRequest({ event: 'click_app_mall_goods_drop_down' })
      this.currentPage = 0
      this.activeTab = 'name'
    },
    cleanStandard () {
      this.standardVal = ''
      this.sortList[1].data = []
      this.queryObject.search = ''
      this.currentPage = 0
      this.sortCb('standard')
    },
    cleanSearch () {
      this.configVal({ key: 'tempObject', val: '' })
      this.searchVal = ''
      // this.currentPage = 0
      this.$emit('cleanSearch')
      // this.sortCb('name')
    },
    classifyClick () {
      // this.statisticRequest({ event: 'click_app_mall_category' })
      const firstShare = mpvue.getStorageSync('firstShareMallClassify') || false
      if (!firstShare) {
        this.modalIntroShow = true
        mpvue.setStorageSync('firstShareMallClassify', true)
      } else {
        this.openFilter()
      }
    },
    modalIntroCb () {
      this.openFilter()
    },
    catchtouchmove () {
      return false
    },
    mallTabValChange () {
      this.tabVal = this.mallTabVal
      const idx = this.sortList[0].data.findIndex(item => {
        return this.mallTabVal === item.id
      })
      this.sortList[0].data[idx].isActive = true
      if (this.standardStr && !this.isFilter) {
        this.standardStr = ''
        this.selectSort(1, 0)
      } else {
        this.isFilter = false
      }
      if (this.materialStr) {
        this.materialStr = ''
        this.selectSort(2, 0)
      }
      if (this.originStr) {
        this.originStr = ''
        this.selectSort(3, 0)
      }
      if (this.warehouseStr) {
        this.warehouseStr = ''
        this.selectSort(4, 0)
      }
      this.selectTab(this.sortList[0].data[idx], idx)
    },
    filterCancel (sortIdx) {
      if (this.temporary.length > 0) {
        this.temporary.map((item, idx) => {
          if (this.sortList[sortIdx].data.length > 0) {
            this.sortList[sortIdx].data[item].isActive = !this.sortList[sortIdx].data[item].isActive
          }
        })
        this.temporary = []
      }
    },
    searchHandler () {
      const list = ['standard', 'material', 'origin', 'warehouse']
      const filters = {}
      this.sortList.map((item, idx) => {
        filters[item.key] = []
        if (list.indexOf(item.key) !== -1 && item.data) {
          item.data.map(itemKey => {
            if (itemKey.isActive) {
              filters[item.key].push(itemKey.name)
            }
          })
        }
      })
      this.$emit('filter', filters)

      this.standardStr = filters['standard'].toString() === '全部' ? '' : filters['standard'].toString()
      this.materialStr = filters['material'].toString() === '全部' ? '' : filters['material'].toString()
      this.originStr = filters['origin'].toString() === '全部' ? '' : filters['origin'].toString()
      this.warehouseStr = filters['warehouse'].toString() === '全部' ? '' : filters['warehouse'].toString()
      this.temporary = []
      // this.statisticRequest({ event: 'app_mall_filter', goods_name: this.tabVal, standard: this.standardStr, material: this.materialStr, supply: this.originStr })
      this.sortClose()
    },
    openFilter () {
      const idx = this.sortList.findIndex((item) => {
        return item.key === this.activeTab
      })
      console.log('idx', idx)
      if (idx !== -1) {
        this.sortClose(idx)
      }
      this.jump('/pages/vendor/sumGoodsFilter/main?name=' + this.tabVal)
    },
    standardChange (e) {
      this.throttle(() => {
        // this.statisticRequest({ event: 'click_app_mall_category_search' })
        this.queryObject.search = e.mp.detail.value
        this.currentPage = 0
        this.sortCb('standard')
      }, 300)
    },
    searchChange () {
      this.$emit('searchChange', this.searchVal)
    },
    selectSort (sortIdx, idx) {
      if (sortIdx !== 0) {
        this.temporary.push(idx)
      }
      if (idx === 0 || sortIdx === 0) {
        this.sortList[sortIdx].data.map(item => {
          item.isActive = false
        })
      } else if (sortIdx !== 0) {
        this.sortList[sortIdx].data[0].isActive = false
      }
      if (this.sortList[sortIdx].data.length > 0) {
        this.sortList[sortIdx].data[idx].isActive = !this.sortList[sortIdx].data[idx].isActive
      }
      if (sortIdx === 0) {
        this.selectTab(this.sortList[sortIdx].data[idx], idx)
        this.sortClose()
      }
      if (idx === 0) {
        this.scrollTop = 0
        const me = this
        setTimeout(function () {
          me.scrollTop = 3
        }, 100)
      }
    },
    sortClose (sortIdx) {
      if (sortIdx) {
        this.filterCancel(sortIdx)
      }
      this.queryObject.search = ''
      this.standardVal = ''
      this.activeTab = ''
    },
    selectTab (item, index) {
      this.isFilter = false
      this.tabVal = item.id
      if (index > 2) {
        this.scrollId = 'idx_' + (index - 2)
      } else {
        this.scrollId = 'idx_0'
      }
      this.sortList[0].data.map((item, idx) => {
        item.isActive = this.tabVal === item.id
      })
      this.configVal({ key: 'tempObject', val: { name: item.id } })
      this.$emit('selectTab', { id: item.id, idx: index })
    },
    loadMore () {
      if (this.activeTab === 'standard') {
        this.isMore = true
        this.currentPage++
        this.sortCb(this.activeTab)
      }
    },
    sortCb (key, standard) {
      this.queryObject.name = this.tabVal
      this.queryObject.current_page = this.currentPage
      let queryObj = Object.assign({}, this.queryObject)
      this.showLoading()
      this.ironRequest(this.sortQueryList[key].reqUrl, queryObj, 'post').then(resp => {
        if (resp.returncode === '0') {
          let arr = resp[this.sortQueryList[key].respKey]
          const tabList = []
          const idx = this.sortList.findIndex((item) => {
            return item.key === key
          })
          if (arr.length > 0) {
            if (standard) {
              arr.unshift({ name: '全部', id: '', isActive: false })
              arr[1].isActive = true
              this.sortList[1].data = arr
            } else {
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
                    id: item.name
                  }
                  tabList.push(obj)
                }
              })
              // arr.unshift({ name: '全部', id: '', isActive: false })
              // this.sortList[idx].data = arr
              if ((this.currentPage === 0 || key !== 'standard') && !this.isMore) {
                arr.unshift({ name: '全部', id: '', isActive: false })
                this.sortList[idx].data = arr
              } else {
                this.sortList[idx].data.push(...arr)
              }
            }
          } else {
            if (this.currentPage > 0) this.currentPage--
          }
          if (key === 'name') {
            tabList.unshift({ name: '全部', id: '', isActive: true })
            this.sortList[0].data = tabList
            this.mallTabValChange()
            this.$emit('getName', tabList)
          } else if (standard) {
            this.activeTab = ''
            this.queryObject.search = ''
            this.standardVal = ''
          } else {
            this.activeTab = key
          }
          this.isMore = false
          this.hideLoading()
        }
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
  margin 0 5px
  width 25%
  line-height 30px
  padding 0 5px
  border-radius 5px
  &.active
    border 2px solid #2485ff
    background rgba(36, 133, 255, 0.05)
.shop-head
  // position fixed
  // width 100%
  // top 64px
  // left 0
  // right 0
  // z-index 2
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
  // height calc(100vh - 122px)
  // height 100vh
  z-index 4
  background rgba(0, 0, 0, 0.5)
  // @media screen and (width: 375px)
  // height calc(100vh - 112px)
  // @media screen and (width: 414px)
  // height calc(100vh - 98px)
.sort-list
  padding 5px
  text-align center
  .sort-item
    border 1px #eeeeee solid
    border-radius 35px
    line-height 30px
    position relative
    &.big
      font-size 14px
    &.active
      border-color #0081ff
      color #0081ff
    .sort-name
      overflow hidden
      white-space nowrap
      text-overflow ellipsis
    .check
      position absolute
      right 0px
      bottom -1px
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
  // max-height 200px
  // overflow auto
.btn-cancel, .btn-sure
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
.search-input
  border-radius 30px
  height 30px
  padding 0 10px
  line-height 30px
  width 200px
  input::-webkit-input-placeholder
    font-size 11px
    font-weight 500
</style>