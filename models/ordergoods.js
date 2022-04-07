const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ordergoods', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "主键id"
    },
    orderId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: "外键,订单id,关联order"
    },
    goodsId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: "外键,商品id,关联goods"
    },
    goodsName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "",
      comment: "商品名称"
    },
    goodsLogo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "",
      comment: "商品logo"
    },
    goodsPrice: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00,
      comment: "商品单价"
    },
    goodsNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "购买单个商品数量"
    },
    goodsTotalPrice: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00,
      comment: "商品小计价格"
    }
  }, {
    sequelize,
    tableName: 'ordergoods',
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
        name: "order_id",
        using: "BTREE",
        fields: [
          { name: "orderId" },
        ]
      },
      {
        name: "goods_id",
        using: "BTREE",
        fields: [
          { name: "goodsId" },
        ]
      },
    ]
  });
};
