<template lang="pug">
div
  nav-bar(title="发布加工", isBack)
  .bg-white.padding-top-sm.padding-left-sm.padding-right-sm
    template(v-if="processId")
      .row.solid-bottom.padding
        .title.padding-left-xs 客户名称
        .col.text-right.text-gray {{pObj['customerUnitName']}}
      .row.solid-bottom.padding
        .title.padding-left-xs 联系电话
        .col.text-right.text-gray {{pObj['contactsPhone']}}
    .row.solid-bottom.padding
      .title
        span.text-red(v-if="processId") *
        span.padding-left-xs 加工类型
      .col.text-right.text-gray(v-if="processId") {{processType}}
      picker.col(@change="processTypeCb", :range="pTypeArray", v-else)
        .text-right.text-gray {{processType}}
    .row.solid-bottom.padding
      .title
        span.text-red(v-if="processId") *
        span.padding-left-xs 交货时间
      .col.text-right.text-gray(v-if="processId") {{pObj['deliveryDate']}}
      picker.col(@change="dateCb", mode="date", v-else)
        .text-right.text-gray {{dateVal}}
    .row.solid-bottom.padding
      .title
        span.text-red(v-if="processId") *
        span.padding-left-xs 材质
      .col.text-right.padding-left-xs
        span(v-if="processId") {{pObj['productTextureName']}}
        input(v-else, type="text", placeholder="请输入材质", v-model="material")
    .row.solid-bottom.padding
      .title
        span.padding-left-xs 备注
      .col.text-right.padding-left-xs
        span(v-if="processId") {{pObj.remarks}}
        input(v-else, type="text", placeholder="请输入备注", v-model="remark")
  .process(v-if="rowCount.length > 0" :style="{'padding-bottom': isIpx ? '218rpx' : '150rpx'}")
    process-item(v-if="i", :pno="processId", :ref="`processItem_${idx}`", v-for="(i,idx) in rowCount", :row="i", :key="idx", :process-type="processType", :cb="pickerItemCb", :rowidx="idx")
  .bottom-footer.bg-white.padding-sm(:style="{'padding-bottom': isIpx ? '98rpx' : '20rpx'}")
    .main-btn.bg-red(@click="delProcess", v-if="processId") 删除
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
      processId: '',
      pObj: {}
    }
  },
  components: {
    processItem
  },
  computed: {
    ...mapState({
      isIpx: state => state.isIpx
    })
  },
  watch: {
    processType (newVal, oldVal) {
      if (!this.processId) {
        this.rowCount = [{ height: '', width: '', length: '', sheet_count: '' }]
      }
    }
  },
  onShow () {
    this.processId = this.$root.$mp.query.processId
    this.dateVal = this.date2Str(new Date())
    if (this.processId) {
      this.rowCount = []
      const paramsObj = {
        id: this.processId
      }
      this.httpGet(this.apiList.zf.onlineProcessDetail, paramsObj).then(res => {
        this.pObj = res.data
        const list = []
        this.processType = this.pObj['processType'] === '01' ? '开平' : '镀锌'
        this.pObj.onlineProcessDetailList.map(item => {
          const obj = {
            height: item.thickness,
            width: item.width,
            length: item.length,
            sheet_count: item.pieces
          }
          list.push(obj)
        })
        this.rowCount = list
      })
      // this.ironRequest('processDetail.shtml?process_no=' + this.pno, {}, 'get').then(resp => {
      //   if (resp.returncode === '0') {
      //     this.pObj = resp.process
      //     const list = []
      //     this.processType = this.pObj['type']
      //     this.pObj.items.map(item => {
      //       const obj = {
      //         height: item.weight,
      //         width: item.width,
      //         length: item.length,
      //         sheet_count: item.sheet
      //       }
      //       list.push(obj)
      //     })
      //     this.rowCount = list
      //   }
      // }).catch(err => {
      //   this.showMsg(err || '网络错误')
      // })
    } else {
      this.rowCount = [{ height: '', width: '', length: '', sheet_count: '' }]
    }
  },
  onUnload () {
    console.log('----onUnload------')
    this.typeIndex = 0
    this.processType = '开平'
    this.pTypeArray = ['开平', '镀锌']
    this.processTypeOpen = false
    this.dateOpen = false
    this.dateVal = ''
    this.material = ''
    this.rowCount = []
    this.originVal = []
    this.remark = ''
    this.btnDisable = false
    this.rowObj = {}
    this.processId = ''
    this.pObj = {}
  },
  methods: {
    dateCb (e) {
      console.log('dateCb', e)
      this.dateVal = e.mp.detail.value
    },
    delProcess () {
      const self = this
      if (!this.btnDisable) {
        self.confirm({ content: '您确定要删除吗?' }).then((res) => {
          if (res !== 'confirm') return false
          self.btnDisable = true
          self.httpGet(self.apiList.zf.deleteOnlineProcess, {id: self.processId}).then(res => {
            self.showMsg('删除成功')
            setTimeout(() => {
              self.btnDisable = false
              self.back()
            })
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
          const self = this
          this.ironRequest('process.shtml', body, 'post').then(resp => {
            if (resp && resp.returncode === '0') {
              self.showMsg('加工发布成功')
              setTimeout(() => {
                self.btnDisable = false
                self.back()
              })
            } else {
              self.btnDisable = false
              self.showMsg(resp === undefined ? '网络异常' : resp.errormsg)
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
        const self = this
        this.rowCount.map((item, index) => {
          if (item) {
            const row = self.$refs[`processItem_${index}`][0].copyRow
            Object.keys(row).forEach((key) => {
              if (row[key].trim().length === 0) {
                self.showMsg('必填项不能为空')
                result = false
                throw Error('必填项不能为空')
              } else {
                // this.originVal.push(row)
                self.rowObj[key].push(row[key].trim())
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
