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
        img.response(:src="g.bannerName", v-if="g.bannerName", style="height: 300rpx", mode="widthFix")
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
  modal-intro(v-model="shareModalShow", :images="introImages", :type="shareModalShowType")
  //- alert(msg="资料提交成功,请耐心等待审核", v-model="alertShow")
  //- modal-input(v-model="alertShow")
  // modal(v-model="modalShow", @cb="modalCb", :title="modalTitle" :btns="btn")
    div
      .padding-15 {{modalMsg}}
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
      shareModalShowType: 'home',
      echartType: ['H型钢', '工角槽', '普碳开平板'],
      echartTabIndex: 0,
      // echarts,
      echartHeight: 0,
      lineOptionData: [],
      gallery: [],
      notices: {},
      lineOptions: lineOpts,
      alertShow: true,
      top: 0,
      modalShow: false,
      modalTitle: '超时未提货物收费标准',
      modalMsg: '对于在库物资，买方在平台上购买物资并支付货款后，应在约定的时间内（系统默认时间为5天）制作提单并提货。超过约定时间未提的合同物资将被判定为违约（超期未提），买方须承担未及时提货而产生的仓储管理费，并于提货时自行与仓库管理方结算。卖方有权对违约合同物资进行处置，进行合同取消并退还对应货款。',
      btn: [{ label: '确定', flag: 'confirm', className: 'main-btn' }]
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
            id: decodeURIComponent(arr[1]),
            source: arr[2],
            time: new Date().getTime()
          })
        )
        // 自动跳转到商城页面
        if (arr[1] !== '999') {
          this.configVal({ key: 'tempObject', val: { name: decodeURIComponent(arr[1]), fromPage: 'home' } })
          this.tab('/pages/mall/main')
        }
      }
    }
    // 超时未提货物收费标准
    // if (this.isLogin && this.currentUser.type === 'buyer' && !this.currentUser.userGeneralAgreement) {
    //   this.modalShow = true
    // }
  },
  onShow (opt) {
    this.echartHeight = (400 / 345) * (this.screenWidth - 30)
    this.loadBanner()
    // this.getTrends()
    this.loadNotice()
    if (this.isLogin) {
      // this.setCartCount(this.currentUser.user_id)
      console.log('index_state.currentUser======>' + JSON.stringify(this.currentUser))
      // this.ironRequest(this.apiList.xy.queryProfile.url, {}, this.apiList.xy.queryProfile.method).then(res => {
      //   if (res.returncode === '0') {
      //     console.log('index.vue_接口返回_rule=====>' + res.rule)
      //     if (this.currentUser.type === 'buyer' && res.rule === 0) {
      //       this.modalShow = true
      //     }
      //   }
      // })
      // this.ironRequest(this.apiList.xy.queryProfile.url, {}, this.apiList.xy.queryProfile.method).then(data => {
      //   console.log('index.vue_queryProfile_data=====>', JSON.stringify(data))
      // }).catch(e => {
      //   console.log('index.vue_queryProfile_catch=====>', JSON.stringify(e))
      //   this.showMsg(e)
      // })
    } else {
      this.tabDot(0)
    }
  },
  onHide () {
    if (this.modalShow) {
      this.modalShow = false
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
    // 跳转公告页面
    jumpNotice () {
      this.logEventGet({ event: 'click_app_index_notice_more', type: '01' })
      this.jump('/pages/cardList/main?title=型云公告&type=notices')
    },
    // 跳转搜索页面
    jumpSearch () {
      this.currentUser.type === 'seller' ? this.logEventGet({ event: 'click_app_index_search_seller', type: '01' }) : this.logEventGet({ event: 'click_app_index_search', type: '01' })
      this.jump('/pages/search/main')
    },
    // 展示首页引导图
    showShareBanner () {
      const firstShare = mpvue.getStorageSync('firstShare') || false
      const activeShare = mpvue.getStorageSync('activeShare') || false
      const downtimeShare = mpvue.getStorageSync('downtimeShare') || false

      if (new Date().getTime() - new Date('2021-07-10').getTime() < 0) {
        if (!activeShare) {
          this.shareModalShowType = 'activity'
          this.shareModalShow = true
          mpvue.setStorageSync('activeShare', true)
        }
      } else if (new Date('2021-07-20').getTime() < new Date().getTime() && new Date().getTime() < new Date('2021-07-31 08:00').getTime()) {
        console.log('ok++++++')
        if (!downtimeShare) {
          this.shareModalShowType = 'downtime'
          this.shareModalShow = true
          mpvue.setStorageSync('downtimeShare', true)
        }
      } else {
        if (!firstShare) {
          this.shareModalShowType = 'home'
          this.shareModalShow = true
          mpvue.setStorageSync('firstShare', true)
        }
      }
    },
    // 点击产品分类
    classifyClick (id, name) {
      // this.configVal({ key: 'tempObject', val: { name: title } })
      this.logEventGet({ event: 'click_app_index_category', name: name, type: '01' })
      this.configVal({ key: 'tempObject', val: { name: name, fromPage: 'home' } })
      this.tab('/pages/mall/main')
    },
    // 点击功能图标
    iconJump (icon) {
      this.logEventGet({ event: icon.event, type: '01' })
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
    // 点击查看更多
    mallMore () {
      this.logEventGet({ event: 'click_app_index_category', name: '查看更多', type: '01' })
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
    // 获取轮播图
    async loadBanner () {
      try {
        const data = await this.httpPost(this.apiList.zf.banner, {
          bannerType: '02'
        })
        this.gallery = data.data
      } catch (e) {
        this.hideLoading()
        this.showMsg(e.message)
      }
    },
    // 获取公告信息
    async loadNotice () {
      try {
        const data = await this.httpPost(this.apiList.zf.notices, {
          pageNum: 1,
          pageSize: 5,
          newsType: '01'
        })
        this.notices = data.data
      } catch (e) {
        this.hideLoading()
        this.showMsg(e.message)
      }
    },
    // 超时未提货物模态框回调
    modalCb (flag) {
      this.httpPost(this.apiList.zf.updatePersonAgreement, {userGeneralAgreement: true}).then(res => {
        console.log('updateRule_res=====>' + JSON.stringify(res))
      }).catch(e => {
        console.log('updateRule_e=====>' + e)
      })
      this.modalShow = false
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
.padding-15
  padding 15px
</style>
