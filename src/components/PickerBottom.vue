<template lang="pug">
modal-bottom(:value="modalShow", @cb="modalHandler", :btns="[]", ref="modal")
  .bg-white
    .padding(v-if="inputShow", style="height: 130rpx;")
      .select-search.round.row.padding-xs
        .cuIcon-search.padding-left-sm
        input.col.margin-left-xs.text-left(type="text", v-model="searchVal")
        .close-icon(@click="searchVal = ''", v-if="searchVal")
          .cuIcon-roundclosefill.ft-18
    iron-scroll(:height="600", heightUnit="rpx", @scrolltolower="loadMore", :loadFinish="loadFinish")
      .solid-top.row.padding.justify-between(@click="tabSelect(item)", v-for="(item, pickIdx) in pickList", :key="pickIdx")
        .row.justify-between.response(:class="{'text-blue': item[valKey] === checkItem[valKey]}")
          .col.text-left {{item.name}}
          .cuIcon-check(v-if="item[valKey] === checkItem[valKey]")
    .solid-top.text-right.padding.text-gray 共{{total}}条数据
</template>
<script>
import ModalBottom from '@/components/ModalBottom.vue'
export default {
  components: {
    ModalBottom
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    inputShow: {
      type: Boolean,
      default: true
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
      default: 200
    },
    clearVal: ['Boolean']
  },
  data () {
    return {
      pickList: [],
      checkItem: {},
      searchVal: '',
      loadFinish: 0,
      total: 0,
      currentPage: 0,
      pageSize: 10,
      modalShow: false
    }
  },
  watch: {
    show (newVal) {
      this.modalShow = newVal
      if (newVal) this.loadData()
    },
    clearVal () {
      this.checkItem = {}
    },
    searchVal (newVal) {
      const me = this
      this.throttle(function () {
        me.currentPage = 0
        me.loadData()
        me.$emit('search', this.customSearchVal)
      }, 300)
    }
  },
  // onShow () {
  //   this.loadData()
  // },
  // beforeMount () {
  //   this.loadData()
  // },
  // mounted () {
  //   this.$nextTick(() => {
  //     debugger
  //     this.loadData()
  //     console.log(this.$refs)
  //   })
  // },
  methods: {
    modalHandler () { },
    tabSelect (item) {
      this.checkItem = item
      this.$emit('cb', this.checkItem)
    },
    loadMore () {
      if (this.selectType === 'dept') return false
      const me = this
      this.throttle(function () {
        me.currentPage++
        me.loadData()
      }, 300)
    },
    async loadData () {
      try {
        let api = {}
        let params = {}
        let data = ''
        switch (this.selectType) {
          case 'dept':
            api = this.apiList.xy.deptList
            params = {
              dept_name: this.searchVal
              // current_page: this.currentPage,
              // page_size: this.pageSize
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
            let queryUrl = '?pageSize=' + this.pageSize + '&currentPage=' + this.currentPage + '&type=1'
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
        if (this.selectType === 'dept') this.currentPage = 2
        this.$forceUpdate()
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.select-search
  background #f6f6f6
</style>