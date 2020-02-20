<template lang="pug">
div
  nav-bar(title="商城")
  mall-head(:mallTabVal="tempObject.name", @filter="multipleFilter", @selectMall="selectMall", @selectTab="selectTab", @searchChange="searchChange")
  .mall-content(:class="{'bg-white': mallFlag}")
    //- .text-center(v-show="isLoad")
      img(src="/static/images/loadRun.gif", style="width: 120px; height: 120px")
    .mt-10(:class="{cardSty: !mallFlag}", v-show="mallItems.length > 0")
      mall-item(:mallFlag="mallFlag", :cb="mallItemCb", v-for="(item,idx) in mallItems", :item="item", :key="idx")
</template>
<script>
import { mapState, mapActions } from 'vuex'
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
      mallFlag: 1,
      btnDisable: false
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser,
      tempObject: state => state.tempObject,
      isLogin: state => state.user.isLogin,
      customBar: state => state.customBar
    })
  },
  onShow () {
    this.queryObject = {}
    if (this.tempObject.search || this.tempObject.name === '') {
      Object.assign(this.queryObject, this.tempObject)
    }
    if (!this.tempObject.name) {
      this.btnDisable = false
      this.mallItems = []
      this.refresher()
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
    ...mapActions(['configVal']),
    multipleFilter (filter) {
      console.log('filter', filter)
      const obj = {}
      Object.keys(filter).forEach((key) => {
        if (filter[key].length > 0) {
          obj[`${key}s`] = filter[key].toString()
        }
      })
      this.mallItems = []
      this.currentPage = 0
      this.isLoad = 'refresher'
      this.queryObject = {
        current_page: this.currentPage,
        page_size: this.pageSize,
        only_available: 1
      }
      Object.assign(this.queryObject, obj)
      this.refresher()
    },
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
    mallItemCb (obj, type, evt) {
      console.log('type', type)
      const me = this
      if (type === 'showPrice') {
        if (this.isLogin) {
          this.showMsg('请完善信息，耐心等待审核通过')
        } else {
          this.confirm({ content: '请登录后查看价格，去登录' }).then(() => {
            me.configVal({
              key: 'tempObject',
              val: { preRoute: me.$root.$mp.appOptions.path }
            })
            me.jump('/pages/account/login/main')
          })
        }
        return
      }
      if (type === 'cart') { this.statisticRequest({ event: 'click_app_mall_add_cart' }, this) }

      if (obj.name === 'H型钢' && obj.price === '--') {
        this.showMsg(`此商品会在${obj.show_time}后开售`)
        return
      }
      if (this.isLogin) {
        if (!this.btnDisable) {
          this.btnDisable = true
          this.addCart(obj, type, this.currentUser.user_id).then(
            rt => {
              debugger
              me.showMsg('加入购物车成功', '', 1000)
              // if (rt.type === 'cart') {
              //   if (this.browserName() === 'wxpub') {
              //     me.zgRequest(
              //       me.zgEventStatic(me.currentUser, '加入购物车', {
              //         productid: obj.id,
              //         count: 1,
              //         measure_way: rt.mway
              //       })
              //     )
              //   }
              //   this.cartEvt = evt
              // } else {
              //   me.msgShow(rt.msg, 'positive')
              // }
              me.btnDisable = false
            },
            err => {
              me.showMsg(err)
              me.btnDisable = false
            }
          )
        }
      } else {
        this.confirm({ content: '请您登录后购买，去登录' }).then(() => {
          me.configVal({
            key: 'tempObject',
            val: { preRoute: me.$root.$mp.appOptions.path }
          })
          me.jump('/pages/account/login/main')
        })
      }
    },
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
      this.ironRequest(
        this.apiList.xy.mallList.url,
        this.queryObject,
        this.apiList.xy.mallList.method,
        this
      ).then(res => {
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