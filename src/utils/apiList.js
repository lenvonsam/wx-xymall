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
    sellerNeedAudit: { url: 'seller/needAudit.shtml', method: 'post' },
    sellerDxAudit: { url: 'seller/dxAudit.shtml', method: 'get' },
    sellerReturnGoodsAudit: {
      url: 'seller/returnGoodsAudit.shtml',
      method: 'get'
    },
    sellerOrderDelayAudit: {
      url: 'seller/orderDelayAudit.shtml',
      method: 'get'
    },
    // ERP议价提单审核详情
    sellerBargainAudit: { url: 'seller/bargainAudit.shtml', method: 'post' },
    // ERP销售定价
    salePriceAudit: { url: 'seller/salePriceAudit.shtml', method: 'post' },
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
    auditHistory: { url: 'seller/auditHistory.shtml', method: 'post' },
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
    wxBind: { url: 'wxBind.shtml', method: 'post' },
    // 更新用户关于rule的状态
    updateRule: { url: 'updateRule.shtml', method: 'post' }
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
  },
  zf: {
    // banner图
    banner: 'xingyun/home/banner',
    // 新闻动态
    notices: 'xingyun/home/news',
    // 动态详情
    noticeDetail: 'xingyun/home/newsViewCount',
    // 获取图片验证码
    getVerifyCode: 'base/online/getVerifyCode',
    // 账号密码登录 手机短信登录
    login: 'base/online/appletLogin',
    // 获取短信验证码
    getSmsVerifyCode: 'base/online/sms',
    // 用户注册
    userRegister: 'base/online/appletRegister',
    // 微信绑定
    wxBind: 'base/online/appletBinding',
    // 微信登录
    wxLogin: 'base/online/wxLogin',
    // 商城分类
    appletQuerySpecificationList: 'xingyun/shopMall/appletQuerySpecificationList',
    // 商城筛选获取所有品名
    searchBrand: 'xingyun/shopMall/queryProductBrandNamePage',
    // 获取商城列表
    shopMallList: 'xingyun/shopMall/queryPage',
    // 获取品名分页列表
    queryProductBrandNamePage: 'xingyun/shopMall/queryProductBrandNamePage',
    // 获取品名规则分页列表
    queryProductBrandNameSortPage: 'xingyun/shopMall/queryProductBrandNameSortPage',
    // 获取规格分页列表
    querySpecificationPage: 'xingyun/shopMall/querySpecificationPage',
    // 获取材质分页列表
    queryProductTextureNamePage: 'xingyun/shopMall/queryProductTextureNamePage',
    // 获取产地分页列表
    queryProdAreaNamePage: 'xingyun/shopMall/queryProdAreaNamePage',
    // 基础管理-个人资料管理-获取个人资料
    getPersonInfo: 'xingyun/base/getPersonInfo',
    // 用户中心数据
    queryUserCenterContractInfo: 'xingyun/contract/queryUserCenterContractInfo',
    // 合同列表
    contractList: 'xingyun/contract/queryContractPage',
    // 合同详情
    saleContractDetail: 'xingyun/contract/saleContractDetail',
    // 合同订单详情
    contractOrderDetail: 'xingyun/order/contractOrderDetail',
    // 合同付款
    contractOrderPayment: 'xingyun/order/contractOrderPayment',
    // 手动取消合同
    cancelContract: 'xingyun/contract/cancelContract',
    // 加工跟踪
    onlineProcessTrack: 'xingyun/onlineProcess/queryPage',
    // 我的加工-新增加工
    addOnlineProcess: 'xingyun/onlineProcess/add',
    // 我的加工-查询详情
    onlineProcessDetail: 'xingyun/onlineProcess/get',
    // 我的加工-删除加工
    deleteOnlineProcess: 'xingyun/onlineProcess/delete',
    // 求购发布
    addOnlineRequireBuy: 'xingyun/onlineRequireBuy/add',
    // 求购管理
    onlineRequireBuyManage: 'xingyun/onlineRequireBuy/queryPage',
    // 求购详情
    // onlineRequireBuyDetail: 'xingyun/onlineRequireBuy/get',
    // 提单管理
    billLading: 'xingyun/billLading/queryPage',
    // 查询提单详情
    billLadingDetail: 'xingyun/billLading/selectBillLadingDetail',
    // 确认/取消提单
    ladingConfirmation: 'xingyun/billLading/ladingConfirmation',
    // 查询待确认提单
    queryLadingPage: 'xingyun/contract/queryLadingPage',
    // 添加购物车
    addCartItem: 'xingyun/cart/appendCartItem',
    // 获取购物车
    getCurrentUserCartItems: 'xingyun/cart/getCurrentUserCartItems',
    // 改变购物车商品数量
    changeNum: 'xingyun/cart/changeNum',
    // 购物车删除商品信息
    deleteItem: 'xingyun/cart/deleteItem',
    // 购物车改变计量方式
    changeQuantityType: 'xingyun/cart/changeQuantityType',
    // 购物车清空失效物资
    failureMaterial: 'xingyun/cart/failureMaterial',
    // 生成合同
    generateContract: 'xingyun/shopMall/generateContract',
    // 生成合同（回收站）
    generateContractRecovery: 'xingyun/contractRecovery/generateContract',
    // 基础管理-支付密码管理
    updatePaymentCode: 'xingyun/base/updatePaymentCode',
    // 基础管理-登录密码管理
    updateLoginPassword: 'xingyun/base/updateLoginPassword',
    // 找回密码
    resetPassword: 'base/online/resetPassword',
    // 图片ocr
    ocrImage: 'base/ocrImage',
    // 上传图片
    uploadImage: 'foundation/attach/upload',
    // 完善公司信息
    addAuthentication: 'xingyun/unitAuthentication/add',
    // 合同回收列表分页
    contractRecoveryPage: 'xingyun/contractRecovery/contractRecoveryPage',
    // 恢复购物车
    restoreShopCart: 'xingyun/contractRecovery/restoreShopCart',
    // 合同回收站生成合同
    recycleBinGenerateContract: 'xingyun/contractRecovery/generateContract',
    // 查看公司信息
    selectCompanyInfo: 'xingyun/base/selectCompanyInfo',
    // 校验手机号验证码是否正确
    checkoutVerificationCode: 'xingyun/base/checkoutVerificationCode',
    // 修改用户个人信息
    updatePersonInfo: 'xingyun/base/updatePersonInfo',
    // 账户收支明细-提现申请预查询(数据准备)
    prepareWithdrawApply: 'finance/withdrawApply/prepareWithdrawApply',
    // 账户收支明细-提现申请
    addWithdraw: 'finance/withdrawApply/addWithdraw',
    // 账户收支明细（往来账）
    searchCustomerFundFlows: 'finance/unitFundFlow/searchCustomerFundFlows',
    // 账户收支明细
    searchInAndOutDetail: 'finance/unitFundFlow/searchInAndOutDetail',
    // 账户收支明细-数量统计
    getUnitFundFlowResult: 'finance/unitFundFlow/getUnitFundFlowResult',
    // 资金管理 账户信息-账户余额
    getUnitMoney: 'finance/unit-fund/getUnitMoney',
    // 获取搜索历史
    appletQuerySearchHistory: 'xingyun/shopMall/appletQuerySearchHistory',
    // 清除搜索历史
    appletDropSearchHistory: 'xingyun/shopMall/appletDropSearchHistory',
    // 提现记录（提现记录）
    searchWithdraw: 'finance/withdrawApply/searchWithdraw',
    // 发票-未申请提单-分页查询
    invoiceUnApply: 'finance/arStatementList/customerSearch',
    // 发票-未申请提单详情
    invoiceUnApplyDetail: 'finance/arStatementList/getArStatementList',
    // 发票-已申请提单的-分页查询
    invoiceApplied: 'finance/arStatementList/customerAppliedSearch',
    // 发票-已申请提单详情
    customerAppliedDetail: 'finance/arStatementList/customerAppliedDetail',
    // 发票-已开票提单
    invoiceInvoiced: 'finance/arInvoice/customerInvoicedSearch',
    // 发票-待开票
    arStatementList: '/api/finance/arStatementList/search',
    // 发票-申请开票
    invoiceAdd: 'finance/arStatementList/createInvoice',
    // 发票-待确认收票的发票列表
    confirmReceiptDetails: 'finance/arInvoice/search',
    // 发票-确认收票功能
    confirmReceipt: 'finance/arInvoice/confirmReceipt',
    // 修改用户个人协议
    updatePersonAgreement: 'xingyun/base/updatePersonAgreement',
    // 小程序可修改合同分页列表
    queryAppletContractPage: 'xingyun/contract/queryAppletContractPage',
    // 修改合同
    updateSaleContract: 'sale/saleContract/updateSaleContract',
    // 文件上传
    upload: 'base/file/upload',
    // 待审核菜单/审核历史菜单
    queryWorkflowProcessMenu: 'workflow/workflow/queryWorkflowProcessMenu',
    // 待审核列表/审核历史列表
    queryWorkflowProcessList: 'workflow/workflow/queryWorkflowProcessList',
    // 待审核详情/审核历史详情
    getDetail: 'workflow/workflow/getDetail',
    // 待审核通过/待审核驳回
    audit: 'workflow/workflow/audit',
    // 卖家-购物车修改定向价格
    sellerUpdateMoney: 'xingyun/cart/sellerUpdateMoney',
    // 查看购物车,待付款数量
    summaryQuantity: 'xingyun/shopMall/summaryQuantity',
    // 卖家-合同跟踪
    querySellerContractPage: 'xingyun/contract/querySellerContractPage',
    // 卖家-合同跟踪列表
    sellerGetSaleContractPage: 'sale/saleContract/sellerGetSaleContractPage',
    // 卖家-crm可用客户
    unitQueryPage: 'base/unit/queryPage',
    // 卖家合同跟踪-业务员下拉筛选列表
    employeeQuery: 'base/employee/query',
    // 卖家-合同跟踪-业务部门下拉筛选列表
    departmentQuery: 'base/department/query',
    // 卖家-提单制作-提货人
    queryDriver: 'logistics/driver/queryPage',
    // 卖家-提单制作-车牌号
    queryCarsByUnitId: 'sale/saleLading/queryCarsByUnitId',
    // 卖家-提单制作-确认制作
    addSaleLading: 'sale/saleLading/addSaleLading',
    addSaleLadingList: 'sale/saleLading/addSaleLadingList',
    // 卖家-制作提单-合同详情
    createSaleLadingFromContract: 'sale/saleLading/createSaleLadingFromContract',
    createSaleLadingFromContractList: 'sale/saleLading/createSaleLadingFromContractList',
    // 埋点、行为日志记录
    logClickAdd: 'base/log-click/add',
    logEventAdd: 'base/log-event/add',
    logSave: 'foundation/logEvent/save',
    // 卖家-提单管理列表
    querySellerSaleLadingPage: 'sale/saleLading/querySellerSaleLadingPage',
    // 卖家-提单详情
    editSaleLading: 'sale/saleLading/editSaleLading',
    // 卖家-提单管理-作废
    dropSaleLading: 'sale/saleLading/dropSaleLading',
    // 卖家-提单管理-货齐
    ladingGoodsAreAll: 'sale/saleLading/ladingGoodsAreAll',
    // 卖家-提单管理-取消货齐
    ladingGoodsAreNotAll: 'sale/saleLading/ladingGoodsAreNotAll',
    // 卖家-提单管理-编辑
    updateSaleLading: 'sale/saleLading/updateSaleLading',
    // 卖家-用户余额
    searchCustomerFunds: 'finance/unit-fund/searchCustomerFunds',
    // 卖家-用户余额查询接口
    selectUnitMoney: 'finance/unitFund/selectUnitMoney',
    // 卖家-型云小程序增加提现限制接口
    addRestrict: 'finance/unitFund/addRestrict',
    // 卖家-型云小程序解除提现限制接口
    delRestrict: 'finance/unitFund/delRestrict',
    // 卖家-合同延时列表
    querySaleContractPage: 'sale/saleContract/querySaleContractPage',
    // 卖家-延时操作
    delaySaleContract: 'sale/saleContract/delaySaleContract',
    // 型云小程序用户余额详情查询
    lookUnitMoney: 'finance/unitFund/getUnitMoney',
    // ERP现货物资列表查询
    // queryWarehouseStockDetailPage: 'sale/stockDetail/queryWarehouseStockDetailPage',
    querySaleStockPageList: 'sale/stock/querySaleStockPageList',
    // ERP现货物资品名
    brandQueryPage: 'foundation/product/brand/queryPage',
    // ERP现货物资仓库
    stockZoneQueryPage: 'foundation/stockZone/queryPage',
    // ERP现货物资规格
    specificationQueryPage: 'foundation/product/getSpecificationList',
    // ERP现货物资材质
    textureQueryPage: 'foundation/product/texture/queryPage',
    // ERP现货物资产地
    prodAreaQueryPage: 'foundation/prodArea/queryPage',
    // ERP现货物资获取对应品名的规格
    getSpecification: 'sale/stock/getSpecification',
    // 卖家-应收款预警
    queryTransferXy: 'finance/arStatementList/queryTransferXy',
    // 短信到货通知
    arrivalNotice: 'xingyun/shopMall/arrivalNotice',
    // 点击合同待确认
    saleContractUpateAffirm: 'sale/saleContract/saleContractUpateAffirm',
    // 退出登录
    logout: 'base/user/logout',
    // 获取业务员名片信息
    getInfoByName: { url: 'businesscard/public/businessCard/getInfoByName', method: 'get' },
    // 获取业务员名片信息
    getInfoById: { url: 'businesscard/public/businessCard/get', method: 'get' },
    // 获取评价信息
    getOptionsData: { url: 'businesscard/public/businessOption/getOptionsData', method: 'get' },
    // 获取头像
    getBusinessCardHead2Base64: { url: 'businesscard/public/businessCard/getBusinessCardHead2Base64', method: 'get' },
    // 交换名片
    businessCustomerAdd: { url: 'businesscard/public/businessCustomer/add', method: 'post' },
    // 评价业务员
    businessRemarkAdd: { url: 'businesscard/public/businessRemark/add', method: 'post' },
    // 生成名片
    getBusinessCardPoster: { url: 'businesscard/public/businessCard/getBusinessCardPoster', method: 'get' },
    // 获取是否评价以及平均分
    displayRemarkInfo: { url: 'businesscard/public/businessRemark/displayRemarkInfo', method: 'get' },
    // 公司信息
    companyContent: { url: 'businesscard/public/companyContent/queryList', method: 'get' },
    // 首页banner图
    onlineBanner: 'sale/public/onlineBanner/queryPage',
    // 获取资源定价详情接口
    queryPageByPriceVersion: 'purchase/resourcePricingItem/queryPageByPriceVersion'
  }
}
