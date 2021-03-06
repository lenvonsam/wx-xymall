import UTF8 from 'utf8'
import BASE64 from 'base-64'
const BASICURL = 'https://mobileapp.xingyun361.com/quasarserverdev' // 测试环境地址
// const BASICURL = 'https://mobileapp.xingyun361.com/quasarserverstage' // 预上线环境地址
// const BASICURL = 'https://mobileapp.xingyun361.com/quasarserver'
// const BASICURL = 'https://47.97.195.16/quasarserver'
// const BASICURL = 'http://localhost:8077'
const PROXYDCODEURL = BASICURL + '/common/proxyDecode'
const COMMURL = BASICURL + '/common/proxy'

function serializeformQuery (requestParams, encodeUrl = false) {
  let query = ''
  for (let param in requestParams) {
    if (param !== undefined && param !== '') {
      query +=
        param +
        '=' +
        (encodeUrl
          ? encodeURIComponent(requestParams[param])
          : requestParams[param]) +
        '&'
    }
  }
  if (query !== '') {
    query = query.substring(0, query.length - 1)
  }
  return query
}

function showMsg (msg) {
  mpvue.showToast({
    title: msg,
    icon: 'none',
    duration: 2500
  })
}

function basicRequest (type, url, params, urlMethod, inputCharset = 'utf8') {
  const param = serializeformQuery(params)
  let reqBody = {
    reqUrl: url,
    params: param,
    type: urlMethod,
    charset: inputCharset
  }
  if (type === 'erp' || type === 'wh') {
    reqBody.outCharset = 'gbk'
  }
  return new Promise((resolve, reject) => {
    let body = {
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: reqBody,
      success (res) {
        if (res.statusCode === 200) {
          console.log('comm', res)
          if (type === 'comm') {
            if (res.data.return_code === 0 || res.data.returncode === '0') {
              resolve(res.data)
            } else {
              showMsg(res.data.msg)
            }
          } else {
            if (res.data.success === '0') {
              if (type === 'erp') {
                resolve(
                  JSON.parse(res.data.body === '' ? '{}' : res.data.body) || {}
                )
              } else if (type === 'wh') {
                const resp = JSON.parse(res.data.body)[0]
                if (resp.status === 0) {
                  resolve(resp.data)
                } else {
                  showMsg(resp.message)
                }
              } else {
                resolve(res.data)
              }
            } else {
              let errMsg = res.data.msg
              // erp返回错误特殊处理
              if (errMsg === '<获取验证码>失败: 手机号码不存在') {
                errMsg = '该手机号未在线下一体机认证,请先认证'
              }
              showMsg(errMsg)
              console.log('showMsgerrMsg========>' + errMsg)
            }
          }
        } else {
          showMsg(res.data.error)
        }
      },
      error (err) {
        showMsg(err.message)
      }
    }
    if (type === 'erp' || type === 'wh') {
      body.url = PROXYDCODEURL
    } else {
      body.url = COMMURL
    }
    mpvue.request(body)
  })
}

function ironRequest (reqUrl, param, type) {
  const basicParams = Object.assign({}, param)
  let ul = reqUrl
  if (this.isLogin && type === 'post') {
    basicParams.user_id = this.currentUser.user_id
  }
  if (this.isLogin && type === 'get' && reqUrl.indexOf('user_id') < 0) {
    ul.indexOf('?') >= 0
      ? (ul += '&user_id=' + this.currentUser.user_id)
      : (ul += '?user_id=' + this.currentUser.user_id)
  }
  const baiscUrl = BASICURL + '/ironmart/httpProxy'
  const reqBody = {
    url: ul,
    type: type,
    params: serializeformQuery(basicParams)
  }
  return new Promise((resolve, reject) => {
    const body = {
      url: baiscUrl,
      method: 'POST',
      data: reqBody,
      success (res) {
        console.log('success', res)
        if (res.statusCode === 200) {
          if (
            res.returncode === undefined &&
            res.data.returncode === undefined
          ) {
            resolve(res.data)
          } else {
            if (Number(res.data.returncode) === 0) {
              resolve(res.data)
            } else {
              reject(res.data.errormsg || res.data.msg)
              console.log('showMsgerrMsg2========>' + 'errormsg：' + res.data.errormsg + 'msg：' + res.data.msg)
            }
          }
        } else {
          reject(res.data === undefined ? '网络异常' : res.data.errormsg)
          console.log('showMsgerrMsg3========>' + res.data.errormsg)
        }
      },
      error (err) {
        reject(err.message || '网络异常')
      }
    }
    mpvue.request(body)
  })
}

