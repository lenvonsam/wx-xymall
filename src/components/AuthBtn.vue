<template lang="pug">
.auth-btn-wrap(@click="getCode")
  .auth-btn {{btnTxt}}
</template>

<script>
const codeTypeMapping = {
  '-1': 0, // 通用
  1: 2, // 短信注册
  2: 3, // 短信登录
  3: 1, // 忘记密码
  4: 6, // 修改登录密码
  5: 5, // 修改支付密码
  6: 4, // 修改手机号（原手机）
  7: 2 // 修改手机号（新手机）
}
export default {
  props: {
    phone: {
      type: String,
      required: true
    },
    codeType: {
      type: Number,
      required: false,
      default: -1
      // 2021-03-22 重新定义
      // 1短信注册 2短信登录 3忘记密码 4修改登录密码 5修改支付密码 6修改手机号（原手机） 7修改手机号（新手机） -1 通用
    },
    timeCount: {
      type: Number,
      required: false,
      default: 90
    },
    cb: {
      default: false
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
      // console.log('phone val', this.phone)
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
      const codeType = codeTypeMapping[this.codeType]
      if (typeof codeType === 'undefined') {
        this.showErrMsg('验证码类型错误')
        return
      }
      if (this.canGetCode) {
        this.canGetCode = false
        const me = this
        this.httpGet(me.apiList.zf.getSmsVerifyCode + '?phone=' + me.phone + '&type=' + codeType, {}).then((resp) => {
        // this.ironRequest(this.apiList.xy.captcha.url + '?user_phone=' + this.phone + (this.codeType === -1 ? '' : '&type=' + this.codeType), {}, this.apiList.xy.captcha.method).then((resp) => {
          me.timeDown()
          // props 回调函数cb
          if (me.cb) me.cb(resp)
        }).catch((e) => {
          if (me.cb) {
            me.timeDown()
            me.cb(e)
          } else {
            me.showErrMsg(e.message)
          }
        })
      }
    },
    // 倒计时
    timeDown () {
      const me = this
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
    },
    // 验证码类型错误错误提示
    showErrMsg (errMsg) {
      this.clearTime()
      this.btnTxt = '获取验证码'
      this.canGetCode = true
      this.showMsg(errMsg)
    },
    // 清除定时器
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
.auth-btn-wrap {
  height: 22px;
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.auth-btn {
  display: inline-block;
  width: 70px;
  height: 16px;
  font-size: 13px;
  color: #888;
}
</style>
