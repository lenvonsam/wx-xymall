<template lang="pug">
.tab-select-dialog.solid-top(:style="selectSty", v-show="show", @click.stop="")
  .bg-white
    .padding(v-if="inputShow")
      .select-search.bg-gray.round.row.padding-xs
        .cuIcon-search.padding-left-sm
        input.col.padding-xs.margin-left-xs(type="text", v-model="searchVal", @input="inputChange")
    iron-scroll(:height="scrollHeight", heightUnit="rpx", @scrolltolower="loadMore", :loadFinish="loadFinish")
      .bg-white.solid-top.row.padding.justify-between(@click="tabSelect(item)", v-for="(item, pickIdx) in pickList", :key="pickIdx")
        .row.justify-between.response(:class="{'text-blue': item[valKey] === checkItem[valKey]}")
          .col.text-left {{item.name}}
          .cuIcon-check(v-if="item[valKey] === checkItem[valKey]")
    .solid-top.text-right.padding.text-gray 共{{total}}条数据
</template>
<script>
export default {
  props: {
    show: ['Boolean'],
    inputShow: {
      type: Boolean,
      default: false
    },
    selectSty: {
      type: Object,
      default: {}
    },
    list: {
      type: Array,
      default: []
    },
    selectType: ['String'],
    valKey: {
      type: String,
      default: 'id'
    },
    labelKey: ['String'],
    scrollHeight: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      pickList: [],
      checkItem: {},
      searchVal: '',
      selectRemote: '',
      loadFinish: 0,
      total: 0
    }
  },
  beforeMount () {
    switch (this.selectType) {
      case 'dept':
        this.selectRemote = () => {
          return this.deptList()
        }
        break
      case 'employee':
        this.selectRemote = () => {
          return this.employeeList()
        }
        break
    }
    if (this.selectRemote) {
      this.selectRemote()
    }
  },
  methods: {
    loadMore () {},
    tabSelect (item) {
      this.checkItem = item
      this.$emit('cb', this.checkItem)
    },
    inputChange (val) {
      this.selectRemote()
      this.$emit('search', val)
    },
    deptList () {
      const deptList = this.apiList.xy.deptList
      const params = {dept_name: this.searchVal}
      const me = this
      this.ironRequest(deptList.url, params, deptList.method).then((res) => {
        if (res.returncode === '0') {
          me.pickList = res.list
          me.total = res.amount.amount
          me.pickList.unshift({name: '全部', id: ''})
        }
        me.$forceUpdate()
      })
    },
    employeeList () {
      const employeeList = this.apiList.xy.employeeList
      const params = {
        employee_name: this.searchVal,
        current_page: 0,
        page_size: 10
      }
      const me = this
      this.ironRequest(employeeList.url, params, employeeList.method).then((res) => {
        if (res.returncode === '0') {
          me.pickList = res.list
          me.total = res.amount.amount
          me.pickList.unshift({name: '全部', id: ''})
        }
        me.$forceUpdate()
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
.tab-select-dialog
  position absolute
  left 0
  right 0
  z-index 99
  background rgba(0, 0, 0, 0.5)
  bottom 0
  // height 100vh
</style>