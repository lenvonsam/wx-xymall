<template lang="pug">
div
  nav-bar(title="条件筛选", isBack)
  .bg-white.text-right.text-gray(@click="closeSelect")
    .row.justify-between.solid-bottom.item(@click.stop="openSelect('custom')", :style="itemSty")
      .label 客户名称
      .text-right.row.justify-end.col.select
        span {{customName || '请选择客户'}}
        span(:class="selectShow==='custom' ? 'cuIcon-fold' : 'cuIcon-unfold'")
      search-select(:selectSty="'top: 90rpx; height: '+ (contentHeight - 180) +'rpx'", valKey="name", :clearVal="isReset", :scrollHeight="400", :selectType="'custom'", @cb="selectCb($event, 'custom')", :show="selectShow==='custom'", :inputShow="true")    
    .row.justify-between.solid-bottom.item(@click.stop="openSelect('dept')")
      .label 业务部门
      .text-right.row.justify-end.col.select(:class="{'text-blue': selectShow==='dept'}")
        span {{deptName || '请选择部门'}}
        span(:class="selectShow==='dept' ? 'cuIcon-fold' : 'cuIcon-unfold'")
      search-select(:selectSty="'top: 90rpx; height: '+ (contentHeight - 450) +'rpx'", :scrollHeight="300", :clearVal="isReset", :selectType="'dept'", @cb="selectCb($event, 'dept')", :show="selectShow==='dept'")
    .row.justify-between.solid-bottom.item
      .label 隐藏余额为0的客户
      switch.blue.sm(:checked="form.hideZero", @change="switchChange")
  .footer.row.bg-white.text-center.text-white.padding-sm(style="height: 100rpx")
    .col.foot-cancel(@click="confirm('reset')") 重置
    .col.foot-confirm.margin-left-sm(@click="confirm") 搜索   
</template>
<script>
import { mapState, mapActions } from 'vuex'
import searchSelect from '@/components/searchSelect.vue'
export default {
  components: {
    searchSelect
  },
  data () {
    return {
      isReset: false,
      selectShow: '',
      contentHeight: 0,
      scrollHeight: 0,
      deptName: '',
      customName: '',
      form: {
        custom: '',
        dept: '',
        hideZero: true
      }
    }
  },
  computed: {
    ...mapState({
      tempObject: state => state.tempObject
    })
  },
  onShow () {
    this.contentHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - 100
    this.scrollHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - 180
    console.log('this.scrollHeight', this.scrollHeight)
  },
  methods: {
    ...mapActions(['configVal']),
    switchChange (e) {
      this.form.hideZero = e.mp.detail.value
    },
    closeSelect () {
      this.selectShow = ''
    },
    openSelect (type) {
      this.selectShow = this.selectShow === type ? '' : type
    },
    confirm (flag) {
      if (flag === 'reset') {
        this.deptName = ''
        this.customName = ''
        this.form = {
          custom: '',
          dept: '',
          hideZero: true
        }
      } else {
        this.form.fromPage = 'balanceFilter'
        this.configVal({ key: 'tempObject', val: this.form })
        this.back()
      }
    },
    selectCb (res, type) {
      this[`${type}Name`] = res.name
      this.form[type] = res
      this.selectShow = ''
      this.$forceUpdate()
    }
  }
}
</script>
<style lang="stylus" scoped>
.label
  text-align left
  color #000
.item
  height 45px
  padding 0 10px
  position relative
  input, .select
    height 100%
.footer
  position fixed
  bottom 0
  left 0
  right 0
</style>