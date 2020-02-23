<template lang="pug">
div
  nav-bar(title="首页", :serviceIcon="true")
  .padding.bg-white
    .padding-sm.padding-lr.margin-bottom-sm(style="background: #f6f6f6;border-radius: 38rpx;", @click="jump('/pages/search/main')")
      .row.text-gray
        .flex-30
          icon.cuIcon-search(style="margin-top: -16rpx")
        .col 请输入关键词搜索
    swiper(v-if="gallery.length > 0", :indicator-dots="true", :autoplay="true", indicator-active-color="#fff", indicator-color="rgba(255, 255, 255, .3)")
      swiper-item.border-radius(v-for="(g,idx) in gallery", :key="idx")
        img.response(:src="imgOuterUrl + g.url", v-if="imgOuterUrl", style="height: 300rpx", mode="widthFix")
    time-line(v-else, type="gallery")
  .row.bg-white.padding-bottom-sm
    .col.text-center(v-for="(icon,idx) in mainIcons", :key="idx", @click="iconJump(icon.path)")
      img(:src="icon.url", style="width: 106rpx; height: 112rpx")
      .mt-5 {{icon.title}}
  .bg-white.padding.margin-top-sm
    .row
      .flex-30.row
        img(src="/static/images/notice_icon.png", style="width: 40rpx;height:40rpx;")
      .col.row(style="overflow hidden")
        vert-banner(:quees="notices")
        //- span(v-else) 暂无消息
      .flex-60.text-gray.ft-12.text-right(@click="jump('/pages/cardList/main?title=型云公告&type=notice')") 更多>>
  .bg-white.padding.margin-top-sm
    .ft-18.text-blod 产品分类
    .margin-top
      .row(v-for="(row,ridx) in mainClassify", :key="ridx", :class="{'margin-top-sm': ridx > 0}")
        .col.text-center(v-for="(col,cidx) in row", :key="cidx")
          .btn-classify(@click="classifyClick(col.id)") {{col.title}}
      .margin-top.text-center.text-blue.ft-13(@click="mallMore") 查看更多>>
  .margin-top-sm.margin-bottom-sm.bg-white.padding
    .text-center.ft-16
      span.ml-15(v-for="(name,idx) in echartType", :key="name", :class="{'text-blue': idx === echartTabIndex}", @click="echartTabClick(name, idx)") {{name}}
    div(:style="{height: echartHeight + 'rpx'}", v-if="!shareModalShow")
      mpvue-echarts(:echarts="echarts", :onInit="initChart")
    .text-center 型云价格指数
  modal-intro(v-model="shareModalShow", :images="introImages")
</template>

<script>
import { mapState, mapActions } from 'vuex'
import mpvueEcharts from 'mpvue-echarts'
import modalIntro from '../../components/ModalIntro.vue'
import vertBanner from '../../components/VertBanner.vue'
import lineOpts from '../../utils/lineOpts'
const echarts = require('../../../static/libs/echarts.min.js')
let chart = null
export default {
  data () {
    return {
      introImages: ['home_intro.png'],
      shareModalShow: false,
      echartType: ['H型钢', '工角槽', '普碳开平板'],
      echartTabIndex: 0,
      echarts,
      echartHeight: 0,
      lineOptionData: [],
      gallery: [],
      notices: {},
      lineOptions: lineOpts,
      alertShow: false
    }
  },
  components: {
    mpvueEcharts,
    vertBanner,
    modalIntro
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
  onShow () {
    this.echartHeight = (200 / 345) * (this.screenWidth - 30)
    this.loadBanner()
    this.getTrends()
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
      mainClassify: state => state.mainClassify,
      screenWidth: state => state.screenWidth,
      isLogin: state => state.user.isLogin,
      currentUser: state => state.user.currentUser
    })
  },
  methods: {
    ...mapActions([
      'configVal'
    ]),
    showShareBanner () {
      const firstShare = mpvue.getStorageSync('firstShare') || false
      if (!firstShare) {
        this.shareModalShow = true
        mpvue.setStorageSync('firstShare', true)
      }
    },
    classifyClick (id) {
      // this.configVal({ key: 'tempObject', val: { name: title } })
      this.configVal({ key: 'tempObject', val: { name: id } })
      this.tab('/pages/mall/main')
    },
    iconJump (path) {
      if (this.isLogin) {
        this.jump(path)
      } else {
        this.confirm({ title: '友情提示', content: '您未登录，请先登录' }).then(res => {
          if (res === 'confirm') this.jump('/pages/account/login/main')
        })
      }
    },
    mallMore () {
      this.tab('/pages/mall/main')
    },
    initChart (canvas, width, height) {
      chart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      canvas.setChart(chart)
      chart.setOption(this.lineOptions)
      return chart // 返回 chart 后可以自动绑定触摸操作
    },
    async getTrends () {
      try {
        const res = await this.ironRequest(this.apiList.xy.trend.url, {}, this.apiList.xy.trend.method, this)
        console.log('trends resp', res)
        const lineOptionDataArr = []
        for (let i = 0; i < this.echartType.length; i++) {
          let key = this.echartType[i]
          if (key === '工角槽') key = '槽钢'
          lineOptionDataArr.push(res.data[key])
        }
        this.lineOptionData = lineOptionDataArr
        this.lineOptions.series[0].data = res.data[this.echartType[0]].slice(-9)
        chart.setOption(this.lineOptions)
      } catch (e) {
        this.showMsg(e)
      }
    },
    echartTabClick (name, idx) {
      this.echartTabIndex = idx
      this.lineOptions.series[0].data = this.lineOptionData[idx].slice(-9)
      chart.setOption(this.lineOptions)
    },
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
.btn-classify
  display inline-block
  padding 8px 12px
  width 110px
  background #f6f6f6
  border-radius 10px
  text-align center
  font-size 13px
</style>
