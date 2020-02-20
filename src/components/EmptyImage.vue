<template lang="pug">
img(:src="imgProxy + url", :class="className")
</template>

<script>
export default {
  props: {
    url: ['String'],
    className: {
      type: String,
      default: ''
    }
  },
  data () {
    return {}
  }
}
</script>

<style scoped>
img {
  width: 120px;
  height: 120px;
  margin: 0 auto;
}
</style>
