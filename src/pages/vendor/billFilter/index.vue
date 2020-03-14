<template lang="pug">
div
  nav-bar(title="条件筛选", isBack)
  .bg-white.text-right.text-gray(@click="closeSelect")
    .row.justify-between.solid-bottom.item(:style="itemSty")
      .label 合同编号
      input.col(type="text", v-model="form.no", placeholder="请输入合同号")
    .row.justify-between.solid-bottom.item(@click="custmShow = !custmShow", :style="itemSty")
      .label 客户名称
      .text-right.row.justify-end.col.select
        span {{customName || '请选择客户'}}
        span.cuIcon-unfold
      //- search-select(:selectSty="'top: 90rpx'", :show="custmShow", :total="6", :list="custmList")
    .row.justify-between.solid-bottom.item(:style="itemSty")
      .label 起始日期
      picker.col(@change="startDateCb", mode="date")
        .text-right.text-gray {{form.startDate || '请选择起始日期'}}
    .row.justify-between.solid-bottom.item(:style="itemSty")
      .label 结束日期
      picker.col(@change="endDateCb", mode="date")
        .text-right.text-gray {{form.endDate || '请选择结束日期'}}
    .row.justify-between.solid-bottom.item(@click.stop="openSelect('dept')", :style="itemSty")
      .label 业务部门
      .text-right.row.justify-end.col.select(:class="{'text-blue': selectShow==='dept'}")
        span {{deptName || '请选择部门'}}
        span(:class="selectShow==='dept' ? 'cuIcon-fold' : 'cuIcon-unfold'")
      search-select(:selectSty="'top: 90rpx; height: '+ (contentHeight - 450) +'rpx'", :scrollHeight="300", :selectType="'dept'", @cb="selectCb($event, 'dept')", :show="selectShow==='dept'")  
    .row.justify-between.solid-bottom.item(@click.stop="openSelect('employee')", :style="itemSty")
      .label 业务人员
      .text-right.row.justify-end.col.select(:class="{'text-blue': selectShow==='employee'}")
        span {{employeeName || '请选择业务员'}}
        span(:class="selectShow==='employee' ? 'cuIcon-fold' : 'cuIcon-unfold'")
      search-select(:selectSty="'top: 90rpx; height: '+ (contentHeight - 500) +'rpx'", :scrollHeight="300", :selectType="'employee'", @cb="selectCb($event,'employee')", :show="selectShow==='employee'", :inputShow="true")
    .row.justify-between.solid-bottom.item(:style="itemSty", v-if="statusList.length > 0")
      .label 状态
      .text-right.row.justify-end.col.select
        picker.col(@change="statusCb", mode="selector", :range="statusList", range-key="label")
          .text-right.text-gray {{statusStr || '请选择状态'}}
        span.cuIcon-unfold  
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
      itemSty: 'height: 90rpx',
      custmList: ['江苏省安徽四暗有限公司', '江苏省安徽四暗有限公司'],
      contentHeight: 0,
      selectShow: '',
      statusList: [],
      deptName: '',
      employeeName: '',
      customName: '',
      statusStr: '',
      form: {
        no: '',
        custom: '',
        startDate: '',
        endDate: '',
        dept: '',
        employee: '',
        status: ''
      }
    }
  },
  computed: {
    ...mapState({
      tempObject: state => state.tempObject
    })
  },
  onShow () {
    this.statusList = this.tempObject.statusList || []
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
    statusCb (e) {
      console.log(e.mp.detail.value)
      const valObj = this.statusList[e.mp.detail.value]
      this.statusStr = valObj.label
      this.form.status = valObj.value
    },
    confirm (flag) {
      if (flag === 'reset') {
        this.employeeName = ''
        this.deptName = ''
        this.customName = ''
        this.statusStr = ''
        this.form = {
          no: '',
          custom: '',
          startDate: '',
          endDate: '',
          dept: '',
          employee: '',
          status: ''
        }
      } else {
        this.form.fromPage = 'billFilter'
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