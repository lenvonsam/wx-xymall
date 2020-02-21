export default {
  // 版本
  currentVersion: '0.0.1',
  // 临时存储对象
  tempObject: {},
  // 屏幕宽度
  screenWidth: 375,
  // 导航栏高度
  statusBar: 0,
  // 自定义导航栏对象
  custom: {},
  // 自定义导航栏内容的高度
  customBar: 0,
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
    [{ title: '等边角钢', id: '167' }, { title: '不等边角钢', id: '179' }, { title: '工字钢', id: '175' }],
    [{ title: '普碳开平板', id: '185' }, { title: '低合金开平板', id: '186' }, { title: '圆钢', id: '272,181' }]
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
        path: '/pages/invoice/main?tabName=1'
      }
    }
  ]
}
