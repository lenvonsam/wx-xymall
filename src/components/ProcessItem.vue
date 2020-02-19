<template lang="pug">
.padding-sm
  .bg-white.padding-sm
    .round
      .flex
        .title.row 
          .title-tag
          span.padding-left-xs 加工标准
        .col.flex.justify-end(v-if="!pno")
          .text-red.margin-right-xs.text-right.solids.line-red.round.btn-padding(v-if="rowidx", @click="cb('del', rowidx)") 删除
          .text-blue.text-right.solids.line-blue.round.btn-padding(@click="cb('add', rowidx)") 添加
    .row.flex-wrap
      .row.margin-top-sm.remark-item(v-for="(item,idx) in itemData[processType]", :key="idx")
        .margin-right-xs.remark-title
          span.text-red(v-if="!pno") *
          span {{item.name}}：
        input.col.padding-left-sm.padding-right-sm(v-if="!pno", :value="copyRow[item.prop]", @input="changeInput($event, item.prop)", :placeholder="item.placeholder", :type="item.type")
        .col.padding-left-sm.padding-right-sm(v-else) {{row[item.prop]}}
</template>
<script>
  export default {
    props: {
      pno: {
        type: String,
        default: ''
      },
      row: {
        type: Object,
        default: {height: '', width: '', length: '', sheet_count: ''}
      },
      rowidx: {
        type: Number,
        default: 0
      },
      processType: {
        type: String,
        default: '开平'
      },
      cb: {
        type: Function,
        required: true
      }
    },
    data () {
      return {
        itemData: {
          '开平': [{
            name: '厚度',
            placeholder: '毫米',
            prop: 'height',
            type: 'number'
          }, {
            name: '宽度',
            placeholder: '毫米',
            prop: 'width',
            type: 'number'
          }, {
            name: '长度',
            placeholder: '毫米',
            prop: 'length',
            type: 'number'
          }, {
            name: '张数',
            placeholder: '张',
            prop: 'sheet_count',
            type: 'number'
          }],
          '镀锌': [{
            name: '品名',
            prop: 'height',
            placeholder: '请输入品名'
          }, {
            name: '规格',
            prop: 'width',
            placeholder: '请输入规格'
          }, {
            name: '长度',
            placeholder: '米',
            prop: 'length',
            type: 'number'
          }, {
            name: '支数',
            placeholder: '支',
            prop: 'sheet_count',
            type: 'number'
          }]
        },
        copyRow: {height: '', width: '', length: '', sheet_count: ''}
      }
    },
    mounted () {
      this.$nextTick(() => {
        if (this.pno) {
          this.copyRow = JSON.parse(JSON.stringify(this.row))
        }
        console.log('pno', this.pno)
      })
    },
    destroyed () {
      this.copyRow = {height: '', width: '', length: '', sheet_count: ''}
    },
    methods: {
      changeInput (e, prop) {
        debugger
        this.copyRow[prop] = e.target.value
        console.log('copyRow', this.copyRow[prop])
        this.$forceUpdate()
      }
    }
  }
</script>
<style lang="stylus" scoped>
.remark-item
  width 50%
.btn-padding
  padding 2px 10px
.title-tag
  width 4px
  height 16px
  background #2485FF
  border-radius 5px  
</style>