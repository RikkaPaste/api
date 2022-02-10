const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('attribute', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "主键id"
    },
    attrName: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "",
      comment: "属性名称"
    },
    catId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: "外键，类型id,关联goodscategory"
    },
    attrSel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "1:输入框(唯一,静态)  2:后台下拉列表\/前台单选框"
    },
    attrWrite: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "1:手工录入(静态)  2:从列表选择"
    },
    attrVals: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "",
      comment: "可选值列表信息,例如颜色：白色,红色,绿色,多个可选值通过逗号分隔"
    },
    chkStatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "是否可用 1.可用 2.禁用"
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
    }
  }, {
    sequelize,
    tableName: 'attribute',
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
        name: "type_id",
        using: "BTREE",
        fields: [
          { name: "catId" },
        ]
      },
    ]
  });
};
