export default {
  // 版本
  currentVersion: '1.0.7',
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
  // 型云图片访问地址
  imgOuterUrl: 'http://web-test.xingyun361.com',
  // 七牛访问地址
  qiniuOuterUrl: 'http://xymobile.xingyun361.com',
  // 首页图片
  mainIcons: [
    {
      url: '/static/images/ht_icon.png',
      title: '合同付款'
    },
    {
      url: '/static/images/td_icon.png',
      title: '我的提单'
    },
    {
      url: '/static/images/fp_icon.png',
      title: '发票申请'
    },
    {
      url: '/static/images/zh_icon.png',
      title: '帮我找货'
    }
  ],
  // 首页产品分类
  mainClassify: [
    [
      {
        title: '普碳H型钢'
      },
      {
        title: '低合金H型钢'
      },
      {
        title: '槽钢'
      }
    ],
    [{ title: '等边角钢' }, { title: '不等边角钢' }, { title: '工字钢' }],
    [{ title: '普碳开平板' }, { title: '低合金开平板' }, { title: '圆钢' }]
  ]
}
