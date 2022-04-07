const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tixianlist', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "序号"
    },
    wxopenid: {
      type: DataTypes.STRING(128),
      allowNull: false,
      defaultValue: "",
      comment: "微信openid"
    },
    nick: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "",
      comment: "昵称"
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
      comment: "状态 1.已提现 2.待审核"
    },
    clientName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "",
      comment: "用户姓名"
    },
    mobile: {
      type: DataTypes.STRING(11),
      allowNull: false,
      defaultValue: "",
      comment: "手机号"
    },
    bankName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "",
      comment: "银行名称"
    },
    bankCard: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "",
      comment: "银行卡号"
    },
    amount: {
      type: DataTypes.DECIMAL(9,2),
      allowNull: false,
      defaultValue: 0.00,
      comment: "金额"
    }
  }, {
    sequelize,
    tableName: 'tixianlist',
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
    ]
  });
};
