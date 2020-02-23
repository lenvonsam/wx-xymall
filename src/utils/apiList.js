export default {
  xy: {
    banner: { url: 'getBanner.shtml', method: 'get' },
    notice: { url: 'getNotice.shtml', method: 'get' },
    noticeDetail: { url: 'noticeDetail.shtml', method: 'get' },
    noticeList: { url: 'noticeList.shtml', method: 'get' },
    searchHistory: { url: 'searchHistory.shtml', method: 'post' },
    updateProfile: { url: 'updateProfile.shtml', method: 'post' },
    queryProfile: { url: 'queryProfile.shtml', method: 'get' },
    resetPwd: { url: 'resetPwd.shtml', method: 'post' },
    forgetPwd: { url: 'forgetPwd.shtml', method: 'post' },
    validCaptcha: { url: 'validCaptcha.shtml', method: 'get' },
    bindNewPhone: { url: 'bindNewPhone.shtml', method: 'post' },
    withdraw: { url: 'withdraw.shtml', method: 'post' },
    queryWithdrawList: { url: 'queryWithdrawList.shtml', method: 'get' },
    creditRecordList: { url: 'creditRecordList.shtml', method: 'post' },
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
    cartListCount: { url: 'cartListCount.shtml', method: 'get' }
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
  }
}
