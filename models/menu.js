const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('menu', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "序号"
    },
    parentid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "外键,父级序号,关联自身"
    },
    menuname: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "",
      comment: "菜单名称"
    },
    menuicon: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "",
      comment: "图标"
    },
    menupath: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "",
      comment: "路径"
    },
    menuLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "菜单级别 1. 一级 2.二级，3. 三级"
    },
    isDel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
      comment: "是否删除 1.是 2.否"
    }
  }, {
    sequelize,
    tableName: 'menu',
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
