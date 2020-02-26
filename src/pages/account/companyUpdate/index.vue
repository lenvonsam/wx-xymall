<template lang="pug">
div
  nav-bar(title="企业认证", isBack, :cb="pageBack")
  .company-fix(:style="{top: customBar + 'px'}")
    .flex.text-center.nav.bg-white.relative
      .tab-line
      .cu-item.flex-sub(v-for="(item,index) in compTab", :class="item.status === tabName?'text-blue cur':''", :key="index", @click="selectTabs(item, index)")
        span {{item.title}}
  div(style="padding-top: 90rpx")
    .margin-top-sm.padding
      .bg-white.border-radius
        .row.padding.border-bottom-line
          .flex-15.row
            .blue-vertical
          .col.text-bold.ft-16 请完善信息
          .flex-100.text-center
            .main-btn.reverse(hover-class="hover-gray", style="font-size:13px;width: 180rpx; height: 60rpx;", @click="backToLogin") 切换账户
        .row.padding.relative(v-for="(part,idx) in partOne", :key="idx")
          .right-bottom-line(v-if="idx < partOne.length - 1")
          .flex-15
            span.text-red(v-if="part.required") *
          .col.row
            .flex-60 {{part.lbl}}
            .col.text-right
              input.text-right(:placeholder="part.placeholder", v-if="part.type== 'text'", v-model="companyInfo[part.key]")
              input.text-right(:placeholder="part.placeholder", v-else-if="part.type== 'number'", v-model="companyInfo[part.key]", type="number")
              input.text-right(:placeholder="part.placeholder", v-else, type="password", v-model="companyInfo[part.key]")
    .margin-top-sm.padding
      .bg-white.border-radius
        .row.padding.border-bottom-line
          .flex-15.row
            .blue-vertical
          .col.text-bold.ft-16 请上传图片
      .bg-white(v-if="tabName=='1'")
        .row.padding.relative.h-50
          .right-bottom-line
          .flex-15
            span.text-red *
          .col.row
            .flex-60 三证合一
            .col
            .flex-30.row(v-if="pic1.length > 0")
              img(:src="imgOuterUrl + '/filepool' + pic1", style="width: 40rpx; height: 60rpx", @click="previewImage(imgOuterUrl + '/filepool' + pic1)")
            .flex-30.row(@click="handlerImage('pic1')")
              img.add-icon(src="/static/images/add_icon.png")
        .row.padding.relative.h-50
          .flex-15
            span.text-red *
          .col.row
            .flex-60 开票资料
            .col.text-right
            .flex-30.row(v-if="pic2.length > 0")
              img(:src="imgOuterUrl + '/filepool' + pic2", style="width: 40rpx; height: 60rpx", @click="previewImage(imgOuterUrl + '/filepool' + pic2)")
            .flex-30.row(@click="handlerImage('pic2')")
              img.add-icon(src="/static/images/add_icon.png")
      .bg-white(v-else)
        .row.padding.relative.h-50
          .right-bottom-line
          .flex-15
            span.text-red *
          .col.row
            .col 营业执照
            .flex-30.row(v-if="pic1.length > 0")
              img(:src="imgOuterUrl + '/filepool' + pic1", style="width: 40rpx; height: 60rpx", @click="previewImage(imgOuterUrl + '/filepool' + pic1)")
            .flex-30.row(@click="handlerImage('pic1')")
              img.add-icon(src="/static/images/add_icon.png")
        .row.padding.relative.h-50
          .right-bottom-line
          .flex-15
            span.text-red *
          .col.row
            .col 开票资料
            .flex-30.row(v-if="pic2.length > 0")
              img(:src="imgOuterUrl + '/filepool' + pic2", style="width: 40rpx; height: 60rpx", @click="previewImage(imgOuterUrl + '/filepool' + pic2)")
            .flex-30.row(@click="handlerImage('pic2')")
              img.add-icon(src="/static/images/add_icon.png")
        .row.padding.relative.h-50
          .right-bottom-line
          .flex-15
            span.text-red *
          .col.row
            .col 税务登记证
            .flex-30.row(v-if="pic3.length > 0")
              img(:src="imgOuterUrl + '/filepool' + pic3", style="width: 40rpx; height: 60rpx", @click="previewImage(imgOuterUrl + '/filepool' + pic3)")
            .flex-30.row(@click="handlerImage('pic3')")
              img.add-icon(src="/static/images/add_icon.png")
        .row.padding.relative.h-50
          .flex-15
            span.text-red *
          .col.row
            .col 组织机构代码证
            .flex-30.row(v-if="pic4.length > 0")
              img(:src="imgOuterUrl + '/filepool' + pic4", style="width: 40rpx; height: 60rpx", @click="previewImage(imgOuterUrl + '/filepool' + pic4)")
            .flex-30.row(@click="handlerImage('pic4')")
              img.add-icon(src="/static/images/add_icon.png")
    .margin-top.padding
      .main-btn(hover-class="hover-gray", @click="clickFinish") 完成
  alert(title="资料提交成功，会在24小时内给您答复", :cb="alertCb", v-model="alertShow")
  invoice-modal(v-model="invoiceModalShow", :cb="invoiceCb")
