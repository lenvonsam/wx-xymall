<template lang="pug">
div
  nav-bar(title="公司介绍", isBack)
  .fixed-top.flex(:style="{top: customBar + 'px'}")
    .top-cell.ft-16(@click="selectTab('1')", :class="tabIndex === '1' ? 'active-tab' : ''") 智恒达
    .top-cell.ft-16(@click="selectTab('2')", :class="tabIndex === '2' ? 'active-tab' : ''") 型云
  .content
    swiper(v-if="typeIndex === '1'", style="height: 382rpx", @change="swiperChange")
      swiper-item(v-for="(item, index) in currentObj.videos", :key="idx")
        // img.response(:src="imgOuterUrl + g.url", style="height: 300rpx", mode="widthFix")
        video.response(v-if="showIndex === index" :id="'video' + index" :src="item.src", style="height: 100%", mode="widthFix", custom-cache="false")
        .cover(v-else @click="playVideo(index, 'video' + index)")
          img.cover-img(:src="item.cover")
          img.cover-img-play(src="http://xymobile.xingyun361.com/cover-img-play.png", @click="playVideo(index, 'video' + index)")
    swiper(v-else, style="height: 382rpx", @change="swiperChange")
      swiper-item(v-for="(item, index) in currentObj.imgs", :key="idx")
        // img.response(:src="imgOuterUrl + g.url", style="height: 300rpx", mode="widthFix")
        img.response(:src="item", style="height: 100%", mode="widthFix")
    .control.bg-gray.flex.justify-center.align-center
      .change.flex.justify-center.align-center.bg-white
        .change-cell.ft-13.mr-20(:class="typeIndex === '1' ? '.active-type' : ''", @click="changetype('1')")
          .text.flex.justify-center.align-center 视频
        .change-cell.ft-13(:class="typeIndex === '2' ? '.active-type' : ''", @click="changetype('2')")
          .text.flex.justify-center.align-center 图片
      .numberText {{typeIndex === '1' ? numberVideoText : numberImgText}}
    .wrap.padding.bg-white
      .ft-14(v-html="currentObj.texts")
  .empty
  .go.ft-16(@click="goShop") {{isSalesman == 0 ? '去型云采购' : '去型云商城'}}
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      tabIndex: '1',
      typeIndex: '1',
      showIndex: '',
      videoContext: '',
      xyObj: {
        imgs: [],
        videos: [],
        texts: ''
      },
      zhdObj: {
        imgs: [],
        videos: [],
        texts: ''
      },
      currentObj: {
        imgs: [],
        videos: [],
        texts: ''
      },
      currentSwiperIndex: 1,
      currentImgLength: 0,
      currentVideoLength: 0,
      isSalesman: ''
    }
  },
  onLoad (options) {
    console.log('isSalesman', options.isSalesman)
    this.isSalesman = options.isSalesman
  },
  mounted () {
    this.loadData()
  },
  computed: {
    ...mapState({
      isIpx: state => state.isIpx
    }),
    numberImgText: function () {
      return this.currentObj.imgs.length + '/' + this.currentSwiperIndex
    },
    numberVideoText: function () {
      return this.currentObj.videos.length + '/' + this.currentSwiperIndex
    }
  },
  methods: {
    playVideo (showIndex, id) {
      this.showIndex = showIndex
      console.log(this.showIndex)
      console.log(id)
      const videoContext = mpvue.createVideoContext(id)
      this.videoContext = videoContext
      videoContext.play()
      // this.videoContext.requestFullScreen()
    },
    selectTab (val) {
      this.tabIndex = val
      this.currentSwiperIndex = 1
      if (val === '1') {
        this.currentObj = this.zhdObj
      } else {
        this.currentObj = this.xyObj
      }
      this.showIndex = ''
      if (this.videoContext) {
        this.videoContext.stop()
      }
    },
    changetype (val) {
      this.typeIndex = val
      this.currentSwiperIndex = 1
    },
    swiperChange (e) {
      this.currentSwiperIndex = e.target.current + 1
      this.showIndex = ''
      if (this.videoContext) {
        this.videoContext.stop()
      }
    },
    goShop () {
      this.tab('/pages/mall/main')
    },
    async loadData () {
      try {
        const res = await this.httpGet(this.apiList.zf.companyContent.url)
        // const res = await this.requestDecode('zf', this.zfProxy + this.apiList.zf.companyContent.url, {}, this.apiList.zf.companyContent.method, 'utf8')
        if (res.data[0].title === '智恒达') {
          this.zhdObj = res.data[0]
          this.xyObj = res.data[1]
        } else {
          this.zhdObj = res.data[1]
          this.xyObj = res.data[0]
        }
        if (this.tabIndex === '1') {
          this.currentObj = this.zhdObj
        } else {
          this.currentObj = this.xyObj
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.fixed-top
  width 100%
  position fixed
  left 0
  background-color #fff
  border-bottom 1rpx solid #eee
  z-index 999
  .top-cell
    width 50%
    height 100rpx
    line-height 100rpx
    text-align center
  .active-tab
    position relative
    color #3DA7FF
    display inline-block
    &::after
      content: "";
      position absolute
      left 50%;
      bottom 0;
      transform translateX(-50%)
      height 6rpx
      width 42rpx
      background-color: #3DA7FF
.content
  margin-top 112rpx
  margin-bottom 60rpx
  .cover
    height 100%
    width 100%
    .cover-img
      height 100%
      width 100%
    .cover-img-play
      height 100rpx
      width 100rpx
      position absolute
      top 50%
      left 50%
      transform translate(-50%, -50%)
.control
  height 100rpx
  .change
    border-radius: 40rpx
    .change-cell
      width 150rpx
      height 50rpx
      line-height 50rpx
      border-radius: 40rpx
      text-align center
      .text::before
        content: ''
        display inline-block
        width: 0
        height: 0
        border: 15rpx solid
        border-color: transparent transparent transparent black
      &.active-type
        background-color #3DA7FF
        color #fff
        .text::before
          content: ''
          display inline-block
          width: 0
          height: 0
          border: 15rpx solid
          border-color: transparent transparent transparent white
  .numberText
    color #fff
    padding 4rpx 10rpx
    background: #000000;
    opacity: 0.4;
    border-radius: 20px;
    font-size: 20rpx
    position: absolute
    right 20rpx
.empty
  width 100%
  height 98rpx
.go
  width 710rpx
  height 98rpx
  line-height 98rpx
  text-align center
  background #3DA7FF
  color #fff
  // box-shadow 0px -2px 10px 0px rgba(0, 0, 0, 0.09)
  position fixed
  bottom 0
  left calc((100% - 710rpx) / 2)
  border-radius 50rpx
  margin-bottom: 10rpx
</style>
