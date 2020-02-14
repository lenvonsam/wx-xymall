export default {
  xy: {
    banner: 'getBanner.shtml',
    notice: 'getNotice.shtml',
    trend: 'trends.shtml',
    login: 'userLogin.shtml',
    mallList: 'mallList.shtml',
    goodsList: 'goodsList.shtml',
    standardList: 'standardList.shtml'
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