export default {
  proxy: {
    // 开发
    // erp: 'http://192.168.80.147:8980/eep/interfacesAjax!',
    // dev
    erp: 'http://erp-test.xingyun361.com/eep/interfacesAjax!',
    // stage
    // erp: 'http://erp-pro.xingyun361.com/eep/interfacesAjax!',
    // prod
    // erp: 'http://erp.xingyun361.com/eep/interfacesAjax!',
    // dev
    wh: 'http://wms-test.xingyun361.com/app/interfacesAjax!',
    // stage
    // wh: 'http://wms-pro.xingyun361.com/app/interfacesAjax!',
    // prod
    // wh: 'http://wms.xingyun361.com/app/interfacesAjax!',
    // dev
    dr: 'http://appadmin-test.xingyun361.com/driver-bk/api/',
    // prod
    // dr: 'http://appadmin.xingyun361.com/driver-bk/api/',
    // dev
    crm: 'http://crm-admin-test.xingyun361.com/crmserver/api/v1/wxmini/', // 测试环境地址
    // stage
    // crm: 'http://crm-admin-pro.xingyun361.com/crmserver/api/v1/wxmini/' // 预上线环境地址
    // prod
    // crm: 'http://crmadmin.xingyun361.com/api/v1/wxmini/'
    // dev
    scp: 'http://scp-dev.xingyun361.com/api/'
    // prod
    // scp: 'http://scp.xingyun361.com/api/'
  },
  ironRequest,
  request (url, params, urlMethod) {
    return basicRequest('comm', url, params, urlMethod)
  },
  requestDecode (type, url, params, urlMethod, iptCharset = 'gbk') {
    return basicRequest(type, url, params, urlMethod, iptCharset)
  },
  statisticRequest (param, isSeller) {
    if (this.currentUser.type === 'seller' && !isSeller) return false
    let basicParams = Object.assign({}, param)
    if (this.isLogin) {
      basicParams.user_id = this.currentUser.user_id
    }
    const baiscUrl = BASICURL + '/ironmart/statisticsProxy'
    const reqBody = {
      params: serializeformQuery(basicParams, true)
    }
    return new Promise((resolve, reject) => {
      const body = {
        url: baiscUrl,
        method: 'POST',
        data: reqBody,
        success (res) {
          console.log('success', res)
          if (res.data.returncode === '0') {
            resolve(res.data)
          } else {
            reject(res.data === undefined ? '网络异常' : res.data.errormsg)
            console.log('showMsgerrMsg4========>' + res.data.errormsg)
          }
        },
        error (err) {
          reject(err.message || '网络异常')
        }
      }
      mpvue.request(body)
    })
  },
  zgRequest (params) {
    const basicUrl = BASICURL + 'ironmart/zgProxy'
    const paramStr = JSON.stringify(params)
    const bytes = UTF8.encode(paramStr)
    const base64Param = BASE64.encode(bytes)
    const reqParam = serializeformQuery({ data: base64Param })
    return new Promise((resolve, reject) => {
      const body = {
        url: basicUrl,
        method: 'POST',
        data: reqParam,
        success (res) {
          console.log('success', res)
          if (res.data.returncode === '0') {
            resolve(res.data)
          } else {
            reject(res.data === undefined ? '网络异常' : res.data.errormsg)
            console.log('showMsgerrMsg5========>' + res.data.errormsg)
          }
        },
        fail (err) {
          reject(err.message || '网络异常')
        }
      }
      mpvue.request(body)
    })
  },
  ironFileUpload (model) {
    return new Promise((resolve, reject) => {
      mpvue.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        success (res) {
          const filePath = res.tempFilePaths[0]
          let fileType = ''
          if (filePath.indexOf('.png') > 0) fileType = 'image/png'
          if (filePath.indexOf('.jpg') > 0 || filePath.indexOf('.jpeg') > 0) {
            fileType = 'image/jpeg'
          }
          console.log('fileType:>>', fileType)
          if (fileType === '') {
            reject(new Error('只支持png/jpeg'))
          } else {
            let suffix = '.png'
            if (fileType === 'image/jpeg') suffix = '.jpg'
            mpvue.getFileSystemManager().readFile({
              filePath: filePath,
              encoding: 'base64',
              success (fdata) {
                mpvue.request({
                  url: BASICURL + '/ironmart/fileUpload',
                  method: 'POST',
                  data: {
                    model: model,
                    filename: model + '-temp' + suffix,
                    filetype: fileType,
                    encryptfile: fdata.data
                  },
                  success (hresp) {
                    if (hresp.data.success) {
                      resolve(hresp.data.urls)
                    } else {
                      reject(new Error('图片上传失败'))
                    }
                  },
                  fail (err) {
                    reject(err)
                  }
                })
              },
              fail (err) {
                reject(err)
              }
            })
          }
        },
        fail (err) {
          reject(err)
        }
      })
    })
  }
}
