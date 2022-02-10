const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "序号"
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "",
      comment: "用户名"
    },
    passwd: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "",
      comment: "密码"
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "",
      comment: "邮箱"
    },
    mobile: {
      type: DataTypes.STRING(11),
      allowNull: false,
      defaultValue: "",
      comment: "手机"
    },
    roleid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
      comment: "外键,角色序号,关联roles"
    },
    createStamp: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      comment: "创建时间戳"
    },
    updateStamp: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      comment: "修改时间戳"
    },
    chkStatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "是否可用 1.可用 2.禁用"
    }
  }, {
    sequelize,
    tableName: 'users',
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
        name: "roleId",
        using: "BTREE",
        fields: [
          { name: "roleid" },
        ]
      },
    ]
  });
};
