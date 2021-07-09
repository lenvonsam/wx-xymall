<template lang="pug">
div
  nav-bar(:title="navTitle", isBack)
  div(:style="{'margin-bottom': isIpx ? '188rpx' : '120rpx'}")
    .bg-white.row.text-blue.padding-sm
      .col
        span.ft-15.text-blue.text-bold {{ladObject.saleLadingNo}}
        copy-btn(:copyUrl="ladObject.saleLadingNo")
      .text-blue(v-if="ladObject.status === '提单待确认'") {{ladObject.status}}
      .text-gray(v-else) {{ladObject.status}}
    .tip.text-orange.padding-sm(v-if="ladObject.status === '提单待确认'")
      span *请务必仔细确认物资提货人信息进行确认，如有疑问，请及时联系型云客服
    .bg-white.padding-sm
      .ft-16.text-bold 商品信息
      .margin-top-sm(v-for="(item, idx) in ladObject.ladingDetailVOList", :key="idx")
        .row.justify-between.ft-15
          .col.text-bold
            span {{item.productBrandName}}
            span.padding-left-xs {{item.specification}}
          .text-blue.text-bold ￥{{item.inTaxPrice}}
        .text-gray.margin-top-xs
          .row.padding-bottom-xs
            .col
              span {{item.productTextureName}}
              span.padding-left-xs {{item.length}}米
              span.padding-left-xs {{item.stockZoneName}}
              .sub-mark.ml-5 {{item.prodAreaName}}
            span ({{item.quantityType === '02' ? '磅计' : '理计'}})
          .padding-bottom-xs {{item.outAmount}}支/{{item.quantityType === '02' ? item.outPoundWeight : item.outManagerWeight}}吨
      .solid-top.padding-top-sm.row.text-bold.justify-between
        span 总支数：{{ladObject.ladingAmount}}支
        span 预计总重量：{{ladObject.ladingManagerWeight}}吨
    .bg-white.margin-top-sm
      .solid-bottom.padding-sm.ft-15 提货信息
      .padding-sm
        .row.text-gray.padding-bottom-xs.justify-between
          span 提货人姓名
          span {{ladObject.driverName}}
        .row.text-gray.padding-bottom-xs.justify-between
          span 提货人联系电话
          span {{ladObject.driverPhone}}
        .row.text-gray.padding-bottom-xs.justify-between
          span 身份证号码
          span {{ladObject.driverIdcard}}
        .row.text-gray.padding-bottom-xs.justify-between
          span 提货人车牌号
          span {{ladObject.carNo}}
        //- .row.text-gray.padding-bottom-xs.justify-between
        //-   span 单位名称
        //-   span {{ladObject.comp_name}}
    .margin-top-sm.padding-sm.flex.justify-between.bg-white
      .col
        .text-bold.ft-15 制单人联系电话
        .text-gray {{tdContact}}
      .tel-btn.bg-red.text-center.text-white.row.justify-center(@click="makeCall(tdContact)")
        span 点击拨打
        .padding-left-xs.cuIcon-phone
  .footer.row.bg-white.text-center.text-white.padding-sm(v-if="ladObject.status === '提单待确认'", :style="{'padding-bottom': isIpx ? '68rpx' : '20rpx'}")
    .bg-red.col.padding-sm.round(@click="ladCancel(ladObject.saleLadingId)") 驳回
    .bg-blue.col.margin-left-sm.padding-sm.round(@click="ladConfirm(ladObject.saleLadingId)") 确认修改提单
