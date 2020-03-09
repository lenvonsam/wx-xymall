<template lang="pug">
div
  nav-bar(title="条件筛选", isBack)
  .bg-white.text-right.text-gray(@click="closeSelect")
    .row.justify-between.solid-bottom.item
      .label 合同编号
      input.col(type="text", placeholder="请输入合同号")
    .row.justify-between.solid-bottom.item(@click="custmShow = !custmShow")
      .label 客户名称
      .text-right.row.justify-end.col.select
        span 请选择客户
        span.cuIcon-unfold
      //- search-select(:selectSty="'top: 90rpx'", :show="custmShow", :total="6", :list="custmList")
    .row.justify-between.solid-bottom.item
      .label 起始日期
      picker.col(@change="startDateCb", mode="date")
        .text-right.text-gray {{startDate}}
    .row.justify-between.solid-bottom.item
      .label 结束日期
      picker.col(@change="endDateCb", mode="date")
        .text-right.text-gray {{endDate}}
    .row.justify-between.solid-bottom.item(@click.stop="openSelect('deptShow')")
      .label 业务部门
      .text-right.row.justify-end.col.select
        span 请选择客户
        span.cuIcon-unfold
      search-select(:selectSty="'top: 90rpx'", :scrollHeight="employeeHeight", :selectType="'dept'", @search="searchCb", :show="deptShow")  
    .row.justify-between.solid-bottom.item(@click.stop="openSelect('employee')")
      .label 业务人员
      .text-right.row.justify-end.col.select(:class="{'text-blue': employeeShow}")
        span 请选择客户
        span(:class="employeeShow ? 'cuIcon-fold' : 'cuIcon-unfold'")
      search-select(:selectSty="'top: 90rpx'", :scrollHeight="employeeHeight", :selectType="'employee'", @search="searchCb", :show="employeeShow", :inputShow="true")
    .row.justify-between.solid-bottom.item
      .label 状态
      .text-right.row.justify-end.col.select
        picker.col(@change="statusCb", mode="selector", :range="statusList")
          .text-right.text-gray {{status || '请选择状态'}}
        span.cuIcon-unfold  
  .footer.row.bg-white.text-center.text-white.padding-sm(style="height: 100rpx")
    .col.foot-cancel(@click="confirm('cancel')") 重置
    .col.foot-confirm.margin-left-sm(@click="confirm") 搜索   
</template>
<script>
import searchSelect from '@/components/searchSelect.vue'
export default {
  components: {
    searchSelect
  },
  data () {
    return {
      custmList: ['江苏省安徽四暗有限公司', '江苏省安徽四暗有限公司'],
      contentHeight: 0,
      custmShow: false,
      deptShow: false,
      deptList: [],
      employeeShow: false,
      employeeHeight: 0,
      startDate: '',
      endDate: '',
      status: '',
      statusList: []
    }
  },
  onShow () {
    this.contentHeight = this.getRpx(this.screenHeight) - this.getRpx(this.customBar) - 100
    this.employeeHeight = this.contentHeight - 750
    this.startDate = this.date2Str(new Date())
    this.endDate = this.date2Str(new Date())
    console.log('this.employeeHeight', this.employeeHeight)
  },
  methods: {
    closeSelect () {
      this.deptShow = false
      this.employeeShow = false
    },
    openSelect (type) {
      this.closeSelect()
      this[type] = true
    },
    statusCb () {},
    confirm (flag) {},
    startDateCb (e) {
      this.startDate = this.date2Str(new Date(e.mp.detail.value))
    },
    endDateCb (e) {
      this.endDate = this.date2Str(new Date(e.mp.detail.value))
    },
    searchCb (res) {
      console.log('searchCb', res)
    },
    async deptList () {
      try {
        const deptList = this.apiList.xy.deptList
        const params = {dept_name: ''}
        const data = this.ironRequest(deptList.url, params, deptList.method)
        console.log(data)
      } catch (err) {
        console.log(err)
      }
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
  input,.select
    height 100%
.footer
  position fixed
  bottom 0
  left 0
  right 0     
</style>