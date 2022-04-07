const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('consignee', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "序号"
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "外键,会员id,关联client"
    },
    cgnName: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "",
      comment: "收货人名称"
    },
    cgnAddress: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: "",
      comment: "收货人地址"
    },
    cgnTel: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "",
      comment: "收货人电话"
    },
    cgnCode: {
      type: DataTypes.CHAR(6),
      allowNull: false,
      defaultValue: "",
      comment: "邮编"
    }
  }, {
    sequelize,
    tableName: 'consignee',
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
        name: "user_id",
        using: "BTREE",
        fields: [
          { name: "clientId" },
        ]
      },
    ]
  });
};
