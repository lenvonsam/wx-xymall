export default {
  xy: {
    banner: { url: 'getBanner.shtml', method: 'get' },
    notice: { url: 'getNotice.shtml', method: 'get' },
    noticeDetail: { url: 'noticeDetail.shtml', method: 'get' },
    noticeList: { url: 'noticeList.shtml', method: 'get' },
    readNotice: { url: 'readNotice.shtml', method: 'post' },
    searchHistory: { url: 'searchHistory.shtml', method: 'post' },
    updateProfile: { url: 'updateProfile.shtml', method: 'post' },
    queryProfile: { url: 'queryProfile.shtml', method: 'get' },
    resetPwd: { url: 'resetPwd.shtml', method: 'post' },
    forgetPwd: { url: 'forgetPwd.shtml', method: 'post' },
    validCaptcha: { url: 'validCaptcha.shtml', method: 'get' },
    bindNewPhone: { url: 'bindNewPhone.shtml', method: 'post' },
    withdraw: { url: 'withdraw.shtml', method: 'post' },
    queryWithdrawList: { url: 'queryWithdrawList.shtml', method: 'get' },
    creditRecordList: { url: 'creditRecordList.shtml', method: 'get' },
    sellerCreditRecordList: {
      url: 'seller/sellerCreditRecordList.shtml',
      method: 'get'
    },
    companyInfo: { url: 'companyInformation.shtml', method: 'get' },
    companyUpdate: { url: 'companyUpdate.shtml', method: 'post' },
    trend: { url: 'trends.shtml', method: 'get' },
    login: { url: 'userLogin.shtml', method: 'post' },
    smsLogin: { url: 'smsLogin.shtml', method: 'post' },
    userRegister: { url: 'userRegister.shtml', method: 'post' },
    captcha: { url: 'getCaptcha.shtml', method: 'get' },
    mallList: { url: 'mallList.shtml', method: 'post' },
    goodsList: { url: 'goodsList.shtml', method: 'post' },
    standardList: { url: 'standardList.shtml', method: 'post' },
    generateOrder: { url: 'generateOrder.shtml', method: 'post' },
    cartList: { url: 'cartList.shtml', method: 'get' },
    cartListCount: { url: 'cartListCount.shtml', method: 'get' },
    cartUpdate: { url: 'cartUpdate.shtml', method: 'post' },
    cartEmpty: { url: 'cartEmpty.shtml', method: 'post' },
    cartDel: { url: 'cartDel.shtml', method: 'post' },
    addCart: { url: 'addCart.shtml', method: 'post' },
    addCartSeller: { url: 'seller/addCartSeller.shtml', method: 'post' },
    auditDxCheck: { url: 'seller/auditDxCheck.shtml', method: 'post' },
    dx: { url: 'seller/dx.shtml', method: 'post' },
    quotation: { url: 'seller/quotation.shtml', method: 'post' },
    quotationDetail: { url: 'seller/quotationDetail.shtml', method: 'get' },
    sellerOrderList: { url: 'seller/orderList.shtml', method: 'post' },
    sellerNeedAudit: { url: 'seller/needAudit.shtml', method: 'get' },
    sellerDxAudit: { url: 'seller/dxAudit.shtml', method: 'get' },
    sellerReturnGoodsAudit: {
      url: 'seller/returnGoodsAudit.shtml',
      method: 'get'
    },
    sellerOrderDelayAudit: {
      url: 'seller/orderDelayAudit.shtml',
      method: 'get'
    },
    returnGoodsAudit: { url: 'seller/returnGoodsAudit.shtml', method: 'post' },
    dxAudit: { url: 'seller/dxAudit.shtml', method: 'post' },
    orderDelayAudit: { url: 'seller/orderDelayAudit.shtml', method: 'post' },
    deptList: { url: 'deptList.shtml', method: 'post' },
    employeeList: { url: 'employeeList.shtml', method: 'post' },
    orderDelayList: { url: 'seller/orderDelayList.shtml', method: 'post' },
    orderDelay: { url: ' seller/orderDelay.shtml', method: 'post' },
    orderDelayAgain: { url: ' seller/orderDelayAgain.shtml', method: 'post' },
    quotationList: { url: 'seller/quotationList.shtml', method: 'post' },
    quotationCancel: { url: 'seller/quotationCancel.shtml', method: 'post' },
    quotationRelease: { url: 'seller/quotationRelease.shtml', method: 'post' },
    quotationDx: { url: 'seller/quotationDx.shtml', method: 'post' },
    quotationLock: { url: 'seller/quotationLock.shtml', method: 'post' },
    copyQuotation: { url: 'seller/copyQuotation.shtml', method: 'post' },
    sellerBalance: { url: 'seller/balance.shtml', method: 'post' },
    balanceRestrict: { url: 'seller/balanceRestrict.shtml', method: 'post' },
    gatherinsgBeforeWarning: {
      url: 'seller/erp/gatherinsgBeforeWarning.shtml',
      method: 'post'
    },
    returnGoodsList: { url: 'seller/returnGoodsList.shtml', method: 'post' },
    returnGoods: { url: 'seller/returnGoodsApply.shtml', method: 'post' },
    returnGoodsApplyDetail: {
      url: 'seller/returnGoodsApply.shtml',
      method: 'get'
    },
    returnGoodsDetail: { url: 'seller/returnGoodsDetail.shtml', method: 'get' },
    modules: { url: 'seller/modules.shtml', method: 'post' },
    returnGoodsReason: {
      url: 'seller/returnGoodsReason.shtml',
      method: 'get'
    },
    bankWater: { url: 'seller/bankWater.shtml', method: 'post' },
    bankWaterAudit: { url: 'seller/bankWaterAudit.shtml', method: 'post' },
    bankWaterRestore: { url: 'seller/bankWaterRestore.shtml', method: 'post' },
    bankWaterDelete: { url: 'seller/bankWaterDelete.shtml', method: 'post' },
    bankWaterDetail: { url: 'seller/bankWaterDetail.shtml', method: 'get' },
    orderCount: { url: 'seller/orderCount.shtml', method: 'get' },
    auditHistory: { url: 'seller/auditHistory.shtml', method: 'get' },
    // 现货物资列表
    sumGoodsList: { url: 'seller/erp/sumGoodsList.shtml', method: 'post' },
    sumGoodsDetail: { url: 'seller/erp/sumGoodsDetail.shtml', method: 'get' },
    sumGoodsNameList: { url: 'seller/erp/goods.shtml', method: 'post' },
    sumGoodsStandardList: { url: 'seller/erp/standard.shtml', method: 'post' },
    returnGoodsCancel: {
      url: 'seller/returnGoodsCancel.shtml',
      method: 'post'
    },
    loginOut: { url: 'loginOut.shtml', method: 'get' },
    checkUUID: { url: 'seller/checkUUID.shtml', method: 'get' },
    // 微信登录
    wxLogin: { url: 'wxLogin.shtml', method: 'post' },
    // 微信绑定
    wxBind: { url: 'wxBind.shtml', method: 'post' }
  },
  erp: {
    // 手机验证码登录
    login: 'getVerificationCodeForLogin.htm',
    // 获取手机验证码
    captcha: 'getVerificationCode.htm',
    // 更换司机手机号
    updatePhone: 'updateDriverPhone.htm',
    // 司机信息
    driverInfo: 'getByDriverCode.htm',
    // 更新司机信息
    updateDriverInfo: 'updateDriver.htm',
    // 获取打印信息
    printerInfo: 'queryPicktokenByDriverIdcard.htm',
    // 制作提单凭证
    makeTdpz: 'addPickToken.htm',
    // 查询提货凭证明细接口
    queryTdDetailList: 'queryPicktokenDetail.htm',
    // 查询提单列表
    queryTdList: 'querySbillInfo.htm',
    // 录入分享提单目的地
    updateDestination: 'updateDatasAcceptcorpaddr.htm',
    // 录入分享司机信息
    updateShareDriverInfo: 'saveDriverWarehouseSbill.htm',
    // 删除提货凭证接口
    delTd: 'deletePickToken.htm',
    // 更新提单表评论字段
    updateCommentStatus: 'updateIsComment.htm',
    // 根据司机查询已关联提单
    queryRelationTdList: 'querySbillBillcodeByDriverPhone.htm'
  },
  wh: {
    // 查询提货单
    queryWaitTdList: 'queryOconsignDetail.do'
  },
  driver: {
    // 司机评论
    comment: 'driver/comment',
    // 评论详情
    commentDetail: 'comment/',
    // 积分商品列表
    product: 'mobileProduct',
    // 商品兑换
    getProduct: 'driver/$/product',
    // 积分详情列表
    jfDetailList: 'driver/$/integralDetail',
    // 票券列表
    quanList: 'driver/$/quan'
  },
  crm: {
    // 客户列表
    cstmList: { url: 'customer', method: 'get' }
  },
  scp: {
    // 登录
    login: { url: 'wechat/miniAuth/login', method: 'post' },

    // 用户信息
    profile: { url: 'wechat/miniAuth/profile', method: 'post' },

    // 手机信息
    phoneInfo: { url: 'wechat/miniAuth/phone', method: 'post' }
  }
}
