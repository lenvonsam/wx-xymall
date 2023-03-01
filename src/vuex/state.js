export default {
  // 版本
  currentVersion: '2.1.3',
  // 临时存储对象
  tempObject: {},
  // 权限
  modules: {},
  // 屏幕宽度
  screenWidth: 375,
  // 屏幕高度
  screenHeight: 667,
  // 导航栏高度
  statusBar: 20,
  // 自定义导航栏对象
  custom: {},
  // 自定义导航栏内容的高度
  customBar: 64,
  // 底部tab高度
  bottomBarHeight: 48,
  // 首页图片
  mainIcons: [
    {
      url: '/static/images/ht_icon.png',
      title: '合同付款',
      path: '/pages/bill/main?tabName=01',
      event: 'click_app_index_pay'
    },
    {
      url: '/static/images/td_icon.png',
      title: '我的提单',
      path: '/pages/ladbill/main',
      event: 'click_app_index_td'
    },
    {
      url: '/static/images/fp_icon.png',
      title: '发票申请',
      path: '/pages/invoice/main',
      event: 'click_app_index_invoice'
    },
    {
      url: '/static/images/zh_icon.png',
      title: '帮我找货',
      path: '/pages/askBuyCreate/main',
      event: 'click_app_index_seek'
    }
  ],
  // 首页产品分类
  mainClassify: [
    [
      { title: 'H型钢', id: '169' },
      { title: '低合金H型钢', id: '256' },
      { title: '槽钢', id: '168' }
    ],
    [
      { title: '角钢', id: '167' },
      { title: '不等边角钢', id: '179' },
      { title: '工字钢', id: '175' }
    ],
    [
      { title: '普碳开平板', id: '185' },
      { title: '低合金开平板', id: '186' },
      { title: '圆钢（机械类）', id: '272,181' }
    ],
    [
      { title: '扁钢', id: '273' },
      { title: '镀锌扁钢', id: '270' },
      { title: '镀锌槽钢', id: '213' }
    ]
  ],
  /**
   * 根据扫码id自动转成品名
   * @author samy
   * @date 2020/05/27
   */
  qrCodeForGoodsName: {
    '169': 'hxg',
    '175': 'gzg',
    '168': 'cg',
    '167': 'jg',
    '273': 'bg',
    '272,181': 'yg',
    '187': 'bc',
    '185': 'kpb',
    '183': 'jb',
    '999': 'gbz'
  },
  billIcons: [
    {
      icon: '/static/images/dfk.png',
      dotKey: 'paymentNumber',
      name: '待付款',
      event: 'click_app_me_to_pay',
      url: {
        path: '/pages/bill/main?tabName=01'
      }
    },
    {
      icon: '/static/images/submit_orders_icon.png',
      name: '修改中',
      dotKey: 'updateContractNumber',
      event: 'click_app_me_to_confirm',
      url: {
        path: '/pages/ladbillConfirm/main'
      }
    },
    {
      icon: '/static/images/wait_pick_icon.png',
      name: '待提货',
      dotKey: 'updateNumber',
      event: 'click_app_me_to_lad',
      url: {
        path: '/pages/bill/main?tabName=02'
      }
    },
    {
      icon: '/static/images/billing_Infor.png',
      name: '待开票',
      dotKey: 'notInvoicedNum',
      event: 'click_app_me_to_invoice',
      url: {
        path: '/pages/invoice/main?tabName=0'
      }
    }
  ],
  contractStatus: [
    { id: '01', name: '待支付' },
    { id: '02', name: '待补款' },
    { id: '03', name: '已付款' },
    { id: '04', name: '支付中' },
    { id: '05', name: '待确认' },
    { id: '06', name: '修改中' },
    { id: '07', name: '已完成' },
    { id: '08', name: '违约' },
    { id: '09', name: '已取消' },
    { id: '10', name: '审核中' }
  ],
  companyName: [
    {code: 'C00001', name: '江苏智恒达投资集团有限公司', shortName: '智恒达集团'},
    {code: 'C00008', name: '江苏智恒达机械科技有限公司', shortName: '智恒达'},
    {code: 'C00009', name: '江苏岳洋通金属加工有限公司', shortName: '岳洋通'},
    {code: 'C00010', name: '江苏智恒达投资集团合肥有限公司', shortName: '智恒达合肥'},
    {code: 'C00011', name: '江苏智恒达型云网络科技有限公司', shortName: '型云'},
    {code: 'C00012', name: '常州金新怡机械科技有限公司', shortName: '金新怡'},
    {code: 'C00013', name: '江苏型升供应链服务有限公司', shortName: '型升供应链'},
    {code: 'C00014', name: '常州智恒达投资合伙企业（有限合伙）', shortName: '智恒达合伙'},
    {code: 'C00015', name: '虚拟部', shortName: '虚拟部'}
  ]
}
