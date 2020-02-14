<template lang="pug">
div
  nav-bar(title="首页", :serviceIcon="true")
  .padding.bg-white
    .padding-sm.padding-lr.margin-bottom-sm(style="background: #f6f6f6;border-radius: 38rpx;", @click="jump('/pages/search/main')")
      .row.text-gray
        .flex-30
          icon.cuIcon-search(style="margin-top: -16rpx")
        .col 请输入关键词搜索
    swiper(v-if="gallery.length > 0", :indicator-dots="true", :autoplay="true")
      swiper-item.border-radius(v-for="(g,idx) in gallery", :key="idx")
        img.response(:src="imgOuterUrl + g.url", v-if="imgOuterUrl", style="height: 300rpx")
    time-line(v-else, type="gallery")
  .row.bg-white.padding-tb
    .col.text-center(v-for="(icon,idx) in mainIcons", :key="idx")
      img(:src="icon.url", style="width: 100rpx; height: 100rpx")
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
          .btn-classify {{col.title}}
      .margin-top.text-center.text-blue.ft-13(@click="mallMore") 查看更多>>
  .margin-top-sm.margin-bottom-sm.bg-white.padding
    .text-center.ft-16
      span.ml-15(v-for="(name,idx) in echartType", :key="name", :class="{'text-blue': idx === echartTabIndex}", @click="echartTabClick(name, idx)") {{name}}
    div(:style="{height: echartHeight + 'rpx'}")
      mpvue-echarts(:echarts="echarts", :onInit="initChart")
    .text-center 型云价格指数
  share-modal(v-model="shareModalShow")
</template>

<script>
import { mapState } from 'vuex'
// import echarts from '/static'
import mpvueEcharts from 'mpvue-echarts'
import shareModal from '../../components/ShareModal.vue'
import vertBanner from '../../components/VertBanner.vue'
const echarts = require('../../../static/libs/echarts.min.js')
let chart = null
export default {
  data () {
    return {
      shareModalShow: true,
      echartType: ['H型钢', '工角槽', '普碳开平板'],
      echartTabIndex: 0,
      echarts,
      echartHeight: 0,
      lineOptionData: [],
      gallery: [],
      notices: {},
      lineOptions: {
        title: { text: '' },
        tooltip: { trigger: 'axis' },
        // legend: { right: 0, selectedMode: 'single', data: ['H型钢', '槽钢', '普碳开平板'], selected: {'H型钢': true} },
        grid: { top: '15%', left: '1%', right: '1%', bottom: '5%', containLabel: true },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            show: true,
            rotate: 30,
            textStyle: { color: '#777' },
            formatter: function (value, index) {
              var d = new Date(value)
              var month = d.getMonth() + 1
              var day = d.getDate()
              month = month > 9 ? month : '0' + month
              day = day > 9 ? day : '0' + day
              if (index > 0 && index < 8) {
                return [month, day].join('/')
              }
              return ''
            }
          },
          axisLine: {
            lineStyle: { color: '#bcddfe', width: 1 }
          },
          splitLine: {
            show: true,
            lineStyle: { color: ['#d6e9fc'] }
          }
        },
        yAxis: {
          type: 'value',
          min: function (value) {
            return Math.floor(value.min / 100) * 100 - 100
          },
          max: function (value) {
            return Math.ceil(value.max / 100) * 100 + 100
          },
          axisLabel: {
            show: true,
            textStyle: { color: '#777' }
          },
          minInterval: 100,
          axisLine: {
            lineStyle: { color: '#bcddfe', width: 1 }
          },
          splitArea: { show: false },
          splitLine: {
            show: true, lineStyle: { color: ['#d6e9fc'] }
          }
        },
        series: [{
          name: 'H型钢',
          type: 'line',
          symbol: 'emptyCircle', // 拐点样式
          symbolSize: 8, // 拐点大小
          smooth: true,
          itemStyle: {
            normal: {
              color: '#409eff',
              lineStyle: {
                width: 2, // 折线宽度
                color: '#409eff'// 折线颜色
              },
              label: { show: false }
            }
          },
          data: []
        }]
      }
    }
  },
  components: {
    mpvueEcharts,
    vertBanner,
    shareModal
  },
  beforeMount () {
    this.$nextTick(function () {
      this.loadBanner()
      this.loadNotice()
    })
  },
  onShow () {
    this.echartHeight = (this.screenWidth - 30) / 4 * 6
    this.getTrends()
  },
  computed: {
    ...mapState({
      mainIcons: state => state.mainIcons,
      mainClassify: state => state.mainClassify,
      screenWidth: state => state.screenWidth
    })
  },
  methods: {
    mallMore () {
      this.confirm({ title: '您未登录，请先登录' }).then(res => {
        if (res === 'confirm') this.jump('/pages/login/main')
      })
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
        console.log('notice ', data)
        this.notices = data.notices
        console.log('notices:>>', this.notices)
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
