const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('order', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "序号"
    },
    clientId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: "外键,下订单会员id,关联client"
    },
    openId: {
      type: DataTypes.STRING(128),
      allowNull: false,
      defaultValue: "",
      comment: "微信openId"
    },
    fromOpenId: {
      type: DataTypes.STRING(128),
      allowNull: false,
      defaultValue: "",
      comment: "从分享来的openId"
    },
    orderNumber: {
      type: DataTypes.STRING(128),
      allowNull: false,
      defaultValue: "",
      comment: "订单编号",
      unique: "order_number"
    },
    orderPrice: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00,
      comment: "订单总金额"
    },
    orderPay: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
      comment: "支付方式  1支付宝  2微信  3银行卡"
    },
    isSend: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
      comment: "是否发货 1.是 2.否,3.已收货"
    },
    tradeNo: {
      type: DataTypes.STRING(128),
      allowNull: false,
      defaultValue: "",
      comment: "交易流水号码"
    },
    invoiceType: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "发票抬头 1.个人 2.公司"
    },
    invoiceTitle: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "",
      comment: "公司名称"
    },
    invoiceContent: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "",
      comment: "发票内容"
    },
    consigneeName: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "",
      comment: "收货人名称"
    },
    consigneePhone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "",
      comment: "收货人电话"
    },
    consigneeAddr: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "",
      comment: "收货人地址"
    },
    expressCompany: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "",
      comment: "快递公司名称"
    },
    expressNo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "",
      comment: "快递单号"
    },
    expressStartTime: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      comment: "发快递时间"
    },
    expressStartDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      comment: "发快递日期"
    },
    payStatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
      comment: "付款状态： 1.已付款 2.未付款"
    },
    isCancel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
      comment: "是否取消: 1:已取消 2.未取消 3.申请取消"
    },
    checkStatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
      comment: "审核状态 1.已审核 2.未审核"
    },
    createStamp: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: "记录生成时间"
    },
    updateStamp: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: "记录修改时间"
    }
  }, {
    sequelize,
    tableName: 'order',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "order_number",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "orderNumber" },
        ]
      },
      {
        name: "add_time",
        using: "BTREE",
        fields: [
          { name: "createStamp" },
        ]
      },
    ]
  });
};
