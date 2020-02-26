<template lang="pug">
div
  nav-bar(title="发布求购", isBack)
  .bg-white.padding-sm
    .row.solid-bottom.padding
      .title
        span.text-red * 
        span.padding-left-xs 品名
      .col.text-right.padding-left-xs
        input(type="text", placeholder="请输入品名", v-model="name")
    .row.solid-bottom.padding
      .title    
        span.padding-left-xs 材质
      .col.text-right.padding-left-xs
        input(type="text", placeholder="请输入材质", v-model="material")
    .row.solid-bottom.padding
      .title    
        span.padding-left-xs 产地
      .col.text-right.padding-left-xs
        input(type="text", placeholder="请输入产地", v-model="supply")  
    .row.solid-bottom.padding
      .title    
        span.padding-left-xs 规格
      .col.text-right.padding-left-xs
        input(type="text", placeholder="请输入规格", v-model="standard")
    .row.solid-bottom.padding
      .title    
        span.text-red *
        span.padding-left-xs 联系电话
      .col.text-right.padding-left-xs
        input(type="text", placeholder="请输入联系电话", v-model="phone")
    .row.solid-bottom.padding
      .title    
        span.padding-left-xs 特殊要求
      .col.text-right.padding-left-xs
        input(type="text", placeholder="请输入规格", v-model="demand")              
  .bottom-footer.bg-white.padding-sm
    .main-btn(@click="createAskPay") 提交
</template>

<script>
export default {
  data () {
    return {
      btnDisable: false,
      name: '',
      material: '',
      supply: '',
      standard: '',
      phone: '',
      demand: ''
    }
  },
  onUnload () {
    this.name = ''
    this.material = ''
    this.supply = ''
    this.standard = ''
    this.phone = ''
    this.demand = ''
  },
  methods: {
    createAskPay () {
      const keys = ['name', 'phone']
      if (this.validateNull(keys)) {
        let nameReg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/
        if (!nameReg.test(this.name.toString().trim())) {
          this.showMsg('品名不能包含特殊字符')
          return
        }
        if (!this.mobileReg(this.phone.toString().trim())) {
          this.showMsg('请输入正确的手机号')
          return
        }
        if (!this.btnDisable) {
          this.btnDisable = true
          const me = this
          this.ironRequest('needBuy.shtml', { user_id: this.currentUser.user_id, name: this.name, material: this.material, supply: this.supply, standard: this.standard, contact_no: this.phone, remark: this.demand }, 'post').then(resp => {
            if (resp && resp.returncode === '0') {
              this.showMsg('求购发布成功')
              setTimeout(() => {
                me.btnDisable = false
                me.back()
              }, 3000)
            } else {
              this.showMsg(resp === undefined ? '网络异常' : resp.errormsg)
              this.btnDisable = false
            }
          })
        }
      }
    }
  }
}
</script>
