<template lang="pug">
  div
    template(v-if="type=='address'")
      .bg-white
        .padding.border-bottom-line
          .animated-background.h-20
            .placeholder-line(style="left: 30%; right: 0;")
          .animated-background.mt-10.h-20
        .row.padding.flex-center
          .col.flex-25.mt-5
            img.choose-icon(src="~assets/imgs/btn_ck_n.png")
          .col
            span 设置默认
          .col.flex-60
            //- FIXME 更加具体页面添加按钮
            //- q-btn.no-shadow.pl-0.pr-0.c-gray(icon="launch", small) 修改
          .col.flex-60
            //- FIXME 更加具体页面添加按钮
            //- q-btn.no-shadow.pl-0.pr-0.c-gray(icon="delete", small) 删除
    template(v-else-if="type=='gallery'")
      .bg-white.padding.pt-0
        .animated-background(style="height: 500rpx")
    template(v-else-if="type=='hslider'")
      .bg-white.padding.mt-10.mb-10(style="width: 560rpx; border-radius: 12rpx;")
        .animated-background.h-20
          .placeholder-line(style="left: 30%; right: 60rpx")
        .animated-background.h-20.mt-10
          .placeholder-line(style="left: 80%; right: 0")
        .animated-background.h-20.mt-10
          .placeholder-line(style="left: 30%; right: 0")
        .animated-background.h-20.mt-10
          .placeholder-line(style="left: 60%; right: 0")
    template(v-else-if="type=='mainres'")
      .bg-white.padding(v-for="(n,index) in 3", :class="{'border-bottom-line': index < 2}", :key="index")
        .animated-background.h-20
          .placeholder-line(style="left: 40%; right: 15%")
        .animated-background.h-20.mt-10
          .placeholder-line(style="left: 40%; right: 15%")
    template(v-else-if="type=='classify'")
      .padding(v-for="(n,idx) in 3", :key="idx")
        .row.bg-white
          .col.flex-100
            .animated-background.h-20
          .col.relative-position
            .border-bottom-line(style="height:1rpx; display:inline-block; width: 80%;position: absolute; top: 46%;left: 10%")
        .bg-white.row.mt-10
          .col.padding
            .animated-background.h-20
          .col.padding
            .animated-background.h-20
          .col.padding
            .animated-background.h-20
          .col.padding
            .animated-background.h-20
        .row.bg-white(v-if="idx == 1")
          .col.padding
            .animated-background.h-20
          .col.padding
            .animated-background.h-20
          .col.padding
            .animated-background.h-20
          .col.padding
            .animated-background.h-20
    template(v-else-if="type=='mallist'")
      .padding.bg-white.border-bottom-line(v-for="(n,idx) in 3", :key="idx")
        .row.padding-bottom-half
          .col.flex-25
            .animated-background.h-20
          .col.flex-35.pl-5
            .animated-background.h-20
          .col
            .animated-background.h-20.relative-position
              .placeholder-line(style="left: 0; right: 20%")
        .row.padding-bottom-half
          .col
            .animated-background.h-20
              .placeholder-line(style="left: 70%; right: 0")
        .row.padding-bottom-half
          .col
            .animated-background.h-20
              .placeholder-line(style="left: 40%; right: 0")
        .row
          .col.flex-100
            .animated-background.h-20
          .col.relative-position
            .animated-background.h-20
              .placeholder-line(style="left: 0; right: 35%")
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'mallist'
    }
  }
}
</script>

<style scoped>
.padding-bottom-half {
  padding-bottom: 8px;
}
.h-20 {
  height: 20px;
}
@keyframes placeHolderShimmer {
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
}
.placeholder-line {
  position: absolute;
  background: #fff;
  top: 0;
  bottom: 0;
}
.animated-background {
  /* animation-duration: 1s;
   animation-fill-mode: forwards;
   animation-iteration-count: infinite;
   animation-name: placeHolderShimmer;
   animation-timing-function: linear; */
  background: #f6f7f8;
  background: linear-gradient(to right, #eee 8%, #ddd 18%, #eee 33%);
  background-size: 800px 300px;
  position: relative;
}
</style>
