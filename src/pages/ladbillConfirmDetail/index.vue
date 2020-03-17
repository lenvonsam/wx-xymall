<template lang="pug">
div
  nav-bar(:title="navTitle", isBack)
  div(style="margin-bottom: 60px")
    .bg-white.row.text-blue.padding-sm
      .col
        span.ft-15.text-blue.text-bold {{ladObject.td_no}}
        copy-btn(:copyUrl="ladObject.id_no")
      .text-blue(v-if="ladObject.status === '提单待确认'") {{ladObject.status}}
      .text-gray(v-else) {{ladObject.status}}
    .tip.text-orange.padding-sm(v-if="ladObject.status === '提单待确认'")
      span *请务必仔细确认物资提货人信息进行确认，如有疑问，请及时联系型云客服
    .bg-white.padding-sm
      .ft-16.text-bold 商品信息
      .margin-top-sm(v-for="(item, idx) in ladObject.order_items", :key="idx")
        .row.justify-between.ft-15
          .col.text-bold
            span {{item.product_name}}
            span.padding-left-xs {{item.product_standard}}
          .text-blue.text-bold ￥{{item.product_price}}
        .text-gray.margin-top-xs
          .row.padding-bottom-xs
            .col
              span {{item.product_material}}
              span.padding-left-xs {{item.product_length}}米
              span.padding-left-xs {{item.warehouse}}号门
              .sub-mark.ml-5 {{item.product_supply}}
            span ({{item.metering}})
          .padding-bottom-xs {{item.product_count}}支/{{item.weight}}吨
      .solid-top.padding-top-sm.row.text-bold.justify-between
        span 总支数：{{totalCount}}支
        span 预计总重量：{{totalWeight}}吨
    .bg-white.margin-top-sm
      .solid-bottom.padding-sm.ft-15 提货信息
      .padding-sm
        .row.text-gray.padding-bottom-xs.justify-between
          span 提货人姓名
          span {{ladObject.receive_name}}
        .row.text-gray.padding-bottom-xs.justify-between
          span 提货人联系电话
          span {{ladObject.receive_phone}}
        .row.text-gray.padding-bottom-xs.justify-between
          span 身份证号码
          span {{ladObject.id_no}}
        .row.text-gray.padding-bottom-xs.justify-between
          span 提货人车牌号
          span {{ladObject.car_no}}
        .row.text-gray.padding-bottom-xs.justify-between
          span 单位名称
          span {{ladObject.comp_name}}
    .margin-top-sm.padding-sm.flex.justify-between.bg-white
      .col
        .text-bold.ft-15 制单人联系电话
        .text-gray {{tdContact}}
      .tel-btn.bg-red.text-center.text-white.row.justify-center(@click="makeCall(tdContact)")
        span 点击拨打
        .padding-left-xs.cuIcon-phone
  .footer.row.bg-white.text-center.text-white.padding-sm(v-if="ladObject.status === '提单待确认'")
    .bg-red.col.padding-sm.round(@click="ladCancel") 驳回
    .bg-blue.col.margin-left-sm.padding-sm.round(@click="ladConfirm") 确认提单  
</template>
<script>
import copyBtn from '@/components/CopyBtn.vue'
export default {
  data () {
    return {
      navTitle: '提单详情',
      totalCount: '',
      totalWeight: '',
      ladObject: {},
      btnDisable: false
    }
  },
  beforeMount () {
    const me = this
    this.ironRequest('orderLadDetail.shtml?td_no=' + this.$root.$mp.query.no, {}, 'get').then(resp => {
      if (resp && resp.returncode === '0') {
        me.totalCount = 0
        me.totalWeight = 0
        resp.order_items.map(item => {
          me.totalCount += item.product_count
          me.totalWeight += item.weight
        })
        this.ladObject = resp
        if (this.ladObject.status === '提单待确认') this.navTitle = '确认提单'
      }
    }).catch(err => {
      console.log(err)
      this.showMsg(err || '网络异常')
      setTimeout(() => {
        me.back()
      }, 2000)
    })
  },
  computed: {
    tdContact () {
      return this.ladObject.make_phone === undefined ? '0519-86921892' : this.ladObject.make_phone
    }
  },
  onUnload () {
    this.totalCount = ''
    this.totalWeight = ''
    this.ladObject = {}
    this.btnDisable = false
  },
  components: {
    copyBtn
  },
  methods: {
    ladConfirm () {
      if (!this.btnDisable) {
        this.btnDisable = true
        const me = this
        this.ironRequest('confirmTdOrder.shtml', { td_id: this.ladObject.td_id }, 'post').then(resp => {
          if (resp && resp.returncode === '0') {
            this.showMsg('提单确认成功')
            setTimeout(() => {
              me.btnDisable = false
              me.back()
            }, 1000)
          } else {
            this.showMsg(resp === undefined ? '网络异常' : resp.errormsg)
            this.btnDisable = false
          }
        }).catch(err => {
          console.log(err)
          this.show(err || '网络错误')
          this.btnDisable = false
        })
      }
    },
    ladCancel () {
      if (!this.btnDisable) {
        this.btnDisable = true
        const me = this
        // me.$ironLoad.show()
        this.showLoading()
        this.ironRequest('cancelTdOrder.shtml', { user_id: this.currentUser.user_id, td_no: this.$root.$mp.query.no }, 'post').then(resp => {
          // me.$ironLoad.hide()
          if (resp && resp.returncode === '0') {
            this.showMsg('提单驳回成功')
            setTimeout(() => {
              me.btnDisable = false
              me.back()
            }, 1000)
          } else {
            this.showMsg(resp === undefined ? '网络异常' : resp.errormsg)
            this.btnDisable = false
          }
          this.hideLoading()
        }).catch(err => {
          console.log(err)
          this.hideLoading()
          // me.$ironLoad.hide()
          this.showMsg(err || '网络错误')
          this.btnDisable = false
        })
      }
    },
    telContact () {
      this.statisticRequest({ event: 'click_app_mylad_confirm_tel' })
      window.location.href = 'tel://' + this.tdContact
    }
  }
}
</script>

<style lang="stylus" scoped>
.confirm-btn
  border 1px solid #0081ff
  padding 3px 8px
  border-radius 15px
.tip
  background #FEF7E7
.tel-btn
  width 150px
  border-radius 50px
  font-size 15px
  height 35px
  line-height 35px
.footer
  position fixed
  bottom 0
  left 0
  right 0
</style>