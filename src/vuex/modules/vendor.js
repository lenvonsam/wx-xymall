export default {
  actions: {},
  state: {
    billTrackIcons: [
      {
        icon: '/static/images/dfk.png',
        name: '待付款',
        dotKey: '',
        url: {
          path: '/pages/vendor/contractTrack/main?tabName=1'
        }
      },
      {
        icon: '/static/images/dfk_icon.png',
        name: '已支付待确认',
        dotKey: '',
        url: {
          path: '/pages/vendor/contractTrack/main?tabName=12'
        }
      },
      {
        icon: '/static/images/seller_wait_pick_icon.png',
        name: '待提货',
        dotKey: '',
        url: {
          path: '/pages/vendor/contractTrack/main?tabName=8'
        }
      },
      {
        icon: '/static/images/invoice_icon.png',
        name: '修改中',
        dotKey: '',
        url: {
          path: '/pages/vendor/contractTrack/main?tabName=10'
        }
      }
    ],
    featuresIcons: [
      {
        icon: '/static/images/audit_record_icon.png',
        name: '待审核',
        dotKey: '',
        url: {
          path: '/pages/vendor/pendingReview/main'
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
          path: '/contractDelay/main'
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
  },
  mutations: {}
}
