<template lang="pug">
div
  nav-bar(title="搜索", :isBack="true")
  .padding.bg-white
    .row
      .col
        .padding-sm.padding-lr(style="background: #f6f6f6;border-radius: 38rpx;")
          .row.text-gray
            .flex-30
              icon.adjust.cuIcon-search
            .col
              input(placeholder="请输入关键词搜索", v-model="searchWord")
      .flex-50.text-center.text-blue(@click="searchClick") 搜索
  .padding
    .row
      .col 搜索历史
      .col.text-right(v-if="filterArray.length > 0")
        icon.adjust.cuIcon-delete(@click="deletePrompt")
    .margin-top-xl.text-center(v-if="filterArray.length === 0") 
      empty-image(url="msg_empty.png")
    .margin-top(v-else)
      .search-btn(v-for="(n,idx) in filterArray", :key="idx") {{n}}
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      searchWord: '',
      filterArray: []
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser
    })
  },
  beforeMount () {
    console.log('beforeMount', this.currentUser)
    if (this.currentUser.localSearchs) this.filterArray = this.currentUser.localSearchs
  },
  onShow () {
    this.searchWord = ''
  },
  methods: {
    ...mapActions([
      'setUser'
    ]),
    deletePrompt () {
      const me = this
      this.confirm({ title: '友情提示', content: '您确定要清空历史记录吗？' }).then(res => {
        if (res === 'confirm') {
          me.filterArray = []
          me.setLocalSearch()
        }
      })
    },
    searchClick () {
      if (this.searchWord.toString().trim().length === 0) {
        this.showMsg('请输入内容')
        return
      }
      const index = this.filterArray.findIndex(itm => itm === this.searchWord.trim())
      if (index < 0) this.filterArray.unshift(this.searchWord.trim())
      this.setLocalSearch()
    },
    setLocalSearch () {
      const user = Object.assign({}, this.currentUser)
      user.localSearchs = this.filterArray
      this.setUser(user)
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
