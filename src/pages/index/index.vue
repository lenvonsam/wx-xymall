<template lang="pug">
div
  nav-bar(title="首页", :serviceIcon="true")
  .padding.bg-white(style="padding-top: 50px")
    .fixed.top.home-top-bar(:style="{height: '40px', 'padding-bottom': '50px', top: customBar + 'px'}")
      .padding-sm.padding-lr.margin-bottom-sm(style="background: #f6f6f6;border-radius: 38rpx;", @click="jumpSearch")
        .row.text-gray
          //- .flex-30
          .cuIcon-search
          .col.padding-left-sm 请输入关键词搜索
    swiper(v-if="gallery.length > 0", :indicator-dots="true", :autoplay="true", circular,indicator-active-color="#fff", indicator-color="rgba(255, 255, 255, .3)")
      swiper-item.border-radius(v-for="(g,idx) in gallery", :key="idx")
        img.response(:src="imgOuterUrl + g.url", v-if="imgOuterUrl", style="height: 300rpx", mode="widthFix")
    time-line(v-else, type="gallery")
  .row.bg-white.padding-bottom-sm
    .col.text-center(v-for="(icon,idx) in (currentUser.type === 'seller' ? sellerMainIcons : mainIcons)", :key="idx", @click="iconJump(icon)")
      img(:src="icon.url", style="width: 85rpx; height: 85rpx")
      .mt-5 {{icon.title}}
  .bg-white.padding.margin-top-sm
    .row
      .flex-30.row
        img(src="/static/images/notice_icon.png", style="width: 40rpx;height:40rpx;")
      .col.row(style="overflow hidden")
        vert-banner(:quees="notices")
        //- span(v-else) 暂无消息
      .flex-60.text-gray.ft-12.text-right(@click="jumpNotice") 更多>>
  .bg-white.padding.margin-top-sm
    .ft-18.text-blod 产品分类
    .margin-top
      .row(v-for="(row,ridx) in mainClassify", :key="ridx", :class="{'margin-top-sm': ridx > 0}")
        .col.text-center(v-for="(col,cidx) in row", :key="cidx")
          .btn-classify(@click="classifyClick(col.id, col.title)") {{col.title}}
      .margin-top.text-center.text-blue.ft-13(@click="mallMore") 查看更多>>
  //- .margin-top-sm.margin-bottom-sm.bg-white.padding
    .text-center.ft-16
      span.ml-15(v-for="(name,idx) in echartType", :key="name", :class="{'text-blue': idx === echartTabIndex}", @click="echartTabClick(name, idx)") {{name}}
    div(:style="{height: echartHeight + 'rpx'}", v-if="!shareModalShow")
      mpvue-echarts(:echarts="echarts", :onInit="initChart")
    .text-center 型云价格指数
  modal-intro(v-model="shareModalShow", :images="introImages", type="home")
  //- alert(msg="资料提交成功,请耐心等待审核", v-model="alertShow")
  //- modal-input(v-model="alertShow")
</template>

