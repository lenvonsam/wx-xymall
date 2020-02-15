import apiList from '../utils/apiList'
import httpUtil from '../utils/httpUtil'
import UTF8 from 'utf8'
import BASE64 from 'base-64'

const wxMixins = {
  data () {
    return {
      apiList,
      pageSize: 10,
      imgProxy: 'http://xymobile.xingyun361.com/',
      // 型云图片访问地址
      imgOuterUrl: 'http://web-test.xingyun361.com',
      phoneReg: /^1[3|4|5|8|7|9][0-9]\d{4,8}$/,
      erpProxy: httpUtil.proxy.erp,
      warehouseProxy: httpUtil.proxy.wh
    }
  },
  methods: {
    statisticRequest: httpUtil.statisticRequest,
    ironRequest: httpUtil.ironRequest,
    request: httpUtil.request,
    requestDecode: httpUtil.requestDecode,
    zgRequest: httpUtil.zgRequest,
    jump (url) {
      mpvue.navigateTo({
        url: url
      })
    },
    back () {
      mpvue.navigateBack(-1)
    },
    toHome () {
      mpvue.reLaunch('/pages/index/main')
    },
    redirect (url) {
      mpvue.redirectTo({
        url: url
      })
    },
    tab (url) {
      mpvue.switchTab({
        url: url
      })
    },
    makeCall (phone) {
      mpvue.makePhoneCall({
        phoneNumber: phone
      })
    },
    previewImage (url, urlist) {
      mpvue.previewImage({
        current: url,
        urls: urlist
      })
    },
    copyText (text) {
      mpvue.setClipboardData({
        data: text
      })
    },
    showMsg (msg, type = 'none', duration = 3000) {
      mpvue.showToast({
        title: msg,
        icon: type,
        duration
      })
    },
    confirm (config) {
      return new Promise((resolve, reject) => {
        mpvue.showModal({
          title: config.title || '友情提示',
          content: config.content || '',
          confirmColor: config.confirmColor || '#000',
          cancelColor: config.cancelColor || '#000',
          success (res) {
            if (res.confirm) {
              resolve('confirm')
            } else if (res.cancel) {
              resolve('cancel')
            }
          }
        })
      })
    },
    formatNum (n) {
      return Number(n) < 10 ? '0' + n : n + ''
    },
    // 随机数 0-9
    randomInteger () {
      return Math.floor(Math.random() * 10)
    },
    maskIdCard (cardno) {
      return cardno.substring(0, 4) + '**********' + cardno.substring(14)
    },
    maskPhone (phone) {
      return phone.substring(0, 2) + '*****' + phone.substring(9)
    },
    formatWeight (val) {
      let w = Number(val)
      if (isNaN(w)) {
        return '0'
      } else {
        let str = w.toString()
        let dotStr = str.substring(str.indexOf('.'))
        if (dotStr.length > 4) {
          let lastNum = Number(
            str.substring(str.indexOf('.') + 4, str.indexOf('.') + 5)
          )
          let preNum = Number(str.substring(0, str.indexOf('.') + 4))
          if (lastNum >= 5) preNum += 0.001
          return preNum.toFixed(3)
        } else {
          return str
        }
      }
    },
    // 节流
    throttle (func, delay = 100) {
      let timer = null
      return (function () {
        if (timer) return
        timer = setTimeout(function () {
          func.apply(this, arguments)
          timer = null
        }, delay)
      })()
    },
    // 一维数组装成二维数组
    arr2DoubleArr (array, full = true, cols = 3) {
      let row = Math.ceil(array.length / cols)
      let doubleArr = []
      for (let i = 0; i < row; i++) {
        let tempRow = []
        for (let j = i * cols; j < (i + 1) * cols; j++) {
          if (j < array.length) {
            tempRow.push(array[j])
          } else {
            if (full) tempRow.push('')
          }
        }
        doubleArr.push(tempRow)
      }
      return doubleArr
    },
    // base64加密
    base64Str (str) {
      const bytes = UTF8.encode(str)
      return BASE64.encode(bytes)
    },
    addCart (val, type, userId) {
      return new Promise((resolve, reject) => {
        if (type === 'notice') {
          this.ironRequest('arrivalNotice.shtml', {
            user_id: userId,
            order_id: val.id
          }, 'post').then(resp => {
            if (resp.returncode === '0') {
              resolve({
                msg: '到货通知设置成功',
                type: type
              })
            } else {
              reject(new Error(resp.errormsg))
            }
          }, err => {
            console.log(err.message)
            reject(new Error('网络异常'))
          })
        } else {
          let mwId = 2
          if (val.weight.split('/').length === 1) {
            if (val.weight.indexOf('16理') > 0) {
              mwId = 3
            } else if (val.weight.indexOf('磅') > 0) {
              mwId = 1
            }
          }
          this.ironRequest('addCart.shtml', {
            user_id: userId,
            product_id: val.id,
            count: 1,
            measure_way: mwId
          }, 'post').then(resp => {
            if (resp.returncode === '0') {
              resolve({
                type,
                mway: mwId
              })
            } else {
              reject(new Error(resp.errormsg))
            }
          }, err => {
            console.log(err.message)
            reject(new Error('网络异常'))
          })
        }
      })
    },
    zgEventStatic (userObj, eventName, eventParams) {
      let time = parseInt(new Date().getTime() / 1000) + ''
      let platform = this.mobileVersion()
      return {
        ts: time,
        cuid: userObj.nickname,
        ak: 'd25bd4937c9444d6bd7817cec2bd8d24',
        sdk: platform,
        debug: 1,
        data: [{
          et: 'cus',
          eid: eventName,
          ts: time,
          pr: eventParams
        }]
      }
    }
  }
}

export default wxMixins
