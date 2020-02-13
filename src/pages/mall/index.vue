<template lang="pug">
div
  nav-bar(title="商城")
  mall-head
  .mall-content
    //- .text-center(v-show="isLoad")
      img(src="/static/images/loadRun.gif", style="width: 120px; height: 120px")
    .mt-10.bg-white(v-show="mallItems.length > 0")
      mall-item(v-for="(item,idx) in mallItems", :item="item", :cb="mallItemCb", :key="idx")
</template>
<script>
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
      pageSize: 10
    }
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
    console.log('onReachBottom')
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
    mallItemCb () { },
    refresher () {
      const me = this
      this.queryObject.current_page = this.currentPage
      this.ironRequest('mallList.shtml', this.queryObject, 'post', this).then((res) => {
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
</style>