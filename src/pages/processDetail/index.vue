<template lang="pug">
div
  nav-bar(title="发布加工", isBack)
  .bg-white.padding-top-sm.padding-left-sm.padding-right-sm
    template(v-if="pno")
      .row.solid-bottom.padding
        .title.padding-left-xs 客户名称
        .col.text-right.text-gray {{pObj['customer_name']}} 
      .row.solid-bottom.padding
        .title.padding-left-xs 联系电话
        .col.text-right.text-gray {{pObj['link_phone']}}  
    .row.solid-bottom.padding
      .title
        span.text-red(v-if="pno") *
        span.padding-left-xs 加工类型
      .col.text-right.text-gray(v-if="pno") {{pObj['type']}} 
      picker.col(@change="processTypeCb", :range="pTypeArray", v-else)
        .text-right.text-gray {{processType}}
    .row.solid-bottom.padding
      .title    
        span.text-red(v-if="pno") *
        span.padding-left-xs 交货时间
      .col.text-right.text-gray(v-if="pno") {{pObj['appoint_time']}}   
      picker.col(@change="dateCb", mode="date", v-else)
        .text-right.text-gray {{dateVal}}
    .row.solid-bottom.padding
      .title    
        span.text-red(v-if="pno") *
        span.padding-left-xs 材质
      .col.text-right.padding-left-xs
        span(v-if="pno") {{pObj['material']}}
        input(v-else, type="text", placeholder="请输入材质", v-model="material")
    .row.solid-bottom.padding
      .title    
        span.padding-left-xs 备注
      .col.text-right.padding-left-xs
        span(v-if="pno") {{pObj.remark}}
        input(v-else, type="text", placeholder="请输入备注", v-model="remark")
  .process(v-if="rowCount.length > 0")
    process-item(v-if="i", :pno="pno", :ref="`processItem_${idx}`", v-for="(i,idx) in rowCount", :row="i", :key="idx", :process-type="processType", :cb="pickerItemCb", :rowidx="idx")  
  .bottom-footer.bg-white.padding-sm
    .main-btn.bg-red(@click="delProcess", v-if="pno") 删除
    .main-btn(@click="createProcess", v-else) 提交
    
