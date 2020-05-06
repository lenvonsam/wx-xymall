# 开发者文档

此文档主要针对开发此项目的注意事项以及项目说明等

## 接口文档

* 型云接口[https://docs.qq.com/doc/DRnNlZVZzYXhGSmxj]

* CRM 接口[http://crmadmin.xingyun361.com:7786/swagger-ui.html]

## 项目开发结构目录

### 卖家模块

```
|--src
    |-- components
        |-- SellerCartTemp // 卖家购物车
        |-- BuyerCartTemp // 买家购物车
        |-- SumGoodsHead // 现货物资头部
        |-- MallHead // 商城头部
    |--pages
        |--vendor // 卖家模块
            |-- balance // 用户余额
            |-- bankWater // 银企直联
            |-- bankWaterDetail // 银企直联详情
            |-- cart // 卖家购物车 暂废弃 (使用SellerCartTemp组件)
            |-- contractDelay // 合同延时
            |-- contractTrack // 合同跟踪
            |-- me // 卖家个人中心 暂废弃
            |-- pendingReview // 待审核
            |-- quotation // 报价清单
            |-- quotationDetail // 报价单详情
            |-- quotationList // 报价单管理
            |-- receivables // 应收款预警
            |-- returnApplication // 退货申请
            |-- returnApplicationDetail // 退货明细
            |-- returnApplicationList // 退货申请列表
            |-- reviewDetail // 待审核详情
            |-- reviewHistory // 审核历史
            |-- sumGoods // 现货物资
            |-- sumGoodsDetail // 现货物资详情
            |-- sumGoodsFilter // 现货物资分类
```

### 买家模块