</template>

<script>
import { mapState, mapActions } from 'vuex'
import invoiceModal from '@/components/InvoiceModal.vue'
export default {
  data () {
    return {
      compTab: [
        { title: '三证合一', status: '1', data: [], isActive: true },
        { title: '三证未合一', status: '2', data: [], isActive: false }
      ],
      tabName: '1',
      companyInfo: {
        // 公司名称
        cust_name: '',
        // 登录密码
        user_pwd: '',
        // 联系人
        linkman: '',
        // 公司电话
        contact_phone: ''
      },
      partOne: [{
        lbl: '公司名称',
        placeholder: '请输入公司名称',
        required: true,
        key: 'cust_name',
        type: 'text'
      }, {
        lbl: '登录密码',
        type: 'pwd',
        placeholder: '请输入6-12位登录密码',
        required: true,
        key: 'user_pwd'
      }, {
        lbl: '联系人名',
        type: 'text',
        placeholder: '请输入联系人',
        required: true,
        key: 'linkman'
      }, {
        lbl: '公司电话',
        required: true,
        type: 'number',
        key: 'contact_phone',
        placeholder: '请输入公司电话'
      }],
      gsdhReg: /^(\d{3,4}-?){0,1}\d{7,8}$/,
      pic1: '',
      pic2: '',
      pic3: '',
      pic4: '',
      canClick: true,
      alertShow: false,
      invoiceModalShow: false,
      currentKey: '',
      // 1 返回首页  2 不做惭怍
      backType: 1,
      // 1 非个人中心来 2 个人中心来
      fromType: 1
    }
  },
  computed: {
    ...mapState({
      customBar: state => state.customBar
    })
  },
  components: {
    invoiceModal
  },
  onShow () {
    if (this.$root.$mp.query.type) this.fromType = Number(this.$root.$mp.query.type)
  },
  onUnload () {
    if (this.backType === 1) {
      this.resetConfig()
      this.tab('/pages/index/main')
    } else {
      this.resetConfig()
    }
  },
  methods: {
    ...mapActions([
      'exitUser'
    ]),
    backToLogin () {
      this.backType = 2
      if (this.fromType === 2) {
        this.redirect('/pages/account/login/main')
      } else {
        this.back()
      }
    },
    invoiceCb () {
      const me = this
      setTimeout(function () {
        me.pickImage(me.currentKey)
      }, 800)
    },
    handlerImage (key) {
      this.currentKey = key
      if (key === 'pic2') {
        this.invoiceModalShow = true
      } else {
        this.pickImage(this.currentKey)
      }
    },
    async pickImage (key) {
      try {
        const imgUrl = await this.ironFileUpload('commInfo')
        this[key] = imgUrl
      } catch (e) {
        this.showMsg(e)
      }
    },
    alertCb () {
      this.resetConfig()
      this.back()
    },
    resetInfo () {
      this.companyInfo = {
        // 公司名称
        cust_name: '',
        // 登录密码
        user_pwd: '',
        // 联系人
        linkman: '',
        // 公司电话
        contact_phone: ''
      }
    },
    resetConfig () {
      this.resetInfo()
      this.pic1 = ''
      this.pic2 = ''
      this.pic3 = ''
      this.pic4 = ''
      this.tabName = '1'
      this.backType = 1
      this.fromType = 1
      this.canClick = true
      this.alertShow = false
    },
    pageBack () {
      this.resetConfig()
      this.tab('/pages/index/main')
    },
    selectTabs (item) {
      this.tabName = item.status
      this.resetInfo()
      this.alertShow = false
      this.canClick = true
      this.pic1 = ''
      this.pic2 = ''
      this.pic3 = ''
      this.pic4 = ''
    },
    clickFinish () {
      if (this.validatePartOne()) {
        this.canHttp = true
        // 校验电话
        if (!this.gsdhReg.test(this.companyInfo.contact_phone)) {
          this.showMsg('请输入正确电话号码')
          return
        }
        if (this.companyInfo.user_pwd.length > 0 && !this.pwdReg.test(this.companyInfo.user_pwd)) {
          this.showMsg('请输入6-12位密码，只能是数字、字母和下划线')
          return
        }
        if (this.tabName === '1') {
          if (this.pic1.length === 0) {
            this.showMsg('三证合一不能为空')
            this.canHttp = false
          }
          if (this.pic2.length === 0) {
            this.showMsg('开票资料不能为空')
            this.canHttp = false
          }
        } else {
          if (this.pic1.length === 0 || this.pic2.length === 0 || this.pic3.length === 0 || this.pic4.length === 0) {
            this.showMsg('图片资料不能为空')
            this.canHttp = false
          }
        }
        if (this.canHttp && this.canClick) {
          this.canClick = false
          this.remoteUpdateCompany()
        }
      }
    },
    async remoteUpdateCompany () {
      try {
        if (this.tabName === '1') {
          this.companyInfo.license_pic = this.pic1
          this.companyInfo.invoice_pic = this.pic2
        } else {
          this.companyInfo.license_pic = this.pic1
          this.companyInfo.invoice_pic = this.pic2
          this.companyInfo.tax_pic = this.pic3
          this.companyInfo.orga_pic = this.pic4
        }
        this.companyInfo.user_pwd = this.base64Str(this.companyInfo.user_pwd)
        await this.ironRequest(this.apiList.xy.companyUpdate.url, this.companyInfo, this.apiList.xy.companyUpdate.method)
        this.exitUser()
        this.alertShow = true
      } catch (e) {
        this.canClick = true
        this.showMsg(e)
      }
    },
    validatePartOne () {
      let result = true
      for (var i = 0; i < this.partOne.length; i++) {
        var item = this.partOne[i]
        if (item.required && this.companyInfo[item.key].length === 0) {
          this.showMsg('请完善信息，不能为空')
          result = false
          break
        }
      }
      return result
    }
  }
}
</script>

<style lang="stylus" scoped>
.nav
  .tab-line
    display block
    content ''
    height 25px
    width 2px
    position absolute
    left 50%
    margin-left -1px
    top 10px
    background #e6e6e6
.nav .cu-item.cur
  border-bottom none
  position relative
  &:after
    display block
    content ''
    width 26px
    height 2px
    background #0081ff
    position absolute
    bottom 0
    left 50%
    margin-left -13px
.blue-vertical
  display inline-block
  height 15px
  width 3.5px
  background #2485FF
  border-radius 1.75px
.h-50
  height 50px
.add-icon
  width 17px
  height 17px
.right-bottom-line
  position absolute
  left 20px
  bottom 0px
  right 0px
  height 0.5px
  border 0.5px solid #ddd
.company-fix
  position fixed
  height 45px
  left 0
  right 0
  z-index 50
</style>
