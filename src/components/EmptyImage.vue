<template lang="pug">
img(:src="imgProxy + url")
</template>

<script>
export default {
  props: {
    url: ['String']
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
