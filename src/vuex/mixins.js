import apiList from '../utils/apiList'
import httpUtil from '../utils/httpUtil'
import UTF8 from 'utf8'
import BASE64 from 'base-64'
import { mapState } from 'vuex'
function formatNumber (n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const wxMixins = {
  data () {
    return {
      apiList,
      pageSize: 10,
      imgProxy: 'http://xymobile.xingyun361.com/',
      // 型云图片访问地址
      // imgOuterUrl: 'http://web-test.xingyun361.com',
      // imgOuterUrl: 'http://xyweb-pro.xingyun361.com',
      imgOuterUrl: 'https://www.xingyun361.com',
      phoneReg: /^1[3-9]\d{9}$/,
      // 6-12为字母数字下划线
      pwdReg: /^[\w]{6,12}$/,
      erpProxy: httpUtil.proxy.erp,
      warehouseProxy: httpUtil.proxy.wh,
      crmProxy: httpUtil.proxy.crm,
      aboutUsInfo:
        '<p><span style="font-size: 12px;"></span><span style="font-size: 12px;"></span><span style="font-size: 11px;"><span style="font-size: 12px;">&nbsp; &nbsp; &nbsp; 江苏智恒达型云网络科技有限公司创建于2015年11月，隶属于江苏智恒达投资集团有限公司，坐落于长三角中心城市—江苏常州，依托华东地区特大的实体钢贸资源，型云网络科技有限公司紧抓行业内的用户痛点，以型钢为切入点，打通钢铁交易环节中所有的壁垒，把上游钢厂-在线交易-支付结算-仓储加工-物流运输-供应链金融-大数据信息进行了整合贯通，真正为客户提供更全面、更高效、更便捷、成本更低的服务。</span></span><br><span style="font-size: 12px;">&nbsp; &nbsp; &nbsp; 型云是互联网思维与线下钢贸经验的结晶，是依托于实体的大宗电商变革者，为用户提供集在线交易、供应链金融、支付结算、仓储加工、物流配送于一体的增值服务，是云端之上的钢铁全产业链生态圈。</span><br><span style="font-size: 12px;">&nbsp; &nbsp; &nbsp; 我们本着“四更”的服务宗旨，建设买卖双方市场真正的良性闭环，让钢铁大宗借互联网之风在云端腾飞！</span><br><span style="font-size: 12px;">&nbsp; &nbsp; &nbsp; 智恒达集团是一家拥有20年历史的大型钢铁贸易集团，自备及在建大型室内库4万余平方米，现货库存5万余吨，在途资源4万余吨，为马鞍山钢铁集团、山东莱芜钢铁集团、首钢长治钢铁集团、河北津西钢铁集团、日照钢铁集团、河北邯郸钢铁在江苏及常州的区域总代理。整个销售网络早已覆盖苏皖地区80多个县级以上城市，辐射全国，是华东地区特大钢铁集散中心。</span><span style="font-size: 12px;"></span><span style="font-size: 12px;"></span><br></p>'
    }
  },
  computed: {
    ...mapState({
      screenWidth: state => state.screenWidth,
      screenHeight: state => state.screenHeight,
      currentUser: state => state.user.currentUser,
      isLogin: state => state.user.isLogin,
      customBar: state => state.customBar
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
    back (step = 1) {
      mpvue.navigateBack({
        delta: step
      })
    },
    toHome () {
      mpvue.switchTab({ url: '/pages/index/main' })
    },
    redirect (url) {
      mpvue.redirectTo({
        url: url
      })
    },
    showLoading () {
      mpvue.showLoading({
        title: '加载中…',
        mask: true
      })
    },
    hideLoading () {
      mpvue.hideLoading()
    },
    whiteStatusBar () {
      mpvue.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#ffffff'
      })
    },
    tabDot (text, index = 2) {
      if (Number(text) > 0) {
        mpvue.setTabBarBadge({
          index,
          text: text.toString()
        })
      } else {
        mpvue.removeTabBarBadge({
          index
        })
      }
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
          // return preNum.toFixed(3)
          return this.$toFixed(preNum, 3)
        } else {
          return str
        }
      }
    },
    mobileReg (mobile) {
      var reg = /^1[3|4|5|8|7|9][0-9]\d{4,8}$/
      return reg.test(mobile)
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
    // 设置购物车数量
    async setCartCount (userId) {
      try {
        let url = `${this.apiList.xy.cartListCount.url}?user_id=${userId}`
        if (this.currentUser.type === 'seller') {
          url += `&data_source=1`
        }
        const data = await this.ironRequest(
          url,
          {},
          this.apiList.xy.cartListCount.method
        )
        if (data.cart_list_count > 0) {
          mpvue.setTabBarBadge({
            index: 2,
            text: data.cart_list_count.toString()
          })
        } else {
          mpvue.removeTabBarBadge({
            index: 2
          })
        }
      } catch (e) {
        mpvue.removeTabBarBadge({
          index: 2
        })
      }
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
                  msg: '处理成功',
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
          // let mwId = 2
          // if (val.weight.split('/').length === 1) {
          //   if (val.weight.indexOf('16理') > 0) {
          //     mwId = 3
          //   } else if (val.weight.indexOf('磅') > 0) {
          //     mwId = 1
          //   }
          // }
          let url = this.apiList.xy.addCart.url
          if (this.currentUser.type === 'seller') {
            // 卖家
            url = this.apiList.xy.addCartSeller.url
          }
          this.ironRequest(
            url,
            {
              user_id: userId,
              product_id: val.id,
              count: 1,
              measure_way: val.wayId
            },
            'post'
          ).then(
            resp => {
              if (resp.returncode === '0') {
                resolve({
                  type,
                  msg: '加入购物车成功',
                  mway: val.wayId
                })
              } else {
                reject(new Error(resp.errormsg))
              }
            },
            err => {
              reject(err || new Error('网络异常'))
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
          one = this.$toFixed(
            parseFloat(opt.att14) *
              parseFloat(opt.att8) *
              (1 - parseFloat(opt.att12)) *
              1.05,
            6
          )
          // 当物资是【花纹板187】【普碳开平板185】【低合金开平板186】【碳钢板278】【普板253】【中板280】【低合金中板211】的时候计算公式：板材磅重计算公式=米重*长度*105%
          if (
            opt.goods_id === 187 ||
            opt.goods_id === 185 ||
            opt.goods_id === 186 ||
            opt.goods_id === 278 ||
            opt.goods_id === 253 ||
            opt.goods_id === 280 ||
            opt.goods_id === 211
          ) {
            // 型云板材上浮5%改为2% --0617 zm
            one = this.$toFixed(
              parseFloat(opt.att14) * parseFloat(opt.att8) * 1.02,
              6
            )
          }
          break
        case 2:
          one = this.$toFixed(parseFloat(opt.att14) * parseFloat(opt.att8), 6)
          break
        case 3:
          one = this.$toFixed(parseFloat(opt.att14) * parseFloat(opt.att9), 6)
          break
        case 4:
          one = this.$toFixed(parseFloat(opt.att14) * parseFloat(opt.att10), 6)
          break
        default:
          one = 0
          break
      }
      if (
        opt.goods_id === 183 ||
        opt.goods_id === 188 ||
        opt.goods_id === 226 ||
        opt.goods_id === 184
      ) {
        one = opt.juanban
      }
      weight = one * parseFloat(opt.amount)
      weight = this.$toFixed(weight, 3)

      price = weight * parseFloat(opt.price)
      price = this.$toFixed(price, 2)

      return { one: one, weight: Number(weight), price: Number(price) }
    },
    date2Str (date) {
      if (date) {
        let n = date
        if (typeof date === 'number') {
          n = new Date(date)
        }
        const years = n.getFullYear()
        const month = n.getMonth() + 1
        const day = n.getDate()
        return [years, month, day].map(formatNumber).join('-')
      } else {
        return ''
      }
    },
    date2Time (date) {
      if (date) {
        let n = date
        if (typeof date === 'number') {
          n = new Date(date)
        }
        const years = n.getFullYear()
        const month = n.getMonth() + 1
        const day = n.getDate()
        const hours = n.getHours()
        const mins = n.getMinutes()
        const secs = n.getSeconds()
        return (
          [years, month, day].map(formatNumber).join('-') +
          ' ' +
          [hours, mins, secs].map(formatNumber).join(':')
        )
      } else {
        return ''
      }
    },
    validateNull (arr, context) {
      let result = true
      for (let i = 0; i < arr.length; i++) {
        let item = arr[i]
        let val = context[item]
        if (val.toString().trim().length === 0) {
          this.showMsg('必填字段不能为空')
          result = false
          break
        }
      }
      return result
    },
    $toFixed (s, d) {
      // const m = Math.pow(10, d)
      // s = Math.round(s * m, 10) / m
      s = this.formatFloat(s, d)
      s = s + ''
      if (!d) d = 0
      if (s.indexOf('.') === -1) s += '.'
      s += new Array(d + 1).join('0')
      if (
        new RegExp('^(-|\\+)?(\\d+(\\.\\d{0,' + (d + 1) + '})?)\\d*$').test(s)
      ) {
        let s = '0' + RegExp.$2
        let pm = RegExp.$1
        let a = RegExp.$3.length
        let b = true
        if (a === d + 2) {
          a = s.match(/\d/g)
          if (parseInt(a[a.length - 1]) > 4) {
            for (var i = a.length - 2; i >= 0; i--) {
              a[i] = parseInt(a[i]) + 1
              if (a[i] === 10) {
                a[i] = 0
                b = i !== 1
              } else break
            }
          }
          s = a
            .join('')
            .replace(new RegExp('(\\d+)(\\d{' + d + '})\\d$'), '$1.$2')
        }
        if (b) s = s.substr(1)
        return (pm + s).replace(/\.$/, '')
      }
      return s + ''
    },
    formatFloat (f, digit) {
      // 转换和处理函数
      let num = 0
      const m = Math.pow(10, digit)
      if (f * m > 0) {
        num = f * m + 0.00000001 // 为了处理类似1.99999999994之类的为题
      } else if (f * m < 0) {
        num = f * m - 0.00000001 // 为了处理类似-1.99999999994之类的为题
      }
      return Math.round(num, 10) / m
    },
    numberFormat (val) {
      const numStr = val.toString()
      const idx = numStr.indexOf('.') + 1
      return Number(
        numStr.substr(0, idx) + numStr.substr(idx).replace(/\./g, '')
      )
    }
  }
}

export default wxMixins
