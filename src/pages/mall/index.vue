<template lang="pug">
div
  nav-bar(title="商城")
  mall-head(:mallTabVal="tempObject.name", @selectMall="selectMall", @selectTab="selectTab", @searchChange="searchChange")
  .mall-content(:class="{'bg-white': mallFlag}")
    //- .text-center(v-show="isLoad")
      img(src="/static/images/loadRun.gif", style="width: 120px; height: 120px")
    .mt-10(:class="{cardSty: !mallFlag}", v-show="mallItems.length > 0")
        mall-item(:mallFlag="mallFlag", :cb="mallItemCb", v-for="(item,idx) in mallItems", :item="item", :key="idx")
</template>
<script>
import { mapState } from 'vuex'
import mallHead from '@/components/MallHead'
import mallItem from '@/components/MallItem'
export default {
  components: {
    mallHead,
    mallItem
  },
  data () {
    return {
      mallItems: [],
      queryObject: {},
      isLoad: 'refresher',
      pullDownRefresh: false,
      currentPage: 0,
      pageSize: 10,
      mallFlag: 1
    }
  },
  computed: {
    ...mapState({
      tempObject: state => state.tempObject,
      customBar: state => state.customBar
    })
  },
  onShow () {
    Object.assign(this.queryObject, this.tempObject)
    this.mallItems = []
    this.refresher()
  },
  mounted () {
    this.$nextTick(() => {
      this.queryObject = {
        current_page: this.currentPage,
        page_size: this.pageSize,
        search: '',
        only_available: 1
      }
      this.refresher()
    })
  },
  onReachBottom () {
    this.currentPage++
    this.isLoad = 'reachBottom'
    this.refresher()
  },
  onPullDownRefresh () {
    this.isLoad = 'refresh'
    this.currentPage = 0
    this.refresher()
  },
  methods: {
    selectMall (flag) {
      console.log(flag)
      this.mallFlag = flag
    },
    searchChange (val) {
      this.mallItems = []
      this.currentPage = 0
      this.isLoad = 'refresher'
      this.queryObject = {
        current_page: this.currentPage,
        page_size: this.pageSize,
        search: val,
        only_available: 1
      }
      this.refresher()
    },
    mallItemCb () { },
    selectTab (val) {
      this.mallItems = []
      this.currentPage = 0
      this.queryObject = {
        current_page: this.currentPage,
        page_size: this.pageSize,
        search: '',
        name: val,
        only_available: 1
      }
      this.isLoad = 'refresh'
      this.refresher()
    },
    refresher () {
      const me = this
      this.queryObject.current_page = this.currentPage
      this.ironRequest(this.apiList.xy.mallList, this.queryObject, 'post', this).then((res) => {
        if (res.returncode === '0') {
          if (me.isLoad === 'refresh') {
            if (res.products.length > 0 && me.currentPage === 0) {
              me.mallItems = res.products
            } else if (res.products.length === 0 && me.currentPage === 0) {
              me.mallItems = []
            }
            wx.stopPullDownRefresh()
          } else {
            if (res.products.length > 0) {
              me.mallItems.push(...res.products)
              console.log('mallItems-reachBottom', me.mallItems)
            } else {
              me.currentPage--
            }
          }
        } else {
          me.msgShow(res === undefined ? '网络异常' : res.errormsg)
          return false
        }
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
.mall-content
  margin-top 150px
.cardSty
  padding 0 15px
  display flex
  flex-wrap wrap
  justify-content space-between
</style>