<template lang="pug">
.bg-white.full-width.text-gra.shop-head(:style="{top: customBar+'px'}")
  .flex.align-center.pl-10.pr-10(style="height: 90rpx")
    .h-left.ft-25(@click="classifyClick")
      .cuIcon-sort.lg.text-gra
      .ft-14 分类
    .search.col
      .row
        .cuIcon-search.text-gray.ft-18
        input.full-width.pl-10(@click="jumpSearchInput", id="mallSearchInput", :disabled="true", type="text", placeholder="品名、材质、规格、产地(空格号隔开)", v-model="searchVal")
        .close-icon(@click="cleanSearch", v-if="searchVal")
          .cuIcon-roundclosefill.ft-18
        //- input.full-width.pl-10(id="mallSearchInput", type="text", placeholder="品名、材质、规格、产地", v-model="searchVal")
  .relative
    .mt-15.text-center.flex.align-stretch
      .col.tab-content
        //- scroll-view.nav(scroll-x, scroll-with-animation, :scroll-left="scrollLeft")
        //- 滑动tab条（品名）
        scroll-view.nav(scroll-x, :scroll-into-view="scrollId")
          //- scroll-view.nav(scroll-x, scroll-with-animation, :scroll-into-view="searchCurId")
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
      .setting-list.flex.ft-25
        .cuIcon-list(@click="selectMall(1)", :class="mallFlag ? 'text-blue' : 'text-gra'")
        .cuIcon-cascades.ml-5(@click="selectMall(0)", :class="!mallFlag ? 'text-blue' : 'text-gra'")
    //- 下拉筛选框（品名、材质、规格、产地）
    .filter-box(:style="{height: filterHeight+'rpx'}", @click.prevent="sortClose(sortIdx)", @touchmove.stop="catchtouchmove", v-show="activeTab === sort.key", v-for="(sort, sortIdx) in sortList", :key="sortIdx")
      .bg-white.padding-sm.ft-11(@click.stop="")
        .flex.align-stretch.justify-between
          .flex.align-center
            .dotted.bg-blue
            span.pl-10.text-bold.ft-16 {{sort.title}}
            //- 搜索框（规格下拉筛选框）
            .search-input.row.bg-gray.margin-left-sm.text-gray(v-if="activeTab === 'standard'")
              .cuIcon-search.ft-16
              input.full-width.pl-10.ft-13(@input="standardChange", @focus="standardInputFocus", v-model="standardVal", type="text", placeholder="请输入规格快速查询")
              .close-icon(@click="cleanStandard", v-if="standardVal")
                .cuIcon-roundclosefill.ft-16
          .row.padding-sm(@click="sortClose(sortIdx)")
            .cuIcon-fold.ft-16
        scroll-view(scroll-y, style="max-height: 700rpx", :scroll-top="scrollTop")
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
      pageSize: 10000,
      currentPage: 0,
      queryObject: {
        current_page: 0,
        page_size: 10000
      },
      temporary: [],
      sortList: [
        { label: '品名', key: 'name', data: [], selectSort: [], title: '品名展示' },
        { label: '规格', key: 'standard', data: [], selectSort: [], title: '规格展示' },
        { label: '材质', key: 'material', data: [], selectSort: [], title: '材质展示' },
        { label: '产地', key: 'origin', data: [], selectSort: [], title: '产地展示' }
      ],
      // sortQueryList: {
      //   'standard': {
      //     reqUrl: 'standardList.shtml',
      //     chooseIdx: [0, 0],
      //     respKey: 'standards'
      //   },
      //   'name': {
      //     reqUrl: 'goodsList.shtml',
      //     chooseIdx: [0, 0],
      //     respKey: 'goods'
      //   },
      //   'material': {
      //     reqUrl: 'materialList.shtml',
      //     chooseIdx: [0, 0],
      //     respKey: 'materials'
      //   },
      //   'origin': {
      //     reqUrl: 'supplyList.shtml',
      //     chooseIdx: [0, 0],
      //     respKey: 'supplies'
      //   },
      //   'more': {
      //     reqUrl: 'toleranceAndWeightList.shtml',
      //     chooseIdx: [0, 0]
      //   }
      // },
      sortQueryList: {
        'standard': {
          reqUrl: 'querySpecificationPage',
          chooseIdx: [0, 0],
          respKey: 'specificationList'
        },
        'name': {
          reqUrl: 'queryProductBrandNamePage',
          chooseIdx: [0, 0],
          respKey: 'productBrandNameList'
        },
        'material': {
          reqUrl: 'queryProductTextureNamePage',
          chooseIdx: [0, 0],
          respKey: 'productTextureNameList'
        },
        'origin': {
          reqUrl: 'queryProdAreaNamePage',
          chooseIdx: [0, 0],
          respKey: 'prodAreaNameList'
        },
        'more': {
          reqUrl: 'querySpecificationPage',
          chooseIdx: [0, 0]
        }
      },
      isActive: true,
      searchVal: '',
      mallFlag: 1,
      // standards: [],
      // materials: [],
      // supplys: [],
      standardStr: '',
      materialStr: '',
      originStr: '',
      filterStr: '',
      isMore: false,
      // standardSearch: '',
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
      screenWidth: state => state.screenWidth,
      bottomBarHeight: state => state.bottomBarHeight
    })
  },
  onHide () {
    // sortList: [
    //   { label: '品名', key: 'name', data: [], selectSort: [], title: '品名展示' },
    //   { label: '规格', key: 'standard', data: [], selectSort: [], title: '规格展示' },
    //   { label: '材质', key: 'material', data: [], selectSort: [], title: '材质展示' },
    //   { label: '产地', key: 'origin', data: [], selectSort: [], title: '产地展示' }
    // ]
    const sortIdx = this.sortList.findIndex(item => item.key === this.activeTab)
    this.sortClose(sortIdx)
  },
  watch: {
    mallTabVal () {
      this.mallTabValChange()
    }
    // searchVal (newVal) {
    //   console.log('search', newVal)
    //   console.log('---', this.searchVal)
    //   this.throttle(this.searchChange, 300)
    // }
  },
  beforeMount () {
    // 如果是从搜索页面进来
    if (this.tempObject.fromPage === 'search' && this.tempObject.noBack) {
      this.searchVal = this.tempObject.search || ''
    }
    // 获取滑动tab条（品名）的数据
    this.sortCb('name')
    // 下拉筛选框高度
    this.filterHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - this.getRpx(this.bottomBarHeight) - 95
  },
  onShow () {
    this.isFilter = false
    if (this.sortList[0].data.length === 0) this.sortCb('name')
    // 如果是从搜索页面过来
    if (this.tempObject.fromPage === 'search' && this.tempObject.noBack) {
      this.searchVal = this.tempObject.search || ''
      this.standardStr = ''
      this.materialStr = ''
      this.originStr = ''
      this.sortList[1].data = []
      this.sortList[2].data = []
      this.sortList[3].data = []
    } else if (this.tempObject.fromPage === 'mallFilter' && this.tempObject.noBack) {
      // 如果是从分类页面过来
      const filters = {
        standard: [this.tempObject.standards]
      }
      // 规格的数据
      this.sortList[1].data = [
        { name: '全部', isActive: false },
        { name: this.tempObject.standards, isActive: true }
      ]
      console.log('从分类页面过来，触发下拉框筛选filter++++')
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
    // 获取焦点（请输入规格快速查询）
    standardInputFocus () {
      this.currentUser.type === 'seller' ? this.statisticRequest({ event: 'click_app_mall_standard_search_seller' }, true) : this.statisticRequest({ event: 'click_app_mall_standard_search' })
    },
    // 打开规格下拉筛选框
    openStandard () {
      this.currentPage = 0
      this.currentUser.type === 'seller' ? this.statisticRequest({ event: 'click_app_mall_standard_seller' }, true) : this.statisticRequest({ event: 'click_app_mall_standard' })
      this.sortCb('standard')
    },
    // 打开材质下拉筛选框
    openMaterial () {
      this.currentPage = 0
      this.currentUser.type === 'seller' ? this.statisticRequest({ event: 'click_app_mall_material_seller' }, true) : this.statisticRequest({ event: 'click_app_mall_material' })
      this.sortCb('material')
    },
    // 打开产地下拉筛选框
    openSupply () {
      this.currentPage = 0
      this.currentUser.type === 'seller' ? this.statisticRequest({ event: 'click_app_mall_supply_seller' }, true) : this.statisticRequest({ event: 'click_app_mall_supply' })
      this.sortCb('origin')
    },
    // 打开品名下拉筛选框
    openName () {
      this.currentPage = 0
      this.currentUser.type === 'seller' ? this.statisticRequest({ event: 'click_app_mall_goods_drop_down_seller' }, true) : this.statisticRequest({ event: 'click_app_mall_goods_drop_down' })
      this.activeTab = 'name'
    },
    // 点击跳转搜索页面
    jumpSearchInput () {
      this.currentUser.type === 'seller' ? this.statisticRequest({ event: 'click_app_mall_search_seller' }, true) : this.statisticRequest({ event: 'click_app_mall_search' })
      this.jump('/pages/search/main')
    },
    // 清除搜索（请输入规格快速查询）
    cleanStandard () {
      this.standardVal = ''
      this.sortList[1].data = []
      this.queryObject.search = ''
      this.currentPage = 0
      this.sortCb('standard')
    },
    // 清除搜索（品名、材质、规格、产地(空格号隔开)）
    cleanSearch () {
      this.configVal({ key: 'tempObject', val: '' })
      this.searchVal = ''
      // this.currentPage = 0
      this.$emit('cleanSearch')
      // this.sortCb('name')
    },
    // 点击分类
    classifyClick () {
      this.currentUser.type === 'seller' ? this.statisticRequest({ event: 'click_app_mall_category_seller' }, true) : this.statisticRequest({ event: 'click_app_mall_category' })
      // 分类使用引导图
      const firstShare = mpvue.getStorageSync('firstShareMallClassify') || false
      if (!firstShare) {
        this.modalIntroShow = true
        mpvue.setStorageSync('firstShareMallClassify', true)
      } else {
        this.openFilter()
      }
    },
    // 分类使用引导图回调
    modalIntroCb () {
      this.openFilter()
    },
    // 防止滑动穿透
    catchtouchmove () {
      return false
    },
    // 滑动tab条（品名）改变
    mallTabValChange () {
      console.log('mallTabValChange++++')
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
      this.selectTab(this.sortList[0].data[idx], idx)
    },
    // 取消下拉框选择
    filterCancel (sortIdx) {
      console.log('取消下拉框选择+++++++')
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
      const list = ['standard', 'material', 'origin']
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
        // if (filters[item.key].length === 0 && this[`${item.key}Str`]) {
        //   filters[item.key] = this[`${item.key}Str`].split(',')
        // }
      })
      this.$emit('filter', filters)

      this.standardStr = filters['standard'].toString() === '全部' ? '' : filters['standard'].toString()
      this.materialStr = filters['material'].toString() === '全部' ? '' : filters['material'].toString()
      this.originStr = filters['origin'].toString() === '全部' ? '' : filters['origin'].toString()
      this.temporary = []
      this.statisticRequest({ event: 'app_mall_filter', goods_name: this.tabVal, standard: this.standardStr, material: this.materialStr, supply: this.originStr })
      this.sortClose()
    },
    // 点击打开分类页面
    openFilter () {
      const idx = this.sortList.findIndex((item) => {
        return item.key === this.activeTab
      })
      // 如果点击直接打开过下拉筛选框，需要先关闭
      console.log('idx', idx) // idx -1
      if (idx !== -1) {
        this.sortClose(idx)
      }
      // 跳转分类页面
      this.jump('/pages/mallFilter/main?name=' + this.tabVal)
    },
    // 规格下拉筛选框搜索框搜索内容改变
    standardChange (e) {
      this.throttle(() => {
        this.currentUser.type === 'seller' ? this.statisticRequest({ event: 'click_app_mall_category_search_seller' }, true) : this.statisticRequest({ event: 'click_app_mall_category_search' })
        this.queryObject.search = e.mp.detail.value
        this.currentPage = 0
        this.sortCb('standard')
      }, 300)
    },
    searchChange () {
      this.$emit('searchChange', this.searchVal)
    },
    // 选择下拉筛选框的项
    selectSort (sortIdx, idx) {
      console.log('selectSort++++', 'sortIdx', sortIdx, 'idx', idx)
      console.log(this.sortList[sortIdx].data)

      if (sortIdx !== 0) {
        this.temporary.push(idx)
      }
      // 如果选择了规格、材质、产地中的全部选项
      // 或者选择了品名中的任意一项
      if (idx === 0 || sortIdx === 0) {
        this.sortList[sortIdx].data.map(item => {
          item.isActive = false // 都不选中
        })
      } else if (sortIdx !== 0) {
        // 如果选择的不是品名中的任意一项
        this.sortList[sortIdx].data[0].isActive = false
      }
      // 单选或者多选
      if (this.sortList[sortIdx].data.length > 0) {
        this.sortList[sortIdx].data[idx].isActive = !this.sortList[sortIdx].data[idx].isActive
      }
      // 如果选择了品名中的任意一项
      if (sortIdx === 0) {
        this.selectTab(this.sortList[sortIdx].data[idx], idx)
        this.sortClose()
      }
      // 如果选择的是全部
      if (idx === 0) {
        this.scrollTop = 0
        const me = this
        setTimeout(function () {
          me.scrollTop = 3
        }, 100)
      }
      console.log('选择结果+++++++++++')
      console.log(this.sortList[sortIdx].data[idx])
      console.log(this.sortList[sortIdx].data)
    },
    // 关闭下拉选择框
    sortClose (sortIdx) {
      if (sortIdx) {
        this.filterCancel(sortIdx)
      }
      // this.standardSearch = ''
      this.queryObject.search = ''
      this.standardVal = ''
      this.activeTab = ''
    },
    // 点击选择滑动tab条（品名）
    selectTab (item, index) {
      console.log('选择品名++++', item, index)
      this.isFilter = false
      this.tabVal = item.id // 选择的滑动tab条项的id
      if (index > 2) {
        this.scrollId = 'idx_' + (index - 2)
      } else {
        this.scrollId = 'idx_0'
      }
      // 选中项
      this.sortList[0].data.map((item, idx) => {
        item.isActive = this.tabVal === item.id
      })
      // 存储选中项的id
      this.configVal({ key: 'tempObject', val: { name: item.id } })
      console.log('触发selectTab筛选++++', item.id, index)
      this.$emit('selectTab', { id: item.id, idx: index })
    },
    // loadMore () {
    //   if (this.activeTab === 'standard') {
    //     this.isMore = true
    //     this.currentPage++
    //     this.sortCb(this.activeTab)
    //   }
    // },
    // 品名、规格、材质、产地
    sortCb (key, standard) {
      this.queryObject.name = this.tabVal
      this.queryObject.current_page = this.currentPage
      let queryObj = Object.assign({}, this.queryObject)
      this.showLoading()
      console.log('apiList++++')
      console.log(this.apiList)
      this.httpPost(this.apiList.zf[this.sortQueryList[key].reqUrl], queryObj, 'post').then(resp => {
        console.log('sortCb++++++', resp)
        // 获取对应的下拉筛选框数据
        let arr = resp.data[this.sortQueryList[key].respKey]
        const tabList = []
        // 获取当前点击的key（规格、材质、产地）的下标
        const idx = this.sortList.findIndex((item) => {
          return item.key === key
        })
        console.log('idx', idx)
        if (arr.length > 0) {
          if (standard) {
            // const standardIdx = arr.findIndex(item => item.name === standard)
            arr.unshift({ name: '全部', isActive: false })
            arr[1].isActive = true
            this.sortList[1].data = arr
          } else {
            console.log('sortList++++', this.sortList[idx].data)
            var newArr = arr.map(item => {
              item = {
                name: item,
                id: item,
                isActive: false
              }
              console.log(item)
              const resActive = this.sortList[idx].data.filter((itemFilter) => {
                if (itemFilter.name === item.name && itemFilter.isActive) {
                  item.isActive = true
                }
                return itemFilter.name === item.name && itemFilter.isActive
              })
              console.log('resActive', resActive)
              // if (key === 'name') {
              //   const obj = {
              //     name: item.name,
              //     key: item.name
              //   }
              //   tabList.push(obj)
              // }
              tabList.push(item)
              return item
            })
            newArr.unshift({ name: '全部', id: '', isActive: false })
            // 将数据存入sortList对应项的data中
            this.sortList[idx].data = newArr
            // if ((this.currentPage === 0 || key !== 'standard') && !this.isMore) {
            //   arr.unshift({ name: '全部', id: '', isActive: false })
            //   this.sortList[idx].data = arr
            // } else {
            //   this.sortList[idx].data.push(...arr)
            // }
          }
        } else {
          this.sortList[idx].data = arr
        }
        // else if (this.currentPage !== 0) {
        //   this.currentPage--
        // }
        // 如果选择的是品名
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
          this.activeTab = key // standard、material、origin
        }
        this.isMore = false
        this.hideLoading()
      }).catch((e) => {
        console.log('sortQueryList_catch=======>' + JSON.stringify(e))
        this.hideLoading()
      })

      // this.ironRequest(this.sortQueryList[key].reqUrl, queryObj, 'post').then(resp => {
      //   console.log('sortCb++++++', resp)
      //   if (resp.returncode === '0') {
      //     // 获取对应的下拉筛选框数据
      //     let arr = resp[this.sortQueryList[key].respKey]
      //     console.log(arr)
      //     const tabList = []
      //     // 获取当前点击的key（规格、材质、产地）的下标
      //     const idx = this.sortList.findIndex((item) => {
      //       return item.key === key
      //     })
      //     if (arr.length > 0) {
      //       if (standard) {
      //         // const standardIdx = arr.findIndex(item => item.name === standard)
      //         arr.unshift({ name: '全部', id: '', isActive: false })
      //         arr[1].isActive = true
      //         this.sortList[1].data = arr
      //       } else {
      //         arr.map(item => {
      //           item.isActive = false
      //           // const resActive = this.sortList[idx].data.filter((itemFilter) => {
      //           //   if (itemFilter.name === item.name && itemFilter.isActive) {
      //           //     item.isActive = true
      //           //   }
      //           //   return itemFilter.name === item.name && itemFilter.isActive
      //           // })
      //           // console.log('resActive', resActive)
      //           if (key === 'name') {
      //             const obj = {
      //               name: item.name,
      //               id: item.id
      //             }
      //             tabList.push(obj)
      //           }
      //         })
      //         arr.unshift({ name: '全部', id: '', isActive: false })
      //         // 将数据存入sortList对应项的data中
      //         this.sortList[idx].data = arr
      //         // if ((this.currentPage === 0 || key !== 'standard') && !this.isMore) {
      //         //   arr.unshift({ name: '全部', id: '', isActive: false })
      //         //   this.sortList[idx].data = arr
      //         // } else {
      //         //   this.sortList[idx].data.push(...arr)
      //         // }
      //       }
      //     } else {
      //       this.sortList[idx].data = arr
      //     }
      //     // else if (this.currentPage !== 0) {
      //     //   this.currentPage--
      //     // }
      //     // 如果选择的是品名
      //     if (key === 'name') {
      //       tabList.unshift({ name: '全部', id: '', isActive: true })
      //       this.sortList[0].data = tabList
      //       this.mallTabValChange()
      //       this.$emit('getName', tabList)
      //     } else if (standard) {
      //       this.activeTab = ''
      //       this.queryObject.search = ''
      //       this.standardVal = ''
      //     } else {
      //       this.activeTab = key // standard、material、origin
      //     }
      //     this.isMore = false
      //     this.hideLoading()
      //   }
      // }).catch((e) => {
      //   console.log('sortQueryList_catch=======>' + JSON.stringify(e))
      //   this.hideLoading()
      // })
    },
    sortRest (key) {
      const keyArray = ['area', 'name', 'material', 'origin', 'more']
      const me = this
      keyArray.map(item => {
        if (key !== item) me[`sidebarList${item.substring(0, 1).toUpperCase()}${item.substring(1)}Show`] = false
      })
    },
    // 选择商城的展示模式
    selectMall (flag) {
      if (flag) {
        this.currentUser.type === 'seller' ? this.statisticRequest({ event: 'click_app_mall_view_list_seller' }, true) : this.statisticRequest({ event: 'click_app_mall_view_list' })
      } else {
        this.currentUser.type === 'seller' ? this.statisticRequest({ event: 'click_app_mall_view_grid_seller' }, true) : this.statisticRequest({ event: 'click_app_mall_view_grid' })
      }
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
