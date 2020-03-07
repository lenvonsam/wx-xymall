export default {
  // 版本
  currentVersion: '0.0.1',
  // 临时存储对象
  tempObject: {},
  // 屏幕宽度
  screenWidth: 375,
  // 屏幕高度
  screenHeight: 667,
  // 导航栏高度
  statusBar: 0,
  // 自定义导航栏对象
  custom: {},
  // 自定义导航栏内容的高度
  customBar: 0,
  // 底部tab高度
  bottomBarHeight: 0,
  // 首页图片
  mainIcons: [
    {
      url: '/static/images/ht_icon.png',
      title: '合同付款',
      path: '/pages/bill/main?tabName=1'
    },
    {
      url: '/static/images/td_icon.png',
      title: '我的提单',
      path: '/pages/ladbill/main'
    },
    {
      url: '/static/images/fp_icon.png',
      title: '发票申请',
      path: '/pages/invoice/main'
    },
    {
      url: '/static/images/zh_icon.png',
      title: '帮我找货',
      path: '/pages/askBuyCreate/main'
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
        id: '215'
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
  ],
  billTrackIcons: [
    {
      icon: '/static/images/dfk.png',
      name: '待付款',
      dotKey: '',
      url: {
        path: ''
      }
    },
    {
      icon: '/static/images/dfk_icon.png',
      name: '待付款确认',
      dotKey: '',
      url: {
        path: ''
      }
    },
    {
      icon: '/static/images/seller_wait_pick_icon.png',
      name: '待提货',
      dotKey: '',
      url: {
        path: ''
      }
    },
    {
      icon: '/static/images/invoice_icon.png',
      name: '修改中',
      dotKey: '',
      url: {
        path: ''
      }
    }
  ],
  featuresIcons: [
    {
      icon: '/static/images/audit_record_icon.png',
      name: '待审核',
      dotKey: '',
      url: {
        path: ''
      }
    },
    {
      icon: '/static/images/hostory_icon.png',
      name: '审核历史',
      dotKey: '',
      url: {
        path: ''
      }
    },
    {
      icon: '/static/images/review_icon.png',
      name: '合同延时',
      dotKey: '',
      url: {
        path: ''
      }
    },
    {
      icon: '/static/images/seller_order_icon.png',
      name: '报价单管理',
      dotKey: '',
      url: {
        path: ''
      }
    },
    {
      icon: '/static/images/balance_icon.png',
      name: '账户余额',
      dotKey: '',
      url: {
        path: ''
      }
    },
    {
      icon: '/static/images/early_warning_icon.png',
      name: '应收款预警',
      dotKey: '',
      url: {
        path: ''
      }
    },
    {
      icon: '/static/images/save_icon.png',
      name: '现货物资',
      dotKey: '',
      url: {
        path: ''
      }
    },
    {
      icon: '/static/images/custom_icon.png',
      name: '客户管理',
      dotKey: '',
      url: {
        path: ''
      }
    },
    {
      icon: '/static/images/card_package_icon.png',
      name: '银企直联',
      dotKey: '',
      url: {
        path: ''
      }
    },
    {
      icon: '/static/images/returns_icon.png',
      name: '退货管理',
      dotKey: '',
      url: {
        path: ''
      }
    },
    {},
    {}
  ]
}