</template>
<script>
import copyBtn from '@/components/CopyBtn.vue'
import { mapState } from 'vuex'
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
    // this.ironRequest('orderLadDetail.shtml?td_no=' + this.$root.$mp.query.no, {}, 'get').then(resp => {
    //   if (resp && resp.returncode === '0') {
    //     me.totalCount = 0
    //     me.totalWeight = 0
    //     resp.order_items.map(item => {
    //       me.totalCount += item.product_count
    //       me.totalWeight += item.weight
    //     })
    //     me.totalWeight = me.$toFixed(me.totalWeight, 3)
    //     this.ladObject = resp
    //     if (this.ladObject.status === '提单待确认') this.navTitle = '确认提单'
    //   }
    // }).catch(err => {
    //   console.log(err)
    //   this.showMsg(err || '网络异常')
    //   setTimeout(() => {
    //     me.back()
    //   }, 2000)
    // })
    this.httpPost(this.apiList.zf.billLadingDetail, {saleLadingId: this.$root.$mp.query.saleLadingId}).then(res => {
      me.totalCount = 0
      me.totalWeight = 0
      res.data.saleLadingList.map(item => {
        me.totalCount += item.product_count
        me.totalWeight += item.weight
      })
      me.totalWeight = me.$toFixed(me.totalWeight, 3)
      this.ladObject = res.data.saleLadingList[0]
      this.ladObject.status = '提单待确认'
      if (this.ladObject.status === '提单待确认') this.navTitle = '确认修改提单'
    })
  },
  computed: {
    ...mapState({
      isIpx: state => state.isIpx
    }),
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
    // 确认提单
    ladConfirm (saleLadingId) {
      if (!this.btnDisable) {
        this.btnDisable = true
        const me = this
        let paramsObj = {
          saleLadingId: [saleLadingId],
          type: true
        }
        this.httpPost(this.apiList.zf.ladingConfirmation, paramsObj).then(res => {
          this.showMsg('提单确认成功')
          setTimeout(() => {
            me.btnDisable = false
            me.back()
          }, 1000)
        }).finally(() => {
          this.hideLoading()
          this.btnDisable = false
        })
        // this.ironRequest('confirmTdOrder.shtml', { td_id: this.ladObject.td_id }, 'post').then(resp => {
        //   if (resp && resp.returncode === '0') {
        //     this.showMsg('提单确认成功')
        //     setTimeout(() => {
        //       me.btnDisable = false
        //       me.back()
        //     }, 1000)
        //   } else {
        //     this.showMsg(resp === undefined ? '网络异常' : resp.errormsg)
        //     this.btnDisable = false
        //   }
        // }).catch(err => {
        //   console.log(err)
        //   this.show(err || '网络错误')
        //   this.btnDisable = false
        // })
      }
    },
    // 驳回提单
    ladCancel (saleLadingId) {
      if (!this.btnDisable) {
        this.btnDisable = true
        const me = this
        // me.$ironLoad.show()
        this.showLoading()
        let paramsObj = {
          saleLadingId: [saleLadingId],
          type: false
        }
        this.httpPost(this.apiList.zf.ladingConfirmation, paramsObj).then(res => {
          this.showMsg('提单驳回成功')
          setTimeout(() => {
            me.btnDisable = false
            me.back()
          }, 1000)
        }).finally(() => {
          this.hideLoading()
          this.btnDisable = false
        })
        // this.ironRequest('cancelTdOrder.shtml', { user_id: this.currentUser.user_id, td_no: this.$root.$mp.query.no }, 'post').then(resp => {
        //   // me.$ironLoad.hide()
        //   this.hideLoading()
        //   if (resp && resp.returncode === '0') {
        //     this.showMsg('提单驳回成功')
        //     setTimeout(() => {
        //       me.btnDisable = false
        //       me.back()
        //     }, 1000)
        //   } else {
        //     this.showMsg(resp === undefined ? '网络异常' : resp.errormsg)
        //     this.btnDisable = false
        //   }
        // }).catch(err => {
        //   console.log(err)
        //   this.hideLoading()
        //   // me.$ironLoad.hide()
        //   this.showMsg(err || '网络错误')
        //   this.btnDisable = false
        // })
      }
    },
    telContact () {
      this.logEventGet({ event: 'click_app_mylad_confirm_tel' })
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
