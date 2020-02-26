<template lang="pug">
div
  nav-bar(title="提货人信息", isBack)
  .padding-sm.bg-white
    .row.solid-bottom.list
      span 提货人名称
      .col.text-right {{detailObject.receive_name}}
    .row.solid-bottom.list
      span 提货人电话
      .col.text-right {{detailObject.receive_phone}}
    .row.solid-bottom.list
      span 身份证号码
      .col.text-right {{detailObject.id_no}}
    .row.solid-bottom.list
      span 车牌号
      .col.text-right {{detailObject.car_no}}     
    .row.solid-bottom.list
      span 单位名称
      .col.text-right {{detailObject.comp_name}}
</template>
<script>
export default {
  data () {
    return {
      detailObject: {}
    }
  },
  beforeMount () {
    this.ironRequest('orderLadDetail.shtml?td_no=' + this.$root.$mp.query.id, {}, 'get', this).then(resp => {
      if (resp && resp.returncode === '0') {
        this.detailObject = resp
      } else {
        this.showMsg(resp === undefined ? '网络异常' : resp.errormsg)
      }
    }).catch(err => {
      console.log(err)
      this.showMsg(err)
    })
  }
}
</script>
<style lang="stylus" scoped>
.list
  padding 10px 0
</style>