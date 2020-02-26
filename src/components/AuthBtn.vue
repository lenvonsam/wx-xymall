<template lang="pug">
.auth-btn(@click="getCode") {{btnTxt}}
</template>

<script>
export default {
  props: {
    phone: {
      type: String,
      required: true
    },
    codeType: {
      type: Number,
      required: false,
      default: 1 // 1注册 2忘记密码 3修改手机号（原手机） 4 修改手机号（新手机）5 登录密码 6支付 7手机号登录
    },
    timeCount: {
      type: Number,
      required: false,
      default: 60
    }
  },
  data () {
    return {
      btnTxt: '发送验证码',
      canGetCode: true,
      timeInterval: null
    }
  },
  beforeMount () {
    this.clearTime()
    this.canGetCode = true
    this.btnTxt = '发送验证码'
  },
  methods: {
    getCode () {
      console.log('phone val', this.phone)
      if (this.phone.trim().length === 0) {
        this.showMsg('手机号不能为空')
        return
      }
      if (this.phone.trim().length !== 11) {
        this.showMsg('手机号位数不正确')
        return
      }
      if (!this.phoneReg.test(this.phone)) {
        this.showMsg('请输入正确的手机号')
        return
      }
      if (this.canGetCode) {
        this.canGetCode = false
        const me = this
        this.ironRequest(this.apiList.xy.captcha.url + '?user_phone=' + this.phone + '&type=' + this.codeType, {}, this.apiList.xy.captcha.method).then((resp) => {
          let timeTxt = me.timeCount
          me.timeInterval = setInterval(() => {
            if (timeTxt > 0) {
              me.btnTxt = `${timeTxt}s后重发`
              timeTxt--
            } else {
              me.btnTxt = '重新获取'
              me.clearTime()
              me.canGetCode = true
            }
          }, 1000)
        }).catch((e) => {
          me.showErrMsg(e)
        })
      }
    },
    showErrMsg (errMsg) {
      this.clearTime()
      this.btnTxt = '获取验证码'
      this.canGetCode = true
      this.showMsg(errMsg)
    },
    clearTime () {
      if (this.timeInterval) {
        clearInterval(this.timeInterval)
      }
    }
  },
  beforeDestroy () {
    this.clearTime()
  }
}
</script>

<style scoped>
.auth-btn {
  display: inline-block;
  width: 70px;
  height: 16px;
  font-size: 13px;
  color: #888;
}
</style>