</template>
<script>
import { mapState } from 'vuex'
import processItem from '@/components/ProcessItem.vue'
export default {
  data () {
    return {
      typeIndex: 0,
      processType: '开平',
      pTypeArray: ['开平', '镀锌'],
      processTypeOpen: false,
      dateOpen: false,
      dateVal: '',
      material: '',
      rowCount: [],
      originVal: [],
      remark: '',
      btnDisable: false,
      rowObj: {},
      pno: '',
      pObj: {}
    }
  },
  components: {
    processItem
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser
    })
  },
  watch: {
    processType (newVal, oldVal) {
      if (!this.pno) {
        this.rowCount = [{ height: '', width: '', length: '', sheet_count: '' }]
      }
    }
  },
  onShow () {
    this.pno = this.$root.$mp.query.pno
    this.dateVal = this.date2Str(new Date())
    if (this.pno) {
      this.rowCount = []
      this.ironRequest('processDetail.shtml?process_no=' + this.pno, {}, 'get', this).then(resp => {
        if (resp.returncode === '0') {
          this.pObj = resp.process
          const list = []
          this.processType = this.pObj['type']
          this.pObj.items.map(item => {
            const obj = {
              height: item.weight,
              width: item.width,
              length: item.length,
              sheet_count: item.sheet
            }
            list.push(obj)
          })
          this.rowCount = list
        }
      }).catch(err => {
        console.log(err)
        this.showMsg()
      })
    } else {
      this.rowCount = [{ height: '', width: '', length: '', sheet_count: '' }]
    }
  },
  onUnload () {
    console.log('----onUnload------')
    this.pObj = {}
  },
  methods: {
    dateCb (e) {
      console.log('dateCb', e)
      this.dateVal = e.mp.detail.value
    },
    delProcess () {
      const me = this
      if (!this.btnDisable) {
        this.confirm({ content: '您确定要删除吗?' }).then(() => {
          me.btnDisable = true
          me.ironRequest('processDel.shtml', { process_no: this.pno }, 'post', me).then(resp => {
            if (resp && resp.returncode === '0') {
              me.showMsg('删除成功')
              setTimeout(() => {
                me.btnDisable = false
                me.back()
              })
            } else {
              me.btnDisable = false
              me.showMsg(resp === undefined ? '网路异常' : resp.errormsg)
            }
          }).catch(err => {
            me.showMsg(err || '网络异常')
            me.btnDisable = false
          })
        })
      }
    },
    processTypeCb (e) {
      this.processType = this.pTypeArray[e.mp.detail.value]
    },
    pickerItemCb (type, idx) {
      if (type === 'add') {
        this.rowCount.push({ height: '', width: '', length: '', sheet_count: '' })
      } else {
        this.rowCount[idx] = null
      }
      this.$forceUpdate()
    },
    createProcess () {
      if (this.validateItemsNull()) {
        // 厚度
        const heigthStr = this.rowObj.height.toString()
        // 宽度
        const widthStr = this.rowObj.width.toString()
        // 长度
        const lenStr = this.rowObj.length.toString()
        // 张数
        const sheeetStr = this.rowObj.sheet_count.toString()
        let pway = 1
        if (this.processType === '镀锌') pway = 2
        let body = {
          height: heigthStr,
          width: widthStr,
          length: lenStr,
          sheet_count: sheeetStr,
          way: pway,
          delivery_time: this.dateVal,
          material: this.material,
          remark: this.remark,
          user_id: this.currentUser.user_id
        }
        if (!this.btnDisable) {
          this.btnDisable = true
          const me = this
          this.ironRequest('process.shtml', body, 'post', this).then(resp => {
            if (resp && resp.returncode === '0') {
              me.showMsg('加工发布成功')
              setTimeout(() => {
                me.btnDisable = false
                me.back()
              })
            } else {
              me.btnDisable = false
              me.showMsg(resp === undefined ? '网络异常' : resp.errormsg)
            }
          })
        }
      }
    },
    validateItemsNull () {
      let result = true
      let $myDate = new Date()
      let $month = $myDate.getMonth() + 1
      let $day = $myDate.getDate()
      if ($month < 10) $month = '0' + $month
      if ($day < 10) $day = '0' + $day
      let $dayDate = Number(($myDate.getFullYear() + $month.toString() + $day))
      let $dateVal = Number(this.dateVal.replace(/[-]/g, ''))
      if (this.dateVal.trim().length === 0) {
        this.showMsg('必填项不能为空')
        result = false
      } else if (this.material.trim().length === 0) {
        this.showMsg('必填项不能为空')
        result = false
      } else if ($dateVal < $dayDate) {
        this.showMsg('交货时间不能小于当前时间')
        result = false
      } else {
        // this.originVal = []
        this.rowObj = {
          height: [],
          width: [],
          length: [],
          sheet_count: []
        }
        const me = this
        this.rowCount.map((item, index) => {
          if (item) {
            const row = me.$refs[`processItem_${index}`][0].copyRow
            Object.keys(row).forEach((key) => {
              if (row[key].trim().length === 0) {
                me.showMsg('必填项不能为空')
                result = false
                throw Error('必填项不能为空')
              } else {
                // this.originVal.push(row)
                me.rowObj[key].push(row[key].trim())
              }
            })
          }
        })
      }
      return result
    }
  },
  destroyed () {
    this.rowCount = []
  }
}
</script>
<style lang="stylus" scoped>
.padding
  padding 10px 0
.bottom-footer
  position fixed
  left 0
  right 0
  bottom 0
  z-index 6
.process
  padding-bottom 70px
.bg-red
  background #e54d42
</style>