<script>
import { mapState, mapActions } from 'vuex'
import mpvueEcharts from 'mpvue-echarts'
import modalIntro from '../../components/ModalIntro.vue'
import vertBanner from '../../components/VertBanner.vue'
import lineOpts from '../../utils/lineOpts'
import modalInput from '@/components/ModalInput.vue'
import modal from '@/components/Modal.vue'
// const echarts = require('../../../static/libs/echarts.min.js')
// let chart = null
export default {
  data () {
    return {
      introImages: ['home_intro.png'],
      shareModalShow: false,
      echartType: ['H型钢', '工角槽', '普碳开平板'],
      echartTabIndex: 0,
      // echarts,
      echartHeight: 0,
      lineOptionData: [],
      gallery: [],
      notices: {},
      lineOptions: lineOpts,
      alertShow: true,
      top: 0
    }
  },
  components: {
    mpvueEcharts,
    vertBanner,
    modalIntro,
    modalInput,
    modal
  },
  beforeMount () {
    this.$nextTick(function () {
      this.showShareBanner()
    })
  },
  onShareAppMessage () {
    return {
      title: '型云商城',
      path: 'pages/index/main',
      success () {
        this.showMsg('转发成功')
      },
      error () {
        this.showMsg('转发失败')
      }
    }
  },
  onLoad (opt) {
    console.log('onLoad', opt)
    /**
     * 添加扫码后获取参数操作
     * @author samy
     * @date 2020/05/27
     */
    if (opt.scene) {
      const arr = opt.scene.split('*')
      console.log('arr:>>', arr)
      if (arr.length > 0 && arr.length === 3 && arr[0] === 'qrp') {
        mpvue.setStorageSync(
          'qrp',
          JSON.stringify({
            id: arr[1],
            source: arr[2],
            time: new Date().getTime()
          })
        )
        // 自动跳转到商城页面
        if (arr[1] !== '999') {
          this.configVal({ key: 'tempObject', val: { name: arr[1], fromPage: 'home' } })
          this.tab('/pages/mall/main')
        }
      }
    }
  },
  onShow (opt) {
    console.log('onshow', opt)
    this.echartHeight = (400 / 345) * (this.screenWidth - 30)
    this.loadBanner()
    // this.getTrends()
    this.loadNotice()
    if (this.isLogin) {
      this.setCartCount(this.currentUser.user_id)
    } else {
      this.tabDot(0)
    }
  },
  computed: {
    ...mapState({
      mainIcons: state => state.mainIcons,
      sellerMainIcons: state => state.vendor.mainIcons,
      mainClassify: state => state.mainClassify,
      modules: state => state.modules
    })
  },
  methods: {
    ...mapActions([
      'configVal'
    ]),
    jumpNotice () {
      this.statisticRequest({ event: 'click_app_index_notice_more' })
      this.jump('/pages/cardList/main?title=型云公告&type=notice')
    },
    jumpSearch () {
      this.currentUser.type === 'seller' ? this.statisticRequest({ event: 'click_app_index_search_seller' }, true) : this.statisticRequest({ event: 'click_app_index_search' })
      this.jump('/pages/search/main')
    },
    showShareBanner () {
      const firstShare = mpvue.getStorageSync('firstShare') || false
      if (!firstShare) {
        this.shareModalShow = true
        mpvue.setStorageSync('firstShare', true)
      }
    },
    classifyClick (id, name) {
      // this.configVal({ key: 'tempObject', val: { name: title } })
      this.statisticRequest({ event: 'click_app_index_category', name: name }, true)
      this.configVal({ key: 'tempObject', val: { name: id, fromPage: 'home' } })
      this.tab('/pages/mall/main')
    },
    iconJump (icon) {
      this.statisticRequest({ event: icon.event }, true)
      if (this.isLogin) {
        if (icon.dotKey && this.currentUser.type === 'seller' && !this.modules[icon.dotKey]) {
          this.showMsg('暂无权限')
          return false
        }
        this.jump(icon.path)
      } else {
        this.confirm({ title: '友情提示', content: '您未登录，请先登录' }).then(res => {
          if (res === 'confirm') this.jump('/pages/account/login/main')
        })
      }
    },
    mallMore () {
      this.statisticRequest({ event: 'click_app_index_category', name: '查看更多' }, true)
      this.tab('/pages/mall/main')
    },
    // initChart (canvas, width, height) {
    //   chart = echarts.init(canvas, null, {
    //     width: width,
    //     height: height
    //   })
    //   canvas.setChart(chart)
    //   chart.setOption(this.lineOptions)
    //   return chart // 返回 chart 后可以自动绑定触摸操作
    // },
    // async getTrends () {
    //   try {
    //     const res = await this.ironRequest(this.apiList.xy.trend.url, {}, this.apiList.xy.trend.method, this)
    //     console.log('trends resp', res)
    //     const lineOptionDataArr = []
    //     for (let i = 0; i < this.echartType.length; i++) {
    //       let key = this.echartType[i]
    //       if (key === '工角槽') key = '槽钢'
    //       lineOptionDataArr.push(res.data[key])
    //     }
    //     this.lineOptionData = lineOptionDataArr
    //     this.lineOptions.series[0].data = res.data[this.echartType[0]].slice(-9)
    //     chart.setOption(this.lineOptions)
    //   } catch (e) {
    //     this.showMsg(e)
    //   }
    // },
    // echartTabClick (name, idx) {
    //   this.echartTabIndex = idx
    //   this.lineOptions.series[0].data = this.lineOptionData[idx].slice(-9)
    //   chart.setOption(this.lineOptions)
    // },
    async loadBanner () {
      try {
        const data = await this.ironRequest(this.apiList.xy.banner.url, {}, this.apiList.xy.banner.method, this)
        this.gallery = data.banners
      } catch (e) {
        this.showMsg(e)
      }
    },
    async loadNotice () {
      try {
        const data = await this.ironRequest(this.apiList.xy.notice.url + '?current_page=0&page_size=5&type=2', {}, this.apiList.xy.notice.method, this)
        this.notices = data.notices
      } catch (e) {
        this.showMsg(e)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.home-top-bar
  overflow hidden
  padding-left 15px
  padding-right 15px
  z-index 200
  background #fff
.btn-classify
  display inline-block
  padding 8px 12px
  width 110px
  background #f6f6f6
  border-radius 10px
  text-align center
  font-size 13px
</style>
