<template lang="pug">
span.copy-btn(@click="clickCopy") 复制
</template>
<script>
export default {
  props: {
    copyUrl: [String]
  },
  methods: {
    clickCopy () {
      this.copyText(this.copyUrl)
    }
  }
}
</script>

<style lang="stylus", scoped>
.copy-btn
  display inline-block
  padding 2px 5px
  color #888
  border-radius 20px
  font-size 12px
  margin-left 5px
</style>
