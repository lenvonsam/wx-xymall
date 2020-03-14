<template lang="pug">
.tab-select-dialog.solid-top(:style="selectSty", v-show="show", @click.stop="")
  .bg-white
    .padding(v-if="inputShow")
      .select-search.bg-gray.round.row.padding-xs
        .cuIcon-search.padding-left-sm
        input.col.padding-xs.margin-left-xs.text-left(type="text", v-model="searchVal")
        .close-icon(@click="searchVal = ''", v-if="searchVal")
          .cuIcon-roundclosefill.ft-18
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
      total: 0,
      currentPage: 0,
      pageSize: 10
    }
  },
  watch: {
    searchVal (newVal) {
      // this.customSearchVal = e.mp.detail.value
      const me = this
      this.throttle(function () {
        me.currentPage = 0
        me.loadData()
        me.$emit('search', this.customSearchVal)
      }, 300)
    }
  },
  beforeMount () {
    this.loadData()
  },
  methods: {
    // loadMore () { },
    tabSelect (item) {
      this.checkItem = item
      this.$emit('cb', this.checkItem)
    },
    deptList () {
      const deptList = this.apiList.xy.deptList
      const params = { dept_name: this.searchVal }
      const me = this
      this.ironRequest(deptList.url, params, deptList.method).then((res) => {
        if (res.returncode === '0') {
          me.pickList = res.list
          me.total = res.amount.amount
          me.pickList.unshift({ name: '全部', id: '' })
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
          me.pickList.unshift({ name: '全部', id: '' })
        }
        me.$forceUpdate()
      })
    },
    loadMore () {
      const me = this
      this.throttle(function () {
        me.currentPage++
        me.loadData()
      }, 300)
    },
    // searchChange (e) {
    //   this.customSearchVal = e.mp.detail.value
    //   const me = this
    //   this.throttle(function () {
    //     me.currentPage = 0
    //     me.loadData()
    //     me.$emit('search', e)
    //   }, 300)
    // },
    async loadData () {
      try {
        let api = {}
        let params = {}
        let data = ''
        switch (this.selectType) {
          case 'dept':
            api = this.apiList.xy.deptList
            params = {
              dept_name: this.searchVal,
              current_page: this.currentPage,
              page_size: this.pageSize
            }
            data = await this.ironRequest(api.url, params, api.method)
            break
          case 'employee':
            api = this.apiList.xy.employeeList
            params = {
              employee_name: this.searchVal,
              current_page: this.currentPage,
              page_size: this.pageSize
            }
            data = await this.ironRequest(api.url, params, api.method)
            break
          case 'custom':
            let queryUrl = '?pageSize=' + this.pageSize + '&currentPage=' + this.currentPage
            if (this.searchVal) queryUrl += '&name=' + encodeURIComponent(this.searchVal)
            data = await this.request(this.crmProxy + this.apiList.crm.cstmList.url + queryUrl, {}, this.apiList.crm.cstmList.method)
            break
        }
        this.total = this.selectType === 'custom' ? data.total : data.amount.amount
        let arr = data.list
        const me = this
        if (arr.length === 0 && me.currentPage === 0) {
          me.pickList = []
          me.isload = false
        } else if (arr.length > 0 && me.currentPage === 0) {
          arr.unshift({ name: '全部', id: '' })
          me.pickList = arr
          me.isload = false
        } else if (arr.length > 0 && me.currentPage > 0) {
          arr.map(item => {
            me.pickList.push(item)
          })
        } else {
          if (me.pickList.length >= 10) me.currentPage = 2
          me.cstmCurrentPage--
        }
        if (this.pickList.length < 10) this.currentPage = 0
        this.$forceUpdate()
      } catch (e) {
        console.error(e)
      }
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