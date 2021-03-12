# 型云商城小程序开发说明

## 项目结构

```
|--build //项目库文件夹(请勿修改!!!)
|--config //项目库文件夹(请勿修改!!!)
|--src
    |--components //组件
    |--css //样式
    |--pages //页面
        |--index
             |--index.vue // vue当前页文件
             |--main.js //直接拷贝复制，每个页面都一样
             |--main.json //单个页面小程序配置文件
        ...
    |--utils //工具类
    |--vuex //状态机管理
    |--app.json //小程序配置，页面路由等
    |--main.js //注册vue全局变量、全局组件等
    |--App.vue //vue主入口
|--static // 静态图片文件夹(小于 2k 的，大于 2k 请联系项目主管放到七牛云处理)
|--index.html //启动页
|--package.json // 类库、项目配置
|--package.swan.json //小程序 appid 等配置
|--project.config.json //项目库文件(请勿修改!!!)
|--project.swan.json //项目库文件(请勿修改!!!)
```
## 组件描述
```
Alert.vue --- 弹框
AuthBtn.vue --- 验证码
BuyerCartTemp.vue --- 买家购物车
countStep.vue --- 计数器
MallHead.vue --- 商城头部
Modal.vue --- 提示框
NoDAta.vue --- 无数据提示
WxLogin.vue --- 微信登录按钮
Zinput.vue --- 封装输入框
ZRadios.vue --- 封装选择项
invoiceModal.vue --- 认证三方图片提示
```
## 页面描述
```
mall --- 商城
cart --- 购物车（BuyerCartTemp.vue）
me --- 我的
login --- 账号密码登录
phoneLogin --- 验证码登录，找回密码
register --- 注册
companyUpdate --- 认证
wxBind --- 微信绑定
bill --- 合同列表
pay --- 合同付款
ladbill --- 提单
invoice --- 发票
invoiceDetail --- 申请发票
process --- 加工
processDetail --- 发布加工
askBuy --- 求购
askBuyCreate --- 发布求购
```

> 注释事项

* 创建一个页面就是对应在 pages 里面创建一个同名的文件夹，里面有三个文件 index.vue, main.js, main.json；后面两个文件基本直接拷贝复制，index.vue 根据 ui 稿来自行开发
* 所有外部 api 由 utils/apiList.js 统一管理
* 弹框，picker，消息提示已经二次封装，开发过程中尽量用小程序原生组件
* 小程序只识别 rpx，框架在单页面 style 里面可以识别是 px，在 template 里面写行样式的时候一律要用 rpx
* 小程序 template 里面不接受复制行计算，不接受行里面应用方法

## 前期装备

1.  阅读学习小程序开发者文档【在线阅读】(https://developers.weixin.qq.com/miniprogram/dev/framework/)
2.  阅读学习小程序开发框架【在线阅读】(http://mpvue.com/)
3.  小程序三方样式库，ColorUI【在线阅读】(https://github.com/weilanwl/ColorUI)
4.  UI 设计稿【在线阅读】(https://lanhuapp.com/web/#/item/project/board?pid=0ff2706a-ec27-4f98-ae21-c1d4ebc6aaab)
5.  UI 原型交互稿【在线阅读】(https://www.xiaopiu.com/h5/byId?type=project&id=5dd4a30c62725803ea4dbfe5)

## 项目运行

```bash
cd xy-mall

# 安装依赖
yarn

# 开发时构建
npm dev

# 打包构建
npm build

# 指定平台的开发时构建(微信、百度、头条、支付宝)
npm dev:wx
npm dev:swan
npm dev:tt
npm dev:my

# 指定平台的打包构建
npm build:wx
npm build:swan
npm build:tt
npm build:my

# 生成 bundle 分析报告
npm run build --report
```

**等项目启动好之后，打开微信开放者工具，将 dist/wx 导入即可正常进行开发**
