<template lang="pug">
div
  nav-bar(title="条件筛选", isBack)
  .bg-white.text-right.text-gray(@click="closeSelect")
    .row.justify-between.solid-bottom.item(@click.stop="openSelect('custom')", :style="itemSty")
      .label 汇款抬头
      .text-right.row.justify-end.col.select
        span {{customName || '请选择汇款抬头'}}
        span(:class="selectShow==='custom' ? 'cuIcon-fold' : 'cuIcon-unfold'")
      //- modal-bottom(valKey="name", :clearVal="isReset", :scrollHeight="400", :selectType="'custom'", @cb="selectCb($event, 'custom')", :show="selectShow==='custom'", :inputShow="true")
      search-select(:selectSty="'top: 90rpx; height: '+ (contentHeight - 90) +'rpx'", valKey="name", :clearVal="isReset", :scrollHeight="400", :selectType="'custom'", @cb="selectCb($event, 'custom')", :show="selectShow==='custom'", :inputShow="true")    
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
  //- picker-bottom(valKey="name", :clearVal="isReset", :scrollHeight="400", :selectType="'custom'", @cb="selectCb($event, 'custom')", :show="selectShow==='custom'", :inputShow="true")  
</template>
<script>
import { mapState, mapActions } from 'vuex'
import searchSelect from '@/components/searchSelect.vue'
// import PickerBottom from '@/components/PickerBottom.vue'
export default {
  components: {
    searchSelect
    // PickerBottom
  },
  data () {
    return {
      isReset: false,
      itemSty: 'height: 90rpx',
      contentHeight: 0,
      selectShow: '',
      customName: '',
      form: {
        custom: '',
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
  onUnload () {
    this.selectShow = ''
    // this.customName = ''
    // this.form = {
    //   custom: '',
    //   startDate: '',
    //   endDate: ''
    // }
  },
  onShow () {
    this.contentHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar)
  },
  methods: {
    ...mapActions(['configVal']),
    closeSelect () {
      this.selectShow = ''
    },
    openSelect (type) {
      this.selectShow = this.selectShow === type ? '' : type
    },
    confirm (flag) {
      if (flag === 'reset') {
        this.isReset = !this.isReset
        this.customName = ''
        this.form = {
          custom: '',
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
    },
    selectCb (res, type) {
      this[`${type}Name`] = res.name
      this.form[type] = res
      this.selectShow = ''
      this.$forceUpdate()
      console.log(this.form)
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