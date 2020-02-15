<template lang="pug">
text(:style="{color: color, fontSize: fontSize + 'px'}") {{text}}
</template>
<script>
export default {
  props: {
    content: {
      type: String,
      defualt: ''
    },
    color: {
      type: String,
      default: '#888'
    },
    fontSize: {
      type: Number,
      default: 14
    },
    format: {
      type: String,
      default: 'yyyy-MM-dd'
    }
  },
  data () {
    return {
      text: ''
    }
  },
  beforeMount () {
    // TODO 目前仅处理8位的string时间
    this.text = this.content.substring(0, 10)
  }
}
</script>

