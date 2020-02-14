<template lang="pug">
div
  nav-bar(:title="pageTitle", :isBack="true")
  .padding(v-if="pageType === 'notice'")
    .bg-white.margin-bottom(v-for="(data,idx) in listData", :key="idx", style="box-shadow: 0px 0px 2.5px rgba(7,1,2,0.04)")
      .padding.border-bottom-line
        div {{data.title}}
        .margin-top(style="color: #4d4d4d") 12333344555
        .text-right.ft-12.text-gray.mt-5 2019-03-39 10:00
      .padding.row.text-gray
        .col 查看详情
        .col.text-right
          icon.cuIcon-right
</template>

<script>
export default {
  data () {
    return {
      pageTitle: '',
      // xyNotice 型云公告
      pageType: 'notice',
      currentPage: 0,
      listData: [],
      listMapKey: {
        'notice': 'notices'
      }
    }
  },
  onReachBottom () {
    console.log('reach bottom')
    const me = this
    this.throttle(function () {
      me.currentPage++
      me.getListData()
    }, 300)
  },
  onShow () {
    const query = this.$root.$mp.query
    this.pageTitle = ''
    this.pageType = 'notice'
    console.log('query:>>', query)
    if (query.title) this.pageTitle = query.title
    if (query.type) this.pageType = query.type
    this.currentPage = 0
    this.listData = []
    this.getListData()
  },
  methods: {
    async getListData () {
      try {
        let url = ''
        let params = {}
        if (this.pageType === 'notice') {
          url = this.apiList.xy[this.pageType].url + '?type=1&current_page=' + this.currentPage + '&page_size=' + this.pageSize
        }
        const data = await this.ironRequest(url, params, this.apiList.xy[this.pageType].method, this)
        console.log('get data', data)
        const arr = data[this.listMapKey[this.pageType]]
        if (this.currentPage === 0 && arr.length > 0) {
          this.listData = arr
        } else if (this.currentPage > 0 && arr.length > 0) {
          arr.map(itm => {
            this.listData.push(itm)
          })
        } else {
          this.currentPage--
          if (this.currentPage < 0) this.currentPage = 0
        }
      } catch (e) {
        this.showMsg(e)
      }
    }
  }
}
</script>
