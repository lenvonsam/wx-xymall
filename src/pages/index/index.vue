<template lang="pug">
div
  nav-bar(title="首页")
  swiper(v-if="gallery.length > 0", :indicator-dots="true", :autoplay="true")
    swiper-item(v-for="(g,idx) in gallery", :key="idx")
      img.response(:src="imgOuterUrl + g.url", v-if="imgOuterUrl", style="height: 300rpx")
  time-line(v-else, type="gallery")
  .row.bg-white.padding-tb
    .col.text-center(v-for="(icon,idx) in mainIcons", :key="idx")
      img(:src="icon.url", style="width: 100rpx; height: 100rpx")
      .mt-5 {{icon.title}}
  .bg-white.padding.margin-top
    .row
      .flex-40.row
        img(src="/static/images/notice_icon.png", style="width: 40rpx;height:40rpx;")
      .col
        marquee(:quees="notices")
        //- span(v-else) 暂无消息
      .flex-60.text-gray.ft-12.text-right 更多>>
  .bg-white.padding.margin-top
    .ft-18.text-blod 产品分类
    .margin-top
      .row(v-for="(row,ridx) in mainClassify", :key="ridx", :class="{'margin-top-sm': ridx > 0}")
        .col.text-center(v-for="(col,cidx) in row", :key="cidx")
          .btn-classify {{col.title}}
      .margin-top.text-center.text-blue.ft-13 查看更多>>
  //- div 
  //-   span 首页页面
  //-   copy-btn(copyContent="33555")
  //-   count-step
  //-   .bg-white
  //-     mall-item(:item="productObj", v-for="n in 2", :cb="mallClick", :key="n")
  //-   .mt-5
  //-     time-line
</template>

<script>
import { mapState } from 'vuex'
import copyBtn from '../../components/CopyBtn.vue'
import countStep from '../../components/CountStep.vue'
import marquee from '../../components/marquee.vue'
export default {
  data () {
    return {
      gallery: [],
      notices: [],
      productObj: {
        name: 'H型钢',
        supply: '山东',
        price: '1233/123',
        standard: '100*1100',
        material: 'Q235B',
        wh_name: '1号库',
        max_count: 1,
        max_weight: 0.333,
        tolerance: '20-30',
        length: '1222',
        weightRange: '100-399'
      }
    }
  },
  components: {
    copyBtn,
    countStep,
    marquee
  },
  beforeMount () {
    this.loadBanner()
    this.loadNotice()
  },
  mounted () {
    // get demo
    // this.ironRequest('getBanner.shtml', {}, 'get', this)
    // post demo
    // this.ironRequest('toleranceAndWeightList.shtml', { current_page: 1 }, 'post', this).then(res => {
    //   console.log('resp:>>>', res)
    // }).catch(err => {
    //   this.showMsg(err)
    // })
  },
  computed: {
    ...mapState({
      imgOuterUrl: state => state.imgOuterUrl,
      mainIcons: state => state.mainIcons,
      mainClassify: state => state.mainClassify
    })
  },
  methods: {
    async loadBanner () {
      try {
        const data = await this.ironRequest(this.apiList.xy.banner, {}, 'get', this)
        this.gallery = data.banners
      } catch (e) {
        this.showMsg(e)
      }
    },
    async loadNotice () {
      try {
        const data = await this.ironRequest(this.apiList.xy.notice + '?current_page=0&page_size=10&type=2', {}, 'get', this)
        console.log('notice ', data)
        this.notices = data.notices
      } catch (e) {
        this.showMsg(e)
      }
    },
    mallClick (item, type, evt) {
      console.log('item', item)
      console.log('type', type)
      console.log('event', evt)
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
