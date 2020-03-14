<template lang="pug">
div
  nav-bar(title="条件筛选", isBack)
  .bg-white.text-right.text-gray
    .row.justify-between.solid-bottom.item(:style="itemSty")
      .label 起始日期
      picker.col(@change="startDateCb", mode="date")
        .text-right.text-gray {{form.startDate || '请选择起始日期'}}
    .row.justify-between.solid-bottom.item(:style="itemSty")
      .label 结束日期
      picker.col(@change="endDateCb", mode="date")
        .text-right.text-gray {{form.endDate || '请选择结束日期'}}
  .footer.row.bg-white.text-center.text-white.padding-sm(style="height: 100rpx")
    .col.foot-cancel(@click="confirm('reset')") 重置
    .col.foot-confirm.margin-left-sm(@click="confirm") 搜索   
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      itemSty: 'height: 90rpx',
      form: {
        startDate: '',
        endDate: ''
      }
    }
  },
  computed: {
    ...mapState({
      tempObject: state => state.tempObject
    })
  },
  methods: {
    ...mapActions(['configVal']),
    confirm (flag) {
      if (flag === 'reset') {
        this.form = {
          startDate: '',
          endDate: ''
        }
      } else {
        this.form.fromPage = 'bankWaterFilter'
        this.configVal({ key: 'tempObject', val: this.form })
        this.back()
      }
    },
    startDateCb (e) {
      this.form.startDate = this.date2Str(new Date(e.mp.detail.value))
    },
    endDateCb (e) {
      this.form.endDate = this.date2Str(new Date(e.mp.detail.value))
    }
  }
}
</script>
<style lang="stylus" scoped>
.label
  text-align left
  color #000
.item
  // height 45px
  padding 0 10px
  // padding 10px
  position relative
  input, .select
    height 100%
.footer
  position fixed
  bottom 0
  left 0
  right 0
</style>