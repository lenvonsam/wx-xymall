<template lang="pug">
div
  nav-bar(title="合同修改", isBack)
  .row.flex-between.padding-sm.bg-white.mb-10
    .col.text-blue
      span {{contractDetail.deal_no}}
      span.padding-left-sm(v-if="contractDetail.status != 18 && contractDetail.status != 19") {{billStatus}}
    .text-red(v-if="contractDetail.status == 18 || contractDetail.status == 19") {{billStatus}}
    .text-right(@click="openEdit()", v-else-if="contractDetail.status === 14") {{isEdit ? '完成' : '编辑'}} 
  
  template(v-if="isload")
    time-line(type="mallist")  
  template(v-else) 
    template(v-if="modifyList.length > 0")   
      .scroll-view
        .bill-items.bg-white.solid-bottom.padding-bottom-sm(v-for="(bill, billIdx) in modifyList", :key="billIdx")
          .bill-item.padding-left-sm.padding-right-sm.padding-top-sm
            .flex.flex-center.align-center(@click="selectBill(bill)")
              .col.flex-25(style="padding-top: 5px;")
                img.choose-icon(src="/static/images/blue_check.png", v-if="bill.choosed")
                img.choose-icon(src="/static/images/btn_ck_n.png", v-else)
              .col
                span {{bill.goods_name}}
                span.padding-left-xs {{bill.standard}}
              .text-blue ￥{{bill.order_price}}/吨
            .content.ft-13.flex.justify-between.text-gray.text-content
              .col
                span {{bill.material}}
                span.padding-left-xs {{bill.length}}米
                span.padding-left-xs {{bill.wh_name}}
                span.sub-mark.ml-5 {{bill.supply}}
                div
                  span {{bill.left_qtt}} 支 / {{bill.provided_qtt}} 吨
                div(v-if="bill.tolerance_range || bill.weight_range")
                  span(v-if="bill.tolerance_range") 公差范围:
                  span.padding-left-xs(v-if="bill.tolerance_range") {{bill.tolerance_range}}
                  template(v-if="contractDetail.status === 18 || contractDetail.status === 19")
                    span.padding-left-sm(v-if="bill.weight_range") 重量范围:
                    span.padding-left-xs(v-if="bill.weight_range") {{bill.weight_range}}
                  div
                    template(v-if="contractDetail.status === 18 || contractDetail.status === 19")
                      span(v-if="bill.left_qtt") 旧单数量:
                      span.padding-left-xs(v-if="bill.left_qtt") {{bill.left_qtt}} 支
                      span.padding-left-sm(v-if="bill.provided_qtt") 旧单重量:
                      span.padding-left-xs(v-if="bill.provided_qtt") {{bill.provided_qtt}} 吨
                    template(v-else)
                      span(v-if="bill.weight_range") 重量范围:
                      span.padding-left-xs(v-if="bill.weight_range") {{bill.weight_range}}
                .solid-top.padding-top-sm.margin-top-sm(v-if="type === '2'")
                  span 新单数量:{{bill.count}}支， {{bill.weight}}吨
              .flex.justify-between.flex-direction.align-end
                .col
                  z-radio(v-for="(r, rIdx) in bill.radios", :key="rIdx", :label="r.label", :checked="bill.measure_way === r.m_way")
                    
                  //- radio-group.block(v-model="bill.measure_way_id")
                    div(v-for="(r, rIdx) in bill.radios", :key="rIdx")
                      radio.blue.radio(:checked="bill.measure_way === r.m_way", @click="weightChoose(r.m_way, bill)")
                      span.padding-left-xs {{r.label}}
                .flex.padding-xs.justify-end.align-end(v-if="contractDetail.status !== 18 && contractDetail.status !== 19")
                  .col
                    count-step(v-model="bill.count", @input="rowCartCount(bill)", @blur="rowCartCount(bill)", :max="bill.amount_left")
                  .padding-left-xs {{bill.weight}}吨
    .text-center.c-gray.pt-100(v-else)
      empty-image(url="bill_empty.png", className="img-empty")
      .empty-content 您暂时没有相关合同
    .bottom-option.bg-white.flex.align-center.justify-between(v-if="isEdit")
      .flex.align-center(@click="choosedAll()")
        .flex.flex-center
          img.choose-icon(src="/static/images/blue_check.png", v-if="allChoosed")
          img.choose-icon(src="/static/images/btn_ck_n.png", v-else)
        .padding-xs 全选
      .main-btn.bg-red(@click="promptClose()") 删除  
    .bottom-panel.padding-sm(v-else)
      .flex
        .col.flex-100 旧单金额：
        .col.text-gray.text-right ￥{{contractDetail.price}}（含吊费：{{contractDetail.lift_price}}）      
      .flex.padding-bottom-sm
        .col.flex-100 新单金额：
        .col.text-gray.text-right ￥{{newBillPrice}}（含吊费：{{newLift}}）          
      
      .solid-top.solid-top-sm.row(v-if="contractDetail.status === 19")
        .col.padding-right-xs
          button.text-white.bg-red(@click="overrule()") 驳回
        .col.padding-left-xs
          button.text-white.bg-blue(@click="agreeEdit()") 同意修改
      .solid-top.solid-top-sm(v-else-if="contractDetail.status === 18")
        button.bg-gray 修改审核中
      .solid-top.solid-top-sm.row(v-else-if="contractDetail.status === 12 || contractDetail.status === 14 || contractDetail.status === 15")
        .col.padding-right-xs
          button.bg-gray(@click="back") 放弃修改
        .col.padding-left-xs
          button.text-white.bg-blue(@click="applyEdit") 申请修改  
    //- .bill-foot.bg-white.padding-sm
      .flex
        .text-black 旧单金额
        .text-gray.text-right.col ￥{{contractDetail.price}}（含吊费：{{contractDetail.lift_price}}） 
      .flex
        .text-black 新单金额
        .text-gray.text-right.col ￥{{contractDetail.deal_price_new ? contractDetail.deal_price_new : (newPrice + newLift).toFixed(2)}}（含吊费：{{newLift}}）   
