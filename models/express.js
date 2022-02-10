const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('express', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "序号"
    },
    orderId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: "外键,订单id,关联order表"
    },
    expressCom: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "",
      comment: "订单快递公司名称"
    },
    expressNu: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "",
      comment: "快递单编号"
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
    tableName: 'express',
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
    ]
  });
};
