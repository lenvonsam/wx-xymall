<template lang="pug">
div
  nav-bar(title="公司信息", isBack)
  div(v-if="isload")
    .border-bottom-line(v-for="(item,idx) in compInfo", :key="idx")
      .bg-white(:class="{'margin-top-sm': idx == 1 && sidx == 0}", v-if="idx<2", v-for="(subItem,sidx) in item", :key="sidx")
        .row.padding-sm.padding-lr(:class="{'pt-0': sidx > 0}")
          .col.flex-100 {{subItem.label}}
          .col.text-right {{compObj[subItem.content]}}
      div(v-if="idx==2")
        template(v-if="compObj['three_in_one'] == 1")
          .bg-white.margin-top-sm
            .text-left.padding-sm.padding-lr(style="flex-direction:column;align-items:flex-start;")
              .col.padding-sm
                span 三证合一
              .col.full-width.margin-top-sm
                img.comp-img(:src="imgOuterUrl + compObj.license_pic", v-if="compObj.license_pic", @click="previewImage(imgOuterUrl + compObj.license_pic)")
          .bg-white.margin-top-sm
            .text-left.padding-sm.padding-lr(style="flex-direction:column;align-items:flex-start;")
              .col.padding-sm
                span 开票资料
              .col.full-width.margin-top-sm
                img.comp-img(:src="imgOuterUrl + compObj.invoice_pic", v-if="compObj.invoice_pic", @click="previewImage(imgOuterUrl + compObj.invoice_pic)")
        template(v-else)
          .bg-white.margin-top-sm(v-for="(subItem,tidx) in item", :key="tidx")
            .text-left.padding-sm.padding-lr(style="flex-direction:column;align-items:flex-start;")
              .col.padding-sm.padding-lr
                span {{subItem.label}}
              .col.margin-top-sm.full-width
                img.comp-img(:src="imgOuterUrl + compObj[subItem.content]", v-if="imgOuterUrl", @click="previewImage(imgOuterUrl + compObj[subItem.content])")
  time-line(v-else, type="mainres")
</template>

<script>
export default {
  data () {
    return {
      isload: false,
      compObj: {},
      compInfo: [[{
        label: '公司名称',
        content: 'cust_name'
      }, {
        label: '公司地址',
        content: 'address'
      }, {
        label: '公司联系人',
        content: 'linkman'
      }, {
        label: '公司电话',
        content: 'contact_phone'
      }], [{
        label: '开户名称',
        content: 'ac_name'
      }, {
        label: '开户银行',
        content: 'bank'
      }, {
        label: '银行账户',
        content: 'ac_number'
      }, {
        label: '税号',
        content: 'license'
      }], [{
        label: '营业执照',
        content: 'license_pic'
      }, {
        label: '税务登记证',
        content: 'tax_pic'
      }, {
        label: '组织机构代码证',
        content: 'orga_pic'
      }, {
        label: '开票资料',
        content: 'invoice_pic'
      }]]
    }
  },
  onShow () {
    this.remoteCompanyInfo()
  },
  methods: {
    async remoteCompanyInfo () {
      try {
        this.isload = false
        this.compObj = await this.ironRequest(this.apiList.xy.companyInfo.url + '?user_id=' + this.currentUser.user_id, {}, this.apiList.xy.companyInfo.method)
        this.isload = true
      } catch (e) {
        this.showMsg(e)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.comp-img
  width 100%
  /* height: 250px; */
  object-position center
  object-fit cover
</style>

