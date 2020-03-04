<template lang="pug">
div
  nav-bar(title="搜索", :isBack="true")
  .padding.bg-white
    .row
      .col
        .padding-xs.padding-lr(style="background: #f6f6f6;border-radius: 38rpx;")
          .flex.text-gray.align-stretch
            //- .flex-30
            icon.adjust.cuIcon-search.padding-right-sm
            .col
              input(placeholder="请输入关键词搜索", v-model="searchWord", confirm-type="search", @confirm="searchClick")
            icon.adjust.cuIcon-close.padding-left(@click="cleanSearch") 
      .flex-50.text-center.text-blue(@click="searchClick") 搜索
  .padding
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
    this.filterArray = []
    if (this.currentUser.localSearchs) this.filterArray = this.currentUser.localSearchs
    this.searchWord = ''
  },
  methods: {
    ...mapActions([
      'setUser',
      'configVal'
    ]),
    deletePrompt () {
      const me = this
      this.confirm({ title: '友情提示', content: '您确定要清空历史记录吗？' }).then(res => {
        if (res === 'confirm') {
          me.filterArray = []
          me.setLocalSearch()
          me.ironRequest(this.apiList.xy.searchHistory.url, { user_id: me.currentUser.user_id, history: JSON.stringify(me.filterArray) }, me.apiList.xy.searchHistory.method, me)
        }
      })
    },
    searchClick (searchName) {
      if (!this.isLogin) {
        this.confirm({ content: '您未登录，请先登录' }).then(res => {
          if (res === 'confirm') {
            this.jump('/pages/account/login/main')
          } else {
            this.tab('/pages/index/main')
          }
        })
        return
      }
      if (typeof (searchName) === 'string') {
        this.configVal({ key: 'tempObject', val: { search: searchName } })
        this.setLocalSearch()
        this.tab('/pages/mall/main')
        return false
      }
      // if (this.searchWord.toString().trim().length === 0) {
      //   this.showMsg('请输入内容')
      //   return
      // }
      const index = this.filterArray.findIndex(itm => itm === this.searchWord.trim())
      if (index < 0 && this.searchWord.trim()) this.filterArray.unshift(this.searchWord.trim())
      this.configVal({ key: 'tempObject', val: { search: this.searchWord } })
      this.setLocalSearch()
      this.tab('/pages/mall/main')
    },
    setLocalSearch () {
      const user = Object.assign({}, this.currentUser)
      user.localSearchs = this.filterArray
      this.setUser(user)
    },
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
