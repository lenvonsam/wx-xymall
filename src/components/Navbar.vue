<template lang="pug">
.cu-custom(:style="{height: customBar + 'px'}")
  .cu-bar.fixed(:class="bgClass", :style="{height: customBar + 'px', paddingTop: statusBar + 'px'}")
    .action.padding-right(v-if="isBack", @click="navBack")
      span.cuIcon-back
      slot(name="backText")
    .action.padding-right(v-if="leftMenu")
      slot(name="leftMenu")
    .action.relative(v-if="serviceIcon")
      .service-btn
        img(src="/static/images/service_icon.png")
        button(open-type="contact", @contact="handleContact")
    .action.padding-right(v-if="isCustom")
      //- text.cuIcon-back(@click="back")
      span.cuIcon-homefill(@click="toHome")
    .content(:style="{top: statusBar + 'px'}")
      div {{title}}
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    bgClass: {
      type: String,
      default: 'bg-white'
    },
    isBack: {
      type: Boolean,
      default: false
    },
    cb: {
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    leftMenu: {
      type: Boolean,
      default: false
    },
    serviceIcon: {
      type: Boolean,
      default: false
    },
    isCustom: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState({
      statusBar: state => state.statusBar,
      custom: state => state.custom,
      customBar: state => state.customBar
    })
  },
  methods: {
    handleContact () {
      this.logEventGet({ event: 'click_app_index_kf' })
      console.log('handleContact')
    },
    navBack () {
      if (this.cb) {
        this.cb()
      } else {
        this.back()
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.service-btn
  img
    width 20px
    height 20px
  button
    position absolute
    top 0
    left 0
    right 0
    bottom 0
    background transparent
    &::after
      border 0 !important
</style>
