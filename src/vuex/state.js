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
      path: '/pages/bill/main?tabName=1',
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
      {
        title: '普碳H型钢',
        id: '169'
      },
      {
        title: '低合金H型钢',
        id: '256'
      },
      {
        title: '槽钢',
        id: '168'
      }
    ],
    [
      { title: '等边角钢', id: '167' },
      { title: '不等边角钢', id: '179' },
      { title: '工字钢', id: '175' }
    ],
    [
      { title: '普碳开平板', id: '185' },
      { title: '低合金开平板', id: '186' },
      { title: '圆钢', id: '272,181' }
    ],
    [
      {
        title: '热轧扁钢',
        id: '273'
      },
      {
        title: '纵剪扁钢',
        id: '270'
      },
      {
        title: '镀锌槽钢',
        id: '213'
      }
    ]
  ],
  billIcons: [
    {
      icon: '/static/images/dfk.png',
      dotKey: 'topay',
      name: '待付款',
      url: {
        path: '/pages/bill/main?tabName=1'
      }
    },
    {
      icon: '/static/images/submit_orders_icon.png',
      name: '待确认',
      dotKey: 'to_confirm_lad',
      url: {
        path: '/pages/ladbillConfirm/main'
      }
    },
    {
      icon: '/static/images/wait_pick_icon.png',
      name: '待提货',
      dotKey: 'to_delivery',
      url: {
        path: '/pages/bill/main?tabName=6'
      }
    },
    {
      icon: '/static/images/billing_Infor.png',
      name: '待开票',
      dotKey: 'toinvoice',
      url: {
        path: '/pages/invoice/main?tabName=0'
      }
    }
  ]
}
