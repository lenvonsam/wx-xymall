<template lang="pug">
div
  nav-bar(title="搜索", :isBack="true")
  .padding.bg-white
    .row
      .col
        .padding-xs.padding-lr(style="background: #f6f6f6;border-radius: 38rpx;")
          .row.text-gray.align-stretch
            //- .flex-30
            .cuIcon-search.padding-right-sm
            .col
              input(placeholder="请输入关键词搜索", v-model="searchWord", confirm-type="search", @confirm="searchClick", auto-focus)
            .close-icon(@click="cleanSearch", v-if="searchWord")
              .cuIcon-roundclosefill.ft-18
            //- icon.adjust.cuIcon-close.padding-left(@click="cleanSearch")
      .flex-50.text-center.text-blue(@click="searchClick") 搜索
  .padding(v-if="isLogin")
    .row
      .col 搜索历史
      .col.text-right(v-if="filterArray.length > 0")
        icon.adjust.cuIcon-delete(@click="deletePrompt")
    .margin-top-xl.text-center(v-if="filterArray.length === 0")
      empty-image(url="msg_empty.png")
    .margin-top(v-else)
      .search-btn(v-for="(n,idx) in filterArray", :key="idx", @click="searchClick(n)") {{n}}
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      searchWord: '',
      filterArray: []
    }
  },
  onShow () {
    // this.filterArray = []
    // if (this.currentUser.searchHistory && this.isLogin) {
    //   this.filterArray = this.currentUser.searchHistory
    // }
    // this.searchWord = ''
    if (this.isLogin) {
      this.getSearchHistory()
    }
  },
  methods: {
    ...mapActions([
      'setUser',
      'configVal'
    ]),
    // 获取用户搜索历史
    getSearchHistory () {
      this.httpPost(this.apiList.zf.appletQuerySearchHistory + '?pageSize=9', {pageSize: 9}).then(res => {
        console.log(res)
        this.filterArray = res.data || []
      }).catch(err => {
        console.log(err)
      })
    },
    // 清空历史记录
    deletePrompt () {
      const me = this
      this.confirm({ title: '友情提示', content: '您确定要清空历史记录吗？' }).then(res => {
        if (res === 'confirm') {
          me.filterArray = []
          this.httpGet(this.apiList.zf.appletDropSearchHistory).then(res => {
            console.log(res)
            // this.filterArray = res.data || []
          }).catch(err => {
            console.log(err)
          })
          // me.setLocalSearch()
          // me.ironRequest(this.apiList.xy.searchHistory.url, { user_id: me.currentUser.user_id, history: JSON.stringify(me.filterArray) }, me.apiList.xy.searchHistory.method, me)
        }
      })
    },
    // 点击搜索按钮或者某条历史搜索
    searchClick (searchName) {
      console.log('searchName++++', searchName)
      if (typeof searchName === 'string') {
        // 记录搜索
        this.configVal({ key: 'tempObject', val: { search: searchName, fromPage: 'search', noBack: true } })
      } else {
        // 搜索框搜索
        this.logEventPost({ event: 'app_mall_search', type: '02', param: { search: this.searchWord || '' } })
        this.configVal({ key: 'tempObject', val: { search: this.searchWord || '', fromPage: 'search', noBack: true } })
      }
      this.searchWord = ''
      // if (this.isLogin && typeof searchName !== 'string') {
      //   // 搜索框搜索
      //   const index = this.filterArray.findIndex(itm => itm === this.searchWord.trim())
      //   if (index < 0 && this.searchWord.length > 0) this.filterArray.unshift(this.searchWord.trim())
      //   this.setLocalSearch()
      // }
      this.tab('/pages/mall/main')
    },
    // 同步本地搜索历史
    // setLocalSearch () {
    //   if (this.isLogin) {
    //     const user = Object.assign({}, this.currentUser)
    //     console.log('同步++++', user)
    //     user.searchHistory = this.filterArray
    //     let data = {
    //       user
    //     }
    //     this.setUser(data)
    //   }
    // },
    // 清除搜索框关键词
    cleanSearch () {
      this.searchWord = ''
    }
  }
}
</script>

<style lang="stylus" scoped>
.search-btn
  background #e5e5e5
  display inline-block
  padding 5px 15px
  border-radius 15px
  margin-right 10px
  margin-bottom 10px
</style>
