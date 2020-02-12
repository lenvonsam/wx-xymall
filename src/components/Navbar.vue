<template lang="pug">
.cu-custom(:style="{height: customBar + 'px'}")
  .cu-bar.fixed(:class="bgClass", :style="{height: customBar + 'px', paddingTop: statusBar + 'px'}")
    .action(v-if="isBack", @click="back")
      span.cuIcon-back
      slot(name="backText")
    .action(v-if="leftMenu")
      slot(name="leftMenu")
    .action.border-custom(:style="{width: custom.width + 'px', height: custom.height + 'px', marginLeft: 'calc(750rpx - ' + custom.right + 'px)'}", v-if="isCustom")
      text.cuIcon-back(@click="back")
      text.cuIcon-homefill(@click="toHome")
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
    title: {
      type: String,
      default: ''
    },
    leftMenu: {
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
  }
}
</script>

