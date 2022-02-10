const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('clients', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "序号"
    },
    clientname: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "",
      comment: "名称"
    },
    clientpwd: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "",
      comment: "密码"
    },
    clientmobile: {
      type: DataTypes.STRING(11),
      allowNull: false,
      defaultValue: "",
      comment: "手机"
    },
    clientemail: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "",
      comment: "邮件"
    },
    clientNick: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "",
      comment: "昵称"
    },
    wxlogo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "",
      primaryKey: true,
      comment: "微信头像"
    },
    wxopenid: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: "",
      comment: "微信openid"
    },
    chkstatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "1：启用 2:禁用"
    },
    createstamp: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: "注册时间戳"
    },
    updatestamp: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      comment: "更新时间戳"
    }
  }, {
    sequelize,
    tableName: 'clients',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
          { name: "wxlogo" },
        ]
      },
    ]
  });
};
