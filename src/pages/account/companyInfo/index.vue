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
        template(v-if="compObj['isThreeCertificatesInOne']")
          .bg-white.margin-top-sm
            .text-left.padding-sm.padding-lr(style="flex-direction:column;align-items:flex-start;")
              .col.padding-sm
                span 三证合一
              .col.full-width.margin-top-sm
                img.comp-img(:src="compObj.businessLicense", v-if="compObj.businessLicense", @click="previewImage(compObj.businessLicense)", mode="widthFix")
          .bg-white.margin-top-sm
            .text-left.padding-sm.padding-lr(style="flex-direction:column;align-items:flex-start;")
              .col.padding-sm
                span 开票资料
              .col.full-width.margin-top-sm
                img.comp-img(:src="compObj.invoiceInformation", v-if="compObj.invoiceInformation", @click="previewImage(compObj.invoiceInformation)", mode="widthFix")
        template(v-else)
          .bg-white.margin-top-sm(v-for="(subItem,tidx) in item", :key="tidx")
            .text-left.padding-sm.padding-lr(style="flex-direction:column;align-items:flex-start;")
              .col.padding-sm.padding-lr
                span {{subItem.label}}
              .col.margin-top-sm.full-width
                img.comp-img(:src="compObj[subItem.content]", v-if="imgOuterUrl", @click="previewImage(compObj[subItem.content])", mode="widthFix")
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
        content: 'unitRegisterName'
      }, {
        label: '公司地址',
        content: 'unitRegisterAddress'
      }, {
        label: '公司联系人',
        content: 'unitRegisterContacts'
      }, {
        label: '公司电话',
        content: 'unitRegisterContactsPhone'
      }], [{
        label: '开户名称',
        content: 'bankRegisterName'
      }, {
        label: '开户银行',
        content: 'bankName'
      }, {
        label: '银行账户',
        content: 'bankAccount'
      }, {
        label: '税号',
        content: 'taxNo'
      }], [{
        label: '营业执照',
        content: 'businessLicense'
      }, {
        label: '税务登记证',
        content: 'taxRegistrationCertificate'
      }, {
        label: '组织机构代码证',
        content: 'organizationCodeCertificate'
      }, {
        label: '开票资料',
        content: 'invoiceInformation'
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
        let res = await this.httpPost(this.apiList.zf.selectCompanyInfo)
        this.compObj = res.data
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

