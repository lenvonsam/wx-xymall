import apiList from '../utils/apiList'
import httpUtil from '../utils/httpUtil'
import UTF8 from 'utf8'
import BASE64 from 'base-64'
import { mapState } from 'vuex'

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
  computed: {
    ...mapState({
      screenWidth: state => state.screenWidth
    })
  },
  methods: {
    statisticRequest: httpUtil.statisticRequest,
    ironRequest: httpUtil.ironRequest,
    request: httpUtil.request,
    requestDecode: httpUtil.requestDecode,
    zgRequest: httpUtil.zgRequest,
    ironFileUpload: httpUtil.ironFileUpload,
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
    previewImage (url, urlist = [url]) {
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
          this.ironRequest(
            'arrivalNotice.shtml',
            {
              user_id: userId,
              order_id: val.id
            },
            'post'
          ).then(
            resp => {
              if (resp.returncode === '0') {
                resolve({
                  msg: '到货通知设置成功',
                  type: type
                })
              } else {
                reject(new Error(resp.errormsg))
              }
            },
            err => {
              console.log(err.message)
              reject(new Error('网络异常'))
            }
          )
        } else {
          let mwId = 2
          if (val.weight.split('/').length === 1) {
            if (val.weight.indexOf('16理') > 0) {
              mwId = 3
            } else if (val.weight.indexOf('磅') > 0) {
              mwId = 1
            }
          }
          this.ironRequest(
            'addCart.shtml',
            {
              user_id: userId,
              product_id: val.id,
              count: 1,
              measure_way: mwId
            },
            'post'
          ).then(
            resp => {
              if (resp.returncode === '0') {
                resolve({
                  type,
                  mway: mwId
                })
              } else {
                reject(new Error(resp.errormsg))
              }
            },
            err => {
              console.log(err.message)
              reject(new Error('网络异常'))
            }
          )
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
        data: [
          {
            et: 'cus',
            eid: eventName,
            ts: time,
            pr: eventParams
          }
        ]
      }
    },
    getRpx (px) {
      console.log('getRpx', this.screenWidth)
      debugger
      return px * 750 / this.screenWidth
    },
    calc (options) {
      /**
       * 统一计算价格、重量
       * options:{
       *   type        计重方式 1:磅计 2:理计 3:16理计 4:10理计
       *   att8        米重
       *   att9        16理重
       *   att10       10理重
       *   att14       长度
       *   att12       公差
       *   price       单价
       *   amount      数量
       * }
       */
      var opt = {
        type: 0,
        att8: 0,
        att9: 0,
        att10: 0,
        att14: 0,
        att12: 0,
        price: 1,
        amount: 1,
        goods_id: 0,
        juanban: 0
      }
      Object.assign(opt, options)
      let one = 0
      let weight = 0
      let price = 0
      switch (opt.type) {
        case 1:
          one = (parseFloat(opt.att14) * parseFloat(opt.att8) * (1 - parseFloat(opt.att12)) * 1.05).toFixed(6)
          // 当物资是【花纹板187】【普碳开平板185】【低合金开平板186】【碳钢板278】【普板253】【中板280】【低合金中板211】的时候计算公式：板材磅重计算公式=米重*长度*105%
          if (opt.goods_id === 187 || opt.goods_id === 185 || opt.goods_id === 186 || opt.goods_id === 278 || opt.goods_id === 253 || opt.goods_id === 280 || opt.goods_id === 211) {
            // 型云板材上浮5%改为2% --0617 zm
            one = (parseFloat(opt.att14) * parseFloat(opt.att8) * 1.02).toFixed(6)
          }
          break
        case 2:
          one = (parseFloat(opt.att14) * parseFloat(opt.att8)).toFixed(6)
          break
        case 3:
          one = (parseFloat(opt.att14) * parseFloat(opt.att9)).toFixed(6)
          break
        case 4:
          one = (parseFloat(opt.att14) * parseFloat(opt.att10)).toFixed(6)
          break
        default:
          one = 0
          break
      }
      if (opt.goods_id === 183 || opt.goods_id === 188 || opt.goods_id === 226 || opt.goods_id === 184) {
        one = opt.juanban
      }
      weight = one * parseFloat(opt.amount)
      weight = weight.toFixed(3)

      price = weight * parseFloat(opt.price)
      price = price.toFixed(2)

      return { one: one, weight: Number(weight), price: Number(price) }
    }
  }
}

export default wxMixins
