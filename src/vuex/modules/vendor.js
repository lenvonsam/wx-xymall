export default {
  actions: {},
  state: {
    // 首页图片
    mainIcons: [
      {
        url: '/static/images/ht_icon.png',
        title: '合同跟踪',
        path: '/pages/vendor/contractTrack/main',
        event: 'click_app_index_order_seller'
      },
      // {
      //   url: '/static/images/td_icon.png',
      //   title: '我的报价单',
      //   path: '/pages/vendor/quotationList/main',
      //   event: 'click_app_index_quotation_seller'
      // },
      {
        url: '/static/images/td_icon.png',
        title: '提单管理',
        path: '/pages/vendor/loadBillList/main',
        event: 'click_app_index_quotation_seller'
      },
      {
        url: '/static/images/pr_icon.png',
        title: '待审核',
        path: '/pages/vendor/pendingReview/main',
        event: 'click_app_index_audit_seller'
      },
      {
        url: '/static/images/bank_icon.png',
        title: '用户余额',
        path: '/pages/vendor/balance/main',
        event: 'click_app_index_balance_seller',
        dotKey: 'balance'
      }
    ],
    billTrackIcons: [
      {
        icon: '/static/images/dfk.png',
        name: '待付款',
        dotKey: 'pay_count',
        event: 'click_app_me_to_pay_seller',
        url: {
          path: '/pages/vendor/contractTrack/main?tabName=1'
        }
      },
      {
        icon: '/static/images/dfk_icon.png',
        name: '已付待确认',
        dotKey: 'confirm_count',
        event: 'click_app_me_to_confirm_seller',
        url: {
          path: '/pages/vendor/contractTrack/main?tabName=12'
        }
      },
      {
        icon: '/static/images/seller_wait_pick_icon.png',
        name: '待提货',
        dotKey: 'delivery_count',
        event: 'click_app_me_to_lad_seller',
        url: {
          path: '/pages/vendor/contractTrack/main?tabName=8'
        }
      },
      {
        icon: '/static/images/invoice_icon.png',
        name: '修改中',
        dotKey: 'eidt_count',
        event: 'click_app_me_to_edit_seller',
        url: {
          path: '/pages/vendor/contractTrack/main?tabName=10'
        }
      }
    ],
    featuresIcons: [
      {
        icon: '/static/images/audit_record_icon.png',
        name: '待审核',
        dotKey: 'waitAudit',
        event: 'click_app_me_audit_seller',
        url: {
          path: '/pages/vendor/pendingMenu/main'
        }
      },
      {
        icon: '/static/images/hostory_icon.png',
        name: '审核历史',
        dotKey: '',
        event: 'click_app_me_audit_history_seller',
        url: {
          path: '/pages/vendor/historyMenu/main'
        }
      },
      {
        icon: '/static/images/review_icon.png',
        name: '合同延时',
        dotKey: 'delay_list',
        event: 'click_app_me_delay_seller',
        url: {
          path: '/pages/vendor/contractDelay/main'
        }
      },
      // {
      //   icon: '/static/images/seller_order_icon.png',
      //   name: '报价单管理',
      //   dotKey: '',
      //   event: 'click_app_me_quotation_seller',
      //   url: {
      //     path: '/pages/vendor/quotationList/main'
      //   }
      // },
      {
        icon: '/static/images/seller_order_icon.png',
        name: '提单管理',
        dotKey: '',
        event: 'click_app_me_quotation_seller',
        url: {
          path: '/pages/vendor/loadBillList/main'
        }
      },
      {
        icon: '/static/images/balance_icon.png',
        name: '用户余额',
        dotKey: 'balance',
        event: 'click_app_me_balance_seller',
        url: {
          path: '/pages/vendor/balance/main'
        }
      },
      {
        icon: '/static/images/early_warning_icon.png',
        name: '应收款预警',
        dotKey: 'receivables',
        event: 'click_app_me_ysk_seller',
        url: {
          path: '/pages/vendor/receivables/main'
        }
      },
      {
        icon: '/static/images/save_icon.png',
        name: '现货物资',
        dotKey: 'spot_goods',
        event: 'click_app_me_sumgood_seller',
        url: {
          path: '/pages/vendor/sumGoods/main'
        }
      },
      // {
      //   icon: '/static/images/custom_icon.png',
      //   name: '客户管理',
      //   dotKey: '',
      //   url: {
      //     path: ''
      //   }
      // },
      {
        icon: '/static/images/card_package_icon.png',
        name: '银企直联',
        dotKey: 'bank',
        event: 'click_app_me_bank_water_seller',
        url: {
          path: '/pages/vendor/bankWater/main'
        }
      },
      {
        icon: '/static/images/returns_icon.png',
        name: '退货管理',
        dotKey: 'return_apply',
        event: 'click_app_me_returngoods_seller',
        url: {
          path: '/pages/vendor/returnApplicationList/main'
        }
      },
      {
        icon: '/static/images/business_card.png',
        name: '电子名片',
        dotKey: 'card',
        event: '',
        url: {
          // path: '/pages/vendor/businessCard/main'
          path: '/pages/vendor/businessCard/main'
        }
      }
    ]
  },
  mutations: {}
}
