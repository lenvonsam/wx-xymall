<template lang="pug">
.flex.justify-end(@click="checkedHandler")
  div
    img.choose-icon(src="/static/images/radio_check.png", v-if="checked")
    img.choose-icon(src="/static/images/radio_check_no.png", v-else)
  label.padding-left-xs {{label}}  
</template>
<script>
export default {
  props: {
    checked: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    }
  },
  methods: {
    checkedHandler () {
      this.$emit('checkHander')
    }
  }
}
</script>