</template>
<script>
import CountStep from '@/components/CountStep.vue'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      isEdit: false,
      choosedList: [],
      agreeEditShow: false,
      overruleShow: false,
      // applyEditShow: false,
      promptShow: false,
      modifyList: [],
      contractDetail: {},
      newPrice: 0,
      newLift: 0,
      wh_lift: '',
      delModifyList: [],
      type: 1,
      delIdx: null,
      billStatus: '',
      newBillPrice: 0,
      allChoosed: true
    }
  },
  components: {
    CountStep
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser
    })
  },
  onUnload () {
    this.isEdit = false
    this.choosedList = []
    this.agreeEditShow = false
    this.overruleShow = false
    // applyEditShow: false,
    this.promptShow = false
    this.modifyList = []
    this.contractDetail = {}
    this.newPrice = 0
    this.newLift = 0
    this.wh_lift = ''
    this.delModifyList = []
    this.type = 1
    this.delIdx = null
    this.billStatus = ''
    this.newBillPrice = 0
    this.allChoosed = true
  },
  beforeMount () {
    this.getLift()
  },
  methods: {
    choosedAll () {
      this.allChoosed = !this.allChoosed
      if (this.allChoosed) {
        this.modifyList.map(itm => {
          itm.choosed = true
        })
      } else {
        this.modifyList.map(itm => {
          itm.choosed = false
        })
      }
      this.$forceUpdate()
    },
    openEdit () {
      this.isEdit = !this.isEdit
      if (!this.isEdit) {
        this.allChoosed = true
        this.modifyList.map(itm => {
          itm.choosed = true
        })
      }
    },
    getNewBillPrice () {
      this.newBillPrice = this.contractDetail.deal_price_new ? this.contractDetail.deal_price_new : this.$toFixed(this.newPrice + this.newLift, 2)
    },
    selectBill (bill) {
      if (this.isEdit) {
        bill.choosed = !bill.choosed
        this.allChoosed = bill.choosed
        this.$forceUpdate()
      }
    },
    weightChoose (val, rowItem) {},
    getLift () {
      this.ironRequest('isLift.shtml', {}, 'get', this).then(res => {
        this.wh_lift = res
        this.loadData()
      }).catch(err => {
        this.isLoad = true
        this.showMsg(err)
      })
    },
    applyEdit () {
      this.confirm({content: '请确认修改合同'}).then((res) => {
        if (res !== 'confirm') return false
        const seqList = []
        const orderList = []
        const countList = []
        this.modifyList.map((res) => {
          seqList.push(res.seq_d)
          orderList.push(res.order_id)
          countList.push(res.count)
        })
        this.delModifyList.map(res => {
          seqList.push(res.seq_d)
          orderList.push(res.order_id)
          countList.push(0)
        })
        const params = {
          id: this.contractDetail.id,
          seq_d: seqList.toString(),
          order_id: orderList.toString(),
          amount: countList.toString()
        }
        // this.$ironLoad.show()
        this.ironRequest('buy_edit_contract_app.shtml', params, 'post', this).then(res => {
        // this.$ironLoad.hide()
          if (res.returncode === '0') {
            this.showMsg(res.msg ? res.msg : '提交成功')
            const me = this
            setTimeout(() => {
              me.back()
            }, 3000)
          } else {
            this.showMsg(res.msg ? res.msg : '操作失败')
          }
        }).catch(err => {
          // console.log('err', err.message)
          this.showMsg(err)
        })
      })
    },
    agreeEdit () {
      const params = {
        id: this.contractDetail.id,
        contract_id: this.contractDetail.contract_id
      }
      const me = this
      // this.$ironLoad.show()
      this.ironRequest('confirm_contract_app.shtml', params, 'post', this).then(res => {
        // this.$ironLoad.hide()
        if (res.returncode === '0') {
          me.showMsg(res.msg ? res.msg : '修改成功', 'positive')
          setTimeout(() => {
            me.back()
          }, 3000)
        } else {
          me.showMsg(res.msg ? res.msg : '操作失败')
        }
      }).catch(err => {
        this.showMsg(err || '网络错误')
      })
    },
    overrule () {
      const params = {
        id: this.contractDetail.id,
        contract_id: this.contractDetail.contract_id
      }
      const me = this
      this.ironRequest('reject_contract_app.shtml', params, 'post', this).then(res => {
        if (res.returncode === '0') {
          me.showMsg('驳回成功', 'positive')
          setTimeout(() => {
            me.back()
          }, 3000)
        } else {
          me.showMsg(res.data.msg)
        }
      }).catch(err => {
        this.showMsg(err || '网络错误')
        // if (done) done()
      })
    },
    getContractStatus () {
      let status = ''
      switch (this.contractDetail.status) {
        case 12:
          status = '付款中'
          break
        case 14:
          status = '待付款'
          break
        case 15:
          status = '待制作提单'
          break
        case 16:
          status = '制作提单中'
          break
        case 17:
          status = '待补款'
          break
        case 18:
        case 19:
          status = '修改中'
          break
      }
      this.billStatus = status
    },
    rowCartCount (item) {
      console.log('rowCartCount', item.count)
      console.log('rowCartWeight', item.weight)
      console.log('row', item)
      const lift = this.wh_lift.lift
      let isLift = this.wh_lift[item.wh_name]
      if (this.contractDetail.is_lift !== 1) {
        isLift = 2
      }
      const options = {
        type: item.measure_way,
        att8: item.att8,
        att9: item.att9,
        att10: item.att10,
        att14: item.length,
        att12: item.att6,
        price: item.order_price,
        amount: item.count,
        goods_id: item.goods_id,
        juanban: item.juanban
      }
      const result = this.calc(options)
      const money = Number(this.$toFixed(result.price, 2))
      const oldLift = isLift === '1' ? this.$toFixed(Number(item.weight) * lift, 2) : 0
      const everyLift = isLift === '1' ? this.$toFixed(Number(result.weight * lift), 2) : 0
      this.newLift = Number(this.$toFixed(this.newLift + Number(everyLift) - Number(oldLift), 2))
      item.weight = this.$toFixed(result.weight, 3)
      console.log('weight', item.weight)
      this.newPrice = Number(this.$toFixed(this.newPrice + money - item.price, 2))
      item.price = Number(money)
      this.getNewBillPrice()
    },
    promptClose () {
      this.confirm({content: '删除后将从合同中移除此规格，是否继续？(点击申请修改后，删除操作生效)'}).then((conRes) => {
        if (conRes !== 'confirm') return false
        const me = this
        const modifyList = JSON.parse(JSON.stringify(me.modifyList))
        const list = []
        modifyList.find((res, index) => {
          if (res.choosed) {
            const lift = me.wh_lift.lift
            let isLift = me.wh_lift[res.wh_name]
            const oldLift = isLift === '1' ? this.$toFixed(Number(res.weight) * lift, 2) : 0
            if (me.contractDetail.is_lift !== 1) {
              isLift = 2
            }
            me.newPrice = Number(this.$toFixed(me.newPrice - res.price, 2))
            me.newLift -= Number(oldLift)
            me.newLift = Number(this.$toFixed(me.newLift, 2))
            res.count = 0
            me.delModifyList.push(res)
          } else {
            list.push(res)
          }
          me.modifyList = list
        })
        this.getNewBillPrice()
      })
    },
    delOrderRow (id) {
      this.delete = 'delete'
      this.delIdx = id
      this.promptShow = true
    },
    loadData () {
      this.isLoad = false
      this.type = this.$root.$mp.query.type
      let apiUrl = 'contract_edit_detail_app.shtml'
      if (this.type === '2') {
        apiUrl = 'contract_edit_detail_confirm_app.shtml'
      }
      this.ironRequest(apiUrl, { id: this.$root.$mp.query.id }, 'post', this).then(resp => {
        this.isLoad = true
        let goodsPriceNew = 0
        let liftPriceNew = 0
        if (resp.returncode === '0') {
          this.contractDetail = resp
          // this.contractDetail.status = 19
          let arr = resp.resultlist
          const list = []
          arr.map(itm => {
            itm.choosed = true
            // this.choosedList.push(false)
            let lbl = '理计'
            if (itm.measure_way === 1) {
              lbl = '磅计'
            }
            itm.radios = [{
              label: lbl,
              m_way: itm.measure_way
            }]
            itm.order_price = itm.order_price / 100
            itm.price = Number(this.$toFixed(itm.order_price * itm.provided_qtt, 2))
            itm.weight = itm.provided_qtt_new || itm.provided_qtt_new === 0 ? itm.provided_qtt_new : itm.provided_qtt
            itm.weight = this.$toFixed(itm.weight, 3)
            itm.count = itm.left_qtt_new || itm.left_qtt_new === 0 ? itm.left_qtt_new : itm.left_qtt
            goodsPriceNew += itm.price
            const lift = this.wh_lift.lift
            let isLift = this.wh_lift[itm.wh_name]
            if (this.contractDetail.is_lift !== 1) {
              isLift = 2
            }
            const oldLift = isLift === '1' ? Number(this.$toFixed(Number(itm.weight) * lift, 2)) : 0
            liftPriceNew += oldLift
            list.push(itm)
          })
          this.modifyList = list

          this.newPrice = this.type === '2' ? this.contractDetail.goods_price_new : goodsPriceNew
          this.newLift = this.type === '2' ? this.contractDetail.lift_price_new : Number(this.$toFixed(liftPriceNew, 2))
          // if (done) done()
          this.getContractStatus()
          this.getNewBillPrice()
        } else {
          this.showMsg(resp === undefined ? '网络异常' : resp.errormsg)
          this.modifyList = []
          // if (done) done()
        }
      }).catch(err => {
        this.isLoad = true
        this.showMsg(err || '网络错误')
        // if (done) done()
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
.bill-btn,.bill-red-btn
  padding 5px 10px
  text-align center
  color #0081ff
.bill-btn
  border 1px #0081ff solid
.bill-red-btn
  border 1px #e54d42 solid
  color #e54d42
.bill-items
  .bill-item
    background #fff
    margin-top 10px
    .sub-mark
      display inline-block
      padding 1px 5px
      background #3da7ff
      color #fff
      font-size 12px
      border-radius 4px
      box-shadow 1px 2px 5px rgba(61, 167, 255, 0.3)
      letter-spacing 1px
    // .content
      // color $mainGray
    .count-step
      height 30px
      width 120px
      .min
        color #888
    .discount-line
      position absolute
      height 1px
      right -2px
      left -2px
      border-bottom 0.5px solid $mainGray
      top 8px
.cart-empty-btn {
  background: $mainColor;
  padding: 0.5rem 2rem;
  color: #fff;
  display: inline-block;
  font-weight: bold;
  font-size: 16px;
  border-radius: 25px;
  letter-spacing: 1px;
}
.count-step .num input
  color #333 !important
.choose-icon
  width 20px
  height 20px
// .s-content {
//   // height: 30rem;
//   height: calc(100vh - 11rem);
//   overflow: auto;
// }
.cart-items {
  .cart-item {
    background: #fff;
    margin-top: 0.5rem;
    .sub-mark {
      display: inline-block;
      padding: 1px 5px;
      background: #3da7ff;
      color: #fff;
      font-size: 12px;
      border-radius: 4px;
      box-shadow: 1px 2px 5px rgba(61, 167, 255, 0.3);
      letter-spacing: 1px;
    }
    .content {
      color: $mainGray;
    }
    .count-step {
      height: 30px;
      width: 120px;
      .min {
        color: #888;
      }
    }
    .discount-line {
      position: absolute;
      height: 1px;
      right: -2px;
      left: -2px;
      border-bottom: 0.5px solid $mainGray;
      top: 8px;
    }
  }
}
// .cart-footer {
//   flex: 5;
//   min-height: 50px;
//   background: #fff;
//   display: flex;
//   color: $mainBlack;
//   .cart-footer-col {
//     flex-direction: column;
//     align-items: center;
//     align-self: center;
//     padding-right: 8px;
//     flex-basis: 28%;
//   }
//   .cart-settle-btn {
//     display: flex;
//     background: $mainRed;
//     align-items: center;
//     color: #fff;
//     justify-content: center;
//   }
// }
.bill-foot
  position fixed
  left 0
  right 0
  bottom 0
.count-step .num input {
  color: #333 !important;
}
.bottom-option{
  position: fixed;
  padding: 10px;
  bottom: 0;
  left: 0;
  right: 0;
  line-height: 25px;
  height: 50px
  z-index 99
}
.bottom-panel {
  position: fixed;
  background: #fff;
  padding: 10px;
  width: 100%;
  bottom: 0;
  left: 0;
  right: 0;
  line-height: 25px;
  height: 120px;
  z-index 99
}
radio.radio[checked]::after
  content ''
  background-color #fff
  display block
  position absolute
  width 0px
  height 0px
  z-index 3
  top 0
  left 0
  right 0
  bottom 0
  margin auto
  border-radius 100%
  border 6px solid #fff !important
.count-step
  width 100px
button
  font-size 16px
.main-btn
  background #e54d42
  font-size 16px
  height 30px
  width 100px  
.scroll-view
  padding-bottom 120px
</style>